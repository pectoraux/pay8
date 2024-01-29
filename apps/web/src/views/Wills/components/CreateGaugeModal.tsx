import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, LinkExternal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useErc721CollectionContract, useWILLContract, useWILLNote } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useCurrencyBalance } from 'state/wallet/hooks'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateParametersStage from './UpdateParametersStage'
import UpdateMediaStage from './UpdateMediaStage'
import ClaimNoteStage from './ClaimNoteStage'
import AddBalanceStage from './AddBalanceStage'
import DeleteStage from './DeleteStage'
import DeleteWillStage from './DeleteWillStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import RemoveBalanceStage from './RemoveBalanceStage'
import UpdateNftApprovalStage from './UpdateNftApprovalStage'
import UpdateActivePeriodStage from './UpdateActivePeriodStage'
import UpdateTaxContractStage from './UpdateTaxContractStage'
import StopWithdrawallCountdownStage from './StopWithdrawallCountdownStage'
import UpdateTransferToNotePayableStage from './UpdateTransferToNotePayableStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import PayStage from './PayStage'
import UpdateApprovalStage from './UpdateApprovalStage'
import PresentBribeModal from './LockedPool/Modals/PresentBribeModal'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.PAY]: t('Claim Inheritance'),
  [LockStage.UPDATE_PROTOCOL]: t('Add/Modify Heir Inheritance'),
  [LockStage.UPDATE_TAX]: t('Update Tax Contract'),
  [LockStage.TRANSFER_TO_NOTE_PAYABLE]: t('Transfer Note Payable'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.UPDATE_MEDIA]: t('Update Media'),
  [LockStage.ADD_BALANCE]: t('Add Balance'),
  [LockStage.ADD_BALANCE2]: t('Add Approved Balance'),
  [LockStage.REMOVE_BALANCE]: t('Remove Balance'),
  [LockStage.CLAIM_NOTE]: t('Claim Note'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Heir'),
  [LockStage.UPDATE_ACTIVE_PERIOD]: t('Update Active Period'),
  [LockStage.UPDATE_APPROVAL]: t('Update Approval'),
  [LockStage.UPDATE_FT_APPROVAL]: t('Update Fungible Token Approval'),
  [LockStage.UPDATE_NFT_APPROVAL]: t('Update NFT Approval'),
  [LockStage.CREATE_LOCK]: t('Create Lock'),
  [LockStage.STOP_WITHDRAWAL_COUNTDOWN]: t('Stop Withdrawal Countdown'),
  [LockStage.CONFIRM_STOP_WITHDRAWAL_COUNTDOWN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TIME_CONSTRAINT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_REMOVE_BALANCE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ACTIVE_PERIOD]: t('Back'),
  [LockStage.CONFIRM_UPDATE_APPROVAL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_FT_APPROVAL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_NFT_APPROVAL]: t('Back'),
  [LockStage.CONFIRM_ADD_BALANCE]: t('Back'),
  [LockStage.CONFIRM_ADD_BALANCE2]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MEDIA]: t('Back'),
  [LockStage.CONFIRM_PAY]: t('Back'),
  [LockStage.CONFIRM_CREATE_LOCK]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAX]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE]: t('Back'),
  [LockStage.CONFIRM_CLAIM_NOTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_PROTOCOL]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({
  variant = 'user',
  location = 'fromStake',
  pool,
  currAccount,
  currToken,
  currency,
  onDismiss,
}) => {
  const [stage, setStage] = useState(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || currToken?.tokenAddress || '')
  const willContract = useWILLContract(pool?.id || router.query.will || '')
  const willNoteContract = useWILLNote()
  console.log('mcurrencyy===============>', currAccount, currency, pool, willContract, stakingTokenContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance
    ? getDecimalAmount(new BigNumber(balance.toExact()), currency?.decimals)
    : BIG_ZERO

  // console.log("router===================>", router)
  // const { state: status, userAccount, session_id, userCurrency, amount } = router.query
  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner ?? account ?? '',
    avatar: pool?.collection?.avatar,
    bountyId: pool?.bountyId ?? '',
    protocolId: currAccount?.id,
    extraMint: '',
    tokens: `${currency?.address ?? ''}`,
    percentages: '',
    category: '',
    contractAddress: '',
    optionId: '',
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    pricePerMinute: '',
    factor: '',
    period: '',
    cap: '',
    tokenId: '',
    startPayable: '',
    creditFactor: '',
    toAddress: '',
    amountPayable: '',
    periodPayable: '',
    bufferTime: '',
    amountReceivable: getBalanceNumber(currAccount?.amountReceivable ?? 0, currency?.decimals),
    periodReceivable: currAccount?.periodReceivable,
    startReceivable: convertTimeToSeconds(currAccount?.startReceivable ?? 0),
    description: currAccount?.description ?? '',
    ratings: currAccount?.ratings?.toString() ?? '',
    esgRating: currAccount?.esgRating ?? '',
    media: pool?.media ?? '',
    ssid: '',
    identityTokenId: '0',
    message: '',
    tag: '',
    profileId: currAccount?.profileId ?? '0',
    minWithdrawableNow: '',
    minNFTWithdrawableNow: '',
    willWithdrawalPeriod: '',
    uriGenerator: '',
    autoCharge: 0,
    like: 0,
    bountyRequired: pool?.bountyRequired,
    ve: pool?._ve,
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    token: currency?.address,
    isNative: 0,
    add: 0,
    contentType: '',
    numPeriods: '',
    name: pool?.name,
    collectionId: '',
    applicationLink: pool?.applicationLink ?? '',
    willDescription: pool?.willDescription ?? '',
    nftype: 0,
    approve: 0,
    decimals: 18,
  }))
  const tokenContract = useErc721CollectionContract(state.token)

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
      case LockStage.PAY:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_PAY:
        setStage(LockStage.PAY)
        break
      case LockStage.UPDATE_TAX:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAX:
        setStage(LockStage.UPDATE_TAX)
        break
      case LockStage.TRANSFER_TO_NOTE_PAYABLE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE:
        setStage(LockStage.TRANSFER_TO_NOTE_PAYABLE)
        break
      case LockStage.UPDATE_MEDIA:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MEDIA:
        setStage(LockStage.UPDATE_MEDIA)
        break
      case LockStage.ADD_BALANCE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_ADD_BALANCE:
        setStage(LockStage.ADD_BALANCE)
        break
      case LockStage.ADD_BALANCE2:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_BALANCE2:
        setStage(LockStage.ADD_BALANCE2)
        break
      case LockStage.UPDATE_ACTIVE_PERIOD:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_ACTIVE_PERIOD:
        setStage(LockStage.UPDATE_ACTIVE_PERIOD)
        break
      case LockStage.UPDATE_APPROVAL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_APPROVAL:
        setStage(LockStage.UPDATE_APPROVAL)
        break
      case LockStage.CONFIRM_UPDATE_FT_APPROVAL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.UPDATE_NFT_APPROVAL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_NFT_APPROVAL:
        setStage(LockStage.UPDATE_NFT_APPROVAL)
        break
      case LockStage.CREATE_LOCK:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CREATE_LOCK:
        setStage(LockStage.CREATE_LOCK)
        break
      case LockStage.REMOVE_BALANCE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_REMOVE_BALANCE:
        setStage(LockStage.REMOVE_BALANCE)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_NOTE:
        setStage(LockStage.CLAIM_NOTE)
        break
      case LockStage.STOP_WITHDRAWAL_COUNTDOWN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_STOP_WITHDRAWAL_COUNTDOWN:
        setStage(LockStage.STOP_WITHDRAWAL_COUNTDOWN)
        break
      case LockStage.CONFIRM_UPDATE_TIME_CONSTRAINT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.DELETE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_PROTOCOL:
        setStage(LockStage.DELETE_PROTOCOL)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROTOCOL:
        setStage(LockStage.UPDATE_PROTOCOL)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.UPDATE_TAX:
        setStage(LockStage.CONFIRM_UPDATE_TAX)
        break
      case LockStage.PAY:
        setStage(LockStage.CONFIRM_PAY)
        break
      case LockStage.TRANSFER_TO_NOTE_PAYABLE:
        setStage(LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.CONFIRM_CLAIM_NOTE)
        break
      case LockStage.UPDATE_MEDIA:
        setStage(LockStage.CONFIRM_UPDATE_MEDIA)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.CONFIRM_DELETE_PROTOCOL)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.ADD_BALANCE:
        setStage(LockStage.CONFIRM_ADD_BALANCE)
        break
      case LockStage.ADD_BALANCE2:
        setStage(LockStage.CONFIRM_ADD_BALANCE2)
        break
      case LockStage.UPDATE_ACTIVE_PERIOD:
        setStage(LockStage.CONFIRM_UPDATE_ACTIVE_PERIOD)
        break
      case LockStage.CREATE_LOCK:
        setStage(LockStage.CONFIRM_CREATE_LOCK)
        break
      case LockStage.UPDATE_APPROVAL:
        setStage(LockStage.CONFIRM_UPDATE_APPROVAL)
        break
      case LockStage.UPDATE_FT_APPROVAL:
        setStage(LockStage.CONFIRM_UPDATE_FT_APPROVAL)
        break
      case LockStage.UPDATE_NFT_APPROVAL:
        setStage(LockStage.CONFIRM_UPDATE_NFT_APPROVAL)
        break
      case LockStage.REMOVE_BALANCE:
        setStage(LockStage.CONFIRM_REMOVE_BALANCE)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.STOP_WITHDRAWAL_COUNTDOWN:
        setStage(LockStage.CONFIRM_STOP_WITHDRAWAL_COUNTDOWN)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      if (!stakingTokenContract) {
        return false
      }
      try {
        return requiresApproval(stakingTokenContract, account, willContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [willContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start processing transactions!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_ADD_BALANCE || stage === LockStage.CONFIRM_ADD_BALANCE2) {
        let { amountReceivable } = state
        if (state.nftype === 0) {
          amountReceivable = getDecimalAmount(amountReceivable ?? 0, currency?.decimals)
        }
        if (state.isNative) {
          const args = [state.owner]
          console.log('CONFIRM_ADD_BALANCE===============>', willContract.address, args, amountReceivable?.toString())
          return callWithGasPrice(willContract, 'addBalanceETH', args, {
            value: amountReceivable.toString(),
          }).catch((err) => console.log('1CONFIRM_ADD_BALANCE===============>', err))
        }
        const args2 = [state.token, state.owner, amountReceivable.toString(), state.nftype]
        console.log('CONFIRM_ADD_BALANCE===============>', args2)
        return callWithGasPrice(willContract, 'addBalance', args2).catch((err) =>
          console.log('CONFIRM_ADD_BALANCE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_REMOVE_BALANCE) {
        let { amountPayable } = state
        if (state.nftype === 0) {
          amountPayable = getDecimalAmount(amountPayable ?? 0, currency?.decimals)
        }
        const args = [currency?.address, amountPayable.toString()]
        console.log('CONFIRM_REMOVE_BALANCE===============>', args)
        return callWithGasPrice(willContract, 'removeBalance', args).catch((err) =>
          console.log('CONFIRM_REMOVE_BALANCE===============>', err),
        )
      }
      // if (stage === LockStage.CONFIRM_UPDATE_MEDIA) {
      //   const args = [state.media]
      //   console.log('CONFIRM_UPDATE_MEDIA===============>', args)
      //   return callWithGasPrice(willContract, 'updateMedia', args).catch((err) =>
      //     console.log('CONFIRM_UPDATE_MEDIA===============>', err),
      //   )
      // }
      if (stage === LockStage.CONFIRM_UPDATE_ACTIVE_PERIOD) {
        const args = [currency?.address]
        console.log('CONFIRM_UPDATE_ACTIVE_PERIOD===============>', args)
        return callWithGasPrice(willContract, 'updateActivePeriod', args).catch((err) =>
          console.log('CONFIRM_UPDATE_ACTIVE_PERIOD===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CREATE_LOCK) {
        const amount = getDecimalAmount(state.amountReceivable, state.decimals)
        const args = [state.token, state.ve, state.lockDuration, state.identityTokenId, amount?.toString()]
        console.log('CONFIRM_CREATE_LOCK===============>', args)
        return callWithGasPrice(willContract, 'createLock', args).catch((err) =>
          console.log('CONFIRM_CREATE_LOCK===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_APPROVAL) {
        const args = [state.ve, state.owner, state.approve]
        console.log('CONFIRM_UPDATE_APPROVAL===============>', args)
        return callWithGasPrice(willContract, 'updateAllowance', args).catch((err) =>
          console.log('CONFIRM_UPDATE_APPROVAL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_FT_APPROVAL) {
        const args = [willContract.address, MaxUint256]
        console.log('CONFIRM_UPDATE_FT_APPROVAL===============>', args)
        return callWithGasPrice(stakingTokenContract, 'approve', args).catch((err) =>
          console.log('CONFIRM_UPDATE_FT_APPROVAL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_NFT_APPROVAL) {
        const args = [willContract.address, true]
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        console.log('CONFIRM_UPDATE_NFT_APPROVAL===============>', args)
        return delay(3000)
          .then(() => callWithGasPrice(tokenContract, 'setApprovalForAll', args))
          .catch((err) => console.log('CONFIRM_UPDATE_NFT_APPROVAL===============>', err))
      }
      if (stage === LockStage.CONFIRM_STOP_WITHDRAWAL_COUNTDOWN) {
        console.log('CONFIRM_STOP_WITHDRAWAL_COUNTDOWN===============>')
        return callWithGasPrice(willContract, 'stopWillWithdrawalCountdown', []).catch((err) =>
          console.log('CONFIRM_STOP_WITHDRAWAL_COUNTDOWN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_PAY) {
        const args = [state.profileId, state.position]
        console.log('CONFIRM_PAY===============>', args)
        return callWithGasPrice(willContract, 'payInvoicePayable', args).catch((err) =>
          console.log('CONFIRM_PAY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAX) {
        const args = [state.contractAddress]
        console.log('CONFIRM_UPDATE_TAX===============>', args)
        return callWithGasPrice(willContract, 'updateTaxContract', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TAX===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [pool?.id, state.toAddress, state.profileId, state.position, amountPayable.toString()]
        console.log('CONFIRM_TRANSFER_TO_NOTE_PAYABLE===============>', args)
        return callWithGasPrice(willNoteContract, 'transferDueToNotePayable', args).catch((err) =>
          console.log('CONFIRM_TRANSFER_TO_NOTE_PAYABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const args = [
          state.profileId,
          state.owner,
          state.tokens?.split(','),
          state.percentages?.split(',').map((perct) => parseInt(perct) * 100),
          state.ssid,
          state.media,
          state.description,
        ]
        console.log('CONFIRM_UPDATE_PROTOCOL===============>', willContract, args)
        return callWithGasPrice(willContract, 'updateProtocol', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const args = [
          state.profileId,
          parseInt(state.updatePeriod) * 60,
          state.minWithdrawableNow,
          state.minNFTWithdrawableNow,
          parseInt(state.willWithdrawalPeriod) * 60,
        ]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(willContract, 'updateParameters', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = [state.owner]
        console.log('CONFIRM_UPDATE_OWNER===============>', args)
        return callWithGasPrice(willContract, 'updateDev', args).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        console.log('CONFIRM_DELETE_PROTOCOL===============>', [state.profileId])
        return callWithGasPrice(willContract, 'deleteProtocol', [state.profileId]).catch((err) =>
          console.log('CONFIRM_DELETE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        console.log('CONFIRM_DELETE===============>', [pool?.id])
        return callWithGasPrice(willNoteContract, 'deleteWill', [pool?.id]).catch((err) =>
          console.log('CONFIRM_DELETE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
        console.log('CONFIRM_CLAIM_NOTE===============>', [state.tokenId])
        return callWithGasPrice(willNoteContract, 'claimPendingRevenueFromNote', [state.tokenId]).catch((err) =>
          console.log('CONFIRM_CLAIM_NOTE===============>', err),
        )
      }
      return null
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
          <Flex justifyContent="center" style={{ cursor: 'pointer' }} alignSelf="center" mb="10px">
            <LinkExternal color="success" href={pool.will?.applicationLink} bold>
              {t('APPLY FOR INHERITANCE')}
            </LinkExternal>
          </Flex>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.ADD_BALANCE2)}>
            {t('ADD BALANCE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.PAY)}>
            {t('CLAIM INHERITANCE')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_TAX)}>
            {t('UPDATE TAX CONTRACT')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CLAIM_NOTE)}>
            {t('CLAIM NOTE')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_PROTOCOL)}>
            {t('ADD/MODIFY HEIR INHERITANCE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.PAY)}>
            {t('CLAIM INHERITANCE')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.CONFIRM_UPDATE_FT_APPROVAL)}>
            {t('UPDATE FT APPROVAL')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_NFT_APPROVAL)}>
            {t('UPDATE NFT APPROVAL')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.ADD_BALANCE)}>
            {t('ADD BALANCE')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_ACTIVE_PERIOD)}>
            {t('UPDATE ACTIVE PERIOD')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.CREATE_LOCK)}>
            {t('CREATE LOCK')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_APPROVAL)}>
            {t('UPDATE APPROVAL')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.REMOVE_BALANCE)}>
            {t('REMOVE BALANCE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.TRANSFER_TO_NOTE_PAYABLE)}>
            {t('TRANSFER TO NOTE PAYABLE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_PARAMETERS)}>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.STOP_WITHDRAWAL_COUNTDOWN)}>
            {t('STOP WITHDRAWAL COUNTDOWN')}
          </Button>
          {location === 'fromStake' ? (
            <>
              <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE_PROTOCOL)}>
                {t('DELETE HEIR')}
              </Button>
            </>
          ) : null}
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE)}>
            {t('DELETE CONTRACT')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.UPDATE_MEDIA && (
        <UpdateMediaStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.ADD_BALANCE && (
        <AddBalanceStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.ADD_BALANCE2 && (
        <AddBalanceStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.REMOVE_BALANCE && (
        <RemoveBalanceStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_NFT_APPROVAL && (
        <UpdateNftApprovalStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_ACTIVE_PERIOD && (
        <UpdateActivePeriodStage
          state={state}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_APPROVAL && (
        <UpdateApprovalStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}

      {stage === LockStage.UPDATE_TAX && (
        <UpdateTaxContractStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.STOP_WITHDRAWAL_COUNTDOWN && (
        <StopWithdrawallCountdownStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.TRANSFER_TO_NOTE_PAYABLE && (
        <UpdateTransferToNotePayableStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PROTOCOL && (
        <UpdateProtocolStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.PAY && (
        <PayStage
          state={state}
          account={pool.id}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_OWNER && (
        <UpdateOwnerStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PARAMETERS && (
        <UpdateParametersStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CLAIM_NOTE && (
        <ClaimNoteStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CREATE_LOCK && (
        <PresentBribeModal
          pool={pool}
          state={state}
          stakingToken={currency}
          handleChange={handleChange}
          stakingTokenBalance={stakingTokenBalance}
        />
      )}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_PROTOCOL && (
        <DeleteWillStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
