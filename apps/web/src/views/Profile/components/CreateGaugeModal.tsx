import BigNumber from 'bignumber.js'
import { useState, ChangeEvent } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useAppDispatch } from 'state'
import { InjectedModalProps, Button, Flex, useToast } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { fetchProfilesAsync } from 'state/profile'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import { getARPNoteAddress, getVeFromWorkspace } from 'utils/addressHelpers'
import { useERC20, useProfileContract, useProfileHelperContract } from 'hooks/useContract'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { ToastDescriptionWithTx } from 'components/Toast'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { requiresApproval } from 'utils/requiresApproval'
import { useActiveChainId } from 'hooks/useActiveChainId'
import LocationStage from 'views/Ramps/components/LocationStage'
import { getSSIContract } from 'utils/contractHelpers'

import PayProfileStage from './PayProfileStage'
import UpdateLateDaysStage from './UpdateLateDaysStage'
import AddAccountStage from './AddAccountStage'
import UpdateBountyStage from './UpdateBountyStage'
import AddAccountFromProofStage from './AddAccountFromProofStage'
import UpdateCollectionIdStage from './UpdateCollectionIdStage'
import DeleteStage from './DeleteStage'
import UpdateBadgeIDStage from './UpdateBadgeIDStage'
import UpdateBlacklistStage from './UpdateBlacklistStage'
import BroadCastStage from './BroadCastStage'
import ClaimRevenueStage from './ClaimRevenueStage'
import RemoveAccountStage from './RemoveAccountStage'
import CreateProfileStage from './CreateProfileStage'
import CrushCheckStage from './CrushCheckStage'
import UpdateSSIDStage from './UpdateSSIDStage'
import UpdateTimeContraintStage from './UpdateTimeContraintStage'
import CrushUpdateStage from './CrushUpdateStage'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.ADD_ACCOUNT]: t('Add Account'),
  [LockStage.ADD_ACCOUNT2]: t('Add Account'),
  [LockStage.PAY]: t('Pay Profile'),
  [LockStage.CREATE]: t('Create Profile'),
  [LockStage.UPDATE_LATE_DAYS]: t('Update Late Days'),
  [LockStage.CRUSH_CHECK]: t('Crush Check'),
  [LockStage.ADD_ACCOUNT_FROM_PROOF]: t('Add Account'),
  [LockStage.UPDATE_COLLECTION_ID]: t('Update Collection'),
  [LockStage.UPDATE_BOUNTY]: t('Update Bounty'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.UPDATE_BADGE_ID]: t('Attach Badge'),
  [LockStage.UPDATE_BLACKLIST]: t('Update Blacklist'),
  [LockStage.CRUSH_UPDATE]: t('Update Crush'),
  [LockStage.BROADCAST]: t('Broadcast'),
  [LockStage.UPDATE_SSID]: t('Update SSID'),
  [LockStage.CLAIM_REVENUE]: t('Withdraw Liquidity'),
  [LockStage.REMOVE_ACCOUNT]: t('Remove Account'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.UPDATE_TIME_CONSTRAINT]: t('Update Time Constraints'),
  [LockStage.ADD_ACCOUNT_FROM_SSI]: t('Add Account From SSID'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_PAY]: t('Back'),
  [LockStage.CONFIRM_ADD_ACCOUNT_FROM_SSI]: t('Back'),
  [LockStage.CONFIRM_UPDATE_LATE_DAYS]: t('Back'),
  [LockStage.CONFIRM_ADD_ACCOUNT]: t('Back'),
  [LockStage.CONFIRM_ADD_ACCOUNT2]: t('Back'),
  [LockStage.CONFIRM_FOLLOW]: t('Back'),
  [LockStage.CONFIRM_CREATE]: t('Back'),
  [LockStage.CONFIRM_UNFOLLOW]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY]: t('Back'),
  [LockStage.CONFIRM_ADD_ACCOUNT_FROM_PROOF]: t('Back'),
  [LockStage.CONFIRM_UPDATE_COLLECTION_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_SSID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BADGE_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BLACKLIST]: t('Back'),
  [LockStage.CONFIRM_CRUSH_UPDATE]: t('Back'),
  [LockStage.CONFIRM_CRUSH_CHECK]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TIME_CONSTRAINT]: t('Back'),
  [LockStage.CONFIRM_BROADCAST]: t('Back'),
  [LockStage.CONFIRM_CLAIM_REVENUE]: t('Back'),
  [LockStage.CONFIRM_REMOVE_ACCOUNT]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  variant: 'admin' | 'user' | 'create' | 'add'
  pool?: any
  currency: any
}

