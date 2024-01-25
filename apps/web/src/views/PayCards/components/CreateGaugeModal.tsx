// eslint-disable-next-line import/no-duplicates
import EncryptRsa from 'encrypt-rsa'
// eslint-disable-next-line import/no-duplicates
import NodeRSA from 'encrypt-rsa'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useCardContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { createPublicClient, http, custom, createWalletClient } from 'viem'
import { fantomTestnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { cardABI } from 'config/abi/card'
import { getCardAddress } from 'utils/addressHelpers'
import { usePool } from 'state/cards/hooks'
import { useGetSessionInfo2, useGetSessionInfoSg, useGetTokenData } from 'state/ramps/hooks'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import ExecutePurchaseStage from './ExecutePurchaseStage'
import TransferBalanceStage from './TransferBalanceStage'
import MintWithNoWalletStage from './MintWithNoWalletStage'
import RemoveBalanceStage from './RemoveBalanceStage'
import UpdatePasswordStage from './UpdatePasswordStage'
import UpdatePassword2Stage from './UpdatePassword2Stage'
import UpdateProfileStage from './UpdateProfileStage'
import MintStage from './MintStage'
import DonateGasFeesStage from './DonateGasFeesStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.ADD_BALANCE]: t('Add Balance With Debit Card'),
  [LockStage.ADD_BALANCE2]: t('Add Balance With Wallet'),
  [LockStage.REMOVE_BALANCE]: t('Remove Balance'),
  [LockStage.TRANSFER_BALANCE]: t('Transfer Balance'),
  [LockStage.DONATE_GAS_FEES]: t('Donate Gas Fees'),
  [LockStage.EXECUTE_PURCHASE]: t('Execute Purchase'),
  [LockStage.UPDATE_PASSWORD]: t('Update Password'),
  [LockStage.UPDATE_PASSWORD2]: t('Update Password With Profile'),
  [LockStage.UPDATE_PROFILE]: t('Attach Unique Profile'),
  [LockStage.PRE_MINT]: t('tFIAT Mint'),
  [LockStage.CONFIRM_PRE_MINT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PASSWORD]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PASSWORD2]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROFILE]: t('Back'),
  [LockStage.CONFIRM_ADD_BALANCE]: t('Back'),
  [LockStage.CONFIRM_ADD_BALANCE2]: t('Back'),
  [LockStage.CONFIRM_REMOVE_BALANCE]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_BALANCE]: t('Back'),
  [LockStage.CONFIRM_DONATE_GAS_FEES]: t('Back'),
  [LockStage.CONFIRM_EXECUTE_PURCHASE]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({
  variant = 'user',
  pool,
  sessionId,
  amountReceivable,
  currAccount,
  currency,
  onDismiss,
}) => {
  const [stage, setStage] = useState(
    sessionId
      ? LockStage.PRE_MINT
      : variant === 'add_with_debit'
      ? LockStage.ADD_BALANCE
      : variant === 'add'
      ? LockStage.CONFIRM_ADD_BALANCE
      : LockStage.SETTINGS,
  )
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const router = useRouter()
  const { pool: ogPool } = usePool(parseInt(router?.query?.username?.toString()))
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const cardContract = useCardContract()
  const [checked, setChecked] = useState<boolean>()
  const accountId = useMemo(
    () =>
      parseInt(ogPool?.id) === parseInt(router.query?.username?.toString())
        ? ogPool?.username
        : router.query?.username?.toString(),
    [ogPool?.username, ogPool?.id, router.query?.username],
  )
  console.log('mcurrencyy===============>', amountReceivable, currAccount, currency, pool, cardContract)

  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  let username
  let password
  const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)
  if (pool?.password && pool?.username) {
    username = nodeRSA?.decryptStringWithRsaPrivateKey({
      text: pool?.username,
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
    })
    password = nodeRSA?.decryptStringWithRsaPrivateKey({
      text: pool?.password,
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
    })
  }
  const adminAccount = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PAYSWAP_SIGNER}`)

  const [state, setState] = useState<any>(() => ({
    rampAddress: '0x0fc05a2326215763701451a50d558a0a5b6f0003',
    owner: pool?.owner,
    avatar: pool?.collection?.avatar,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId ?? '',
    extraMint: '',
    category: '',
    optionId: currAccount?.optionId ?? '0',
    cap: '',
    factor: '',
    period: '',
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    amountPayable: '',
    pricePerMinute: '',
    contractAddress: '',
    card: pool?.cardAddress ?? '',
    legend: currAccount?.ratingLegend,
    amountReceivable: getBalanceNumber(amountReceivable?.toString() ?? '0'),
    periodReceivable: currAccount?.periodReceivable,
    startReceivable: convertTimeToSeconds(currAccount?.startReceivable ?? 0),
    description: currAccount?.description ?? '',
    ratings: currAccount?.ratings?.toString() ?? '',
    esgRating: currAccount?.esgRating ?? '',
    media: pool?.media ?? '',
    identityTokenId: '0',
    message: '',
    tag: '',
    username: '',
    password: '',
    newPassword: '',
    protocolId: currAccount?.protocolId ?? '0',
    toAddress: '',
    uriGenerator: '',
    autoCharge: 0,
    like: 0,
    bountyRequired: pool?.bountyRequired,
    ve: pool?._ve,
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    token: currency?.address,
    add: 0,
    contentType: '',
    name: pool?.name,
    numPeriods: '',
    collection: '',
    referrer: '',
    productId: '',
    userTokenId: '',
    recipient: '',
    options: '',
    isPaywall: 0,
    applicationLink: pool?.applicationLink ?? '',
    cardDescription: pool?.cardDescription ?? '',
    datakeeper: 0,
    accounts: [],
    sessionId: sessionId ?? '',
  }))

  const { data } = useGetSessionInfoSg(sessionId, state.rampAddress.toLowerCase())
  const { data: stripeData } = useGetSessionInfo2(sessionId, process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)
  const { data: tokenData } = useGetTokenData(data?.tokenAddress)
  console.log('data=================>', data)
  console.log('ogPool=================>', ogPool, accountId)
  console.log('stripeData=================>', stripeData, tokenData)

  const client = createPublicClient({
    chain: fantomTestnet,
    transport: http(),
  })
  const walletClient = createWalletClient({
    chain: fantomTestnet,
    transport: custom(window.ethereum),
  })

  useEffect(() => {
    if (data) {
      if (
        (data?.user?.toLowerCase() !== account?.toLowerCase() &&
          data?.user?.toLowerCase() !== getCardAddress()?.toLowerCase()) ||
        !data?.active
      ) {
        onDismiss()
        if (router.query?.username) router.push('/cards')
      } else {
        state.amountReceivable = data?.amount
        state.token = data?.tokenAddress
        state.identityTokenId = data?.identityTokenId
        state.sessionId = sessionId
        setChecked(true)
      }
    }
  }, [sessionId, data, account, state, router, onDismiss])

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }
  const handleRawValueChange = (key: string) => (value: string | Date) => {
    updateValue(key, value)
  }

  const goBack = () => {
    switch (stage) {
      case LockStage.ADD_BALANCE:
        if (variant !== 'add' && variant !== 'add_with_debit') setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_BALANCE:
        setStage(LockStage.ADD_BALANCE)
        break
      case LockStage.CONFIRM_ADD_BALANCE2:
        setStage(LockStage.ADD_BALANCE2)
        break
      case LockStage.ADD_BALANCE2:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.REMOVE_BALANCE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_REMOVE_BALANCE:
        setStage(LockStage.REMOVE_BALANCE)
        break
      case LockStage.TRANSFER_BALANCE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_TRANSFER_BALANCE:
        setStage(LockStage.TRANSFER_BALANCE)
        break
      case LockStage.DONATE_GAS_FEES:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DONATE_GAS_FEES:
        setStage(LockStage.DONATE_GAS_FEES)
        break
      case LockStage.EXECUTE_PURCHASE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_EXECUTE_PURCHASE:
        setStage(LockStage.EXECUTE_PURCHASE)
        break
      case LockStage.UPDATE_PASSWORD:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PASSWORD:
        setStage(LockStage.UPDATE_PASSWORD)
        break
      case LockStage.UPDATE_PASSWORD2:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PASSWORD2:
        setStage(LockStage.UPDATE_PASSWORD2)
        break
      case LockStage.UPDATE_PROFILE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROFILE:
        setStage(LockStage.UPDATE_PROFILE)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.ADD_BALANCE:
        setStage(LockStage.CONFIRM_ADD_BALANCE)
        break
      case LockStage.ADD_BALANCE2:
        setStage(LockStage.CONFIRM_ADD_BALANCE2)
        break
      case LockStage.REMOVE_BALANCE:
        setStage(LockStage.CONFIRM_REMOVE_BALANCE)
        break
      case LockStage.EXECUTE_PURCHASE:
        setStage(LockStage.CONFIRM_EXECUTE_PURCHASE)
        break
      case LockStage.TRANSFER_BALANCE:
        setStage(LockStage.CONFIRM_TRANSFER_BALANCE)
        break
      case LockStage.DONATE_GAS_FEES:
        setStage(LockStage.CONFIRM_DONATE_GAS_FEES)
        break
      case LockStage.UPDATE_PASSWORD:
        setStage(LockStage.CONFIRM_UPDATE_PASSWORD)
        break
      case LockStage.UPDATE_PASSWORD2:
        setStage(LockStage.CONFIRM_UPDATE_PASSWORD2)
        break
      case LockStage.UPDATE_PROFILE:
        setStage(LockStage.CONFIRM_UPDATE_PROFILE)
        break
      default:
        break
    }
  }

  const onSuccessSale = async (onfirmedTxHash) => {
    switch (stage) {
      case LockStage.CONFIRM_ADD_BALANCE:
        router.push('/cards')
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, cardContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [cardContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start receiving payments for audits!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: async () => {
      if (stage === LockStage.CONFIRM_ADD_BALANCE2) {
        const amount = getDecimalAmount(state.amountReceivable ?? 0, currency.decimals ?? 18)
        const args = [pool?.username, currency?.address, amount?.toString()]
        console.log('CONFIRM_ADD_BALANCE2===============>', args)
        return callWithGasPrice(cardContract, 'addBalance', args).catch((err) =>
          console.log('CONFIRM_ADD_BALANCE2===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DONATE_GAS_FEES) {
        const _amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [adminAccount?.address, _amountReceivable?.toString()]
        console.log('CONFIRM_DONATE_GAS_FEES===============>', args)
        return callWithGasPrice(stakingTokenContract, 'transfer', args).catch((err) =>
          console.log('CONFIRM_DONATE_GAS_FEES===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_BALANCE) {
        if (username && password && username === state.username && password === state.password) {
          const amount = getDecimalAmount(state.amountReceivable ?? 0, currency.decimals ?? 18)
          const args = [pool?.username, pool?.password, state.recipient, currency?.address, BigInt(amount?.toString())]
          console.log('CONFIRM_TRANSFER_BALANCE===============>', args)
          const { request } = await client.simulateContract({
            account: adminAccount,
            address: getCardAddress(),
            abi: cardABI,
            functionName: 'transferBalance',
            args: [pool?.username, pool?.password, state.recipient, currency?.address, BigInt(amount?.toString())],
          })
          return walletClient
            .writeContract(request)
            .catch((err) => console.log('CONFIRM_TRANSFER_BALANCE===============>', err))
        }
      }
      if (stage === LockStage.CONFIRM_EXECUTE_PURCHASE) {
        if (username && password && username === state.username && password === state.password) {
          const amount = getDecimalAmount(state.amountReceivable ?? 0, currency.decimals ?? 18)
          const args = [
            state.collection,
            ADDRESS_ZERO,
            currency?.address,
            pool?.username,
            state.productId,
            state.isPaywall,
            amount?.toString(),
            state.userTokenId,
            state.identityTokenId,
            state.options?.split(',')?.filter((val) => !!val),
          ]
          const { request } = await client.simulateContract({
            account: adminAccount,
            address: getCardAddress(),
            abi: cardABI,
            functionName: 'executePurchase',
            args: [
              state.collection,
              ADDRESS_ZERO,
              currency?.address,
              pool?.username,
              state.productId,
              state.isPaywall,
              BigInt(amount?.toString()),
              state.userTokenId,
              state.identityTokenId,
              state.options?.split(',')?.filter((val) => !!val),
            ],
          })
          console.log('CONFIRM_EXECUTE_PURCHASE===============>', args)
          await walletClient
            .writeContract(request)
            .catch((err) => console.log('CONFIRM_EXECUTE_PURCHASE===============>', err))
        }
      }
      if (stage === LockStage.CONFIRM_REMOVE_BALANCE) {
        if (username && password && username === state.username && password === state.password) {
          const amount = getDecimalAmount(state.amountReceivable ?? 0, currency.decimals ?? 18)
          const { request } = await client.simulateContract({
            account: adminAccount,
            address: getCardAddress(),
            abi: cardABI,
            functionName: 'removeBalance',
            args: [pool?.username, pool?.password, currency?.address, state.recipient, BigInt(amount?.toString())],
          })
          console.log('CONFIRM_REMOVE_BALANCE===============>', [
            pool?.username,
            pool?.password,
            currency?.address,
            state.recipient,
            amount?.toString(),
          ])
          await walletClient
            .writeContract(request)
            .catch((err) => console.log('CONFIRM_REMOVE_BALANCE===============>', err))
        }
      }
      if (stage === LockStage.CONFIRM_UPDATE_PASSWORD) {
        if (username && password && username === state.username && password === state.password) {
          const encryptRsa = new EncryptRsa()
          const newPassword = encryptRsa.encryptStringWithRsaPublicKey({
            text: state.newPassword,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
          })
          const args = [pool?.username, pool?.password, newPassword]
          console.log('CONFIRM_UPDATE_PASSWORD===============>', args)
          return callWithGasPrice(cardContract, 'updatePassword', args).catch((err) =>
            console.log('CONFIRM_UPDATE_PASSWORD===============>', err),
          )
        }
      }
      if (stage === LockStage.CONFIRM_UPDATE_PASSWORD2) {
        if (username && password && username === state.username) {
          const encryptRsa = new EncryptRsa()
          const newPassword = encryptRsa.encryptStringWithRsaPublicKey({
            text: state.newPassword,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
          })
          const args = [pool?.username, newPassword]
          console.log('CONFIRM_UPDATE_PASSWORD2===============>', args)
          return callWithGasPrice(cardContract, 'updatePasswordWithProfile', args).catch((err) =>
            console.log('CONFIRM_UPDATE_PASSWORD2===============>', err),
          )
        }
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROFILE) {
        if (username && password && username === state.username && password === state.password) {
          const args = [pool?.username, pool?.password, account]
          console.log('CONFIRM_UPDATE_PROFILE===============>', args)
          return callWithGasPrice(cardContract, 'updateProfileId', args).catch((err) =>
            console.log('CONFIRM_UPDATE_PROFILE===============>', err),
          )
        }
      }
      if (stage === LockStage.CONFIRM_ADD_BALANCE) {
        const amount = getDecimalAmount(stripeData?.amount, 18)
        console.log('CONFIRM_ADD_BALANCE===============>', [
          state.rampAddress,
          accountId,
          state.sessionId,
          data?.tokenAddress,
          BigInt(amount.toString()),
          state.identityTokenId,
        ])
        try {
          const { request } = await client.simulateContract({
            account: adminAccount,
            address: getCardAddress(),
            abi: cardABI,
            functionName: 'notifyAddBalance',
            args: [
              state.rampAddress,
              accountId,
              state.sessionId?.toString(),
              data?.tokenAddress,
              BigInt(amount.toString()),
              BigInt(state.identityTokenId),
            ],
          })
          return walletClient
            .writeContract(request)
            .catch((err) => console.log('1CONFIRM_ADD_BALANCE===============>', err))
        } catch (err) {
          console.log('2CONFIRM_ADD_BALANCE===============>', err)
        }
      }
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onSuccessSale(receipt?.transactionHash || '')
      setConfirmedTxHash(receipt?.transactionHash || '')
      setStage(LockStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving
  console.log(
    'ttt===================>',
    tokenData,
    stripeData?.currency?.toLowerCase(),
    stripeData,
    stripeData?.currency?.toLowerCase() !== tokenData?.symbol?.toLowerCase(),
  )
  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {stage === LockStage.PRE_MINT && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          {checked ? (
            <Button
              mb="8px"
              variant="success"
              onClick={() => setStage(LockStage.CONFIRM_ADD_BALANCE)}
              disabled={!tokenData || stripeData?.currency?.toLowerCase() !== tokenData?.symbol?.toLowerCase()}
            >
              {t('CONFIRM ADD TO BALANCE')}
            </Button>
          ) : null}
        </Flex>
      )}
      {stage === LockStage.SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.ADD_BALANCE)}>
            {t('ADD BALANCE WITH DEBIT CARD')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.ADD_BALANCE2)}>
            {t('ADD BALANCE WITH WALLET')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_PASSWORD)}>
            {t('UPDATE PASSWORD')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_PASSWORD2)}>
            {t('UPDATE PASSWORD WITH PROFILE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_PROFILE)}>
            {t('ATTACH UNIQUE PROFILE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.DONATE_GAS_FEES)}>
            {t('DONATE GAS FEES')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.TRANSFER_BALANCE)}>
            {t('TRANSFER BALANCE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.EXECUTE_PURCHASE)}>
            {t('EXECUTE PURCHASE')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.REMOVE_BALANCE)}>
            {t('REMOVE BALANCE')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADD_BALANCE2 && (
        <MintStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.ADD_BALANCE && (
        <MintWithNoWalletStage
          state={state}
          pool={pool}
          currency={currency}
          handleChange={handleChange}
          callWithGasPrice={callWithGasPrice}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.EXECUTE_PURCHASE && (
        <ExecutePurchaseStage
          state={state}
          account={account}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.TRANSFER_BALANCE && (
        <TransferBalanceStage
          state={state}
          account={account}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DONATE_GAS_FEES && (
        <DonateGasFeesStage
          state={state}
          currency={currency}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.REMOVE_BALANCE && (
        <RemoveBalanceStage
          state={state}
          account={account}
          currency={currency}
          currAccount={currAccount}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PASSWORD && (
        <UpdatePasswordStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_PASSWORD2 && (
        <UpdatePassword2Stage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_PROFILE && (
        <UpdateProfileStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
      {stage === LockStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default CreateGaugeModal
