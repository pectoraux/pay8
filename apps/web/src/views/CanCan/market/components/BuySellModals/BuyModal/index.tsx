import { useRouter } from 'next/router'
import EncryptRsa from 'encrypt-rsa'
import { useState, useMemo, useEffect } from 'react'
import { InjectedModalProps, Skeleton, useToast } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation, TranslateFunction } from '@pancakeswap/localization'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import {
  useERC20,
  useMarketTradesContract,
  useMarketHelperContract,
  usePaywallMarketTradesContract,
  usePaywallMarketHelperContract,
  useStakeMarketContract,
  useValuepoolContract,
  useValuepoolHelperContract,
} from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { requiresApproval } from 'utils/requiresApproval'
import { ToastDescriptionWithTx } from 'components/Toast'
import { NftToken } from 'state/cancan/types'
import {
  useGetDiscounted,
  useGetPaymentCredits,
  useGetNftFilters,
  useGetPaywallARP,
  useGetSubscriptionStatus,
} from 'state/cancan/hooks'
import { stagesWithBackButton, stagesWithApproveButton, stagesWithConfirmButton, StyledModal } from './styles'
import ReviewStage from './ReviewStage'
import PaywallReviewStage from './PaywallReviewStage'
import ConfirmStage from '../shared/ConfirmStage'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import { PaymentCurrency, BuyingStage } from './types'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import PaymentCreditStage from './PaymentCreditStage'
import CashbackStage from './CashbackStage'
import { createPublicClient, http, custom, createWalletClient } from 'viem'
import { fantomTestnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { decryptContent, getThumbnailNContent } from 'utils/cancan'
import { noop } from 'lodash'
import { useGetRequiresApproval } from 'state/valuepools/hooks'
import { getMarketEventsContract } from 'utils/contractHelpers'
import { marketEventsABI } from 'config/abi/marketEvents'
import { getMarketEventsAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

const modalTitles = (t: TranslateFunction) => ({
  [BuyingStage.REVIEW]: t('Review'),
  [BuyingStage.PAYWALL_REVIEW]: t('Subscription Review'),
  [BuyingStage.STAKE]: t('StakeMarket'),
  [BuyingStage.CASHBACK]: t('Cashback'),
  [BuyingStage.PAYMENT_CREDIT]: t('Payment Credit'),
  [BuyingStage.CONFIRM_REVIEW]: t('Back'),
  [BuyingStage.CONFIRM_PAYWALL_REVIEW]: t('Back'),
  [BuyingStage.CONFIRM_STAKE]: t('Back'),
  [BuyingStage.CONFIRM_CASHBACK]: t('Back'),
  [BuyingStage.CONFIRM_PAYMENT_CREDIT]: t('Back'),
  [BuyingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

// NFT WBNB in testnet contract is different
const TESTNET_WBNB_NFT_ADDRESS = '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f'

const BuyModal: React.FC<any> = ({ variant = 'item', nftToBuy, bidPrice, setBought = noop, onDismiss }) => {
  const referrer = useRouter().query.referrer as string
  const collectionId = useRouter().query.collectionAddress as string
  const [stage, setStage] = useState(variant === 'paywall' ? BuyingStage.PAYWALL_REVIEW : BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [tokenId, setTokenId] = useState<any>(0)
  const [credit, setCredit] = useState<any>(0)
  const [userTokenId, setUserTokenId] = useState(0)
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [identityTokenId, setIdentityTokenId] = useState(0)
  const [merchantIdentityTokenId, setMerchantIdentityTokenId] = useState(0)
  const [requireUpfrontPayment, setRequireUpfrontPayment] = useState(0)
  const [checkRank, setCheckRank] = useState(false)
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.BNB)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useWeb3React()
  const { mainCurrency, secondaryCurrency, mainToSecondaryCurrencyFactor } = useWorkspaceCurrency(
    nftToBuy?.ve?.toLowerCase(),
    nftToBuy?.tFIAT,
    nftToBuy?.usetFIAT,
    bidPrice ? bidPrice : nftToBuy?.currentAskPrice,
  )
  const inputCurrency = mainCurrency?.address
  const bnbContractReader = useERC20(inputCurrency ?? '')
  const bnbContractApprover = useERC20(inputCurrency ?? '')
  const marketContract = useMarketTradesContract()
  const paywallMarketTradesContract = usePaywallMarketTradesContract()
  const marketHelperContract = useMarketHelperContract()
  const paywallMarketHelperContract = usePaywallMarketHelperContract()
  const callContract = variant === 'paywall' ? paywallMarketTradesContract : marketContract
  const helperContract = variant === 'paywall' ? paywallMarketHelperContract : marketHelperContract
  const p = getDecimalAmount(bidPrice ? bidPrice : nftToBuy?.currentAskPrice, 18)
  const { toastSuccess } = useToast()
  const nftFilters = useGetNftFilters(account)
  const [recipient, setRecipient] = useState<string>('')
  const [tokenId2, setTokenId2] = useState<string>('')
  const nftPrice = parseFloat(bidPrice ? bidPrice : nftToBuy?.currentAskPrice)
  const { data: paymentCredits, refetch: refetchPayment } = useGetPaymentCredits(
    nftToBuy?.collection?.id,
    nftToBuy?.tokenId,
    account,
  ) as any
  const valuepoolContract = useValuepoolContract(recipient)
  const valuepoolHelperContract = useValuepoolHelperContract()
  const userOptions = useMemo(() => {
    let opt = []
    Object.values(nftFilters)?.map((vals) => {
      Object.keys(vals).map((elt) => {
        const id =
          variant === 'paywall'
            ? nftToBuy.options?.findIndex((cat) => parseFloat(cat.value) === parseFloat(elt))
            : nftToBuy.options?.findIndex((cat) => cat.element?.toLowerCase() === elt.toLowerCase())
        const count = vals[elt]?.count
        opt = [...opt, ...Array(count).fill(id)]
        return opt
      })
      return null
    })
    return opt
  }, [variant, nftToBuy, nftFilters])
  const userOptionsPrices = useMemo(() => {
    let opt = []
    Object.values(nftFilters)?.map((vals) => {
      Object.keys(vals).map((elt) => {
        const id =
          variant === 'paywall'
            ? nftToBuy.options?.findIndex((cat) => parseFloat(cat.value) === parseFloat(elt))
            : nftToBuy.options?.findIndex((cat) => cat.element?.toLowerCase() === elt.toLowerCase())
        const count = vals[elt]?.count
        opt = [...opt, vals[elt].price]
        return opt
      })
      return null
    })
    return opt
  }, [variant, nftToBuy, nftFilters])

  useEffect(() => {
    refetchPayment()
  }, [account])

  let userOptionsPrice = userOptionsPrices?.reduce((a, b) => a + b, 0)
  console.log('userOptions====================>', userOptions, paymentCredits)
  const {
    discount,
    discounted,
    status,
    refetch: refetchDiscount,
  } = useGetDiscounted(
    nftToBuy?.currentSeller,
    account,
    nftToBuy?.tokenId,
    p.toFixed(),
    userOptions,
    0,
    variant === 'paywall',
  )
  useEffect(() => {
    refetchDiscount()
  }, [variant, nftToBuy, nftFilters])

  const totalPayment = Math.max(Number(discount ?? 0) - paymentCredits, 0)
  const discountAmount = getBalanceNumber(
    new BigNumber(parseInt(p.toFixed()) + parseFloat(userOptionsPrice) - parseFloat(discount?.toString() ?? '0')),
  )

  let { mp4, thumbnail } = getThumbnailNContent(nftToBuy)
  const paywallARP = useGetPaywallARP(nftToBuy?.collection?.id ?? '')
  const { ongoingSubscription } = useGetSubscriptionStatus(
    paywallARP?.paywallAddress ?? '',
    account ?? '',
    '0',
    nftToBuy?.tokenId,
  )
  const { thumbnail: _thumbnail } = decryptContent(nftToBuy, thumbnail, mp4, ongoingSubscription, account)

  // BNB - returns ethers.BigNumber
  const stakeMarketContract = useStakeMarketContract()

  const { isRequired: needsApproval, refetch } = useGetRequiresApproval(
    bnbContractReader,
    account,
    callContract.address,
  )
  const { isRequired: needsApproval2, refetch: refetch2 } = useGetRequiresApproval(
    bnbContractReader,
    account,
    stakeMarketContract.address,
  )
  const { isRequired: needsApproval3, refetch: refetch3 } = useGetRequiresApproval(
    bnbContractReader,
    account,
    helperContract.address,
  )

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      if (paymentCurrency === 2) return true
      return needsApproval || needsApproval2 || needsApproval3
    },
    // eslint-disable-next-line consistent-return
    onApprove: async () => {
      if (paymentCurrency === PaymentCurrency.BNB) {
        if (bidPrice) {
          return callWithGasPrice(bnbContractApprover, 'approve', [helperContract.address, MaxUint256])
        }
        return callWithGasPrice(bnbContractApprover, 'approve', [callContract.address, MaxUint256])
      }
      return callWithGasPrice(bnbContractApprover, 'approve', [stakeMarketContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now make your purchase!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: async () => {
      if (stage === BuyingStage.CONFIRM_CASHBACK) {
        const args = [nftToBuy?.currentSeller, nftToBuy.tokenId, !!credit, tokenId2]
        console.log('CONFIRM_CASHBACK================>', args)
        return callWithGasPrice(callContract, 'processCashBack', args).catch((err) =>
          console.log('CONFIRM_CASHBACK================>', err),
        )
      }
      if (paymentCurrency === PaymentCurrency.BNB) {
        if (note?.trim()?.length || address?.trim()?.length) {
          const adminAccount = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PAYSWAP_SIGNER}`)
          const client = createPublicClient({
            chain: fantomTestnet,
            transport: http(),
          })
          const walletClient = createWalletClient({
            chain: fantomTestnet,
            transport: custom(window.ethereum),
          })
          const encryptRsa = new EncryptRsa()
          const encryptedNote = note
            ? encryptRsa.encryptStringWithRsaPublicKey({
                text: note,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY_4096,
              })
            : ''
          const encryptedAddress = address
            ? encryptRsa.encryptStringWithRsaPublicKey({
                text: address,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY_4096,
              })
            : ''
          console.log('1BNB================>', [
            BigInt(10),
            BigInt(collectionId),
            encryptedAddress,
            encryptedNote,
            BigInt(0),
            BigInt(0),
            account,
            '',
          ])
          const { request } = await client.simulateContract({
            account: adminAccount,
            address: getMarketEventsAddress(),
            abi: marketEventsABI,
            functionName: 'emitUpdateMiscellaneous',
            args: [
              BigInt(10),
              BigInt(collectionId),
              encryptedAddress,
              encryptedNote,
              variant === 'paywall' ? BigInt(1) : BigInt(0),
              BigInt(0),
              account,
              nftToBuy.tokenId,
            ],
          })
          await walletClient
            .writeContract(request)
            .catch((err) =>
              console.log('BNBmisc================>', err, [
                BigInt(10),
                BigInt(collectionId),
                encryptedAddress,
                encryptedNote,
                variant === 'paywall' ? BigInt(1) : BigInt(0),
                BigInt(0),
                account,
                nftToBuy.tokenId,
              ]),
            )

          console.log('BNB================>', [
            nftToBuy?.currentSeller,
            account,
            referrer || ADDRESS_ZERO,
            nftToBuy.tokenId,
            userTokenId,
            identityTokenId,
            userOptions,
          ])
        }
        return callWithGasPrice(callContract, 'buyWithContract', [
          nftToBuy?.currentSeller,
          account,
          referrer || ADDRESS_ZERO,
          nftToBuy.tokenId,
          userTokenId,
          identityTokenId,
          userOptions,
        ])
      }
      if (paymentCurrency === PaymentCurrency.WBNB) {
        // [amountPayable,amountReceivable,periodPayable,periodReceivable,waitingPeriod,startPayable,startReceivable]
        const args = [
          [
            nftToBuy.ve,
            inputCurrency,
            callContract.address,
            referrer || ADDRESS_ZERO,
            nftToBuy?.currentSeller,
            nftToBuy?.currentSeller,
          ],
          nftToBuy.tokenId,
          collectionId,
          userOptions,
          userTokenId,
          identityTokenId,
          [0, totalPayment.toString(), 0, 0, 0, 0, 0],
          !!requireUpfrontPayment || !!nftToBuy.requireUpfrontPayment,
        ]
        console.log('WBNB=================>', args)
        return callWithGasPrice(stakeMarketContract, 'createStake', args).catch((err) =>
          console.log('WBNB=================>', err),
        )
      }
      if (paymentCurrency === 2) {
        const contract = !checkRank ? valuepoolContract : valuepoolHelperContract
        const method = !checkRank ? 'pickRank' : 'checkRank'
        const args = !checkRank
          ? [tokenId ?? 0, identityTokenId ?? 0]
          : [
              recipient,
              nftToBuy?.currentSeller,
              referrer || ADDRESS_ZERO,
              nftToBuy.tokenId,
              userOptions,
              [userTokenId, identityTokenId, merchantIdentityTokenId, tokenId, totalPayment.toString()],
            ]
        console.log('3=================>', contract, method, args)
        return callWithGasPrice(contract, method, args).catch((err) => console.log('3=================>', err))
      }
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      setBought(true)
      toastSuccess(
        t('Your purchase has been successfully processed. Notify the seller on PaySwap or somewhere else.'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
  })

  const continueToNextStage = () => {
    switch (stage) {
      case BuyingStage.STAKE:
        setStage(BuyingStage.CONFIRM_STAKE)
        break
      case BuyingStage.REVIEW:
        setStage(BuyingStage.CONFIRM_REVIEW)
        break
      case BuyingStage.PAYWALL_REVIEW:
        setStage(BuyingStage.CONFIRM_PAYWALL_REVIEW)
        break
      case BuyingStage.PAYMENT_CREDIT:
        setStage(BuyingStage.CONFIRM_PAYMENT_CREDIT)
        break
      case BuyingStage.CASHBACK:
        setStage(BuyingStage.CONFIRM_CASHBACK)
        break
      default:
        break
    }
  }

  const continueToPaymentCreditStage = () => {
    setStage(BuyingStage.PAYMENT_CREDIT)
  }

  const continueToCashbackStage = () => {
    setStage(BuyingStage.CASHBACK)
  }

  const goBack = () => {
    switch (stage) {
      case BuyingStage.CONFIRM_STAKE:
        setStage(BuyingStage.STAKE)
        break
      case BuyingStage.CONFIRM_REVIEW:
        setStage(BuyingStage.REVIEW)
        break
      case BuyingStage.CONFIRM_PAYWALL_REVIEW:
        setStage(BuyingStage.PAYWALL_REVIEW)
        break
      case BuyingStage.CONFIRM_PAYMENT_CREDIT:
        setStage(BuyingStage.PAYMENT_CREDIT)
        break
      case BuyingStage.CONFIRM_CASHBACK:
        setStage(BuyingStage.CASHBACK)
        break
      default:
        setStage(BuyingStage.REVIEW)
        break
    }
  }

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {(stage === BuyingStage.REVIEW || stage === BuyingStage.PAYWALL_REVIEW) && (
        <ReviewStage
          isPaywall={variant === 'paywall'}
          thumbnail={_thumbnail}
          status={status}
          nftToBuy={nftToBuy}
          checkRank={checkRank}
          userTokenId={userTokenId}
          setUserTokenId={setUserTokenId}
          address={address}
          setAddress={setAddress}
          note={note}
          setNote={setNote}
          identityTokenId={identityTokenId}
          setIdentityTokenId={setIdentityTokenId}
          merchantIdentityTokenId={merchantIdentityTokenId}
          setMerchantIdentityTokenId={setMerchantIdentityTokenId}
          requireUpfrontPayment={requireUpfrontPayment}
          setRequireUpfrontPayment={setRequireUpfrontPayment}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          paymentCredits={getBalanceNumber(paymentCredits ?? 0)}
          discounted={discounted}
          discountAmount={discountAmount}
          totalPayment={totalPayment}
          nftPrice={nftPrice}
          recipient={recipient}
          setRecipient={setRecipient}
          tokenId={tokenId}
          setTokenId={setTokenId}
          mainCurrency={mainCurrency}
          setCheckRank={setCheckRank}
          secondaryCurrency={secondaryCurrency}
          mainToSecondaryCurrencyFactor={mainToSecondaryCurrencyFactor}
          continueToNextStage={continueToNextStage}
          continueToCashbackStage={continueToCashbackStage}
          continueToPaymentCreditStage={continueToPaymentCreditStage}
        />
      )}
      {stage === BuyingStage.PAYMENT_CREDIT && (
        <PaymentCreditStage
          thumbnail={_thumbnail}
          nftToBuy={nftToBuy}
          isPaywall={variant === 'paywall'}
          collectionId={collectionId}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.CASHBACK && (
        <CashbackStage
          thumbnail={_thumbnail}
          isPaywall={variant === 'paywall'}
          nftToBuy={nftToBuy}
          collectionId={collectionId}
          credit={credit}
          tokenId={tokenId2}
          setCredit={setCredit}
          setTokenId={setTokenId2}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stagesWithApproveButton.includes(stage) && (
        <ApproveAndConfirmStage
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stagesWithConfirmButton.includes(stage) && (
        <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />
      )}
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
