import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, LinkExternal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useTrustBountiesContract, useTrustBountiesHelperContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@pancakeswap/wagmi'
import { differenceInSeconds } from 'date-fns'
import { fetchBountiesAsync } from 'state/trustbounties'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import AddBalanceStage from './AddBalanceStage'
import AddApprovalStage from './AddApprovalStage'
import ApplyResultsStage from './ApplyResultsStage'
import AddRecurringBalanceStage from './AddRecurringBalanceStage'
import DeleteApprovalStage from './DeleteApprovalStage'
import CleanUpBalanceStage from './CleanUpBalanceStage'
import CleanUpApprovalStage from './CleanUpApprovalStage'
import UpdateParametersStage from './UpdateParametersStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import LocationStage from 'views/Ramps/components/LocationStage'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.ADD_BALANCE]: t('Add Balance'),
  [LockStage.UPDATE]: t('Update Bounty'),
  [LockStage.APPLY_RESULTS]: t('Apply Vote Results'),
  [LockStage.ADD_APPROVAL]: t('Add Approval'),
  [LockStage.DELETE_APPROVAL]: t('Delete Approval'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.ADD_RECURRING_BALANCE]: t('Add Recurring Balance'),
  [LockStage.CLEAN_UP_APPROVALS]: t('Clean Up Approvals'),
  [LockStage.CLEAN_UP_BALANCES]: t('Clean Up Balances'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_CLEAN_UP_BALANCES]: t('Back'),
  [LockStage.CONFIRM_CLEAN_UP_APPROVALS]: t('Back'),
  [LockStage.CONFIRM_ADD_RECURRING_BALANCE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_UPDATE]: t('Back'),
  [LockStage.CONFIRM_APPLY_RESULTS]: t('Back'),
  [LockStage.CONFIRM_ADD_APPROVAL]: t('Back'),
  [LockStage.CONFIRM_DELETE_APPROVAL]: t('Back'),
  [LockStage.CONFIRM_DELETE_BOUNTY]: t('Back'),
  [LockStage.CONFIRM_ADD_BALANCE]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({ pool, currency, onDismiss }) => {
  const { account } = useWeb3React()
  const variant = pool?.owner?.toLowerCase() === account?.toLowerCase() ? 'admin' : 'user'
  const [stage, setStage] = useState(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { callWithGasPrice } = useCallWithGasPrice()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()
  const adminARP = pool
  const trustBountiesContract = useTrustBountiesContract()
  const trustBountiesHelperContract = useTrustBountiesHelperContract()
  const stakingTokenContract = useERC20(pool?.tokenAddress || '')
  const router = useRouter()
  const fromAccelerator = router.pathname.includes('accelerator')
  const fromContributors = router.pathname.includes('contributors')
  const fromSponsors = router.pathname.includes('sponsors')
  const fromAuditors = router.pathname.includes('auditors')
  const fromBusinesses = router.pathname.includes('businesses')
  const fromRamps = router.pathname.includes('ramps')
  const fromTransfers = router.pathname.includes('transfers')

  console.log('ppool==============>', pool, adminARP)

  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    bountyId: pool?.id,
    profileId: pool?.profileId ?? '',
    tokenId: '',
    nativeCoin: 0,
    amountPayable: '',
    waitingPeriod: '',
    amountReceivable: '',
    paidPayable: '',
    paidReceivable: '',
    periodPayable: '',
    periodReceivable: '',
    startPayable: '',
    startReceivable: '',
    description: '',
    numPeriods: '',
    name: '',
    symbol: '',
    startProtocolId: '',
    endProtocolId: '',
    requestAddress: '',
    requestAmount: '',
    recipient: '',
    splitShares: '',
    adminNote: false,
    period: pool?.period,
    bufferTime: pool?.bufferTime,
    limitFactor: pool?.limitFactor,
    gaugeBalanceFactor: pool?.gaugeBalanceFactor,
    profileRequired: pool?.profileRequired,
    bountyRequired: pool?.bountyRequired,
    paidDays: '',
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    requests: adminARP.userData?.requests?.length || [],
    amounts: adminARP.userData?.amounts?.length || [],
    closeStake: false,
    claimableBy: '',
    minToClaim: '',
    ownerAddress: '',
    collectionId: pool?.collectionId,
    avatar: pool?.collection?.avatar,
    terms: pool?.terms,
    title: '',
    content: '',
    sourceAddress: trustBountiesContract.address,
    customTags: '',
  }))
  const [nftFilters, setNftFilters] = useState<any>({
    workspace: pool?.workspaces,
    country: pool?.countries,
    city: pool?.cities,
    product: pool?.products,
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
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_LOCATION:
        setStage(LockStage.UPDATE_LOCATION)
        break
      case LockStage.APPLY_RESULTS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_APPLY_RESULTS:
        setStage(LockStage.APPLY_RESULTS)
        break
      case LockStage.ADD_BALANCE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_ADD_BALANCE:
        setStage(LockStage.ADD_BALANCE)
        break
      case LockStage.CLEAN_UP_BALANCES:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLEAN_UP_BALANCES:
        setStage(LockStage.CLEAN_UP_BALANCES)
        break
      case LockStage.CLEAN_UP_APPROVALS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLEAN_UP_APPROVALS:
        setStage(LockStage.CLEAN_UP_APPROVALS)
        break
      case LockStage.ADD_RECURRING_BALANCE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_RECURRING_BALANCE:
        setStage(LockStage.ADD_RECURRING_BALANCE)
        break
      case LockStage.ADD_APPROVAL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_APPROVAL:
        setStage(LockStage.ADD_APPROVAL)
        break
      case LockStage.UPDATE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE:
        setStage(LockStage.UPDATE)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.DELETE_APPROVAL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_APPROVAL:
        setStage(LockStage.DELETE_APPROVAL)
        break
      case LockStage.CONFIRM_DELETE_BOUNTY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.CONFIRM_UPDATE_LOCATION)
        break
      case LockStage.UPDATE:
        setStage(LockStage.CONFIRM_UPDATE)
        break
      case LockStage.ADD_BALANCE:
        setStage(LockStage.CONFIRM_ADD_BALANCE)
        break
      case LockStage.ADD_RECURRING_BALANCE:
        setStage(LockStage.CONFIRM_ADD_RECURRING_BALANCE)
        break
      case LockStage.CLEAN_UP_APPROVALS:
        setStage(LockStage.CONFIRM_CLEAN_UP_APPROVALS)
        break
      case LockStage.CLEAN_UP_BALANCES:
        setStage(LockStage.CONFIRM_CLEAN_UP_BALANCES)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.APPLY_RESULTS:
        setStage(LockStage.CONFIRM_APPLY_RESULTS)
        break
      case LockStage.ADD_APPROVAL:
        setStage(LockStage.CONFIRM_ADD_APPROVAL)
        break
      case LockStage.DELETE_APPROVAL:
        setStage(LockStage.CONFIRM_DELETE_APPROVAL)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return (
          requiresApproval(stakingTokenContract, account, trustBountiesContract.address) &&
          requiresApproval(stakingTokenContract, account, trustBountiesHelperContract.address)
        )
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [trustBountiesContract.address, MaxUint256]).then(() =>
        callWithGasPrice(stakingTokenContract, 'approve', [trustBountiesHelperContract.address, MaxUint256]),
      )
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now transfer tokens into this Bounty!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_UPDATE_LOCATION) {
        const args = [
          '0',
          '0',
          nftFilters?.country?.toString(),
          nftFilters?.city?.toString(),
          '0',
          '0',
          ADDRESS_ZERO,
          [nftFilters?.products?.toString()].filter((val) => !!val)?.toString() + state.customTags,
        ]
        console.log('CONFIRM_UPDATE_LOCATION===============>', args)
        return callWithGasPrice(trustBountiesHelperContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_BALANCE) {
        const amount = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const method = state.nativeCoin ? 'addBalanceETH' : 'addBalance'
        const args = state.nativeCoin
          ? [pool?.id, state.sourceAddress, state.tokenId]
          : [pool?.id, state.sourceAddress, state.tokenId, amount.toString()]
        console.log('CONFIRM_ADD_BALANCE===============>', method, args)
        return callWithGasPrice(trustBountiesContract, method, args).catch((err) =>
          console.log('CONFIRM_ADD_BALANCE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        console.log('CONFIRM_UPDATE_OWNER===============>', [state.bountyId])
        return callWithGasPrice(trustBountiesContract, 'updateOwner', [state.bountyId]).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE) {
        console.log('CONFIRM_UPDATE===============>', [
          pool?.id,
          state.collectionId,
          state.owner,
          state.avatar,
          state.terms,
        ])
        return callWithGasPrice(trustBountiesContract, 'updateBounty', [
          pool?.id,
          state.collectionId,
          state.owner,
          state.avatar,
          state.terms,
        ]).catch((err) => console.log('CONFIRM_UPDATE===============>', err))
      }
      if (stage === LockStage.CONFIRM_APPLY_RESULTS) {
        const amount = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const method = state.nativeCoin ? 'applyClaimResultsETH' : 'applyClaimResults'
        const args = state.nativeCoin
          ? [pool?.id, state.claimId, state.title, state.content]
          : [pool?.id, state.claimId, amount.toString(), state.title, state.content]
        console.log('CONFIRM_APPLY_RESULTS===============>', method, args)
        return callWithGasPrice(trustBountiesContract, method, args).catch((err) =>
          console.log('CONFIRM_APPLY_RESULTS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_BOUNTY) {
        console.log('CONFIRM_DELETE_BOUNTY===============>', [pool?.id])
        return callWithGasPrice(trustBountiesContract, 'deleteBounty', [pool?.id]).catch((err) =>
          console.log('CONFIRM_DELETE_BOUNTY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_RECURRING_BALANCE) {
        console.log('CONFIRM_ADD_RECURRING_BALANCE===============>', [state.bountyId, state.sourceAddress])
        return callWithGasPrice(trustBountiesContract, 'addRecurringBalance', [
          state.bountyId,
          state.sourceAddress,
        ]).catch((err) => console.log('CONFIRM_ADD_RECURRING_BALANCE===============>', err))
      }
      if (stage === LockStage.CONFIRM_CLEAN_UP_BALANCES) {
        console.log('CONFIRM_CLEAN_UP_BALANCES===============>', [state.bountyId])
        return callWithGasPrice(trustBountiesContract, 'cleanUpBalances', [state.bountyId]).catch((err) =>
          console.log('CONFIRM_CLEAN_UP_BALANCES===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLEAN_UP_APPROVALS) {
        console.log('CONFIRM_CLEAN_UP_APPROVALS===============>', [state.bountyId])
        return callWithGasPrice(trustBountiesContract, 'cleanUpApprovals', [state.bountyId]).catch((err) =>
          console.log('CONFIRM_CLEAN_UP_APPROVALS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_APPROVAL) {
        const amount = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const endTime = Math.max(
          differenceInSeconds(new Date(state.endTime || 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        console.log('CONFIRM_ADD_APPROVAL============>', [state.partnerBounty, pool.id, amount.toString(), endTime])
        return callWithGasPrice(trustBountiesContract, 'addApproval', [
          state.partnerBounty,
          pool.id,
          amount.toString(),
          endTime,
        ]).catch((err) => console.log('CONFIRM_ADD_APPROVAL===============>', err))
      }
      if (stage === LockStage.CONFIRM_DELETE_APPROVAL) {
        const amount = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        console.log('CONFIRM_DELETE_APPROVAL============>', [state.partnerBounty, pool.id, amount.toString()])
        return callWithGasPrice(trustBountiesContract, 'removeApproval', [
          state.partnerBounty,
          pool.id,
          amount.toString(),
        ]).catch((err) => console.log('CONFIRM_DELETE_APPROVAL===============>', err))
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      dispatch(
        fetchBountiesAsync({
          fromAccelerator,
          fromContributors,
          fromSponsors,
          fromAuditors,
          fromBusinesses,
          fromRamps,
          fromTransfers,
        }),
      )
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
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE)}>
            {t('UPDATE BOUNTY')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.ADD_BALANCE)}>
            {t('ADD BALANCE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          <Button variant="light" mb="8px" onClick={() => setStage(LockStage.APPLY_RESULTS)}>
            {t('APPLY RESULTS')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.ADD_RECURRING_BALANCE)}>
            {t('ADD RECURRING BALANCE')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.CLEAN_UP_APPROVALS)}>
            {t('CLEAN UP APPROVALS')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.CLEAN_UP_BALANCES)}>
            {t('CLEAN UP BALANCES')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.CONFIRM_DELETE_BOUNTY)}>
            {t('DELETE BOUNTY')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" onClick={() => setStage(LockStage.ADD_APPROVAL)}>
            {t('ADD APPROVAL')}
          </Button>
          <Button variant="light" mb="8px" onClick={() => setStage(LockStage.APPLY_RESULTS)}>
            {t('APPLY RESULTS')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.ADD_RECURRING_BALANCE)}>
            {t('ADD RECURRING BALANCE')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE_APPROVAL)}>
            {t('DELETE APPROVAL')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.CLEAN_UP_APPROVALS)}>
            {t('CLEAN UP APPROVALS')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.CLEAN_UP_BALANCES)}>
            {t('CLEAN UP BALANCES')}
          </Button>
          <Flex mb="8px" justifyContent="center" alignSelf="center">
            <LinkExternal
              color="failure"
              href={`/trustbounties/voting/create?bountyId=${pool?.id}&decimals=${pool?.token?.decimals}`}
              bold
            >
              {t('START LITIGATIONS')}
            </LinkExternal>
          </Flex>
        </Flex>
      )}
      {stage === LockStage.UPDATE_LOCATION && (
        <LocationStage
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE && (
        <UpdateParametersStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_OWNER && (
        <UpdateOwnerStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.ADD_BALANCE && (
        <AddBalanceStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.ADD_APPROVAL && (
        <AddApprovalStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DELETE_APPROVAL && (
        <DeleteApprovalStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.APPLY_RESULTS && (
        <ApplyResultsStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CLEAN_UP_BALANCES && (
        <CleanUpBalanceStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CLEAN_UP_APPROVALS && (
        <CleanUpApprovalStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.ADD_RECURRING_BALANCE && (
        <AddRecurringBalanceStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
