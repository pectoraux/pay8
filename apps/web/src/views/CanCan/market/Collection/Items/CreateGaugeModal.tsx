import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, LinkExternal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, usePaywallContract } from 'hooks/useContract'
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

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateParametersStage from './UpdateParametersStage'
import AutoChargeStage from './AutoChargeStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteARPStage from './DeleteARPStage'
import UpdateProfileIdStage from './UpdateProfileIdStage'
import UpdateDiscountDivisorStage from './UpdateDiscountDivisorStage'
import UpdatePenaltyDivisorStage from './UpdatePenaltyDivisorStage'
import UpdateAdminStage from './UpdateAdminStage'
import UpdateAutoChargeStage from './UpdateAutoChargeStage'
import UpdateFreeTrialStage from './UpdateFreeTrialStage'
import UpdateOwnerStage from './UpdateOwnerStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_FREE_TRIAL]: t('Update Free Trial'),
  [LockStage.PARTNER]: t('Partner'),
  [LockStage.UPDATE_DISCOUNT_DIVISOR]: t('Update Discount Divisor'),
  [LockStage.UPDATE_PENALTY_DIVISOR]: t('Update Penalty Divisor'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.UPDATE_PROFILE_ID]: t('Update Profile ID'),
  [LockStage.UPDATE_ADMIN]: t('UPDATE ADMIN'),
  [LockStage.UPDATE_AUTOCHARGE]: t('Update Autocharge'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.AUTOCHARGE]: t('Pay Due Receivable'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Protocol'),
  [LockStage.CONFIRM_UPDATE_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROFILE_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_FREE_TRIAL]: t('Back'),
  [LockStage.CONFIRM_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_PARTNER]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ADMIN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_DELETE_PROTOCOL]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({
  isAdmin,
  pool,
  paywallARP,
  currAccount,
  currency,
  paused,
  protocolId,
  subscription,
  profileRequired,
  pricePerSecond,
  bufferTime,
  onDismiss,
}) => {
  const [stage, setStage] = useState(!isAdmin ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  // const paywallArpContract = usePaywallContract('0x48b43B35e5Afd7d3A107f379604b4954DFcBF93F')
  const paywallArpContract = usePaywallContract(paywallARP?.paywallAddress || '')
  console.log('1mcurrencyy===============>', pool, paywallArpContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  const [state, setState] = useState<any>(() => ({
    profileId: pool?.profileId,
    protocolId: protocolId || 0,
    extraMint: '',
    category: '',
    contractAddress: '',
    optionId: '0',
    pricePerMinute: '',
    factor: '',
    period: '',
    cap: '',
    tokenId: '',
    startPayable: '',
    creditFactor: '',
    toAddress: account ?? '',
    amountPayable: '',
    periodPayable: '',
    bufferTime: parseInt(bufferTime ?? '0') / 60 ?? '',
    amountReceivable: getBalanceNumber(pricePerSecond ?? 0, currency?.decimals),
    periodReceivable: '',
    startReceivable: '',
    media: pool?.media ?? '',
    customTags: '',
    identityTokenId: '0',
    freeTrialPeriod: '',
    message: '',
    tag: '',
    uriGenerator: '',
    autoCharge: 0,
    token: currency?.address,
    add: 0,
    decimals: currency?.decimals ?? 18,
    collectionId: pool?.collection?.id ?? '',
    profileRequired: profileRequired ? 1 : 0,
    pause: paused ? 1 : 0,
    subscription: subscription ? 1 : 0,
  }))
  const [nftFilters, setNftFilters] = useState<any>({
    countries: pool?.countries,
    cities: pool?.cities,
    products: pool?.products,
  })
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
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_ADMIN:
        setStage(LockStage.UPDATE_ADMIN)
        break
      case LockStage.UPDATE_FREE_TRIAL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_FREE_TRIAL:
        setStage(LockStage.UPDATE_FREE_TRIAL)
        break
      case LockStage.UPDATE_DISCOUNT_DIVISOR:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR:
        setStage(LockStage.UPDATE_DISCOUNT_DIVISOR)
        break
      case LockStage.UPDATE_PENALTY_DIVISOR:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR:
        setStage(LockStage.UPDATE_PENALTY_DIVISOR)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
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
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_PROTOCOL:
        setStage(LockStage.DELETE_PROTOCOL)
        break
      case LockStage.UPDATE_PROFILE_ID:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROFILE_ID:
        setStage(LockStage.UPDATE_PROFILE_ID)
        break
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_AUTOCHARGE:
        setStage(LockStage.UPDATE_AUTOCHARGE)
        break
      case LockStage.AUTOCHARGE:
        setStage(isAdmin ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_AUTOCHARGE:
        setStage(LockStage.AUTOCHARGE)
        break
      case LockStage.PARTNER:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_PARTNER:
        setStage(LockStage.PARTNER)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.AUTOCHARGE:
        setStage(LockStage.CONFIRM_AUTOCHARGE)
        break
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(LockStage.CONFIRM_UPDATE_AUTOCHARGE)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.CONFIRM_DELETE_PROTOCOL)
        break
      case LockStage.UPDATE_FREE_TRIAL:
        setStage(LockStage.CONFIRM_UPDATE_FREE_TRIAL)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.UPDATE_PROFILE_ID:
        setStage(LockStage.CONFIRM_UPDATE_PROFILE_ID)
        break
      case LockStage.PARTNER:
        setStage(LockStage.CONFIRM_PARTNER)
        break
      case LockStage.UPDATE_PENALTY_DIVISOR:
        setStage(LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR)
        break
      case LockStage.UPDATE_DISCOUNT_DIVISOR:
        setStage(LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.CONFIRM_UPDATE_ADMIN)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, paywallArpContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [paywallArpContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start processing transactions!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_AUTOCHARGE) {
        const args = [state.accounts, state.identityTokenId]
        console.log('CONFIRM_AUTOCHARGE===============>', args)
        return callWithGasPrice(paywallArpContract, 'autoCharge', args).catch((err) =>
          console.log('CONFIRM_AUTOCHARGE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_FREE_TRIAL) {
        const args = [state.optionId, parseInt(state.freeTrialPeriod) * 60]
        console.log('CONFIRM_UPDATE_FREE_TRIAL===============>', args)
        return callWithGasPrice(paywallArpContract, 'updateSubscriptionInfo', args).catch((err) =>
          console.log('CONFIRM_UPDATE_FREE_TRIAL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROFILE_ID) {
        console.log('CONFIRM_UPDATE_PROFILE_ID===============>')
        return callWithGasPrice(paywallArpContract, 'updateProfileId', []).catch((err) =>
          console.log('CONFIRM_UPDATE_PROFILE_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR) {
        const args = [
          state.optionId,
          parseInt(state.factor) * 100,
          parseInt(state.period) * 60,
          parseInt(state.cap) * 100,
        ]
        console.log('CONFIRM_UPDATE_DISCOUNT_DIVISOR===============>', args)
        return callWithGasPrice(paywallArpContract, 'updateDiscountDivisor', args).catch((err) =>
          console.log('CONFIRM_UPDATE_DISCOUNT_DIVISOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR) {
        const args = [
          state.optionId,
          parseInt(state.factor) * 100,
          parseInt(state.period) * 60,
          parseInt(state.cap) * 100,
        ]
        console.log('CONFIRM_UPDATE_PENALTY_DIVISOR===============>', args)
        return callWithGasPrice(paywallArpContract, 'updatePenaltyDivisor', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PENALTY_DIVISOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const args = [state.token]
        console.log('CONFIRM_WITHDRAW===============>', args)
        return callWithGasPrice(paywallArpContract, 'withdraw', args).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [
          parseInt(state.bufferTime) * 60,
          amountReceivable?.toString(),
          !!state.subscription,
          !!state.profileRequired,
          !!state.pause,
        ]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(paywallArpContract, 'updateParams', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        console.log('CONFIRM_UPDATE_OWNER===============>')
        return callWithGasPrice(paywallArpContract, 'updateDevaddr', []).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err, paywallArpContract),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_AUTOCHARGE) {
        const args = [state.protocolId, !!state.autoCharge]
        console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', args)
        return callWithGasPrice(paywallArpContract, 'updateAutoCharge', args).catch((err) =>
          console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', err, paywallArpContract),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        console.log('CONFIRM_DELETE_PROTOCOL===============>', [state.protocolId])
        return callWithGasPrice(paywallArpContract, 'deleteProtocol', [state.protocolId]).catch((err) =>
          console.log('CONFIRM_DELETE_PROTOCOL===============>', err),
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
          <Button mb="8px" onClick={() => setStage(LockStage.AUTOCHARGE)}>
            {t('PAY DUE RECEIVABLE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_AUTOCHARGE)}>
            {t('UPDATE AUTOCHARGE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_PROFILE_ID)}>
            {t('UPDATE PROFILE ID')}
          </Button>
          {/* <Button mb="8px" onClick={() => setStage(LockStage.PARTNER)}>
            {t('PARTNER')}
          </Button> */}
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" onClick={() => setStage(LockStage.AUTOCHARGE)}>
            {t('PAY DUE RECEIVABLE')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_FREE_TRIAL)}>
            {t('UPDATE FREE TRIAL')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_DISCOUNT_DIVISOR)}>
            {t('UPDATE DISCOUNT DIVISOR')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PENALTY_DIVISOR)}>
            {t('UPDATE PENALTY DIVISOR')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_PARAMETERS)}>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE_PROTOCOL)}>
            {t('DELETE ACCOUNT')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.AUTOCHARGE && (
        <AutoChargeStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_ADMIN && (
        <UpdateAdminStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_AUTOCHARGE && (
        <UpdateAutoChargeStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_FREE_TRIAL && (
        <UpdateFreeTrialStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_OWNER && (
        <UpdateOwnerStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_DISCOUNT_DIVISOR && (
        <UpdateDiscountDivisorStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PENALTY_DIVISOR && (
        <UpdatePenaltyDivisorStage
          state={state}
          handleChange={handleChange}
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
      {stage === LockStage.WITHDRAW && (
        <AdminWithdrawStage
          state={state}
          account={paywallARP?.paywallAddress}
          currency={currency}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.UPDATE_PROFILE_ID && <UpdateProfileIdStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_PROTOCOL && (
        <DeleteARPStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
