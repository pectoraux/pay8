import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, LinkExternal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useBILLContract, useBILLNote, useBILLHelper, useBILLMinter } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import LocationStage from 'views/Ramps/components/LocationStage'
import DepositStage from 'views/ARPs/components/DepositStage'
import { useWeb3React } from '@pancakeswap/wagmi'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { differenceInSeconds } from 'date-fns'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import UpdateApplicationStage from 'views/ARPs/components/UpdateApplicationStage'

import UpdateUserOwnerStage from './UpdateUserOwnerStage'

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
import UpdateWhitelistStage from './UpdateWhitelistStage'
import UpdatePricePerMinuteStage from './UpdatePricePerMinuteStage'
import UpdateExcludedContentStage from './UpdateExcludedContentStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import SponsorTagStage from './SponsorTagStage'
import UpdateMintExtraStage from './UpdateMintExtraStage'
import UpdateMintInfoStage from './UpdateMintInfoStage'
import UpdateCategoryStage from './UpdateCategoryStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteStage from './DeleteStage'
import DeleteBillStage from './DeleteBillStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import UpdateCapStage from './UpdateCapStage'
import UpdateNotifyDebitStage from './UpdateNotifyDebitStage'
import UpdateNotifyCreditStage from './UpdateNotifyCreditStage'
import UpdateTaxContractStage from './UpdateTaxContractStage'
import UpdateSponsorMediaStage from './UpdateSponsorMediaStage'
import UpdateTransferToNotePayableStage from './UpdateTransferToNotePayableStage'
import UpdateTransferToNoteReceivableStage from './UpdateTransferToNoteReceivableStage'
import UpdateTagRegistrationStage from './UpdateTagRegistrationStage'
import UpdateDueBeforePayableStage from './UpdateDueBeforePayableStage'
import UpdateMigratePointStage from './UpdateMigratePointStage'
import UpdateDiscountDivisorStage from './UpdateDiscountDivisorStage'
import UpdatePenaltyDivisorStage from './UpdatePenaltyDivisorStage'
import UpdateMigrateStage from './UpdateMigrateStage'
import UpdateAdminStage from './UpdateAdminStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.PAY]: t('Pay Due Payable'),
  [LockStage.MIGRATE]: t('Migrate'),
  [LockStage.DEPOSIT]: t('Deposit'),
  [LockStage.UPDATE_WHITELIST]: t('Update Whitelist'),
  [LockStage.UPDATE_PROTOCOL]: t('Create/Update Account'),
  [LockStage.UPDATE_DISCOUNT_DIVISOR]: t('Update Discount Divisor'),
  [LockStage.UPDATE_PENALTY_DIVISOR]: t('Update Penalty Divisor'),
  [LockStage.UPDATE_MIGRATE_POINT]: t('Update Migrate'),
  [LockStage.TRANSFER_TO_NOTE_RECEIVABLE]: t('Transfer Note Receivable'),
  [LockStage.UPDATE_DUE_BEFORE_PAYABLE]: t('Update Due Before Payable'),
  [LockStage.UPDATE_TAG_REGISTRATION]: t('Update Tag Registration'),
  [LockStage.NOTIFY_CREDIT]: t('Notify Credit'),
  [LockStage.NOTIFY_DEBIT]: t('Notify Debit'),
  [LockStage.UPDATE_TAX_CONTRACT]: t('Update Tax Contract'),
  [LockStage.UPDATE_USER_OWNER]: t('Update Account Owner'),
  [LockStage.TRANSFER_TO_NOTE_PAYABLE]: t('Transfer Note Payable'),
  [LockStage.UPDATE_SPONSOR_MEDIA]: t('Update Sponsor Media'),
  [LockStage.UPDATE_CAP]: t('Update Cap'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.UPDATE_BOUNTY_ID]: t('Update Attached Bounty'),
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
  [LockStage.MINT_EXTRA]: t('Mint Extra'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Protocol'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.UPDATE_APPLICATION]: t('Update Application Link'),
  [LockStage.CONFIRM_UPDATE_APPLICATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_SPONSOR_TAG]: t('Back'),
  [LockStage.CONFIRM_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_PAY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ADMIN]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT]: t('Back'),
  [LockStage.CONFIRM_MIGRATE]: t('Back'),
  [LockStage.CONFIRM_CLAIM_NOTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_WHITELIST]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MIGRATE_POINT]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DUE_BEFORE_PAYABLE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAG_REGISTRATION]: t('Back'),
  [LockStage.CONFIRM_NOTIFY_CREDIT]: t('Back'),
  [LockStage.CONFIRM_NOTIFY_DEBIT]: t('Back'),
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
  [LockStage.CONFIRM_MINT_EXTRA]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_UPDATE_URI_GENERATOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY_ID]: t('Back'),
  [LockStage.CONFIRM_VOTE]: t('Back'),
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
  currency,
  onDismiss,
}) => {
  const [stage, setStage] = useState(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const billContract = useBILLContract(pool?.billAddress || router.query.bill || '')
  const billNoteContract = useBILLNote()
  const billHelperContract = useBILLHelper()
  const billMinterContract = useBILLMinter()
  console.log('mcurrencyy===============>', currAccount, currency, pool, billContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner ?? '',
    avatar: pool?.collection?.avatar,
    bountyId: pool?.bountyId ?? '',
    profileId: pool?.profileId,
    bill: pool?.billAddress ?? '',
    extraMint: '',
    category: '',
    contractAddress: '',
    optionId: currAccount?.optionId ?? '0',
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    pricePerMinute: '',
    factor: '',
    period: parseInt(pool?.period) / 60 ?? '',
    cap: '',
    tokenId: '',
    startPayable: convertTimeToSeconds(currAccount?.startPayable ?? 0),
    creditFactor: pool?.migrationPoint?.length ? parseInt(pool?.migrationPoint[3]?.toString()) / 100 : '',
    debitFactor: pool?.migrationPoint?.length ? parseInt(pool?.migrationPoint[4]?.toString()) / 100 : '',
    toAddress: '',
    decimals: currAccount?.token?.decimals ?? 18,
    periodPayable: '',
    bufferTime: parseInt(pool?.bufferTime) / 60 ?? '',
    amountPayable: getBalanceNumber(currAccount?.amountPayable ?? 0, currency?.decimals),
    amountReceivable: getBalanceNumber(currAccount?.amountReceivable ?? 0, currency?.decimals),
    periodReceivable: currAccount?.periodReceivable,
    startReceivable: convertTimeToSeconds(currAccount?.startReceivable ?? 0),
    description: currAccount?.description ?? '',
    ratings: currAccount?.ratings?.toString() ?? '',
    esgRating: currAccount?.esgRating ?? '',
    media: pool?.media ?? '',
    identityTokenId: '0',
    message: '',
    tag: '',
    protocolId: currAccount?.protocolId ?? '0',
    uriGenerator: '',
    autoCharge: 0,
    like: 0,
    bountyRequired: parseInt(pool?.bountyRequired) / 100,
    ve: pool?._ve,
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    token: currency?.address,
    add: 0,
    contentType: '',
    name: pool?.name,
    applicationLink: pool?.applicationLink ?? '',
    billDescription: pool?.billDescription ?? '',
    customTags: '',
    adminBountyRequired: parseInt(pool?.adminBountyRequired) / 100,
    adminCreditShare: parseInt(pool?.adminCreditShare) / 100 ?? '',
    adminDebitShare: parseInt(pool?.adminDebitShare) / 100 ?? '',
    profileRequired: pool?.profileRequired ? 1 : 0,
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
      case LockStage.UPDATE_APPLICATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_APPLICATION:
        setStage(LockStage.UPDATE_APPLICATION)
        break
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
      case LockStage.MIGRATE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_MIGRATE:
        setStage(LockStage.MIGRATE)
        break
      case LockStage.UPDATE_WHITELIST:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_WHITELIST:
        setStage(LockStage.UPDATE_WHITELIST)
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
      case LockStage.UPDATE_MIGRATE_POINT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MIGRATE_POINT:
        setStage(LockStage.UPDATE_MIGRATE_POINT)
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
      case LockStage.NOTIFY_CREDIT:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_CREDIT:
        setStage(LockStage.NOTIFY_CREDIT)
        break
      case LockStage.NOTIFY_DEBIT:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_DEBIT:
        setStage(LockStage.NOTIFY_DEBIT)
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
        setStage(LockStage.SETTINGS)
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
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
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
      case LockStage.DEPOSIT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DEPOSIT:
        setStage(LockStage.DEPOSIT)
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
      case LockStage.UPDATE_APPLICATION:
        setStage(LockStage.CONFIRM_UPDATE_APPLICATION)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.CONFIRM_DEPOSIT)
        break
      case LockStage.AUTOCHARGE:
        setStage(LockStage.CONFIRM_AUTOCHARGE)
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
      case LockStage.VOTE:
        setStage(LockStage.CONFIRM_VOTE)
        break
      case LockStage.UPDATE_BOUNTY_ID:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY_ID)
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
      case LockStage.NOTIFY_DEBIT:
        setStage(LockStage.CONFIRM_NOTIFY_DEBIT)
        break
      case LockStage.NOTIFY_CREDIT:
        setStage(LockStage.CONFIRM_NOTIFY_CREDIT)
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
      case LockStage.UPDATE_MIGRATE_POINT:
        setStage(LockStage.CONFIRM_UPDATE_MIGRATE_POINT)
        break
      case LockStage.UPDATE_PENALTY_DIVISOR:
        setStage(LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR)
        break
      case LockStage.UPDATE_DISCOUNT_DIVISOR:
        setStage(LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR)
        break
      case LockStage.UPDATE_WHITELIST:
        setStage(LockStage.CONFIRM_UPDATE_WHITELIST)
        break
      case LockStage.MIGRATE:
        setStage(LockStage.CONFIRM_MIGRATE)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.CONFIRM_UPDATE_ADMIN)
        break
      case LockStage.PAY:
        setStage(LockStage.CONFIRM_PAY)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, billContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [billContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(t('Contract approved'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
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
        return callWithGasPrice(billMinterContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DEPOSIT) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [pool?.id, amountReceivable?.toString()]
        console.log('CONFIRM_DEPOSIT===============>', args)
        return callWithGasPrice(stakingTokenContract, 'transfer', args).catch((err) =>
          console.log('CONFIRM_DEPOSIT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_APPLICATION) {
        const args = ['0', '0', '', '', '0', '0', ADDRESS_ZERO, state.applicationLink]
        console.log('CONFIRM_UPDATE_APPLICATION===============>', args)
        return callWithGasPrice(billMinterContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_APPLICATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_AUTOCHARGE) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.protocolId?.split(','), amountReceivable?.toString()]
        console.log('CONFIRM_AUTOCHARGE===============>', args)
        return callWithGasPrice(billContract, 'autoCharge', args).catch((err) =>
          console.log('CONFIRM_AUTOCHARGE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_PAY) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [state.protocolId, amountPayable?.toString()]
        console.log('CONFIRM_PAY===============>', args)
        return callWithGasPrice(billContract, 'payInvoicePayable', args).catch((err) =>
          console.log('CONFIRM_PAY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_ADMIN) {
        const args = [state.owner, !!state.add]
        console.log('CONFIRM_UPDATE_ADMIN===============>', args)
        return callWithGasPrice(billContract, 'updateAdmin', args).catch((err) =>
          console.log('CONFIRM_UPDATE_ADMIN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MIGRATE) {
        const args = [state.protocolId]
        console.log('CONFIRM_MIGRATE===============>', args)
        return callWithGasPrice(billContract, 'migrate', args).catch((err) =>
          console.log('CONFIRM_MIGRATE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_WHITELIST) {
        const args = [state.contractAddress, state.protocolId, !!state.add]
        console.log('CONFIRM_UPDATE_WHITELIST===============>', args)
        return callWithGasPrice(billContract, 'updateWhitelist', args).catch((err) =>
          console.log('CONFIRM_UPDATE_WHITELIST===============>', err),
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
        return callWithGasPrice(billContract, 'updateDiscountDivisor', args).catch((err) =>
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
        return callWithGasPrice(billContract, 'updatePenaltyDivisor', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PENALTY_DIVISOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_MIGRATE_POINT) {
        const startPayable = Math.max(
          differenceInSeconds(new Date(state.startPayable ?? 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const startReceivable = Math.max(
          differenceInSeconds(new Date(state.startReceivable ?? 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args = [
          startPayable.toString(),
          startReceivable.toString(),
          parseInt(state.creditFactor ?? '0') * 100,
          parseInt(state.debitFactor ?? '0') * 100,
        ]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(billContract, 'updateMigrationPoint', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE) {
        const args = [state.bill, state.toAddress, state.protocolId]
        console.log('CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>', args)
        return callWithGasPrice(billNoteContract, 'transferDueToNoteReceivable', args).catch((err) =>
          console.log('CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DUE_BEFORE_PAYABLE) {
        const args = [state.bill, !!state.add]
        console.log('CONFIRM_UPDATE_DUE_BEFORE_PAYABLE===============>', args)
        return callWithGasPrice(billNoteContract, 'updateDueBeforePayable', args).catch((err) =>
          console.log('CONFIRM_UPDATE_DUE_BEFORE_PAYABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAG_REGISTRATION) {
        const args = [state.tag, !!state.add]
        console.log('CONFIRM_UPDATE_TAG_REGISTRATION===============>', args)
        return callWithGasPrice(billHelperContract, 'updateTagRegistration', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TAG_REGISTRATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_NOTIFY_CREDIT) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.contractAddress, state.owner, amountReceivable?.toString()]
        console.log('CONFIRM_NOTIFY_CREDIT===============>', args)
        return callWithGasPrice(billContract, 'notifyCredit', args).catch((err) =>
          console.log('CONFIRM_NOTIFY_CREDIT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_NOTIFY_DEBIT) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [state.contractAddress, state.owner, amountPayable?.toString()]
        console.log('CONFIRM_NOTIFY_DEBIT===============>', args)
        return callWithGasPrice(billContract, 'notifyDebit', args).catch((err) =>
          console.log('CONFIRM_NOTIFY_DEBIT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAX_CONTRACT) {
        const args = [state.contractAddress]
        console.log('CONFIRM_UPDATE_TAX_CONTRACT===============>', args)
        return callWithGasPrice(billContract, 'updateTaxContract', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TAX_CONTRACT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_USER_OWNER) {
        const args = [state.owner, state.protocolId]
        console.log('CONFIRM_UPDATE_USER_OWNER===============>', args)
        return callWithGasPrice(billContract, 'updateOwner', args).catch((err) =>
          console.log('CONFIRM_UPDATE_USER_OWNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_TO_NOTE_PAYABLE) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [state.bill, state.toAddress, state.protocolId, amountPayable?.toString()]
        console.log('CONFIRM_TRANSFER_TO_NOTE_PAYABLE===============>', args)
        return callWithGasPrice(billNoteContract, 'transferDueToNotePayable', args).catch((err) =>
          console.log('CONFIRM_TRANSFER_TO_NOTE_PAYABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA) {
        const args = [state.protocolId, state.tag]
        console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', args)
        return callWithGasPrice(billHelperContract, 'updateSponsorMedia', args).catch((err) =>
          console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_CAP) {
        const args = [currency?.address, state.cap]
        console.log('CONFIRM_UPDATE_CAP===============>', args)
        return callWithGasPrice(billContract, 'updateCap', args).catch((err) =>
          console.log('CONFIRM_UPDATE_CAP===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT) {
        console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', [state.tag, state.contentType, !!state.add])
        return callWithGasPrice(billHelperContract, 'updateExcludedContent', [
          state.tag,
          state.contentType,
          !!state.add,
        ]).catch((err) => console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE) {
        const pricePerMinute = getDecimalAmount(state.pricePerMinute ?? 0, currency?.decimals)
        console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', [pricePerMinute?.toString()])
        return callWithGasPrice(billHelperContract, 'updatePricePerAttachMinutes', [pricePerMinute?.toString()]).catch(
          (err) => console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BURN) {
        console.log('CONFIRM_BURN===============>', [state.tokenId])
        return callWithGasPrice(billMinterContract, 'burn', [state.tokenId]).catch((err) =>
          console.log('CONFIRM_BURN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_CATEGORY) {
        console.log('CONFIRM_UPDATE_CATEGORY===============>', [state.bill, state.category])
        return callWithGasPrice(billHelperContract, 'updateCategory', [state.bill, state.category]).catch((err) =>
          console.log('CONFIRM_UPDATE_CATEGORY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [currency?.address, amount.toString()]
        console.log('CONFIRM_WITHDRAW===============>', args)
        return callWithGasPrice(billContract, 'withdraw', args).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_MINT_INFO) {
        const args = [state.bill, state.extraMint, state.tokenId]
        console.log('CONFIRM_UPDATE_MINT_INFO===============>', args)
        return callWithGasPrice(billMinterContract, 'updateMintInfo', args).catch((err) =>
          console.log('CONFIRM_UPDATE_MINT_INFO===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MINT_EXTRA) {
        console.log('CONFIRM_MINT_EXTRA===============>', [state.tokenId, state.extraMint])
        return callWithGasPrice(billMinterContract, 'mintExtra', [state.tokenId, state.extraMint]).catch((err) =>
          console.log('CONFIRM_MINT_EXTRA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
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
          state.protocolId,
          [
            state.identityTokenId,
            startReceivable.toString(),
            startPayable.toString(),
            parseInt(state.periodReceivable) * 60,
            parseInt(state.periodPayable) * 60,
          ],
          parseInt(state.bountyRequired) * 100,
          state.optionId,
          state.media,
          state.description,
        ]
        console.log('CONFIRM_UPDATE_PROTOCOL===============>', billContract, args)
        return callWithGasPrice(billContract, 'updateProtocol', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const args = [
          !!state.profileRequired,
          parseInt(state.bountyRequired) * 100,
          parseInt(state.bufferTime) * 60,
          state.maxNotesPerProtocol,
          parseInt(state.adminBountyRequired) * 100,
          parseInt(state.period) * 60,
          parseInt(state.adminCreditShare) * 100,
          parseInt(state.adminDebitShare) * 100,
        ]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(billContract, 'updateParameters', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SPONSOR_TAG) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.contractAddress, state.bill, amountReceivable.toString(), state.tag, state.message]
        console.log('CONFIRM_SPONSOR_TAG===============>', args)
        return callWithGasPrice(billHelperContract, 'sponsorTag', args).catch((err) =>
          console.log('CONFIRM_SPONSOR_TAG===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = [state.owner]
        console.log('CONFIRM_UPDATE_OWNER===============>', args)
        return callWithGasPrice(billContract, 'updateDev', args).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_URI_GENERATOR) {
        const args = [state.bill, state.uriGenerator]
        console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', args)
        return callWithGasPrice(billHelperContract, 'updateUriGenerator', args).catch((err) =>
          console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_AUTOCHARGE) {
        const args = [!!state.autoCharge, state.protocolId]
        console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', args)
        return callWithGasPrice(billContract, 'updateAutoCharge', args).catch((err) =>
          console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        console.log('CONFIRM_DELETE_PROTOCOL===============>', [state.protocolId])
        return callWithGasPrice(billContract, 'deleteProtocol', [state.protocolId]).catch((err) =>
          console.log('CONFIRM_DELETE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        console.log('CONFIRM_DELETE===============>', [state.bill])
        return callWithGasPrice(billContract, 'deleteBILL', [state.bill]).catch((err) =>
          console.log('CONFIRM_DELETE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY_ID) {
        console.log('CONFIRM_UPDATE_BOUNTY_ID===============>', [state.bountyId, state.protocolId])
        return callWithGasPrice(billContract, 'updateBounty', [state.bountyId, state.protocolId]).catch((err) =>
          console.log('CONFIRM_UPDATE_BOUNTY_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
        console.log('CONFIRM_CLAIM_NOTE===============>', [state.tokenId])
        return callWithGasPrice(billNoteContract, 'claimPendingRevenueFromNote', [state.tokenId]).catch((err) =>
          console.log('CONFIRM_CLAIM_NOTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_VOTE) {
        const args = [state.bill, state.profileId, !!state.like]
        console.log('CONFIRM_VOTE===============>', args)
        return callWithGasPrice(billHelperContract, 'vote', args).catch((err) =>
          console.log('CONFIRM_VOTE===============>', err),
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
            <LinkExternal color="success" href={pool.bill?.applicationLink} bold>
              {t('APPLY FOR AN ACCOUNT')}
            </LinkExternal>
          </Flex>
          <Button mb="8px" onClick={() => setStage(LockStage.AUTOCHARGE)}>
            {t('PAY DUE RECEIVABLE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.PAY)}>
            {t('PAY DUE PAYABLE')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.NOTIFY_CREDIT)}>
            {t('NOTIFY CREDIT')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.NOTIFY_DEBIT)}>
            {t('NOTIFY DEBIT')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.VOTE)}>
            {t('VOTE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.SPONSOR_TAG)}>
            {t('SPONSOR TAG')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_TAX_CONTRACT)}>
            {t('UPDATE TAX CONTRACT')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.UPDATE_USER_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={() => setStage(LockStage.MIGRATE)}>
            {t('MIGRATE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.MINT_EXTRA)}>
            {t('MINT EXTRA')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY_ID)}>
            {t('UPDATE BOUNTY ID')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.TRANSFER_TO_NOTE_PAYABLE)}>
            {t('TRANSFER TO NOTE PAYABLE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_AUTOCHARGE)}>
            {t('UPDATE AUTOCHARGE')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_SPONSOR_MEDIA)}>
            {t('UPDATE SPONSOR MEDIA')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CLAIM_NOTE)}>
            {t('CLAIM NOTE')}
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
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.NOTIFY_CREDIT)}>
            {t('NOTIFY CREDIT')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.NOTIFY_DEBIT)}>
            {t('NOTIFY DEBIT')}
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
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_APPLICATION)}>
            {t('UPDATE APPLICATION')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_AUTOCHARGE)}>
            {t('UPDATE AUTOCHARGE')}
          </Button>
          <Button variant="text" mb="8px" onClick={() => setStage(LockStage.UPDATE_WHITELIST)}>
            {t('UPDATE WHITELIST')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_DISCOUNT_DIVISOR)}>
            {t('UPDATE DISCOUNT DIVISOR')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_PENALTY_DIVISOR)}>
            {t('UPDATE PENALTY DIVISOR')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={() => setStage(LockStage.UPDATE_MIGRATE_POINT)}>
            {t('UPDATE MIGRATE POINT')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={() => setStage(LockStage.MIGRATE)}>
            {t('MIGRATE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_PARAMETERS)}>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY_ID)}>
            {t('UPDATE BOUNTY ID')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_URI_GENERATOR)}>
            {t('UPDATE URI GENERATOR')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_MINT_INFO)}>
            {t('UPDATE MINT INFO')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.TRANSFER_TO_NOTE_RECEIVABLE)}>
            {t('TRANSFER TO NOTE RECEIVABLE')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CLAIM_NOTE)}>
            {t('CLAIM NOTE')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.UPDATE_DUE_BEFORE_PAYABLE)}>
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
              <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_CATEGORY)}>
                {t('UPDATE CATEGORY')}
              </Button>
              <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.WITHDRAW)}>
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
          pool={pool}
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_APPLICATION && (
        <UpdateApplicationStage
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
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
      {stage === LockStage.NOTIFY_CREDIT && (
        <UpdateNotifyCreditStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.NOTIFY_DEBIT && (
        <UpdateNotifyDebitStage
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
      {stage === LockStage.VOTE && (
        <VoteStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_TAX_CONTRACT && (
        <UpdateTaxContractStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_USER_OWNER && (
        <UpdateUserOwnerStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.MINT_EXTRA && (
        <UpdateMintExtraStage
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
      {stage === LockStage.UPDATE_SPONSOR_MEDIA && (
        <UpdateSponsorMediaStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
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
        <AutoChargeStage
          state={state}
          account={account}
          currency={currency}
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
        <UpdateOwnerStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_WHITELIST && (
        <UpdateWhitelistStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_DISCOUNT_DIVISOR && (
        <UpdateDiscountDivisorStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PENALTY_DIVISOR && (
        <UpdatePenaltyDivisorStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_MIGRATE_POINT && (
        <UpdateMigratePointStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.MIGRATE && (
        <UpdateMigrateStage
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
      {stage === LockStage.UPDATE_DUE_BEFORE_PAYABLE && (
        <UpdateDueBeforePayableStage
          state={state}
          handleChange={handleChange}
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
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_PROTOCOL && <DeleteBillStage continueToNextStage={continueToNextStage} />}
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