// eslint-disable-next-line consistent-return
const getApproveToastText = (stage: any, t: ContextApi['t']) => {
  if (stage === LockStage.CONFIRM_UPDATE_SSID) {
    return t('Contract approved - you can now send tokens into your bribe contract')
  }
  if (stage === LockStage.CONFIRM_CRUSH_CHECK) {
    return t('You are a crush of this profile')
  }
}

// eslint-disable-next-line consistent-return
const getToastText = (stage: LockStage, t: ContextApi['t']) => {
  if (stage === LockStage.CONFIRM_VOTE_UP || stage === LockStage.CONFIRM_VOTE_DOWN) {
    return t('Vote successfully processed')
  }
}

const BuyModal: React.FC<any> = ({ variant = 'user', pool, currAccount, currency, profile, onSuccess, onDismiss }) => {
  const [stage, setStage] = useState(
    variant === 'admin'
      ? LockStage.ADMIN_SETTINGS
      : variant === 'create'
      ? LockStage.CREATE
      : variant === 'add'
      ? LockStage.ADD_ACCOUNT2
      : variant === 'follow'
      ? LockStage.CONFIRM_FOLLOW
      : variant === 'unfollow'
      ? LockStage.CONFIRM_UNFOLLOW
      : LockStage.SETTINGS,
  )
  const { chainId } = useActiveChainId()
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const profileContract = useProfileContract()
  const profileHelperContract = useProfileHelperContract()
  const tokenContract = useERC20(currency?.address || '')
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const [state, setState] = useState(() => ({
    profileId: pool?.id ?? '',
    isPaywall: 0,
    protocolId: '',
    tokenId: '',
    identityTokenId: '0',
    amountReceivable: '0',
    helper: '',
    arp: '',
    owner: '',
    ve: '',
    bountyId: '0',
    collectionId: '0',
    badgeId: '0',
    add: 0,
    detach: 1,
    message: '',
    amountPayable: '0',
    name: '',
    referrerProfileId: '0',
    customTags: '',
    reason: '',
  }))
  console.log('pppoool================>', pool, profile)
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
      case LockStage.UPDATE_TIME_CONSTRAINT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TIME_CONSTRAINT:
        setStage(LockStage.UPDATE_TIME_CONSTRAINT)
        break
      case LockStage.CONFIRM_CREATE:
        setStage(LockStage.CREATE)
        break
      case LockStage.UPDATE_LATE_DAYS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_LATE_DAYS:
        setStage(LockStage.UPDATE_LATE_DAYS)
        break
      case LockStage.CONFIRM_FOLLOW:
        if (variant !== 'follow') setStage(LockStage.SETTINGS)
        break
      case LockStage.PAY:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_PAY:
        setStage(LockStage.PAY)
        break
      case LockStage.CONFIRM_UNFOLLOW:
        if (variant !== 'unfollow') setStage(LockStage.SETTINGS)
        break
      case LockStage.ADD_ACCOUNT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_ADD_ACCOUNT:
        setStage(LockStage.ADD_ACCOUNT)
        break
      case LockStage.CONFIRM_ADD_ACCOUNT2:
        setStage(LockStage.ADD_ACCOUNT2)
        break
      case LockStage.ADD_ACCOUNT_FROM_PROOF:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_ADD_ACCOUNT_FROM_PROOF:
        setStage(LockStage.ADD_ACCOUNT_FROM_PROOF)
        break
      case LockStage.CONFIRM_UPDATE_COLLECTION_ID:
        setStage(LockStage.UPDATE_COLLECTION_ID)
        break
      case LockStage.UPDATE_COLLECTION_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.DELETE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.UPDATE_BLACKLIST:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BLACKLIST:
        setStage(LockStage.UPDATE_BLACKLIST)
        break
      case LockStage.CRUSH_UPDATE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CRUSH_UPDATE:
        setStage(LockStage.CRUSH_UPDATE)
        break
      case LockStage.CRUSH_CHECK:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CRUSH_CHECK:
        setStage(LockStage.CRUSH_CHECK)
        break
      case LockStage.CONFIRM_ADD_ACCOUNT_FROM_SSI:
        setStage(LockStage.ADD_ACCOUNT_FROM_SSI)
        break
      case LockStage.ADD_ACCOUNT_FROM_SSI:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BOUNTY:
        setStage(LockStage.UPDATE_BOUNTY)
        break
      case LockStage.UPDATE_BADGE_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BADGE_ID:
        setStage(LockStage.UPDATE_BADGE_ID)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.CONFIRM_UPDATE_SSID:
        setStage(LockStage.UPDATE_SSID)
        break
      case LockStage.UPDATE_SSID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_BROADCAST:
        setStage(LockStage.BROADCAST)
        break
      case LockStage.BROADCAST:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_REVENUE:
        setStage(LockStage.CLAIM_REVENUE)
        break
      case LockStage.CLAIM_REVENUE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_REMOVE_ACCOUNT:
        setStage(LockStage.REMOVE_ACCOUNT)
        break
      case LockStage.REMOVE_ACCOUNT:
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
      case LockStage.CREATE:
        setStage(LockStage.CONFIRM_CREATE)
        break
      case LockStage.PAY:
        setStage(LockStage.CONFIRM_PAY)
        break
      case LockStage.ADD_ACCOUNT_FROM_SSI:
        setStage(LockStage.CONFIRM_ADD_ACCOUNT_FROM_SSI)
        break
      case LockStage.UPDATE_LATE_DAYS:
        setStage(LockStage.CONFIRM_UPDATE_LATE_DAYS)
        break
      case LockStage.ADD_ACCOUNT:
        setStage(LockStage.CONFIRM_ADD_ACCOUNT)
        break
      case LockStage.ADD_ACCOUNT2:
        setStage(LockStage.CONFIRM_ADD_ACCOUNT2)
        break
      case LockStage.ADD_ACCOUNT_FROM_PROOF:
        setStage(LockStage.CONFIRM_ADD_ACCOUNT_FROM_PROOF)
        break
      case LockStage.UPDATE_COLLECTION_ID:
        setStage(LockStage.CONFIRM_UPDATE_COLLECTION_ID)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY)
        break
      case LockStage.UPDATE_BADGE_ID:
        setStage(LockStage.CONFIRM_UPDATE_BADGE_ID)
        break
      case LockStage.UPDATE_BLACKLIST:
        setStage(LockStage.CONFIRM_UPDATE_BLACKLIST)
        break
      case LockStage.CRUSH_UPDATE:
        setStage(LockStage.CONFIRM_CRUSH_UPDATE)
        break
      case LockStage.CRUSH_CHECK:
        setStage(LockStage.CONFIRM_CRUSH_CHECK)
        break
      case LockStage.UPDATE_TIME_CONSTRAINT:
        setStage(LockStage.CONFIRM_UPDATE_TIME_CONSTRAINT)
        break
      case LockStage.BROADCAST:
        setStage(LockStage.CONFIRM_BROADCAST)
        break
      case LockStage.CLAIM_REVENUE:
        setStage(LockStage.CONFIRM_CLAIM_REVENUE)
        break
      case LockStage.REMOVE_ACCOUNT:
        setStage(LockStage.CONFIRM_REMOVE_ACCOUNT)
        break
      case LockStage.UPDATE_SSID:
        setStage(LockStage.CONFIRM_UPDATE_SSID)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(tokenContract, account, profileContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(tokenContract, 'approve', [profileContract.address, MaxUint256]).catch((err) =>
        console.log('approve===================>', err),
      )
    },
    onApproveSuccess: ({ receipt }) => {
      toastSuccess(getApproveToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_UPDATE_LOCATION) {
        const customTags = state.customTags?.split(',')
        const args = [
          '0',
          '0',
          nftFilters?.country?.toString(),
          nftFilters?.city?.toString(),
          '0',
          '0',
          pool?.id,
          customTags.length && customTags[0],
        ]
        console.log('CONFIRM_UPDATE_LOCATION===============>', args)
        return callWithGasPrice(profileContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CREATE) {
        console.log('CONFIRM_CREATE================>', [state.name, state.referrerProfileId])
        return callWithGasPrice(profileContract, 'createProfile', [
          state.name?.toUpperCase(),
          state.referrerProfileId,
        ]).catch((err) => console.log('CONFIRM_CREATE==================>', err))
      }
      if (stage === LockStage.CONFIRM_FOLLOW) {
        console.log('CONFIRM_FOLLOW================>', [state.profileId])
        return callWithGasPrice(profileContract, 'follow', [state.profileId]).catch((err) =>
          console.log('CONFIRM_FOLLOW==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_PAY) {
        const amount = getDecimalAmount(new BigNumber(state.amountReceivable ?? 0), currency?.decimals)
        console.log('CONFIRM_PAY==================>', [currency?.address, state.profileId, amount?.toString()])
        return callWithGasPrice(profileContract, 'payProfile', [
          currency?.address,
          state.profileId,
          amount?.toString(),
          state.reason,
        ]).catch((err) => console.log('CONFIRM_PAY==================>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_LATE_DAYS) {
        const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase())
        const args = [
          getARPNoteAddress(),
          state.arp,
          state.owner,
          ve,
          state.tokenId,
          state.protocolId,
          state.profileId,
          state.isPaywall,
        ]
        console.log('CONFIRM_UPDATE_LATE_DAYS==================>', args)
        return callWithGasPrice(profileContract, 'updateLateDays', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LATE_DAYS==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UNFOLLOW) {
        console.log('CONFIRM_UNFOLLOW==================>', [pool?.id])
        return callWithGasPrice(profileContract, 'unFollow', [pool?.id]).catch((err) =>
          console.log('CONFIRM_UNFOLLOW==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_ACCOUNT || stage === LockStage.CONFIRM_ADD_ACCOUNT2) {
        console.log('CONFIRM_ADD_ACCOUNT==================>', [
          pool?.profileId || profile?.id || state.profileId,
          state.owner,
        ])
        return callWithGasPrice(profileContract, 'addAccount', [
          pool?.profileId || profile?.id || state.profileId,
          state.owner,
        ]).catch((err) => console.log('CONFIRM_ADD_ACCOUNT==================>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY) {
        console.log('CONFIRM_UPDATE_BOUNTY==================>', [state.bountyId])
        return callWithGasPrice(profileContract, 'addBounty', [state.bountyId]).catch((err) =>
          console.log('CONFIRM_UPDATE_BOUNTY==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_ACCOUNT_FROM_PROOF) {
        console.log('CONFIRM_ADD_ACCOUNT_FROM_PROOF==================>', [
          pool?.profileId || state.profileId,
          state.identityTokenId,
        ])
        return callWithGasPrice(profileContract, 'addAccountFromProof', [
          pool?.profileId || state.profileId,
          state.identityTokenId,
        ])
          .then(() => onSuccess())
          .catch((err) => console.log('CONFIRM_ADD_ACCOUNT_FROM_PROOF==================>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_COLLECTION_ID) {
        console.log('CONFIRM_UPDATE_COLLECTION_ID==================>', [state.collectionId])
        return callWithGasPrice(profileContract, 'updateCollectionId', [state.collectionId]).catch((err) =>
          console.log('CONFIRM_UPDATE_COLLECTION_ID==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        console.log('CONFIRM_DELETE================>', [!!state.detach])
        return callWithGasPrice(profileContract, 'deleteProfile', [!!state.detach]).catch((err) =>
          console.log('CONFIRM_DELETE==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_SSID) {
        console.log('CONFIRM_UPDATE_SSID=======================>', [state.profileId, state.identityTokenId])
        return callWithGasPrice(getSSIContract(), 'updateSSID', [state.profileId, state.identityTokenId])
          .then(() => delay(3000))
          .then(() => callWithGasPrice(profileContract, 'updateSSID', []))
          .catch((err) => console.log('1CONFIRM_UPDATE_SSID==================>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BADGE_ID) {
        console.log('CONFIRM_UPDATE_BADGE_ID==================>', [state.badgeId, !!state.add])
        return callWithGasPrice(profileContract, 'updateBadgeId', [state.badgeId, !!state.add]).catch((err) =>
          console.log('CONFIRM_UPDATE_BADGE_ID==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BLACKLIST) {
        console.log('CONFIRM_UPDATE_BLACKLIST==================>', [state.profileId, !!state.add])
        return callWithGasPrice(profileContract, 'updateBlackList', [state.profileId, !!state.add]).catch((err) =>
          console.log('CONFIRM_UPDATE_BLACKLIST==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CRUSH_UPDATE) {
        console.log('CONFIRM_CRUSH_UPDATE==================>', [state.profileId, !!state.add])
        return callWithGasPrice(profileHelperContract, 'updateCrush', [state.profileId, !!state.add]).catch((err) =>
          console.log('CONFIRM_CRUSH_UPDATE==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CRUSH_CHECK) {
        console.log('CONFIRM_CRUSH_CHECK==================>', [state.profileId])
        return callWithGasPrice(profileHelperContract, 'checkCrush', [state.profileId]).catch((err) =>
          console.log('CONFIRM_CRUSH_CHECK==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TIME_CONSTRAINT) {
        console.log('CONFIRM_UPDATE_TIME_CONSTRAINT===============>')
        return callWithGasPrice(getSSIContract(), 'updateSSID', [state.profileId, state.identityTokenId])
          .then(() => delay(3000))
          .then(() => callWithGasPrice(profileContract, 'updateTimeConstraint', []))
          .catch((err) => console.log('CONFIRM_UPDATE_TIME_CONSTRAINT===============>', err))
      }
      if (stage === LockStage.CONFIRM_ADD_ACCOUNT_FROM_SSI) {
        console.log('CONFIRM_ADD_ACCOUNT_FROM_SSI===============>')
        return callWithGasPrice(profileContract, 'addAccountFromSSID', [state.profileId, state.identityTokenId]).catch(
          (err) => console.log('CONFIRM_ADD_ACCOUNT_FROM_SSI===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BROADCAST) {
        console.log('CONFIRM_BROADCAST==================>', [state.message, pool?.profileId || state.profileId])
        return callWithGasPrice(profileHelperContract, 'updateBroadcast', [
          state.message,
          pool?.profileId || state.profileId,
        ]).catch((err) => console.log('CONFIRM_BROADCAST==================>', err))
      }
      if (stage === LockStage.CONFIRM_CLAIM_REVENUE) {
        const amount = getDecimalAmount(new BigNumber(state.amountPayable ?? 0), currency?.decimals)
        console.log('CONFIRM_CLAIM_REVENUE==================>', [
          currency?.address,
          pool?.profileId || state.profileId,
          amount?.toString(),
        ])
        return callWithGasPrice(profileContract, 'claimRevenue', [
          currency?.address,
          pool?.profileId || state.profileId,
          amount?.toString(),
        ]).catch((err) => console.log('CONFIRM_CLAIM_REVENUE==================>', err))
      }
      if (stage === LockStage.CONFIRM_REMOVE_ACCOUNT) {
        console.log('CONFIRM_REMOVE_ACCOUNT==================>', [pool?.profileId || state.profileId, state.owner])
        return callWithGasPrice(profileContract, 'removeAccount', [
          pool?.profileId || state.profileId,
          state.owner,
        ]).catch((err) => console.log('CONFIRM_REMOVE_ACCOUNT==================>', err))
      }
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      // onSuccessSale()
      setConfirmedTxHash(receipt.transactionHash)
      setStage(LockStage.TX_CONFIRMED)
      dispatch(fetchProfilesAsync({ chainId }))
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
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.CONFIRM_FOLLOW)}>
            {t('FOLLOW')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.CRUSH_CHECK)}>
            {t('AM I A CRUSH')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.PAY)}>
            {t('PAY PROFILE')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.UPDATE_LATE_DAYS)}>
            {t('UPDATE LATE DAYS')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.CONFIRM_UNFOLLOW)}>
            {t('UNFOLLOW')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.ADD_ACCOUNT)}>
            {t('ADD ACCOUNT')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.PAY)}>
            {t('PAY PROFILE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.ADD_ACCOUNT_FROM_SSI)}>
            {t('ADD ACCOUNT FROM SSID')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_COLLECTION_ID)}>
            {t('UPDATE COLLECTION ID')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_SSID)}>
            {t('UPDATE SSID')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY)}>
            {t('UPDATE BOUNTY')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BADGE_ID)}>
            {t('ATTACH BADGE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BLACKLIST)}>
            {t('UPDATE BLACKLIST')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.CRUSH_UPDATE)}>
            {t('UPDATE CRUSH')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.BROADCAST)}>
            {t('BROADCAST')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.CLAIM_REVENUE)}>
            {t('WITHDRAW LIQUIDITY')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.UPDATE_TIME_CONSTRAINT)}>
            {t('UPDATE TIME CONSTRAINT')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.REMOVE_ACCOUNT)}>
            {t('REMOVE ACCOUNT')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE)}>
            {t('DELETE PROFILE')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.UPDATE_SSID && (
        <UpdateSSIDStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}

      {stage === LockStage.UPDATE_TIME_CONSTRAINT && (
        <UpdateTimeContraintStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_LOCATION && (
        <LocationStage
          pool={pool}
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.PAY && (
        <PayProfileStage
          state={state}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_LATE_DAYS && (
        <UpdateLateDaysStage
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {(stage === LockStage.ADD_ACCOUNT || stage === LockStage.ADD_ACCOUNT2) && (
        <AddAccountStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.ADD_ACCOUNT_FROM_SSI && (
        <AddAccountFromProofStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_COLLECTION_ID && (
        <UpdateCollectionIdStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_BOUNTY && (
        <UpdateBountyStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_BADGE_ID && (
        <UpdateBadgeIDStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_BLACKLIST && (
        <UpdateBlacklistStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BROADCAST && (
        <BroadCastStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CLAIM_REVENUE && (
        <ClaimRevenueStage
          state={state}
          currAccount={currAccount}
          currency={currency}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.REMOVE_ACCOUNT && (
        <RemoveAccountStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.DELETE && (
        <DeleteStage
          state={state}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CREATE && (
        <CreateProfileStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CRUSH_CHECK && (
        <CrushCheckStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CRUSH_UPDATE && (
        <CrushUpdateStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
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
      {stage === LockStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
