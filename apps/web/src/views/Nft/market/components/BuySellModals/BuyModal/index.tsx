import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect } from 'react'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useTranslation, TranslateFunction } from '@pancakeswap/localization'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import {
  useERC20,
  useNftMarketTradesContract,
  useNftMarketHelper3Contract,
  usePaywallMarketTradesContract,
  useStakeMarketContract,
  useValuepoolContract,
  useValuepoolHelperContract,
  useErc721CollectionContract,
  useNftMarketHelperContract,
  usePaywallMarketHelperContract,
} from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import { NftToken } from 'state/cancan/types'
import {
  useGetPaymentCredits,
  useGetNftFilters,
  useGetPaywallARP,
  useGetSubscriptionStatus,
  useGetNftDiscounted,
} from 'state/cancan/hooks'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { decryptContent, getThumbnailNContent } from 'utils/cancan'
import { useGetRequiresApproval } from 'state/valuepools/hooks'

import { stagesWithBackButton, stagesWithApproveButton, stagesWithConfirmButton, StyledModal } from './styles'
import ReviewStage from './ReviewStage'
import ConfirmStage from '../shared/ConfirmStage'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import { PaymentCurrency, BuyingStage } from './types'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import PaymentCreditStage from './PaymentCreditStage'
import CashbackStage from './CashbackStage'

