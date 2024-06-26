import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { ContextApi, TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, Modal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  useERC20,
  useValuepoolHelperContract,
  useValuepoolHelper2Contract,
  useValuepoolVoterContract,
  useValuepoolContract,
  useVaContract,
} from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useMemo, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCurrPool } from 'state/valuepools/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { fetchValuepoolSgAsync } from 'state/valuepools'
import { getNFTSVGContract } from 'utils/contractHelpers'

import { stagesWithBackButton, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import AddAmountModal from './LockedPool/Modals/AddAmountModal'
import RemoveAmountModal from './LockedPool/Modals/RemoveAmountModal'
import PresentBribeModal from './LockedPool/Modals/PresentBribeModal'
import MergeStage from './MergeStage'
import UpdateExcludedContentStage from './UpdateExcludedContentStage'
import UpdateBlacklistedStage from './UpdateBlacklistedStage'
import DisableBribeStage from './DisableBribeStage'
import UpdateVPStage from './UpdateVPStage'
import PickRankStage from './PickRankStage'
import CheckRankStage from './CheckRankStage'
import UpdateDescriptionStage from './UpdateDescriptionStage'
import UpdateDescriptionStage2 from './UpdateDescriptionStage2'
import UpdateMediaStage from './UpdateMediaStage'
import ApproveUserStage from './ApproveUserStage'
import UpdateTaxContractStage from './UpdateTaxContractStage'
import UpdateMarketPlaceStage from './UpdateMarketPlaceStage'
import UpdateTrustworthyMerchantStage from './UpdateTrustworthyMerchantStage'
import UpdateTrustworthyAuditorStage from './UpdateTrustworthyAuditorStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteVPStage from './DeleteVPStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import AddSponsorStage from './AddSponsorStage'
import RemoveSponsorStage from './RemoveSponsorStage'
import NotifyLoanStage from './NotifyLoanStage'
import ReimburseLoanStage from './ReimburseLoanStage'
import ReimburseBNPLStage from './ReimburseBNPLStage'
import UpdateMerchantIDProofStage from './UpdateMerchantIDProofStage'
import AddCreditStage from './AddCreditStage'
import UpdateUserIDProofStage from './UpdateUserIDProofStage'
import UpdateVotingParametersStage from './UpdateVotingParametersStage'
import UpdateVotingBlacklistStage from './UpdateVotingBlacklistStage'
import LocationStage from './LocationStage'
import NotifyPaymentStage from './NotifyPaymentStage'
import SwitchPoolStage from './SwitchPoolStage'
import DepositStage from './DepositStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.DEPOSIT]: t('Deposit into Account'),
  [LockStage.DEPOSIT2]: t('Donate Funds'),
  [LockStage.WITHDRAW]: t('Withdraw from Account'),
  [LockStage.REIMBURSE_BNPL]: t('Reimburse BNPL'),
  [LockStage.REIMBURSE]: t('Reimburse Loan'),
  [LockStage.MERGE]: t('Merge IDs'),
  [LockStage.ADD_CREDIT]: t('Add Credits'),
  [LockStage.SWITCH_POOL]: t('Switch to Valuepool/Riskpool'),
  [LockStage.CREATE_LOCK]: t('Create Account'),
  [LockStage.HISTORY]: t('Transactions History'),
  [LockStage.SPONSORS]: t('SPONSORS'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.DELETE_VP]: t('Delete Valuepool'),
  [LockStage.DISABLE_BRIBE]: t('Disable Bribes'),
  [LockStage.UPDATE_VP]: t('Update Valuepool'),
  [LockStage.ADMIN_WITHDRAW]: t('Withdraw from treasury'),
  [LockStage.ADD_SPONSORS]: t('Add Sponsors'),
  [LockStage.REMOVE_SPONSORS]: t('Remove Sponsors'),
  [LockStage.NOTIFY_PAYMENT]: t('Notify Payment'),
  [LockStage.NOTIFY_LOAN]: t('Withdraw Approved Funds'),
  [LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS]: t('Update Merchants ID Proof'),
  [LockStage.UPDATE_USER_IDENTITY_PROOFS]: t('Update Users ID Proof'),
  [LockStage.PICK_RANK]: t('Pick Rank'),
  [LockStage.UPDATE_DESCRIPTION]: t('Update Description'),
  [LockStage.UPDATE_DESCRIPTION2]: t('Update NFT Board'),
  [LockStage.UPDATE_TAX_CONTRACT]: t('Update Tax Contract'),
  [LockStage.UPDATE_MARKETPLACE]: t('Update MarketPlace'),
  [LockStage.UPDATE_TRUSTWORTHY_AUDITORS]: t('Update Trustworthy Auditors'),
  [LockStage.UPDATE_TRUSTWORTHY_MERCHANTS]: t('Update Trustworthy Merchants'),
  [LockStage.CHECK_RANK]: t('Check Rank'),
  [LockStage.APPROVE_USER]: t('Approve User'),
  [LockStage.UPDATE_EXCLUDED_CONTENT]: t('Update Excluded Content'),
  [LockStage.UPDATE_BLACKLISTED_MERCHANTS]: t('Update Blacklisted Merchants'),
  [LockStage.UPDATE_MEDIA]: t('Update Media'),
  [LockStage.UPDATE_VOTING_PARAMETERS]: t('Update Voting Parameters'),
  [LockStage.UPDATE_VOTING_BLACKLIST]: t('Update Voting Blacklist'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MARKETPLACE]: t('Back'),
  [LockStage.CONFIRM_SWITCH_POOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST]: t('Back'),
  [LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MEDIA]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT]: t('Back'),
  [LockStage.CONFIRM_CHECK_RANK]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAX_CONTRACT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DESCRIPTION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DESCRIPTION2]: t('Back'),
  [LockStage.CONFIRM_PICK_RANK]: t('Back'),
  [LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS]: t('Back'),
  [LockStage.CONFIRM_ADD_CREDIT]: t('Back'),
  [LockStage.CONFIRM_APPROVE_USER]: t('Back'),
  [LockStage.CONFIRM_REIMBURSE_BNPL]: t('Back'),
  [LockStage.CONFIRM_REIMBURSE]: t('Back'),
  [LockStage.CONFIRM_ADD_SPONSORS]: t('Back'),
  [LockStage.CONFIRM_NOTIFY_LOAN]: t('Back'),
  [LockStage.CONFIRM_NOTIFY_PAYMENT]: t('Back'),
  [LockStage.CONFIRM_REMOVE_SPONSORS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_MERGE]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT2]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_UPDATE_VP]: t('Back'),
  [LockStage.CONFIRM_CREATE_LOCK]: t('Back'),
  [LockStage.CONFIRM_ADMIN_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_DELETE_VP]: t('Back'),
  [LockStage.CONFIRM_DISABLE_BRIBE]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

