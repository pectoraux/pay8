import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, LinkExternal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  useERC20,
  useARPContract,
  useARPNote,
  useARPHelper,
  useARPMinter,
  useErc721CollectionContract,
} from 'hooks/useContract'
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
import { differenceInSeconds } from 'date-fns'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateParametersStage from './UpdateParametersStage'
import UpdateAutoChargeStage from './UpdateAutoChargeStage'
import UpdateBountyStage from './UpdateBountyStage'
import ClaimNoteStage from './ClaimNoteStage'
import UpdateUriStage from './UpdateUriStage'
import VoteStage from './VoteStage'
import BurnStage from './BurnStage'
import PayStage from './PayStage'
import AutoChargeStage from './AutoChargeStage'
import UpdatePaidPayableStage from './UpdatePaidPayableStage'
import UpdateUserPercentilesStage from './UpdateUserPercentilesStage'
import UpdateProfileIdStage from './UpdateProfileIdStage'
import UpdateTokenIdStage from './UpdateTokenIdStage'
import UpdatePricePerMinuteStage from './UpdatePricePerMinuteStage'
import UpdateExcludedContentStage from './UpdateExcludedContentStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import SponsorTagStage from './SponsorTagStage'
import UpdateMintExtraStage from './UpdateMintExtraStage'
import UpdateMintInfoStage from './UpdateMintInfoStage'
import UpdateCategoryStage from './UpdateCategoryStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteStage from './DeleteStage'
import DeleteARPStage from './DeleteARPStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import UpdateCapStage from './UpdateCapStage'
import UpdateNotifyDebtStage from './UpdateNotifyDebtStage'
import UpdateNotifyRewardStage from './UpdateNotifyRewardStage'
import UpdateTaxContractStage from './UpdateTaxContractStage'
import UpdateSponsorMediaStage from './UpdateSponsorMediaStage'
import UpdateTransferToNotePayableStage from './UpdateTransferToNotePayableStage'
import UpdateTransferToNoteReceivableStage from './UpdateTransferToNoteReceivableStage'
import UpdateTagRegistrationStage from './UpdateTagRegistrationStage'
import UpdateDueBeforePayableStage from './UpdateDueBeforePayableStage'
import UpdateDiscountDivisorStage from './UpdateDiscountDivisorStage'
import UpdatePenaltyDivisorStage from './UpdatePenaltyDivisorStage'
import UpdateAdminStage from './UpdateAdminStage'
import UpdateUserOwnerStage from './UpdateUserOwnerStage'
import UpdateApplicationStage from './UpdateApplicationStage'
import LocationStage from './LocationStage'
import DepositStage from './DepositStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.PAY]: t('Pay Due Payable'),
  [LockStage.DEPOSIT]: t('Deposit'),
  [LockStage.UPDATE_PROTOCOL]: t('Create/Update Account'),
  [LockStage.UPDATE_DISCOUNT_DIVISOR]: t('Update Discount Divisor'),
  [LockStage.UPDATE_PENALTY_DIVISOR]: t('Update Penalty Divisor'),
  [LockStage.TRANSFER_TO_NOTE_RECEIVABLE]: t('Transfer Note Receivable'),
  [LockStage.UPDATE_DUE_BEFORE_PAYABLE]: t('Update Due Before Payable'),
  [LockStage.UPDATE_TAG_REGISTRATION]: t('Update Tag Registration'),
  [LockStage.NOTIFY_REWARDS]: t('Notify Rewards'),
  [LockStage.NOTIFY_DEBT]: t('Notify Debt'),
  [LockStage.MINT_EXTRA]: t('Mint Extra'),
  [LockStage.UPDATE_TAX_CONTRACT]: t('Update Tax Contract'),
  [LockStage.UPDATE_USER_OWNER]: t('Update User Owner'),
  [LockStage.TRANSFER_TO_NOTE_PAYABLE]: t('Transfer Note Payable'),
  [LockStage.UPDATE_SPONSOR_MEDIA]: t('Update Sponsor Media'),
  [LockStage.UPDATE_CAP]: t('Update Cap'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.UPDATE_BOUNTY_ID]: t('Update Attached Bounty'),
  [LockStage.UPDATE_TOKEN_ID]: t('Update Token ID'),
  [LockStage.UPDATE_PROFILE_ID]: t('Update Profile ID'),
  [LockStage.UPDATE_USER_PERCENTILES]: t('Update User Percentiles'),
  [LockStage.UPDATE_PAID_PAYABLE]: t('Update Paid Payable'),
  [LockStage.UPDATE_ADMIN]: t('UPDATE ADMIN'),
  [LockStage.VOTE]: t('Vote'),
  [LockStage.BURN]: t('Burn'),
  [LockStage.UPDATE_AUTOCHARGE]: t('Update Autocharge'),
  [LockStage.UPDATE_PRICE_PER_MINUTE]: t('Update Price Per Minute'),
  [LockStage.UPDATE_EXCLUDED_CONTENT]: t('Update Excluded Content'),
  [LockStage.SPONSOR_TAG]: t('Sponsor Tag'),
  [LockStage.UPDATE_MINT_INFO]: t('Update Mint Info'),
  [LockStage.UPDATE_CATEGORY]: t('Update Category'),
  [LockStage.UPDATE_URI_GENERATOR]: t('Update URI Generator'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.AUTOCHARGE]: t('Pay Due Receivable'),
  [LockStage.CLAIM_NOTE]: t('Claim Note'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Protocol'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.UPDATE_APPLICATION]: t('Update Application Link'),
  [LockStage.CONFIRM_UPDATE_APPLICATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROFILE_ID]: t('Back'),
  [LockStage.CONFIRM_SPONSOR_TAG]: t('Back'),
  [LockStage.CONFIRM_CLAIM_NOTE]: t('Back'),
  [LockStage.CONFIRM_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT]: t('Back'),
  [LockStage.CONFIRM_PAY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TOKEN_ID]: t('Back'),
  [LockStage.CONFIRM_MINT_EXTRA]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PAID_PAYABLE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ADMIN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DUE_BEFORE_PAYABLE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAG_REGISTRATION]: t('Back'),
  [LockStage.CONFIRM_NOTIFY_REWARDS]: t('Back'),
  [LockStage.CONFIRM_NOTIFY_DEBT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAX_CONTRACT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_USER_OWNER]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA]: t('Back'),
  [LockStage.CONFIRM_UPDATE_CAP]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT]: t('Back'),
  [LockStage.CONFIRM_BURN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_CATEGORY]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MINT_INFO]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_UPDATE_URI_GENERATOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY_ID]: t('Back'),
  [LockStage.CONFIRM_VOTE]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_USER_PERCENTILES]: t('Back'),
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
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const arpContract = useARPContract(pool?.arpAddress || router.query.arp || '')
  const arpNoteContract = useARPNote()
  const arpHelperContract = useARPHelper()
  const arpMinterContract = useARPMinter()
  console.log('mcurrencyy===============>', currAccount, currency, pool, arpContract, stakingTokenContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  const [state, setState] = useState<any>(() => ({
    avatar: pool?.collection?.avatar,
    bountyId: pool?.bountyId ?? '',
    profileId: pool?.profileId,
    protocolId: currAccount?.protocolId || 0,
    extraMint: '',
    category: '',
    contractAddress: '',
    optionId: '0',
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    pricePerMinute: '',
    factor: '',
    period: parseInt(pool.period) / 60 ?? '',
    cap: '',
    tokenId: '',
    startPayable: convertTimeToSeconds(currAccount?.startPayable ?? 0),
    creditFactor: '',
    toAddress: account ?? '',
    amountPayable: pool?.percentages
      ? parseInt(currAccount?.amountPayable ?? '0') / 100
      : getBalanceNumber(currAccount?.amountPayable ?? 0, currAccount?.token?.decimals),
    periodPayable: parseInt(currAccount?.periodPayable ?? '0') / 60,
    bufferTime: parseInt(pool?.bufferTime) / 60 ?? '',
    amountReceivable: pool?.percentages
      ? parseInt(currAccount?.amountReceivable ?? '0') / 100
      : getBalanceNumber(currAccount?.amountReceivable ?? 0, currAccount?.token?.decimals),
    periodReceivable: parseInt(currAccount?.periodReceivable ?? '0') / 60,
    startReceivable: convertTimeToSeconds(currAccount?.startReceivable ?? 0),
    description: currAccount?.description ?? '',
    ratings: currAccount?.ratings?.toString() ?? '',
    esgRating: currAccount?.esgRating ?? '',
    media: pool?.media ?? '',
    customTags: '',
    identityTokenId: '0',
    message: '',
    tag: '',
    uriGenerator: '',
    autoCharge: 0,
    like: 0,
    bountyRequired: parseInt(pool?.bountyRequired) / 100,
    ve: pool?._ve,
    token: currency?.address,
    isNFT: 0,
    add: 0,
    adminNote: 0,
    contentType: '',
    numPeriods: '',
    decimals: currAccount?.token?.decimals ?? currency?.decimals ?? 18,
    name: pool?.name,
    collectionId: pool?.collection?.id ?? '',
    maxAccounts: '0',
    percentages: pool?.percentages,
    applicationLink: pool?.applicationLink ?? '',
    arpDescription: pool?.arpDescription ?? '',
    owner: currAccount?.owner || account,
    adminBountyRequired: parseInt(pool?.adminBountyRequired) / 100,
    adminCreditShare: parseInt(pool?.adminCreditShare) / 100 ?? '',
    adminDebitShare: parseInt(pool?.adminDebitShare) / 100 ?? '',
    profileRequired: pool?.profileRequired ? 1 : 0,
    arp: pool?.id,
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
  const collectionContract = useErc721CollectionContract(state.token)

  const goBack = () => {
    switch (stage) {
      case LockStage.PAY:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_PAY:
        setStage(LockStage.PAY)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_ADMIN:
        setStage(LockStage.UPDATE_ADMIN)
        break
      case LockStage.UPDATE_APPLICATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_APPLICATION:
        setStage(LockStage.UPDATE_APPLICATION)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DEPOSIT:
        setStage(LockStage.DEPOSIT)
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
      case LockStage.TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.TRANSFER_TO_NOTE_RECEIVABLE)
        break
      case LockStage.UPDATE_TAG_REGISTRATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAG_REGISTRATION:
        setStage(LockStage.UPDATE_TAG_REGISTRATION)
        break
      case LockStage.UPDATE_DUE_BEFORE_PAYABLE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DUE_BEFORE_PAYABLE:
        setStage(LockStage.UPDATE_DUE_BEFORE_PAYABLE)
        break
      case LockStage.NOTIFY_REWARDS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_REWARDS:
        setStage(LockStage.NOTIFY_REWARDS)
        break
      case LockStage.NOTIFY_DEBT:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_DEBT:
        setStage(LockStage.NOTIFY_DEBT)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAX_CONTRACT:
        setStage(LockStage.UPDATE_TAX_CONTRACT)
        break
      case LockStage.UPDATE_USER_OWNER:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_USER_OWNER:
        setStage(LockStage.UPDATE_USER_OWNER)
        break
      case LockStage.TRANSFER_TO_NOTE_PAYABLE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE:
        setStage(LockStage.TRANSFER_TO_NOTE_PAYABLE)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.UPDATE_CAP:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_CAP:
        setStage(LockStage.UPDATE_CAP)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_PRICE_PER_MINUTE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE:
        setStage(LockStage.UPDATE_PRICE_PER_MINUTE)
        break
      case LockStage.BURN:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BURN:
        setStage(LockStage.BURN)
        break
      case LockStage.UPDATE_CATEGORY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_CATEGORY:
        setStage(LockStage.UPDATE_CATEGORY)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.UPDATE_MINT_INFO:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MINT_INFO:
        setStage(LockStage.UPDATE_MINT_INFO)
        break
      case LockStage.MINT_EXTRA:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_MINT_EXTRA:
        setStage(LockStage.MINT_EXTRA)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROTOCOL:
        setStage(LockStage.UPDATE_PROTOCOL)
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
      case LockStage.UPDATE_URI_GENERATOR:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_URI_GENERATOR:
        setStage(LockStage.UPDATE_URI_GENERATOR)
        break
      case LockStage.UPDATE_BOUNTY_ID:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BOUNTY_ID:
        setStage(LockStage.UPDATE_BOUNTY_ID)
        break
      case LockStage.VOTE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_VOTE:
        setStage(LockStage.VOTE)
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
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_AUTOCHARGE:
        setStage(LockStage.UPDATE_AUTOCHARGE)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SPONSOR_TAG:
        setStage(LockStage.SPONSOR_TAG)
        break
      case LockStage.CLAIM_NOTE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_NOTE:
        setStage(LockStage.CLAIM_NOTE)
        break
      case LockStage.AUTOCHARGE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_AUTOCHARGE:
        setStage(LockStage.AUTOCHARGE)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TOKEN_ID:
        setStage(LockStage.UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_PROFILE_ID:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROFILE_ID:
        setStage(LockStage.UPDATE_PROFILE_ID)
        break
      case LockStage.UPDATE_USER_PERCENTILES:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_USER_PERCENTILES:
        setStage(LockStage.UPDATE_USER_PERCENTILES)
        break
      case LockStage.UPDATE_PAID_PAYABLE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PAID_PAYABLE:
        setStage(LockStage.UPDATE_PAID_PAYABLE)
        break
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_LOCATION:
        setStage(LockStage.UPDATE_LOCATION)
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
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.CONFIRM_UPDATE_LOCATION)
        break
      case LockStage.UPDATE_APPLICATION:
        setStage(LockStage.CONFIRM_UPDATE_APPLICATION)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.CONFIRM_DEPOSIT)
        break
      case LockStage.PAY:
        setStage(LockStage.CONFIRM_PAY)
        break
      case LockStage.VOTE:
        setStage(LockStage.CONFIRM_VOTE)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.CONFIRM_CLAIM_NOTE)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.CONFIRM_SPONSOR_TAG)
        break
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(LockStage.CONFIRM_UPDATE_AUTOCHARGE)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.CONFIRM_DELETE_PROTOCOL)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.UPDATE_BOUNTY_ID:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY_ID)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.CONFIRM_UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_URI_GENERATOR:
        setStage(LockStage.CONFIRM_UPDATE_URI_GENERATOR)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.MINT_EXTRA:
        setStage(LockStage.CONFIRM_MINT_EXTRA)
        break
      case LockStage.UPDATE_MINT_INFO:
        setStage(LockStage.CONFIRM_UPDATE_MINT_INFO)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.UPDATE_CATEGORY:
        setStage(LockStage.CONFIRM_UPDATE_CATEGORY)
        break
      case LockStage.BURN:
        setStage(LockStage.CONFIRM_BURN)
        break
      case LockStage.UPDATE_PRICE_PER_MINUTE:
        setStage(LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_CAP:
        setStage(LockStage.CONFIRM_UPDATE_CAP)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.TRANSFER_TO_NOTE_PAYABLE:
        setStage(LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE)
        break
      case LockStage.UPDATE_USER_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_USER_OWNER)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.CONFIRM_UPDATE_TAX_CONTRACT)
        break
      case LockStage.NOTIFY_DEBT:
        setStage(LockStage.CONFIRM_NOTIFY_DEBT)
        break
      case LockStage.NOTIFY_REWARDS:
        setStage(LockStage.CONFIRM_NOTIFY_REWARDS)
        break
      case LockStage.UPDATE_TAG_REGISTRATION:
        setStage(LockStage.CONFIRM_UPDATE_TAG_REGISTRATION)
        break
      case LockStage.UPDATE_DUE_BEFORE_PAYABLE:
        setStage(LockStage.CONFIRM_UPDATE_DUE_BEFORE_PAYABLE)
        break
      case LockStage.TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE)
        break
      case LockStage.UPDATE_PROFILE_ID:
        setStage(LockStage.CONFIRM_UPDATE_PROFILE_ID)
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
      case LockStage.UPDATE_USER_PERCENTILES:
        setStage(LockStage.CONFIRM_UPDATE_USER_PERCENTILES)
        break
      case LockStage.UPDATE_PAID_PAYABLE:
        setStage(LockStage.CONFIRM_UPDATE_PAID_PAYABLE)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, arpContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [arpContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start processing transactions!'),
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
          pool?.id,
          [nftFilters?.products?.toString()].filter((val) => !!val)?.toString() + state.customTags,
        ]
        console.log('CONFIRM_UPDATE_LOCATION===============>', args)
        return callWithGasPrice(arpHelperContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_APPLICATION) {
        const args = ['0', '0', state.contactChannels, state.contacts, '0', '0', ADDRESS_ZERO, state.applicationLink]
        console.log('CONFIRM_UPDATE_APPLICATION===============>', args)
        return callWithGasPrice(arpHelperContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_APPLICATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_AUTOCHARGE) {
        const args = [state.accounts?.split(','), state.numPeriods]
        console.log('CONFIRM_AUTOCHARGE===============>', args)
        return callWithGasPrice(arpContract, 'autoCharge', args).catch((err) =>
          console.log('CONFIRM_AUTOCHARGE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_VOTE) {
        const args = [pool?.arpAddress, state.profileId, !!state.like]
        console.log('CONFIRM_VOTE===============>', args)
        return callWithGasPrice(arpMinterContract, 'vote', args).catch((err) =>
          console.log('CONFIRM_VOTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_PAY) {
        const args = [state.protocolId, state.numPeriods]
        console.log('CONFIRM_PAY===============>', args)
        return callWithGasPrice(arpContract, 'payInvoicePayable', args).catch((err) =>
          console.log('CONFIRM_PAY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_ADMIN) {
        const args = [state.owner, !!state.add]
        console.log('CONFIRM_UPDATE_ADMIN===============>', args)
        return callWithGasPrice(arpContract, 'updateAdmin', args).catch((err) =>
          console.log('CONFIRM_UPDATE_ADMIN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROFILE_ID) {
        console.log('CONFIRM_UPDATE_PROFILE_ID===============>')
        return callWithGasPrice(arpContract, 'updateProfile', []).catch((err) =>
          console.log('CONFIRM_UPDATE_PROFILE_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_ID) {
        const args = [state.tokenId]
        console.log('CONFIRM_UPDATE_TOKEN_ID===============>', args)
        return callWithGasPrice(arpContract, 'updateTokenId', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TOKEN_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_USER_PERCENTILES) {
        const args = [state.accounts?.split(',')]
        console.log('CONFIRM_UPDATE_USER_PERCENTILES===============>', args)
        return callWithGasPrice(arpContract, 'updateUserPercentiles', args).catch((err) =>
          console.log('CONFIRM_UPDATE_USER_PERCENTILES===============>', err),
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
        return callWithGasPrice(arpContract, 'updateDiscountDivisor', args).catch((err) =>
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
        return callWithGasPrice(arpContract, 'updatePenaltyDivisor', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PENALTY_DIVISOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PAID_PAYABLE) {
        const args = [state.protocolId, state.numPeriods]
        console.log('CONFIRM_UPDATE_PAID_PAYABLE===============>', args)
        return callWithGasPrice(arpContract, 'updatePaidPayable', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PAID_PAYABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE) {
        const args = [pool?.id, state.toAddress, state.protocolId, state.numPeriods]
        console.log('CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>', args)
        return callWithGasPrice(arpNoteContract, 'transferDueToNoteReceivable', args).catch((err) =>
          console.log('CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DUE_BEFORE_PAYABLE) {
        const args = [pool?.arpAddress, !!state.add]
        console.log('CONFIRM_UPDATE_DUE_BEFORE_PAYABLE===============>', args)
        return callWithGasPrice(arpNoteContract, 'updateDueBeforePayable', args).catch((err) =>
          console.log('CONFIRM_UPDATE_DUE_BEFORE_PAYABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAG_REGISTRATION) {
        const args = [state.tag, !!state.add]
        console.log('CONFIRM_UPDATE_TAG_REGISTRATION===============>', args)
        return callWithGasPrice(arpMinterContract, 'updateTagRegistration', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TAG_REGISTRATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_NOTIFY_REWARDS) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.token, state.isNFT ? state.amountReceivable : amountReceivable?.toString()]
        console.log('CONFIRM_NOTIFY_REWARDS===============>', collectionContract, args)
        if (state.isNFT > 0) {
          const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
          return callWithGasPrice(collectionContract, 'setApprovalForAll', [arpContract.address, true])
            .then(() => delay(5000))
            .then(() =>
              callWithGasPrice(arpContract, 'notifyReward', args).catch((err) =>
                console.log('CONFIRM_NOTIFY_REWARDS===============>', err),
              ),
            )
        }
        return callWithGasPrice(arpContract, 'notifyReward', args).catch((err) =>
          console.log('CONFIRM_NOTIFY_REWARDS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_NOTIFY_DEBT) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [currency?.address, amountPayable?.toString()]
        console.log('CONFIRM_NOTIFY_DEBT===============>', args)
        return callWithGasPrice(arpContract, 'notifyDebt', args).catch((err) =>
          console.log('CONFIRM_NOTIFY_DEBT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAX_CONTRACT) {
        const args = [state.contractAddress]
        console.log('CONFIRM_UPDATE_TAX_CONTRACT===============>', args)
        return callWithGasPrice(arpContract, 'updateTaxContract', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TAX_CONTRACT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_USER_OWNER) {
        const args = [state.owner, state.protocolId]
        console.log('CONFIRM_UPDATE_USER_OWNER===============>', args)
        return callWithGasPrice(arpContract, 'updateOwner', args).catch((err) =>
          console.log('CONFIRM_UPDATE_USER_OWNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE) {
        const args = [pool?.id, state.toAddress, state.protocolId, state.numPeriods]
        console.log('CONFIRM_TRANSFER_TO_NOTE_PAYABLE===============>', args)
        return callWithGasPrice(arpNoteContract, 'transferDueToNotePayable', args).catch((err) =>
          console.log('CONFIRM_TRANSFER_TO_NOTE_PAYABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA) {
        const args = [state.protocolId, state.tag]
        console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', args)
        return callWithGasPrice(arpMinterContract, 'updateSponsorMedia', args).catch((err) =>
          console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_CAP) {
        const args = [currency?.address, state.cap]
        console.log('CONFIRM_UPDATE_CAP===============>', args)
        return callWithGasPrice(arpContract, 'updateCap', args).catch((err) =>
          console.log('CONFIRM_UPDATE_CAP===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT) {
        console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', [state.tag, state.contentType, !!state.add])
        return callWithGasPrice(arpMinterContract, 'updateExcludedContent', [
          state.tag,
          state.contentType,
          !!state.add,
        ]).catch((err) => console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE) {
        const pricePerMinute = getDecimalAmount(state.pricePerMinute ?? 0, currency?.decimals)
        console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', [pricePerMinute?.toString()])
        return callWithGasPrice(arpMinterContract, 'updatePricePerAttachMinutes', [pricePerMinute?.toString()]).catch(
          (err) => console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BURN) {
        console.log('CONFIRM_BURN===============>', [state.tokenId])
        return callWithGasPrice(arpHelperContract, 'burn', [state.tokenId]).catch((err) =>
          console.log('CONFIRM_BURN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_CATEGORY) {
        console.log('CONFIRM_UPDATE_CATEGORY===============>', [pool?.arpAddress, state.category])
        return callWithGasPrice(arpMinterContract, 'updateCategory', [pool?.arpAddress, state.category]).catch((err) =>
          console.log('CONFIRM_UPDATE_CATEGORY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [state.token, state.isNFT ? state.amountPayable : amount.toString(), state.isNFT]
        console.log('CONFIRM_WITHDRAW===============>', args)
        return callWithGasPrice(arpContract, 'withdraw', args).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_MINT_INFO) {
        const args = [pool?.arpAddress, state.extraMint, state.tokenId]
        console.log('CONFIRM_UPDATE_MINT_INFO===============>', args)
        return callWithGasPrice(arpHelperContract, 'updateMintInfo', args).catch((err) =>
          console.log('CONFIRM_UPDATE_MINT_INFO===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MINT_EXTRA) {
        console.log('CONFIRM_MINT_EXTRA===============>', [state.tokenId, state.extraMint])
        return callWithGasPrice(arpHelperContract, 'mintExtra', [state.tokenId, state.extraMint]).catch((err) =>
          console.log('CONFIRM_MINT_EXTRA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const startReceivable = Math.max(
          differenceInSeconds(new Date(state.startReceivable ?? 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const startPayable = Math.max(
          differenceInSeconds(new Date(state.startPayable ?? 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args = [
          state.owner,
          currency?.address,
          [
            pool?.percentages ? parseInt(state.amountReceivable) * 100 : amountReceivable.toString(),
            parseInt(state.periodReceivable ?? '0') * 60,
            startReceivable.toString(),
            pool?.percentages ? parseInt(state.amountPayable) * 100 : amountPayable.toString(),
            parseInt(state.periodPayable ?? '0') * 60,
            startPayable.toString(),
            parseInt(state.bountyRequired) * 100,
          ],
          state.identityTokenId,
          state.protocolId,
          state.optionId,
          state.media,
          state.description,
        ]
        console.log('CONFIRM_UPDATE_PROTOCOL===============>', arpContract, args)
        return callWithGasPrice(arpContract, 'updateProtocol', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const args = [
          !!state.profileRequired,
          parseInt(state.bountyRequired) * 100,
          state.collectionId,
          parseInt(state.bufferTime) * 60,
          state.maxNotesPerProtocol,
          parseInt(state.adminBountyRequired) * 100,
          parseInt(state.adminCreditShare) * 100,
          parseInt(state.adminDebitShare) * 100,
          parseInt(state.period) * 60,
          state.maxAccounts,
        ]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(arpContract, 'updateParameters', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SPONSOR_TAG) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.contractAddress, pool?.arpAddress, amountReceivable.toString(), state.tag, state.message]
        console.log('CONFIRM_SPONSOR_TAG===============>', args)
        return callWithGasPrice(arpMinterContract, 'sponsorTag', args).catch((err) =>
          console.log('CONFIRM_SPONSOR_TAG===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = [state.owner]
        console.log('CONFIRM_UPDATE_OWNER===============>', args)
        return callWithGasPrice(arpContract, 'updateDev', args).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_URI_GENERATOR) {
        const args = [pool?.arpAddress, state.uriGenerator]
        console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', args)
        return callWithGasPrice(arpMinterContract, 'updateUriGenerator', args).catch((err) =>
          console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_AUTOCHARGE) {
        const args = [!!state.autoCharge, state.tokenId]
        console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', args)
        return callWithGasPrice(arpContract, 'updateAutoCharge', args).catch((err) =>
          console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', err, arpContract),
        )
      }
      if (stage === LockStage.CONFIRM_DEPOSIT) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [pool?.id, amountReceivable?.toString()]
        console.log('CONFIRM_DEPOSIT===============>', args)
        return callWithGasPrice(stakingTokenContract, 'transfer', args).catch((err) =>
          console.log('CONFIRM_DEPOSIT===============>', err, arpContract),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        console.log('CONFIRM_DELETE_PROTOCOL===============>', [state.protocolId])
        return callWithGasPrice(arpContract, 'deleteProtocol', [state.protocolId]).catch((err) =>
          console.log('CONFIRM_DELETE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        console.log('CONFIRM_DELETE===============>', [pool?.id])
        return callWithGasPrice(arpContract, 'deleteARP', [pool?.id]).catch((err) =>
          console.log('CONFIRM_DELETE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY_ID) {
        console.log('CONFIRM_UPDATE_BOUNTY_ID===============>', [state.bountyId, state.protocolId])
        return callWithGasPrice(arpContract, 'updateBounty', [state.bountyId, state.protocolId]).catch((err) =>
          console.log('CONFIRM_UPDATE_BOUNTY_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
        console.log('CONFIRM_CLAIM_NOTE===============>', [state.tokenId])
        return callWithGasPrice(arpNoteContract, 'claimPendingRevenueFromNote', [state.tokenId]).catch((err) =>
          console.log('CONFIRM_CLAIM_NOTE===============>', err),
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
          <Flex justifyContent="center" style={{ cursor: 'pointer' }} alignSelf="center" mb="10px">
            <LinkExternal color="success" href={pool.arp?.applicationLink} bold>
              {t('APPLY FOR AN ACCOUNT')}
            </LinkExternal>
          </Flex>
          <Button mb="8px" onClick={() => setStage(LockStage.AUTOCHARGE)}>
            {t('PAY DUE RECEIVABLE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.PAY)}>
            {t('PAY DUE PAYABLE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.VOTE)}>
            {t('VOTE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.SPONSOR_TAG)}>
            {t('SPONSOR TAG')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_AUTOCHARGE)}>
            {t('UPDATE AUTOCHARGE')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_TAX_CONTRACT)}>
            {t('UPDATE TAX CONTRACT')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_PROFILE_ID)}>
            {t('UPDATE PROFILE ID')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_USER_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.MINT_EXTRA)}>
            {t('MINT EXTRA')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY_ID)}>
            {t('UPDATE BOUNTY ID')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_TOKEN_ID)}>
            {t('UPDATE TOKEN ID')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_USER_PERCENTILES)}>
            {t('UPDATE USER PERCENTILES')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.TRANSFER_TO_NOTE_PAYABLE)}>
            {t('TRANSFER TO NOTE PAYABLE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.CLAIM_NOTE)}>
            {t('CLAIM NOTE')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.NOTIFY_REWARDS)}>
            {t('NOTIFY REWARDS')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_SPONSOR_MEDIA)}>
            {t('UPDATE SPONSOR MEDIA')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.BURN)}>
            {t('BURN')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_PROTOCOL)}>
            {t('CREATE/UPDATE ACCOUNT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.DEPOSIT)}>
            {t('DEPOSIT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.AUTOCHARGE)}>
            {t('PAY DUE RECEIVABLE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.PAY)}>
            {t('PAY DUE PAYABLE')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_CAP)}>
            {t('UPDATE CAP')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_ADMIN)}>
            {t('UPDATE ADMIN')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_USER_PERCENTILES)}>
            {t('UPDATE USER PERCENTILES')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PAID_PAYABLE)}>
            {t('UPDATE PAID PAYABLE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_AUTOCHARGE)}>
            {t('UPDATE AUTOCHARGE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_DISCOUNT_DIVISOR)}>
            {t('UPDATE DISCOUNT DIVISOR')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_PENALTY_DIVISOR)}>
            {t('UPDATE PENALTY DIVISOR')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.NOTIFY_REWARDS)}>
            {t('NOTIFY REWARDS')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.NOTIFY_DEBT)}>
            {t('NOTIFY DEBT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PARAMETERS)}>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_APPLICATION)}>
            {t('UPDATE APPLICATION')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY_ID)}>
            {t('UPDATE BOUNTY ID')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_URI_GENERATOR)}>
            {t('UPDATE URI GENERATOR')}
          </Button>
          <Button mb="8px" variant="subtle" onClick={() => setStage(LockStage.UPDATE_MINT_INFO)}>
            {t('UPDATE MINT INFO')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.TRANSFER_TO_NOTE_RECEIVABLE)}>
            {t('TRANSFER TO NOTE RECEIVABLE')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CLAIM_NOTE)}>
            {t('CLAIM NOTE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_DUE_BEFORE_PAYABLE)}>
            {t('UPDATE DUE BEFORE PAYABLE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_TAG_REGISTRATION)}>
            {t('UPDATE TAG REGISTRATION')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.BURN)}>
            {t('BURN')}
          </Button>
          {location === 'fromStake' ? (
            <>
              <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_PRICE_PER_MINUTE)}>
                {t('UPDATE PRICE PER MINUTE')}
              </Button>
              <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_EXCLUDED_CONTENT)}>
                {t('UPDATE EXCLUDED CONTENT')}
              </Button>
              {/* <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_CATEGORY)}>
                {t('UPDATE CATEGORY')}
              </Button> */}
              <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.WITHDRAW)}>
                {t('WITHDRAW')}
              </Button>
              <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE_PROTOCOL)}>
                {t('DELETE PROTOCOL')}
              </Button>
            </>
          ) : null}
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE)}>
            {t('DELETE CONTRACT')}
          </Button>
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
      {stage === LockStage.UPDATE_APPLICATION && (
        <UpdateApplicationStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.NOTIFY_REWARDS && (
        <UpdateNotifyRewardStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.NOTIFY_DEBT && (
        <UpdateNotifyDebtStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_AUTOCHARGE && (
        <UpdateAutoChargeStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.VOTE && (
        <VoteStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_TAX_CONTRACT && (
        <UpdateTaxContractStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_USER_OWNER && (
        <UpdateUserOwnerStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.MINT_EXTRA && (
        <UpdateMintExtraStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.TRANSFER_TO_NOTE_PAYABLE && (
        <UpdateTransferToNotePayableStage
          state={state}
          handleChange={handleChange}
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
      {stage === LockStage.UPDATE_SPONSOR_MEDIA && (
        <UpdateSponsorMediaStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.SPONSOR_TAG && (
        <SponsorTagStage
          state={state}
          account={account}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.AUTOCHARGE && (
        <AutoChargeStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.PAY && (
        <PayStage
          state={state}
          account={pool?.id}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_CAP && (
        <UpdateCapStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_ADMIN && (
        <UpdateAdminStage
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
      {stage === LockStage.UPDATE_BOUNTY_ID && (
        <UpdateBountyStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_URI_GENERATOR && (
        <UpdateUriStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_MINT_INFO && (
        <UpdateMintInfoStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.TRANSFER_TO_NOTE_RECEIVABLE && (
        <UpdateTransferToNoteReceivableStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CLAIM_NOTE && (
        <ClaimNoteStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.UPDATE_TOKEN_ID && (
        <UpdateTokenIdStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_USER_PERCENTILES && (
        <UpdateUserPercentilesStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PAID_PAYABLE && (
        <UpdatePaidPayableStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_DUE_BEFORE_PAYABLE && (
        <UpdateDueBeforePayableStage
          state={state}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_TAG_REGISTRATION && (
        <UpdateTagRegistrationStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BURN && (
        <BurnStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_PRICE_PER_MINUTE && (
        <UpdatePricePerMinuteStage
          state={state}
          handleChange={handleChange}
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
      {stage === LockStage.UPDATE_CATEGORY && (
        <UpdateCategoryStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.WITHDRAW && (
        <AdminWithdrawStage
          state={state}
          account={pool.id}
          currency={currency}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.DEPOSIT && (
        <DepositStage
          state={state}
          currency={currency}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.UPDATE_PROFILE_ID && <UpdateProfileIdStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_PROTOCOL && <DeleteARPStage continueToNextStage={continueToNextStage} />}
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