const modalTitles = (t: TranslateFunction) => ({
  [BuyingStage.REVIEW]: t('Review'),
  [BuyingStage.PAYWALL_REVIEW]: t('Subscription Review'),
  [BuyingStage.STAKE]: t('StakeMarket'),
  [BuyingStage.CASHBACK]: t('Cashback'),
  [BuyingStage.PAYMENT_CREDIT]: t('Payment Credit'),
  [BuyingStage.IDENTITY_LIMIT]: t('Identity Limit'),
  [BuyingStage.ADDRESS_LIMIT]: t('Address Limit'),
  [BuyingStage.CONFIRM_REVIEW]: t('Back'),
  [BuyingStage.CONFIRM_IDENTITY_LIMIT]: t('Back'),
  [BuyingStage.CONFIRM_ADDRESS_LIMIT]: t('Back'),
  [BuyingStage.CONFIRM_PAYWALL_REVIEW]: t('Back'),
  [BuyingStage.CONFIRM_STAKE]: t('Back'),
  [BuyingStage.CONFIRM_CASHBACK]: t('Back'),
  [BuyingStage.CONFIRM_PAYMENT_CREDIT]: t('Back'),
  [BuyingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
  variant: 'item' | 'paywall'
}

const BuyModal: React.FC<any> = ({ variant = 'item', nftToBuy, bidPrice, processAuction = false, onDismiss }) => {
  const referrer = useRouter().query.referrer as string
  const collectionId = useRouter().query.collectionAddress as string
  const [stage, setStage] = useState(variant === 'paywall' ? BuyingStage.PAYWALL_REVIEW : BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [userTokenId, setUserTokenId] = useState(0)
  const [identityTokenId, setIdentityTokenId] = useState(0)
  const [merchantIdentityTokenId, setMerchantIdentityTokenId] = useState(0)
  const [requireUpfrontPayment, setRequireUpfrontPayment] = useState(0)
  const [credit, setCredit] = useState<any>(0)
  const [currToken, setCurrToken] = useState<any>('')
  const [tokenId2, setTokenId2] = useState<string>('')
  const [checkRank, setCheckRank] = useState(false)
  const [position, setPosition] = useState<any>(0)
  const [amount, setAmount] = useState('')
  const [decimals, setDecimals] = useState('')
  const [applyToTokenId, setApplyToTokenId] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.BNB)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useWeb3React()
  const { mainCurrency, secondaryCurrency, mainToSecondaryCurrencyFactor } = useWorkspaceCurrency(
    nftToBuy?.ve?.toLowerCase(),
    nftToBuy?.tFIAT,
    nftToBuy?.usetFIAT,
    bidPrice || nftToBuy?.currentAskPrice,
  )
  const stakingTokenContract = useErc721CollectionContract(currToken || '')
  const inputCurrency = mainCurrency?.address
  const bnbContractApprover = useERC20(inputCurrency ?? '')
  const nftMarketContract = useNftMarketTradesContract()
  const marketHelper3Contract = useNftMarketHelper3Contract()
  const paywallMarketTradesContract = usePaywallMarketTradesContract()
  const nftMarketHelperContract = useNftMarketHelperContract()
  const paywallMarketHelperContract = usePaywallMarketHelperContract()
  const callContract = variant === 'paywall' ? paywallMarketTradesContract : nftMarketContract
  const helperContract = variant === 'paywall' ? paywallMarketHelperContract : nftMarketHelperContract
  const p = getDecimalAmount(bidPrice || nftToBuy?.currentAskPrice, 18)
  const { toastSuccess } = useToast()
  const nftFilters = useGetNftFilters(account)
  const [recipient, setRecipient] = useState<string>('')
  const [tokenId, setTokenId] = useState<string>('')
  const nftPrice = parseFloat(bidPrice || nftToBuy?.currentAskPrice)
  const { data: paymentCredits, refetch: refetchPayment } = useGetPaymentCredits(
    nftToBuy?.collection?.id,
    nftToBuy?.tokenId,
    account,
  ) as any
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const valuepoolContract = useValuepoolContract(recipient)
  const valuepoolHelperContract = useValuepoolHelperContract()
  const tokenContract = useErc721CollectionContract(nftToBuy?.minter || '')
  const userOptions = useMemo(() => {
    let opt = []
    Object.values(nftFilters)?.map((vals) => {
      return Object.keys(vals).map((elt) => {
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

  useEffect(() => {
    refetchPayment()
  }, [account])

  const userOptionsPrices = useMemo(() => {
    let opt = []
    Object.values(nftFilters)?.map((vals) => {
      Object.keys(vals).map((elt) => {
        // const id =
        //   variant === 'paywall'
        //     ? nftToBuy.options?.findIndex((cat) => parseFloat(cat.value) === parseFloat(elt))
        //     : nftToBuy.options?.findIndex((cat) => cat.element?.toLowerCase() === elt.toLowerCase())
        // const count = vals[elt]?.count
        opt = [...opt, vals[elt].price]
        return opt
      })
      return null
    })
    return opt
  }, [variant, nftToBuy, nftFilters])

  const userOptionsPrice = userOptionsPrices?.reduce((a, b) => a + b, 0)

  const {
    discount,
    discounted,
    status,
    refetch: refetchDiscount,
  } = useGetNftDiscounted(
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

  const { mp4, thumbnail } = getThumbnailNContent(nftToBuy)
  const paywallARP = useGetPaywallARP(nftToBuy?.collection?.id ?? '', nftToBuy?.tokenId) as any
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
    bnbContractApprover,
    account,
    callContract.address,
  )
  const { isRequired: needsApproval2, refetch: refetch2 } = useGetRequiresApproval(
    bnbContractApprover,
    account,
    stakeMarketContract.address,
  )
  const { isRequired: needsApproval3, refetch: refetch3 } = useGetRequiresApproval(
    bnbContractApprover,
    account,
    helperContract.address,
  )

  // const checkStage = () => stage === BuyingStage.CONFIRM_PAYMENT_CREDIT && !!activeButtonIndex

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      // if (checkStage) return false
      if (processAuction) return false
      if (paymentCurrency === 2) return true
      return needsApproval || needsApproval2 || needsApproval3
    },
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
    onConfirm: () => {
      if (stage === BuyingStage.CONFIRM_CASHBACK) {
        const args = [nftToBuy?.currentSeller, nftToBuy.tokenId, !!credit, tokenId2]
        console.log('CONFIRM_CASHBACK================>', args)
        return callWithGasPrice(callContract, 'processCashBack', args).catch((err) =>
          console.log('CONFIRM_CASHBACK================>', err),
        )
      }
      if (stage === BuyingStage.CONFIRM_IDENTITY_LIMIT) {
        const args = [nftToBuy?.collection?.id, account, nftToBuy.tokenId]
        console.log('CONFIRM_IDENTITY_LIMIT================>', args)
        return callWithGasPrice(callContract, 'updateIdVersion', args).catch((err) =>
          console.log('CONFIRM_IDENTITY_LIMIT================>', err),
        )
      }
      if (stage === BuyingStage.CONFIRM_ADDRESS_LIMIT) {
        const args = [nftToBuy?.collection?.id, account, nftToBuy.tokenId]
        console.log('CONFIRM_ADDRESS_LIMIT================>', args)
        return callWithGasPrice(callContract, 'updateVersion', args).catch((err) =>
          console.log('CONFIRM_ADDRESS_LIMIT================>', err),
        )
      }
      if (stage === BuyingStage.CONFIRM_PAYMENT_CREDIT) {
        const _amount =
          parseInt(decimals) === 0 ? amount : getDecimalAmount(new BigNumber(amount?.toString()), parseInt(decimals))
        const args = [nftToBuy?.currentSeller, position, _amount?.toString(), applyToTokenId]
        console.log('CONFIRM_PAYMENT_CREDIT================>', args)
        if (activeButtonIndex > 0) {
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
          return callWithGasPrice(stakingTokenContract, 'setApprovalForAll', [helperContract.address, true])
            .then(() => delay(5000))
            .then(() => {
              return callWithGasPrice(helperContract, 'burnForCredit', args).catch((err) =>
                console.log('1CONFIRM_PAYMENT_CREDIT================>', err),
              )
            })
        }
        return callWithGasPrice(helperContract, 'burnForCredit', args).catch((err) =>
          console.log('CONFIRM_PAYMENT_CREDIT================>', err),
        )
      }
      if (paymentCurrency === PaymentCurrency.BNB) {
        const args = processAuction
          ? [nftToBuy?.currentSeller, referrer || ADDRESS_ZERO, account, nftToBuy.tokenId, userTokenId, userOptions]
          : [
              nftToBuy?.currentSeller,
              account,
              referrer || ADDRESS_ZERO,
              nftToBuy.tokenId,
              userTokenId,
              identityTokenId,
              userOptions,
            ]
        if (processAuction) {
          return callWithGasPrice(helperContract, 'processAuction', args).catch((err) =>
            console.log('0err BNB===================>', err),
          )
        }
        if (Number(new BigNumber(nftToBuy.nftokenId._hex).toJSON())) {
          return callWithGasPrice(tokenContract, 'approve', [marketHelper3Contract.address, nftToBuy.nftokenId])
            .then(() => callWithGasPrice(callContract, 'buyWithContract', args))
            .catch((err) => console.log('BNB================>', err))
        }
        return callWithGasPrice(callContract, 'buyWithContract', args).catch((err) =>
          console.log('BNB================>', err),
        )
      }
      if (paymentCurrency === PaymentCurrency.WBNB) {
        // [amountPayable,amountReceivable,periodPayable,periodReceivable,waitingPeriod,startPayable,startReceivable]
        console.log('WBNB=================>', [
          [nftToBuy.ve, inputCurrency, callContract.address, referrer || ADDRESS_ZERO, nftToBuy?.currentSeller],
          nftToBuy.tokenId,
          collectionId,
          userOptions,
          userTokenId,
          identityTokenId,
          [0, totalPayment.toString(), 0, 0, 0, 0, 0],
          !!requireUpfrontPayment || !!nftToBuy.requireUpfrontPayment,
        ])
        return callWithGasPrice(stakeMarketContract, 'createStake', [
          [nftToBuy.ve, inputCurrency, callContract.address, referrer || ADDRESS_ZERO, nftToBuy?.currentSeller],
          nftToBuy.tokenId,
          collectionId,
          userOptions,
          userTokenId,
          identityTokenId,
          [0, totalPayment.toString(), 0, 0, 0, 0, 0],
          !!requireUpfrontPayment || !!nftToBuy.requireUpfrontPayment,
        ]).catch((err) => console.log('WBNB=================>', err))
      }
      if (paymentCurrency === 2) {
        const contract = !checkRank ? valuepoolContract : valuepoolHelperContract
        const method = !checkRank ? 'pickRank' : 'checkRank'
        const args2 = !checkRank
          ? [tokenId, identityTokenId]
          : [
              recipient,
              nftToBuy?.currentSeller,
              referrer || ADDRESS_ZERO,
              nftToBuy.tokenId,
              userOptions,
              [userTokenId, identityTokenId, merchantIdentityTokenId, tokenId, totalPayment.toString()],
            ]
        console.log('3=================>', contract, method, args2)
        return callWithGasPrice(contract, method, args2).catch((err) => console.log('3=================>', err))
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      toastSuccess(
        t('Your purchase has been successfully processed'),
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
      case BuyingStage.ADDRESS_LIMIT:
        setStage(BuyingStage.CONFIRM_ADDRESS_LIMIT)
        break
      case BuyingStage.IDENTITY_LIMIT:
        setStage(BuyingStage.CONFIRM_IDENTITY_LIMIT)
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

  const continueToAddressLimitStage = () => {
    setStage(BuyingStage.CONFIRM_ADDRESS_LIMIT)
  }

  const continueToIdentityLimitStage = () => {
    setStage(BuyingStage.CONFIRM_IDENTITY_LIMIT)
  }

  const goBack = () => {
    switch (stage) {
      case BuyingStage.CONFIRM_STAKE:
        setStage(BuyingStage.STAKE)
        break
      case BuyingStage.CONFIRM_REVIEW:
        setStage(BuyingStage.REVIEW)
        break
      case BuyingStage.CONFIRM_IDENTITY_LIMIT:
        setStage(BuyingStage.REVIEW)
        break
      case BuyingStage.CONFIRM_ADDRESS_LIMIT:
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
          status={status}
          thumbnail={_thumbnail}
          nftToBuy={nftToBuy}
          checkRank={checkRank}
          userTokenId={userTokenId}
          setUserTokenId={setUserTokenId}
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
          continueToAddressLimitStage={continueToAddressLimitStage}
          continueToIdentityLimitStage={continueToIdentityLimitStage}
          continueToCashbackStage={continueToCashbackStage}
          continueToPaymentCreditStage={continueToPaymentCreditStage}
        />
      )}
      {stage === BuyingStage.PAYMENT_CREDIT && (
        <PaymentCreditStage
          thumbnail={_thumbnail}
          nftToBuy={nftToBuy}
          amount={amount}
          setAmount={setAmount}
          currency={mainCurrency}
          position={position}
          applyToTokenId={applyToTokenId}
          setPosition={setPosition}
          setApplyToTokenId={setApplyToTokenId}
          decimals={decimals}
          setDecimals={setDecimals}
          isPaywall={variant === 'paywall'}
          collectionId={collectionId}
          setCurrToken={setCurrToken}
          activeButtonIndex={activeButtonIndex}
          setActiveButtonIndex={setActiveButtonIndex}
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