const getToastText = (stage: LockStage, t: ContextApi['t']) => {
  if (stage === LockStage.CONFIRM_DEPOSIT) {
    return t('Deposit successfully processed')
  }
  if (stage === LockStage.CONFIRM_WITHDRAW) {
    return t('Withdrawal successfully processed')
  }
  return ''
}

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({ variant = 'user', location = 'valuepool', pool, currency, onDismiss }) => {
  const [stage, setStage] = useState(
    variant === 'admin' || variant === 'adminUser'
      ? LockStage.ADMIN_SETTINGS
      : variant === 'delete'
      ? LockStage.DELETE_VP
      : variant === 'user'
      ? LockStage.SETTINGS
      : variant === 'add_sponsors'
      ? LockStage.ADD_SPONSORS
      : LockStage.SPONSORS,
  )
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const _adminARP = pool
  const adminARP = location === 'valuepool' ? pool : _adminARP
  const valuepoolHelperContract = useValuepoolHelperContract()
  const valuepoolHelper2Contract = useValuepoolHelper2Contract()
  const valuepoolVoterContract = useValuepoolVoterContract()
  const stakingTokenContract = useERC20(pool?.stakingToken?.address || '')
  const stakingTokenContract2 = useERC20(currency?.address || '')
  const valuepoolContract = useValuepoolContract(pool?.id ?? '')
  const vaContract = useVaContract(pool?._va ?? '')
  const currState = useCurrPool()
  const { userData } = pool
  const router = useRouter()
  const referrer = router.query?.referrer as string
  const tokenBalance = useMemo(
    () => pool?.userData?.nfts?.find((n) => n.id === currState[pool?.valuepoolAddress]),
    [pool, currState],
  )
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance
    ? getDecimalAmount(new BigNumber(balance.toExact()), currency?.decimals)
    : BIG_ZERO
  const stakingTokenBalance2 = tokenBalance?.maxWithdrawable
    ? getDecimalAmount(tokenBalance.maxWithdrawable, currency?.decimals)
    : BIG_ZERO
  const totalLiquidity = parseFloat(pool.totalLiquidity)
    ? getBalanceNumber(pool?.totalLiquidity, currency?.decimals)
    : BIG_ZERO
  console.log('totalLiquidity=============>', totalLiquidity, pool)
  const treasuryBalance = (parseFloat(pool?.treasuryShare ?? '0') / 100) * parseFloat(totalLiquidity.toString())
  const dispatch = useAppDispatch()
  const fromValuepool = useRouter().query.valuepool

  const [share, setShare] = useState(0)

  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    vava: pool?.id ?? '',
    tokenId2: '',
    amountPayable: '',
    amountReceivable: '',
    identityTokenId: '',
    paidPayable: '',
    paidReceivable: '',
    periodPayable: '',
    periodReceivable: '',
    startPayable: '',
    startReceivable: '',
    description: '',
    minLockValue: '',
    numPeriods: '',
    name: '',
    symbol: '',
    price: '',
    startProtocolId: '',
    endProtocolId: '',
    requestAddress: '',
    requestAmount: '',
    recipient: '',
    splitShares: '',
    adminNote: false,
    period: parseInt(pool?.period ?? '0') / 60,
    bufferTime: parseInt(pool?.bufferTime ?? '0') / 60,
    limitFactor: pool?.limitFactor,
    gaugeBalanceFactor: pool?.gaugeBalanceFactor,
    profileRequired: pool?.profileRequired,
    bountyRequired: pool?.bountyRequired,
    paidDays: '',
    item: '',
    options: '',
    userTokenId: '',
    collectionAddress: '',
    merchantIdentityTokenId: '',
    requests: adminARP.userData?.requests?.length || [],
    amounts: adminARP.userData?.amounts?.length || [],
    cbcAddress: '',
    BNPL: pool?.BNPL ?? 0,
    onlyTrustWorthyAuditors: pool?.onlyTrustWorthyAuditors,
    queueDuration: parseInt(pool?.queueDuration ?? '0') / 60,
    linkFeeInBase: pool?.linkFeeInBase,
    maxDueReceivable: pool?.maxDueReceivable,
    addAdmin: true,
    admins: false,
    taxAddress: '',
    minDifference: parseInt(pool.minDifference ?? '0') / 100,
    minPeriod: '',
    adminAddress: '',
    minReceivable: getBalanceNumber(pool.minReceivable ?? '0', currency?.decimals),
    maxTreasuryShare: '',
    uniqueAccounts: 0,
    votingPower: parseInt(pool?.voteOption ?? '0'),
    cardId: '',
    geoTag: '',
    cardAddress: '',
    badgeColor: 0,
    maxUse: '',
    valueName: '',
    contentType: '',
    add: 0,
    value: '',
    onlyDataKeepers: 0,
    minimumLockValue: getBalanceNumber(pool.minimumLockValue, currency?.decimals),
    onlyTrustWorthyMerchants: 0,
    treasuryShare: parseInt(pool?.treasuryShare ?? '0') / 100,
    maxWithdrawable: pool?.maxWithdrawable,
    minimumSponsorPercentile: parseInt(pool?.minimumSponsorPercentile ?? '0') / 100,
    customTags: '',
    token: currency?.address,
    isNFT: 0,
    decimals: currency?.decimals,
  }))
  const [nftFilters, setNftFilters] = useState<any>({
    workspace: pool?.workspaces,
    country: pool?.countries,
    city: pool?.cities,
    product: pool?.products,
  })
  console.log('ppool==============>', pool, adminARP, valuepoolContract)
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

  const handleEasyMdeChange = (value: string) => {
    updateValue('description', value)
  }

  const handleEasyMdeChange2 = (value: string) => {
    if (value?.length <= 90) updateValue('description', value)
  }

  const goBack = () => {
    switch (stage) {
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_LOCATION:
        setStage(LockStage.UPDATE_LOCATION)
        break
      case LockStage.MERGE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS:
        setStage(LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS)
        break
      case LockStage.UPDATE_USER_IDENTITY_PROOFS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS:
        setStage(LockStage.UPDATE_USER_IDENTITY_PROOFS)
        break
      case LockStage.PICK_RANK:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_PICK_RANK:
        setStage(LockStage.PICK_RANK)
        break
      case LockStage.CHECK_RANK:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CHECK_RANK:
        setStage(LockStage.CHECK_RANK)
        break
      case LockStage.UPDATE_TRUSTWORTHY_MERCHANTS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS:
        setStage(LockStage.UPDATE_TRUSTWORTHY_MERCHANTS)
        break
      case LockStage.UPDATE_BLACKLISTED_MERCHANTS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS:
        setStage(LockStage.UPDATE_BLACKLISTED_MERCHANTS)
        break
      case LockStage.UPDATE_VOTING_BLACKLIST:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST:
        setStage(LockStage.UPDATE_VOTING_BLACKLIST)
        break
      case LockStage.UPDATE_VOTING_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS:
        setStage(LockStage.UPDATE_VOTING_PARAMETERS)
        break
      case LockStage.UPDATE_MEDIA:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MEDIA:
        setStage(LockStage.UPDATE_MEDIA)
        break
      case LockStage.APPROVE_USER:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_APPROVE_USER:
        setStage(LockStage.APPROVE_USER)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_TRUSTWORTHY_AUDITORS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS:
        setStage(LockStage.UPDATE_TRUSTWORTHY_AUDITORS)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAX_CONTRACT:
        setStage(LockStage.UPDATE_TAX_CONTRACT)
        break
      case LockStage.UPDATE_DESCRIPTION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DESCRIPTION:
        setStage(LockStage.UPDATE_DESCRIPTION)
        break
      case LockStage.UPDATE_DESCRIPTION2:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DESCRIPTION2:
        setStage(LockStage.UPDATE_DESCRIPTION2)
        break
      case LockStage.UPDATE_MARKETPLACE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MARKETPLACE:
        setStage(LockStage.UPDATE_MARKETPLACE)
        break
      case LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_PAYMENT:
        setStage(LockStage.NOTIFY_PAYMENT)
        break
      case LockStage.NOTIFY_PAYMENT:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_LOAN:
        setStage(LockStage.NOTIFY_LOAN)
        break
      case LockStage.NOTIFY_LOAN:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.ADD_SPONSORS:
        if (pool?.userData?.isAdmin) setStage(LockStage.SPONSORS)
        break
      case LockStage.REMOVE_SPONSORS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SPONSORS)
        break
      case LockStage.CONFIRM_ADD_SPONSORS:
        setStage(LockStage.ADD_SPONSORS)
        break
      case LockStage.CONFIRM_REMOVE_SPONSORS:
        setStage(LockStage.REMOVE_SPONSORS)
        break
      // case LockStage.HISTORY:
      //   setStage(LockStage.ADMIN_SETTINGS)
      //   break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.REIMBURSE_BNPL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_REIMBURSE_BNPL:
        setStage(LockStage.REIMBURSE_BNPL)
        break
      case LockStage.ADD_CREDIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_CREDIT:
        setStage(LockStage.ADD_CREDIT)
        break
      case LockStage.REIMBURSE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_REIMBURSE:
        setStage(LockStage.REIMBURSE)
        break
      case LockStage.CONFIRM_MERGE:
        setStage(LockStage.MERGE)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CREATE_LOCK:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SWITCH_POOL:
        setStage(LockStage.SWITCH_POOL)
        break
      case LockStage.SWITCH_POOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.UPDATE_VP:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADMIN_WITHDRAW:
        setStage(LockStage.ADMIN_WITHDRAW)
        break
      case LockStage.CONFIRM_UPDATE_VP:
        setStage(LockStage.UPDATE_VP)
        break
      case LockStage.CONFIRM_DEPOSIT:
        setStage(LockStage.DEPOSIT)
        break
      case LockStage.CONFIRM_CREATE_LOCK:
        setStage(LockStage.CREATE_LOCK)
        break
      case LockStage.DELETE_VP:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_VP:
        setStage(LockStage.DELETE_VP)
        break
      case LockStage.DISABLE_BRIBE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DISABLE_BRIBE:
        setStage(LockStage.DISABLE_BRIBE)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.DEPOSIT2:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DEPOSIT2:
        setStage(LockStage.DEPOSIT2)
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
      case LockStage.ADD_CREDIT:
        setStage(LockStage.CONFIRM_ADD_CREDIT)
        break
      case LockStage.SWITCH_POOL:
        setStage(LockStage.CONFIRM_SWITCH_POOL)
        break
      case LockStage.REIMBURSE_BNPL:
        setStage(LockStage.CONFIRM_REIMBURSE_BNPL)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.REIMBURSE:
        setStage(LockStage.CONFIRM_REIMBURSE)
        break
      case LockStage.NOTIFY_PAYMENT:
        setStage(LockStage.CONFIRM_NOTIFY_PAYMENT)
        break
      case LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS:
        setStage(LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS)
        break
      case LockStage.UPDATE_USER_IDENTITY_PROOFS:
        setStage(LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS)
        break
      case LockStage.PICK_RANK:
        setStage(LockStage.CONFIRM_PICK_RANK)
        break
      case LockStage.CHECK_RANK:
        setStage(LockStage.CONFIRM_CHECK_RANK)
        break
      case LockStage.UPDATE_TRUSTWORTHY_MERCHANTS:
        setStage(LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS)
        break
      case LockStage.UPDATE_BLACKLISTED_MERCHANTS:
        setStage(LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS)
        break
      case LockStage.UPDATE_VOTING_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS)
        break
      case LockStage.UPDATE_VOTING_BLACKLIST:
        setStage(LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_MEDIA:
        setStage(LockStage.CONFIRM_UPDATE_MEDIA)
        break
      case LockStage.APPROVE_USER:
        setStage(LockStage.CONFIRM_APPROVE_USER)
        break
      case LockStage.UPDATE_TRUSTWORTHY_AUDITORS:
        setStage(LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.CONFIRM_UPDATE_TAX_CONTRACT)
        break
      case LockStage.UPDATE_DESCRIPTION:
        setStage(LockStage.CONFIRM_UPDATE_DESCRIPTION)
        break
      case LockStage.UPDATE_DESCRIPTION2:
        setStage(LockStage.CONFIRM_UPDATE_DESCRIPTION2)
        break
      case LockStage.UPDATE_MARKETPLACE:
        setStage(LockStage.CONFIRM_UPDATE_MARKETPLACE)
        break
      case LockStage.NOTIFY_LOAN:
        setStage(LockStage.CONFIRM_NOTIFY_LOAN)
        break
      case LockStage.ADD_SPONSORS:
        setStage(LockStage.CONFIRM_ADD_SPONSORS)
        break
      case LockStage.REMOVE_SPONSORS:
        setStage(LockStage.CONFIRM_REMOVE_SPONSORS)
        break
      case LockStage.MERGE:
        setStage(LockStage.CONFIRM_MERGE)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.CONFIRM_DEPOSIT)
        break
      case LockStage.CREATE_LOCK:
        setStage(LockStage.CONFIRM_CREATE_LOCK)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.UPDATE_VP:
        setStage(LockStage.CONFIRM_UPDATE_VP)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(LockStage.CONFIRM_ADMIN_WITHDRAW)
        break
      case LockStage.DELETE_VP:
        setStage(LockStage.CONFIRM_DELETE_VP)
        break
      case LockStage.DISABLE_BRIBE:
        setStage(LockStage.CONFIRM_DISABLE_BRIBE)
        break
      case LockStage.DEPOSIT2:
        setStage(LockStage.CONFIRM_DEPOSIT2)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return (
          !parseFloat(pool ? pool.userData?.allowance : adminARP?.allowance) &&
          !parseFloat(pool ? pool.userData?.vaAllowance : adminARP?.vaAllowance)
        )
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [valuepoolContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now transfer tokens into this contract!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
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
        return callWithGasPrice(valuepoolHelperContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_VP) {
        console.log('CONFIRM_DELETE_VP===============>', [pool?.valuepoolAddress])
        return callWithGasPrice(valuepoolHelperContract, 'deleteVava', [pool?.valuepoolAddress]).catch((err) =>
          console.log('CONFIRM_DELETE_VP===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DISABLE_BRIBE) {
        const args = [pool?.valuepoolAddress, !!state.add]
        console.log('CONFIRM_DISABLE_BRIBE===============>', args)
        return callWithGasPrice(valuepoolVoterContract, 'disableBribes', args).catch((err) =>
          console.log('CONFIRM_DISABLE_BRIBE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_NOTIFY_LOAN) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [
          state.token,
          state.cardAddress,
          state.isNFT ? state.amountReceivable : amountReceivable.toString(),
        ]
        console.log('CONFIRM_NOTIFY_LOAN===============>', args)
        return callWithGasPrice(valuepoolContract, 'notifyLoan', args).catch((err) =>
          console.log('CONFIRM_NOTIFY_LOAN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DEPOSIT2) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [pool?.id, amountReceivable?.toString()]
        console.log('CONFIRM_DEPOSIT2===============>', args)
        return callWithGasPrice(stakingTokenContract2, 'transfer', args).catch((err) =>
          console.log('CONFIRM_DEPOSIT2===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADMIN_WITHDRAW) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [pool?.valuepoolAddress, currency?.address, amountPayable?.toString()]
        console.log('CONFIRM_ADMIN_WITHDRAW===============>', args)
        return callWithGasPrice(valuepoolHelperContract, 'withdrawTreasury', args).catch((err) =>
          console.log('CONFIRM_ADMIN_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_REMOVE_SPONSORS) {
        console.log('CONFIRM_REMOVE_SPONSORS===============>', [state.cardAddress])
        return callWithGasPrice(valuepoolContract, 'removeSponsorAt', [state.cardAddress]).catch((err) =>
          console.log('CONFIRM_REMOVE_SPONSORS===============>', err),
        )
      }
      if (stage === LockStage.ADMIN_WITHDRAW) {
        return callWithGasPrice(valuepoolContract, 'withdraw', [pool.stakingToken.address, state.amountPayable]).catch(
          (err) => console.log('ADMIN_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        return callWithGasPrice(valuepoolContract, 'payInvoicePayable', [pool.owner, share.toString()]).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MERGE) {
        return callWithGasPrice(vaContract, 'merge', [state.tokenId, state.tokenId2]).catch((err) =>
          console.log('CONFIRM_MINT_FT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_VP) {
        const minReceivable = getDecimalAmount(state.minReceivable ?? 0, currency?.decimals)
        const args = [
          !!state.BNPL,
          state.maxUse,
          parseInt(state.queueDuration) * 60,
          minReceivable?.toString(),
          state.maxDueReceivable,
          parseInt(state.treasuryShare) * 100,
          parseInt(state.maxTreasuryShare) * 100,
          parseInt(state.maxWithdrawable) * 100,
          parseInt(state.lenderFactor) * 100,
          parseInt(state.minimumSponsorPercentile) * 100,
        ]
        return callWithGasPrice(valuepoolContract, 'updateParameters', args).catch((err) =>
          console.log('CONFIRM_UPDATE_VP===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_SPONSORS) {
        const args = [state.cardAddress, state.cardId, state.geoTag]
        console.log('CONFIRM_ADD_SPONSORS===============>', args)
        return callWithGasPrice(valuepoolContract, 'addSponsor', args).catch((err) =>
          console.log('CONFIRM_ADD_SPONSORS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = [state.owner]
        console.log('CONFIRM_UPDATE_OWNER===============>', args)
        return callWithGasPrice(valuepoolContract, 'updateDev', args).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SWITCH_POOL) {
        console.log('CONFIRM_SWITCH_POOL===============>')
        return callWithGasPrice(vaContract, 'switchPool', []).catch((err) =>
          console.log('CONFIRM_SWITCH_POOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_REIMBURSE_BNPL) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.tokenId, amountReceivable.toString()]
        console.log('CONFIRM_REIMBURSE_BNPL===============>', args)
        return callWithGasPrice(valuepoolContract, 'reimburseBNPL', args).catch((err) =>
          console.log('CONFIRM_REIMBURSE_BNPL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_CREDIT) {
        const args = [state.tokenId]
        console.log('CONFIRM_ADD_CREDIT===============>', args)
        return callWithGasPrice(valuepoolContract, 'addCredit', args).catch((err) =>
          console.log('CONFIRM_ADD_CREDIT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_REIMBURSE) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [currency.address, state.cardAddress, amountReceivable.toString()]
        console.log('CONFIRM_REIMBURSE===============>', args)
        return callWithGasPrice(valuepoolContract, 'notifyReimbursement', args).catch((err) =>
          console.log('CONFIRM_REIMBURSE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_NOTIFY_PAYMENT) {
        console.log('CONFIRM_NOTIFY_PAYMENT===============>', state.cardAddress)
        return callWithGasPrice(valuepoolContract, 'notifyPayment', [state.cardAddress]).catch((err) =>
          console.log('CONFIRM_NOTIFY_PAYMENT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS) {
        const args = [
          state.badgeColor,
          state.valueName,
          state.value,
          !!state.onlyDataKeepers,
          !!state.onlyTrustWorthyMerchants,
        ]
        console.log('CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS===============>', args)
        return callWithGasPrice(valuepoolContract, 'updateMerchantIDProofParams', args).catch((err) =>
          console.log('CONFIRM_UPDATE_MERCHANT_IDENTITY_PROOFS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_USER_IDENTITY_PROOFS) {
        const args = [
          state.badgeColor,
          state.valueName,
          state.value,
          !!state.uniqueAccounts,
          !!state.onlyDataKeepers,
          !!state.onlyTrustWorthyMerchants,
        ]
        console.log('CONFIRM_UPDATE_USER_IDENTITY_PROOFS===============>', args)
        return callWithGasPrice(valuepoolContract, 'updateUserIDProofParams', args).catch((err) =>
          console.log('CONFIRM_UPDATE_USER_IDENTITY_PROOFS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_PICK_RANK) {
        const args = [state.tokenId, state.identityTokenId]
        console.log('CONFIRM_PICK_RANK===============>', args)
        return callWithGasPrice(valuepoolContract, 'pickRank', args).catch((err) =>
          console.log('CONFIRM_PICK_RANK===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CHECK_RANK) {
        const amountReceivable = getDecimalAmount(state.amountReceivable, currency?.decimals)
        const args = [
          state.vava,
          state.collectionAddress,
          referrer || ADDRESS_ZERO,
          state.item,
          state.options?.split(','),
          [
            state.userTokenId,
            state.identityTokenId,
            state.merchantIdentityTokenId,
            state.tokenId,
            amountReceivable.toString(),
          ],
        ]
        console.log('CONFIRM_CHECK_RANK===============>', args)
        return callWithGasPrice(valuepoolHelperContract, 'checkRank', args).catch((err) =>
          console.log('CONFIRM_CHECK_RANK===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS) {
        const args = [state.vava, state.taxAddress, !!state.add]
        console.log('CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS===============>', args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateVavaTrustWorthyMerchants', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TRUSTWORTHY_MERCHANTS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS) {
        const args = [state.vava, state.taxAddress, !!state.add]
        console.log('CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS===============>', args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateMerchantTrustWorthyAuditors', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TRUSTWORTHY_AUDITORS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BLACKLISTED_MERCHANTS) {
        const args = [state.vava, state.taxAddress, !!state.add]
        console.log('CONFIRM_UPDATE_BLACKLISTED_MERCHANTS===============>', args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateBlacklistMerchant', args).catch((err) =>
          console.log('CONFIRM_UPDATE_BLACKLISTED_MERCHANTS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_VOTING_BLACKLIST) {
        const args = [state.vava, state.taxAddress, !!state.add]
        console.log('CONFIRM_UPDATE_VOTING_BLACKLIST===============>', args)
        return callWithGasPrice(valuepoolVoterContract, 'updateBlacklist', args).catch((err) =>
          console.log('CONFIRM_UPDATE_VOTING_BLACKLIST===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_VOTING_PARAMETERS) {
        const minimumLockValue = getDecimalAmount(state.minimumLockValue, currency?.decimals)
        const args = [
          state.vava,
          parseInt(state.period) * 60,
          parseInt(state.minPeriod) * 60,
          parseInt(state.minDifference) * 100,
          state.userTokenId,
          parseInt(state.minBountyRequired) * 100,
          minimumLockValue?.toString(),
          state.votingPower,
        ]
        console.log('CONFIRM_UPDATE_VOTING_PARAMETERS===============>', args)
        return callWithGasPrice(valuepoolVoterContract, 'addVa', args).catch((err) =>
          console.log('CONFIRM_UPDATE_VOTING_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT) {
        const args = [state.vava, state.contentType, !!state.add]
        console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateExcludedContent', args).catch((err) =>
          console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_MEDIA) {
        const args = [state.taxAddress, state.vava, state.item]
        console.log('CONFIRM_UPDATE_MEDIA===============>', args)
        return callWithGasPrice(valuepoolHelper2Contract, 'updateMedia', args).catch((err) =>
          console.log('CONFIRM_UPDATE_MEDIA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAX_CONTRACT) {
        const args = [state.taxAddress]
        console.log('CONFIRM_UPDATE_TAX_CONTRACT===============>', args)
        return callWithGasPrice(valuepoolHelperContract, 'updateTaxContract', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TAX_CONTRACT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DESCRIPTION) {
        const args = [state.vava, state.description]
        console.log('CONFIRM_UPDATE_DESCRIPTION===============>', args)
        return callWithGasPrice(valuepoolHelperContract, 'updateValuepool', args).catch((err) =>
          console.log('CONFIRM_UPDATE_DESCRIPTION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DESCRIPTION2) {
        const args = [pool?._va, state.description]
        console.log('CONFIRM_UPDATE_DESCRIPTION===============>', args)
        return callWithGasPrice(getNFTSVGContract(), 'updateDescription', args).catch((err) =>
          console.log('CONFIRM_UPDATE_DESCRIPTION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_MARKETPLACE) {
        const args = [state.vava, state.taxAddress]
        console.log('CONFIRM_UPDATE_MARKETPLACE===============>', args)
        return callWithGasPrice(valuepoolHelperContract, 'updateMarketPlace', args).catch((err) =>
          console.log('CONFIRM_UPDATE_MARKETPLACE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_APPROVE_USER) {
        const args = [state.owner, state.tokenId]
        console.log('CONFIRM_APPROVE_USER===============>', args)
        return callWithGasPrice(vaContract, 'approve', args).catch((err) =>
          console.log('CONFIRM_APPROVE_USER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE) {
        console.log('CONFIRM_EXECUTE_NEXT_PURCHASE1===============>')
        return callWithGasPrice(valuepoolContract, 'executeNextPurchase', []).catch((err) =>
          console.log('CONFIRM_EXECUTE_NEXT_PURCHASE===============>', err),
        )
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      // onSuccessSale()
      dispatch(
        fetchValuepoolSgAsync({
          fromVesting: false,
          fromValuepool,
        }),
      )
      setConfirmedTxHash(receipt.transactionHash)
      setStage(LockStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <Modal
      title={modalTitles(t)[stage]}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {stage === LockStage.SPONSORS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" onClick={() => setStage(LockStage.ADD_SPONSORS)}>
            {t('ADD SPONSORS')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.REMOVE_SPONSORS)}>
            {t('REMOVE SPONSORS')}
          </Button>
        </Flex>
      )}
      {(stage === LockStage.SETTINGS || (stage === LockStage.ADMIN_SETTINGS && location === 'valuepool')) && (
        <Flex flexDirection="column" width="100%" px="16px">
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.NOTIFY_PAYMENT)}>
            {t('NOTIFY PAYMENT')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.NOTIFY_LOAN)}>
            {t('WITHDRAW FUNDS APPROVED')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px">
          {pool.BNPL ? (
            <Button variant="success" mb="8px" onClick={() => setStage(LockStage.REIMBURSE_BNPL)}>
              {t('REIMBURSE BNPL')}
              {/* <Flex mb="40px" position="relative" left="100px"><NotificationDot show={state.requests.length} /></Flex> */}
            </Button>
          ) : null}
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.REIMBURSE)}>
            {t('REIMBURSE LOAN')}
            {/* <Flex mb="40px" position="relative" left="100px"><NotificationDot show={state.requests.length} /></Flex> */}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.CREATE_LOCK)}>
            {t('CREATE ACCOUNT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.ADD_CREDIT)}>
            {t('ADD CREDIT')}
          </Button>
          <Button variant="light" mb="8px" onClick={() => setStage(LockStage.PICK_RANK)}>
            {t('PICK RANK')}
          </Button>
          <Button variant="light" mb="8px" onClick={() => setStage(LockStage.CHECK_RANK)}>
            {t('CHECK RANK')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={() => setStage(LockStage.UPDATE_MEDIA)}>
            {t('UPDATE MEDIA')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.APPROVE_USER)}>
            {t('APPROVE USER')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={() => setStage(LockStage.UPDATE_TAX_CONTRACT)}>
            {t('UPDATE TAX CONTRACT')}
          </Button>
          <Button mb="8px" variant="subtle" onClick={() => setStage(LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE)}>
            {t('EXECUTE NEXT PURCHASE')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.DEPOSIT2)}>
            {t('DONATE FUNDS')}
          </Button>
          {userData?.nfts?.length ? (
            <Button variant="success" mb="8px" onClick={() => setStage(LockStage.DEPOSIT)}>
              {t('DEPOSIT')}
            </Button>
          ) : null}
          {userData?.nfts?.length >= 2 ? (
            <Button variant="success" mb="8px" onClick={() => setStage(LockStage.MERGE)}>
              {t('MERGE IDs')}
            </Button>
          ) : null}
          {userData?.nfts?.length ? (
            <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.WITHDRAW)}>
              {t('WITHDRAW')}
            </Button>
          ) : null}
          {/* <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.HISTORY)}>
            {t('ALL TRANSACTION HISTORY')}
          </Button> */}
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px">
          {variant === 'admin' ? (
            <>
              <Button mb="8px" onClick={() => setStage(LockStage.CREATE_LOCK)}>
                {t('CREATE ACCOUNT')}
              </Button>
              <Button mb="8px" variant="subtle" onClick={() => setStage(LockStage.CONFIRM_EXECUTE_NEXT_PURCHASE)}>
                {t('EXECUTE NEXT PURCHASE')}
              </Button>
              <Button variant="success" mb="8px" onClick={() => setStage(LockStage.DEPOSIT2)}>
                {t('DONATE FUNDS')}
              </Button>
              <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_VP)}>
                {t('UPDATE PARAMETERS')}
              </Button>
              <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
                {t('UPDATE LOCATION')}
              </Button>
              <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS)}>
                {t('UPDATE MERCHANT IDENTITY PROOFS')}
              </Button>
              <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_USER_IDENTITY_PROOFS)}>
                {t('UPDATE USER IDENTITY PROOFS')}
              </Button>
              <Button variant="text" mb="8px" onClick={() => setStage(LockStage.UPDATE_TRUSTWORTHY_MERCHANTS)}>
                {t('UPDATE TRUSTWORTHY MERCHANTS')}
              </Button>
              <Button variant="text" mb="8px" onClick={() => setStage(LockStage.UPDATE_TRUSTWORTHY_AUDITORS)}>
                {t('UPDATE TRUSTWORTHY AUDITORS')}
              </Button>
              <Button variant="subtle" mb="8px" onClick={() => setStage(LockStage.UPDATE_MEDIA)}>
                {t('UPDATE MEDIA')}
              </Button>
              <Button variant="light" mb="8px" onClick={() => setStage(LockStage.UPDATE_BLACKLISTED_MERCHANTS)}>
                {t('UPDATE BLACKLISTED MERCHANTS')}
              </Button>
              <Button variant="light" mb="8px" onClick={() => setStage(LockStage.UPDATE_EXCLUDED_CONTENT)}>
                {t('UPDATE EXCLUDED CONTENT')}
              </Button>
              {/* <Button variant="light" mb="8px" onClick={()=> setStage(LockStage.UPDATE_MINIMUM_LOCK) }>
            {t('UPDATE MINIMUM LOCK')}
          </Button> */}
              <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_VOTING_PARAMETERS)}>
                {t('UPDATE VOTING PARAMETERS')}
              </Button>
              <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_VOTING_BLACKLIST)}>
                {t('UPDATE VOTING BLACKLIST')}
              </Button>
              <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.SWITCH_POOL)}>
                {t('SWITCH POOL')}
              </Button>
              <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.DISABLE_BRIBE)}>
                {t('DISABLE BRIBES')}
              </Button>
              {/* <Button variant="tertiary" mb="8px" onClick={()=> setStage(LockStage.UPDATE_COLLECTION_ID) }>
            {t('UPDATE COLLECTION ID IN VE')}
          </Button> */}
              <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
                {t('UPDATE OWNER')}
              </Button>
              <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_DESCRIPTION)}>
                {t('UPDATE DESCRIPTION')}
              </Button>
              <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_DESCRIPTION2)}>
                {t('UPDATE NFT BOARD')}
              </Button>
              <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_MARKETPLACE)}>
                {t('UPDATE MARKETPLACE')}
              </Button>
              <Button variant="success" mb="8px" onClick={() => setStage(LockStage.APPROVE_USER)}>
                {t('APPROVE USER')}
              </Button>
              <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.ADMIN_WITHDRAW)}>
                {t('WITHDRAW')}
              </Button>
              <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE_VP)}>
                {t('DELETE VALUEPOOL')}
              </Button>
            </>
          ) : null}
          {location === 'valuepool' && variant === 'admin' ? (
            <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.REMOVE_SPONSORS)}>
              {t('REMOVE SPONSORS')}
            </Button>
          ) : null}
          {/* <Button variant="secondary" mb="8px" disabled onClick={() => setStage(LockStage.HISTORY)}>
            {t('ALL TRANSACTION HISTORY')}
          </Button> */}
        </Flex>
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
      {stage === LockStage.UPDATE_VOTING_BLACKLIST && (
        <UpdateVotingBlacklistStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_VOTING_PARAMETERS && (
        <UpdateVotingParametersStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.PICK_RANK && (
        <PickRankStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CHECK_RANK && (
        <CheckRankStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_TAX_CONTRACT && (
        <UpdateTaxContractStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_DESCRIPTION && (
        <UpdateDescriptionStage
          state={state}
          handleChange={handleChange}
          handleEasyMdeChange={handleEasyMdeChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_DESCRIPTION2 && (
        <UpdateDescriptionStage2
          state={state}
          handleChange={handleChange}
          handleEasyMdeChange={handleEasyMdeChange2}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_MEDIA && (
        <UpdateMediaStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.APPROVE_USER && (
        <ApproveUserStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_MARKETPLACE && (
        <UpdateMarketPlaceStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_MERCHANT_IDENTITY_PROOFS && (
        <UpdateMerchantIDProofStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_USER_IDENTITY_PROOFS && (
        <UpdateUserIDProofStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.REIMBURSE && (
        <ReimburseLoanStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.ADD_CREDIT && (
        <AddCreditStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.REIMBURSE_BNPL && (
        <ReimburseBNPLStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.ADD_SPONSORS && (
        <AddSponsorStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.REMOVE_SPONSORS && (
        <RemoveSponsorStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.NOTIFY_PAYMENT && (
        <NotifyPaymentStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.NOTIFY_LOAN && (
        <NotifyLoanStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.CREATE_LOCK && (
        <PresentBribeModal pool={pool} stakingToken={currency} stakingTokenBalance={stakingTokenBalance} />
      )}
      {stage === LockStage.DEPOSIT && (
        <AddAmountModal
          pool={pool}
          stakingToken={currency}
          currentBalance={stakingTokenBalance}
          currentLockedAmount={new BigNumber(tokenBalance?.lockAmount ?? '')}
          lockEndTime={tokenBalance?.lockEnds ?? ''}
          stakingTokenBalance={stakingTokenBalance}
        />
      )}
      {stage === LockStage.WITHDRAW && (
        <RemoveAmountModal
          pool={pool}
          stakingToken={currency}
          currentBalance={stakingTokenBalance2}
          currentLockedAmount={new BigNumber(tokenBalance?.lockAmount ?? '')}
          lockEndTime={tokenBalance?.lockEnds ?? ''}
          stakingTokenBalance={stakingTokenBalance2}
        />
      )}
      {stage === LockStage.MERGE && (
        <MergeStage state={state} pool={pool} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {/* {stage === LockStage.HISTORY && <ActivityHistoryStage />} */}

      {stage === LockStage.UPDATE_VP && (
        <UpdateVPStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.ADMIN_WITHDRAW && (
        <AdminWithdrawStage
          state={state}
          currency={currency}
          pendingRevenue={treasuryBalance}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
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
      {stage === LockStage.UPDATE_TRUSTWORTHY_MERCHANTS && (
        <UpdateTrustworthyMerchantStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_TRUSTWORTHY_AUDITORS && (
        <UpdateTrustworthyAuditorStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_EXCLUDED_CONTENT && (
        <UpdateExcludedContentStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DEPOSIT2 && (
        <DepositStage
          state={state}
          currency={currency}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.SWITCH_POOL && <SwitchPoolStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DISABLE_BRIBE && (
        <DisableBribeStage
          state={state}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_BLACKLISTED_MERCHANTS && (
        <UpdateBlacklistedStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DELETE_VP && <DeleteVPStage continueToNextStage={continueToNextStage} />}
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
    </Modal>
  )
}

export default CreateGaugeModal
