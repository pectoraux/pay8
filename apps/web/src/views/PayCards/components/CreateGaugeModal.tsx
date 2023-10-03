import EncryptRsa from 'encrypt-rsa'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useCardContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import NodeRSA from 'encrypt-rsa'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import ExecutePurchaseStage from './ExecutePurchaseStage'
import AddBalanceStage from './AddBalanceStage'
import TransferBalanceStage from './TransferBalanceStage'
import RemoveBalanceStage from './RemoveBalanceStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import UpdatePasswordStage from './UpdatePasswordStage'
import UpdateTokenIdStage from './UpdateTokenIdStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.ADD_BALANCE]: t('Add Balance'),
  [LockStage.REMOVE_BALANCE]: t('Remove Balance'),
  [LockStage.TRANSFER_BALANCE]: t('Transfer Balance'),
  [LockStage.EXECUTE_PURCHASE]: t('Execute Purchase'),
  [LockStage.UPDATE_TOKEN_ID]: t('Update Token ID'),
  [LockStage.UPDATE_PASSWORD]: t('Update Password'),
  [LockStage.CONFIRM_UPDATE_PASSWORD]: t('Update Password'),
  [LockStage.CONFIRM_ADD_BALANCE]: t('Back'),
  [LockStage.CONFIRM_REMOVE_BALANCE]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_BALANCE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TOKEN_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_EXECUTE_PURCHASE]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({
  variant = 'user',
  pool,
  amountReceivable,
  currAccount,
  currency,
  onDismiss,
}) => {
  const [stage, setStage] = useState(variant === 'add' ? LockStage.CONFIRM_ADD_BALANCE : LockStage.SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const cardContract = useCardContract()
  const cardContractWithPayswapSigner = useCardContract() // useCardContract(true)
  const cardNoteContract = cardContract
  console.log('mcurrencyy===============>', amountReceivable, currAccount, currency, pool, cardContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)
  let password
  if (pool?.password) {
    password = nodeRSA?.decryptStringWithRsaPrivateKey({
      text: pool?.password,
      privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
    })
  }
  const [state, setState] = useState<any>(() => ({
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
    amountReceivable: amountReceivable,
    periodReceivable: currAccount?.periodReceivable,
    startReceivable: convertTimeToSeconds(currAccount?.startReceivable ?? 0),
    description: currAccount?.description ?? '',
    ratings: currAccount?.ratings?.toString() ?? '',
    esgRating: currAccount?.esgRating ?? '',
    media: pool?.media ?? '',
    identityTokenId: '0',
    message: '',
    tag: '',
    password: '',
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
    options: '',
    isPaywall: 0,
    applicationLink: pool?.applicationLink ?? '',
    cardDescription: pool?.cardDescription ?? '',
    datakeeper: 0,
    accounts: [],
  }))

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
        if (variant !== 'add') setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_BALANCE:
        setStage(LockStage.ADD_BALANCE)
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
      case LockStage.EXECUTE_PURCHASE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_EXECUTE_PURCHASE:
        setStage(LockStage.EXECUTE_PURCHASE)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TOKEN_ID:
        setStage(LockStage.UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.UPDATE_PASSWORD:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PASSWORD:
        setStage(LockStage.UPDATE_PASSWORD)
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
      case LockStage.REMOVE_BALANCE:
        setStage(LockStage.CONFIRM_REMOVE_BALANCE)
        break
      case LockStage.EXECUTE_PURCHASE:
        setStage(LockStage.CONFIRM_EXECUTE_PURCHASE)
        break
      case LockStage.TRANSFER_BALANCE:
        setStage(LockStage.CONFIRM_TRANSFER_BALANCE)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.CONFIRM_UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_PASSWORD:
        setStage(LockStage.CONFIRM_UPDATE_PASSWORD)
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
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_ADD_BALANCE) {
        const amount = getDecimalAmount(state.amountReceivable ?? 0, currency.decimals ?? 18)
        const args = [account, currency?.address, amount?.toString()]
        console.log('CONFIRM_ADD_BALANCE===============>', args)
        return callWithGasPrice(cardContract, 'addBalance', args).catch((err) =>
          console.log('CONFIRM_ADD_BALANCE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_BALANCE) {
        if (password && password === state.password) {
          const amount = getDecimalAmount(state.amountReceivable ?? 0, currency.decimals ?? 18)
          const args = [account, state.toAddress, currency?.address, amount?.toString()]
          console.log('CONFIRM_TRANSFER_BALANCE===============>', args)
          return callWithGasPrice(cardContractWithPayswapSigner, 'transferBalance', args).catch((err) =>
            console.log('CONFIRM_TRANSFER_BALANCE===============>', err),
          )
        }
      }
      if (stage === LockStage.CONFIRM_EXECUTE_PURCHASE) {
        if (password && password === state.password) {
          const amount = getDecimalAmount(state.amountReceivable ?? 0, currency.decimals ?? 18)
          const args = [
            state.collection,
            ADDRESS_ZERO,
            currency?.address,
            state.productId,
            state.isPaywall,
            amount?.toString(),
            state.tokenId,
            state.userTokenId,
            state.identityTokenId,
            state.options?.split(',')?.filter((val) => !!val),
          ]
          console.log('CONFIRM_EXECUTE_PURCHASE===============>', args)
          return callWithGasPrice(cardContractWithPayswapSigner, 'executePurchase', args).catch((err) =>
            console.log('CONFIRM_EXECUTE_PURCHASE===============>', err),
          )
        }
      }
      if (stage === LockStage.CONFIRM_REMOVE_BALANCE) {
        const amount = getDecimalAmount(state.amountReceivable ?? 0, currency.decimals ?? 18)
        const args = [currency?.address, amount?.toString()]
        console.log('CONFIRM_REMOVE_BALANCE===============>', args)
        return callWithGasPrice(cardContract, 'removeBalance', args).catch((err) =>
          console.log('CONFIRM_REMOVE_BALANCE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_ID) {
        const args = [state.tokenId]
        console.log('CONFIRM_UPDATE_TOKEN_ID===============>', args)
        return callWithGasPrice(cardContract, 'updateTokenId', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TOKEN_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PASSWORD) {
        const encryptRsa = new EncryptRsa()
        const password = encryptRsa.encryptStringWithRsaPublicKey({
          text: state.password,
          publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
        })
        const args = [password]
        console.log('CONFIRM_UPDATE_PASSWORD===============>', state.password, args)
        return callWithGasPrice(cardContract, 'updatePassword', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PASSWORD===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = [state.owner, state.tokenId]
        console.log('CONFIRM_UPDATE_OWNER===============>', args)
        return callWithGasPrice(cardContract, 'updateOwner', args).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err),
        )
      }
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      setConfirmedTxHash(receipt.transactionHash)
      setStage(LockStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {stage === LockStage.SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.ADD_BALANCE)}>
            {t('ADD BALANCE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_PASSWORD)}>
            {t('UPDATE PASSWORD')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.TRANSFER_BALANCE)}>
            {t('TRANSFER BALANCE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.EXECUTE_PURCHASE)}>
            {t('EXECUTE PURCHASE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_TOKEN_ID)}>
            {t('UPDATE TOKEN ID')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.REMOVE_BALANCE)}>
            {t('REMOVE BALANCE')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADD_BALANCE && (
        <AddBalanceStage
          state={state}
          account={account}
          currency={currency}
          handleRawValueChange={handleRawValueChange}
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
      {stage === LockStage.REMOVE_BALANCE && (
        <RemoveBalanceStage
          state={state}
          account={account}
          currency={currency}
          currAccount={currAccount}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_TOKEN_ID && (
        <UpdateTokenIdStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_OWNER && (
        <UpdateOwnerStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_PASSWORD && (
        <UpdatePasswordStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
