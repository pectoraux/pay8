import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, LinkExternal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useAuditorContract, useAuditorNote, useAuditorHelper, useAuditorHelper2 } from 'hooks/useContract'
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
import UpdateApplicationStage from 'views/ARPs/components/UpdateApplicationStage'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateParametersStage from './UpdateParametersStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import UpdateAdminStage from './UpdateAdminStage'
import UpdateDataKeeperStage from './UpdateDataKeeperStage'
import UpdateAutoChargeStage from './UpdateAutoChargeStage'
import UpdateBountyStage from './UpdateBountyStage'
import UpdateUriStage from './UpdateUriStage'
import VoteStage from './VoteStage'
import BurnStage from './BurnStage'
import UpdateDiscountDivisorStage from './UpdateDiscountDivisorStage'
import UpdatePenaltyDivisorStage from './UpdatePenaltyDivisorStage'
import AutoChargeStage from './AutoChargeStage'
import UpdatePricePerMinuteStage from './UpdatePricePerMinuteStage'
import UpdateExcludedContentStage from './UpdateExcludedContentStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import SponsorTagStage from './SponsorTagStage'
import UpdateMintExtraStage from './UpdateMintExtraStage'
import UpdateCategoryStage from './UpdateCategoryStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import ClaimRevenueStage from './ClaimRevenueStage'
import DeleteAuditorStage from './DeleteAuditorStage'
import DeleteStage from './DeleteStage'
import UpdateTransferToNoteReceivableStage from './UpdateTransferToNoteReceivableStage'
import ClaimNoteStage from './ClaimNoteStage'
import UpdateTagRegistrationStage from './UpdateTagRegistrationStage'
import UpdateSponsorMediaStage from './UpdateSponsorMediaStage'
import UpdateRatingLegendStage from './UpdateRatingLegendStage'
import LocationStage from './LocationStage'
import UpdateMintInfoStage from './UpdateMintInfoStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.UPDATE_ADMIN]: t('Update Admin'),
  [LockStage.UPDATE_PROTOCOL]: t('Create/Update Account'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.UPDATE_DISCOUNT_DIVISOR]: t('Update Discount Divisor'),
  [LockStage.UPDATE_PENALTY_DIVISOR]: t('Update Penalty Divisor'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Bounty Required'),
  [LockStage.UPDATE_BOUNTY_ID]: t('Update Attached Bounty'),
  [LockStage.VOTE]: t('Vote'),
  [LockStage.BURN]: t('Burn'),
  [LockStage.TRANSFER_TO_NOTE_RECEIVABLE]: t('Transfer Note Receivable'),
  [LockStage.UPDATE_AUTOCHARGE]: t('Update Autocharge'),
  [LockStage.UPDATE_CATEGORY]: t('Update Category'),
  [LockStage.UPDATE_PRICE_PER_MINUTE]: t('Update Price Per Minute'),
  [LockStage.UPDATE_EXCLUDED_CONTENT]: t('Update Excluded Content'),
  [LockStage.SPONSOR_TAG]: t('Sponsor Tag'),
  [LockStage.ADMIN_AUTOCHARGE]: t('Pay Due Receivable'),
  [LockStage.UPDATE_URI_GENERATOR]: t('Update URI Generator'),
  [LockStage.MINT_EXTRA]: t('Mint Extra'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.CLAIM_NOTE]: t('Claim Note'),
  [LockStage.UPDATE_RATING_LEGEND]: t('Update Rating Legend'),
  [LockStage.UPDATE_SPONSOR_MEDIA]: t('Update Sponsor Media'),
  [LockStage.CLAIM_REVENUE_FROM_SPONSORS]: t('Claim Pending From Sponsors'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Protocol'),
  [LockStage.UPDATE_TAG_REGISTRATION]: t('Update Tag Registration'),
  [LockStage.UPDATE_DATA_KEEPER]: t('Update Data Keeper'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.UPDATE_MINT_INFO]: t('Update Mint Info'),
  [LockStage.UPDATE_APPLICATION]: t('Update Application Link'),
  [LockStage.CONFIRM_UPDATE_APPLICATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DATA_KEEPER]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAG_REGISTRATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_CATEGORY]: t('Back'),
  [LockStage.CONFIRM_BURN]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_MINT_EXTRA]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ADMIN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_URI_GENERATOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_CLAIM_NOTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_RATING_LEGEND]: t('Back'),
  [LockStage.CONFIRM_CLAIM_REVENUE_FROM_SPONSORS]: t('Back'),
  [LockStage.CONFIRM_SPONSOR_TAG]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT]: t('Back'),
  [LockStage.CONFIRM_ADMIN_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY_ID]: t('Back'),
  [LockStage.CONFIRM_VOTE]: t('Back'),
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
  const auditorContract = useAuditorContract(pool?.auditorAddress || router.query.auditor || '')
  const auditorNoteContract = useAuditorNote()
  const auditorHelperContract = useAuditorHelper()
  const auditorHelper2Contract = useAuditorHelper2()
  console.log('mcurrencyy===============>', currAccount, currency, pool, auditorContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    avatar: pool?.collection?.avatar,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
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
    auditor: pool?.id ?? '',
    legend: currAccount?.ratingLegend,
    amountReceivable: getBalanceNumber(currAccount?.amountReceivable ?? 0, currAccount?.token?.decimals),
    periodReceivable: parseInt(currAccount?.periodReceivable ?? '0') / 60,
    startReceivable: convertTimeToSeconds(currAccount?.startReceivable ?? 0),
    description: currAccount?.description ?? '',
    ratings: currAccount?.ratings?.toString() ?? '',
    esgRating: currAccount?.esgRating ?? '',
    media: pool?.media ?? '',
    identityTokenId: '0',
    message: '',
    tag: '',
    protocolId: currAccount?.protocolId ?? '0',
    toAddress: currAccount?.id ?? '',
    uriGenerator: '',
    autoCharge: 0,
    like: 0,
    bountyRequired: pool?.bountyRequired,
    ve: pool?._ve,
    token: currency?.address,
    add: 0,
    contentType: '',
    name: pool?.name,
    numPeriods: '',
    applicationLink: pool?.applicationLink ?? '',
    auditorDescription: pool?.auditorDescription ?? '',
    datakeeper: 0,
    accounts: currAccount?.id ?? '',
    decimals: currAccount?.token?.decimals ?? currency?.decimals ?? 18,
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
      case LockStage.UPDATE_APPLICATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_APPLICATION:
        setStage(LockStage.UPDATE_APPLICATION)
        break
      case LockStage.UPDATE_MINT_INFO:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MINT_INFO:
        setStage(LockStage.UPDATE_MINT_INFO)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.UPDATE_TAG_REGISTRATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAG_REGISTRATION:
        setStage(LockStage.UPDATE_TAG_REGISTRATION)
        break
      case LockStage.CLAIM_NOTE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_NOTE:
        setStage(LockStage.CLAIM_NOTE)
        break
      case LockStage.UPDATE_RATING_LEGEND:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_RATING_LEGEND:
        setStage(LockStage.UPDATE_RATING_LEGEND)
        break
      case LockStage.CLAIM_REVENUE_FROM_SPONSORS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_REVENUE_FROM_SPONSORS:
        setStage(LockStage.CLAIM_REVENUE_FROM_SPONSORS)
        break
      case LockStage.TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.TRANSFER_TO_NOTE_RECEIVABLE)
        break
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_AUTOCHARGE:
        setStage(LockStage.UPDATE_AUTOCHARGE)
        break
      case LockStage.UPDATE_DATA_KEEPER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DATA_KEEPER:
        setStage(LockStage.UPDATE_DATA_KEEPER)
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
      case LockStage.BURN:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BURN:
        setStage(LockStage.BURN)
        break
      case LockStage.ADMIN_AUTOCHARGE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADMIN_AUTOCHARGE:
        setStage(LockStage.ADMIN_AUTOCHARGE)
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
      case LockStage.UPDATE_CATEGORY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_CATEGORY:
        setStage(LockStage.UPDATE_CATEGORY)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SPONSOR_TAG:
        setStage(LockStage.SPONSOR_TAG)
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
      case LockStage.UPDATE_BOUNTY_ID:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BOUNTY_ID:
        setStage(LockStage.UPDATE_BOUNTY_ID)
        break
      case LockStage.CONFIRM_VOTE:
        setStage(LockStage.VOTE)
        break
      case LockStage.VOTE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_PROTOCOL:
        setStage(LockStage.DELETE_PROTOCOL)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.DELETE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_ADMIN:
        setStage(LockStage.UPDATE_ADMIN)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_URI_GENERATOR:
        setStage(LockStage.UPDATE_URI_GENERATOR)
        break
      case LockStage.UPDATE_URI_GENERATOR:
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
      case LockStage.UPDATE_APPLICATION:
        setStage(LockStage.CONFIRM_UPDATE_APPLICATION)
        break
      case LockStage.UPDATE_MINT_INFO:
        setStage(LockStage.CONFIRM_UPDATE_MINT_INFO)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.UPDATE_TAG_REGISTRATION:
        setStage(LockStage.CONFIRM_UPDATE_TAG_REGISTRATION)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.CONFIRM_CLAIM_NOTE)
        break
      case LockStage.UPDATE_RATING_LEGEND:
        setStage(LockStage.CONFIRM_UPDATE_RATING_LEGEND)
        break
      case LockStage.CLAIM_REVENUE_FROM_SPONSORS:
        setStage(LockStage.CONFIRM_CLAIM_REVENUE_FROM_SPONSORS)
        break
      case LockStage.TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE)
        break
      case LockStage.UPDATE_DATA_KEEPER:
        setStage(LockStage.CONFIRM_UPDATE_DATA_KEEPER)
        break
      case LockStage.BURN:
        setStage(LockStage.CONFIRM_BURN)
        break
      case LockStage.UPDATE_PENALTY_DIVISOR:
        setStage(LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR)
        break
      case LockStage.UPDATE_DISCOUNT_DIVISOR:
        setStage(LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR)
        break
      case LockStage.UPDATE_PRICE_PER_MINUTE:
        setStage(LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_CATEGORY:
        setStage(LockStage.CONFIRM_UPDATE_CATEGORY)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.CONFIRM_SPONSOR_TAG)
        break
      case LockStage.MINT_EXTRA:
        setStage(LockStage.CONFIRM_MINT_EXTRA)
        break
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(LockStage.CONFIRM_UPDATE_AUTOCHARGE)
        break
      case LockStage.UPDATE_BOUNTY_ID:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY_ID)
        break
      case LockStage.VOTE:
        setStage(LockStage.CONFIRM_VOTE)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.CONFIRM_DELETE_PROTOCOL)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.CONFIRM_UPDATE_ADMIN)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.ADMIN_AUTOCHARGE:
        setStage(LockStage.CONFIRM_ADMIN_AUTOCHARGE)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_URI_GENERATOR:
        setStage(LockStage.CONFIRM_UPDATE_URI_GENERATOR)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, auditorContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [auditorContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start receiving payments for audits!'),
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
        return callWithGasPrice(auditorNoteContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_APPLICATION) {
        const args = ['0', '0', state.contactChannels, state.contacts, '0', '0', ADDRESS_ZERO, state.applicationLink]
        console.log('CONFIRM_UPDATE_APPLICATION===============>', args)
        return callWithGasPrice(auditorNoteContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_APPLICATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_MINT_INFO) {
        const args = [pool?.id, state.extraMint, state.protocolId]
        console.log('CONFIRM_UPDATE_MINT_INFO===============>', args)
        return callWithGasPrice(auditorHelperContract, 'updateMintInfo', args).catch((err) =>
          console.log('CONFIRM_UPDATE_MINT_INFO===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA) {
        const args = [state.protocolId, state.tag]
        console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', args)
        return callWithGasPrice(auditorHelper2Contract, 'updateSponsorMedia', args).catch((err) =>
          console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAG_REGISTRATION) {
        const args = [state.tag, !!state.add]
        console.log('CONFIRM_UPDATE_TAG_REGISTRATION===============>', args)
        return callWithGasPrice(auditorHelper2Contract, 'updateTagRegistration', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TAG_REGISTRATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE) {
        const args = [state.auditor, state.toAddress, state.protocolId, state.numPeriods]
        console.log('CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>', args)
        return callWithGasPrice(auditorNoteContract, 'transferDueToNoteReceivable', args).catch((err) =>
          console.log('CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const startReceivable = Math.max(
          differenceInSeconds(new Date(state.startReceivable ?? 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args = [
          state.owner,
          currency?.address,
          [
            amountReceivable.toString(),
            parseInt(state.periodReceivable) * 60,
            startReceivable.toString(),
            state.optionId,
          ],
          state.identityTokenId,
          state.esgRating,
          state.protocolId,
          state.ratings?.split(','),
          state.media,
          state.description,
        ]
        console.log('CONFIRM_UPDATE_PROTOCOL===============>', auditorContract, args)
        return callWithGasPrice(auditorContract, 'updateProtocol', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const args = [!!state.bountyRequired]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(auditorContract, 'updateParameters', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SPONSOR_TAG) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.contractAddress, state.auditor, amountReceivable.toString(), state.tag, state.message]
        console.log('CONFIRM_SPONSOR_TAG===============>', args)
        return callWithGasPrice(auditorHelper2Contract, 'sponsorTag', args).catch((err) =>
          console.log('CONFIRM_SPONSOR_TAG===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MINT_EXTRA) {
        const args = [state.tokenId, state.extraMint]
        console.log('CONFIRM_MINT_EXTRA===============>', args)
        return callWithGasPrice(auditorHelperContract, 'mintExtra', args).catch((err) =>
          console.log('CONFIRM_MINT_EXTRA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DATA_KEEPER) {
        const args = [state.auditor, !!state.datakeeper]
        console.log('CONFIRM_UPDATE_DATA_KEEPER===============>', args)
        return callWithGasPrice(auditorNoteContract, 'updateDatakeeper', args).catch((err) =>
          console.log('CONFIRM_UPDATE_DATA_KEEPER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT) {
        console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', [state.tag, state.contentType, !!state.add])
        return callWithGasPrice(auditorHelper2Contract, 'updateExcludedContent', [
          state.tag,
          state.contentType,
          !!state.add,
        ]).catch((err) => console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE) {
        const pricePerMinute = getDecimalAmount(state.pricePerMinute ?? 0, currency?.decimals)
        console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', [pricePerMinute?.toString()])
        return callWithGasPrice(auditorHelper2Contract, 'updatePricePerAttachMinutes', [
          pricePerMinute?.toString(),
        ]).catch((err) => console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', err))
      }
      if (stage === LockStage.CONFIRM_BURN) {
        console.log('CONFIRM_BURN===============>', [state.tokenId])
        return callWithGasPrice(auditorHelperContract, 'burn', [state.tokenId]).catch((err) =>
          console.log('CONFIRM_BURN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_CATEGORY) {
        console.log('CONFIRM_UPDATE_CATEGORY===============>', [state.auditor, state.category])
        return callWithGasPrice(auditorHelperContract, 'updateCategory', [state.auditor, state.category]).catch((err) =>
          console.log('CONFIRM_UPDATE_CATEGORY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADMIN_AUTOCHARGE) {
        console.log('CONFIRM_ADMIN_AUTOCHARGE===============>', [state.accounts?.split(','), state.numPeriods])
        return callWithGasPrice(auditorContract, 'autoCharge', [state.accounts?.split(','), state.numPeriods]).catch(
          (err) => console.log('CONFIRM_ADMIN_AUTOCHARGE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        console.log('CONFIRM_WITHDRAW===============>', [currency?.address, amount.toString()])
        return callWithGasPrice(auditorContract, 'withdraw', [currency?.address, amount.toString()]).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        console.log('CONFIRM_DELETE_PROTOCOL===============>', [state.protocolId])
        return callWithGasPrice(auditorContract, 'deleteProtocol', [state.protocolId]).catch((err) =>
          console.log('CONFIRM_DELETE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        console.log('CONFIRM_DELETE===============>', [state.auditor])
        return callWithGasPrice(auditorNoteContract, 'deleteAuditor', [state.auditor]).catch((err) =>
          console.log('CONFIRM_DELETE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY_ID) {
        console.log('CONFIRM_UPDATE_BOUNTY===============>', [state.bountyId, state.protocolId])
        return callWithGasPrice(auditorContract, 'updateBounty', [state.bountyId, state.protocolId]).catch((err) =>
          console.log('CONFIRM_UPDATE_BOUNTY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_AUTOCHARGE) {
        console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', [!!state.autoCharge, state.protocolId])
        return callWithGasPrice(auditorContract, 'updateAutoCharge', [!!state.autoCharge, state.protocolId]).catch(
          (err) => console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_URI_GENERATOR) {
        console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', [state.uriGenerator])
        return callWithGasPrice(auditorContract, 'updateURIGenerator', [state.uriGenerator]).catch((err) =>
          console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
        console.log('CONFIRM_CLAIM_NOTE===============>', [state.tokenId])
        return callWithGasPrice(auditorNoteContract, 'claimPendingRevenueFromNote', [state.tokenId]).catch((err) =>
          console.log('CONFIRM_CLAIM_NOTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_RATING_LEGEND) {
        const args = [state.auditor, state.legend?.split(',')]
        console.log('CONFIRM_UPDATE_RATING_LEGEND===============>', args)
        return callWithGasPrice(auditorHelper2Contract, 'updateRatingLegend', args).catch((err) =>
          console.log('CONFIRM_UPDATE_RATING_LEGEND===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_REVENUE_FROM_SPONSORS) {
        console.log('CONFIRM_CLAIM_REVENUE_FROM_SPONSORS===============>', [])
        return callWithGasPrice(auditorHelper2Contract, 'claimPendingRevenue', []).catch((err) =>
          console.log('CONFIRM_CLAIM_REVENUE_FROM_SPONSORS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_VOTE) {
        const args = [state.auditor, state.profileId, !!state.like]
        console.log('CONFIRM_VOTE===============>', args)
        return callWithGasPrice(auditorNoteContract, 'vote', args).catch((err) =>
          console.log('CONFIRM_VOTE===============>', err),
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
        return callWithGasPrice(auditorContract, 'updateDiscountDivisor', args).catch((err) =>
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
        return callWithGasPrice(auditorContract, 'updatePenaltyDivisor', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PENALTY_DIVISOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_ADMIN) {
        const args = [state.owner, !!state.add]
        console.log('CONFIRM_UPDATE_ADMIN===============>', args)
        return callWithGasPrice(auditorContract, 'updateAdmin', args).catch((err) =>
          console.log('CONFIRM_UPDATE_ADMIN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = [state.owner]
        console.log('CONFIRM_UPDATE_OWNER===============>', args)
        return callWithGasPrice(auditorContract, 'updateDev', args).catch((err) =>
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
          <Flex justifyContent="center" style={{ cursor: 'pointer' }} alignSelf="center" mb="10px">
            <LinkExternal color="success" href={pool.auditor?.applicationLink} bold>
              {t('APPLY FOR AN AUDIT')}
            </LinkExternal>
          </Flex>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.VOTE)}>
            {t('VOTE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.SPONSOR_TAG)}>
            {t('SPONSOR TAG')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.ADMIN_AUTOCHARGE)}>
            {t('PAY DUE RECEIVABLE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_AUTOCHARGE)}>
            {t('UPDATE AUTOCHARGE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.CLAIM_NOTE)}>
            {t('CLAIM NOTE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.MINT_EXTRA)}>
            {t('MINT EXTRA')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY_ID)}>
            {t('UPDATE BOUNTY ID')}
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
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_MINT_INFO)}>
            {t('UPDATE MINT INFO')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_APPLICATION)}>
            {t('UPDATE APPLICATION')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.ADMIN_AUTOCHARGE)}>
            {t('PAY DUE RECEIVABLE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_DATA_KEEPER)}>
            {t('UPDATE DATA KEEPER')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_TAG_REGISTRATION)}>
            {t('UPDATE TAG REGISTRATION')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_BOUNTY_ID)}>
            {t('UPDATE BOUNTY ID')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_URI_GENERATOR)}>
            {t('UPDATE URI GENERATOR')}
          </Button>
          {location === 'fromStake' ? (
            <>
              <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_CATEGORY)}>
                {t('UPDATE CATEGORY')}
              </Button>
              <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.WITHDRAW)}>
                {t('WITHDRAW')}
              </Button>
              <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_DISCOUNT_DIVISOR)}>
                {t('UPDATE DISCOUNT DIVISOR')}
              </Button>
              <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_PENALTY_DIVISOR)}>
                {t('UPDATE PENALTY DIVISOR')}
              </Button>
              <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
                {t('UPDATE OWNER')}
              </Button>
              <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.UPDATE_ADMIN)}>
                {t('UPDATE ADMIN')}
              </Button>
              <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.UPDATE_PRICE_PER_MINUTE)}>
                {t('UPDATE PRICE PER MINUTE')}
              </Button>
              <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.UPDATE_EXCLUDED_CONTENT)}>
                {t('UPDATE EXCLUDED CONTENT')}
              </Button>
              <Button mb="8px" variant="subtle" onClick={() => setStage(LockStage.TRANSFER_TO_NOTE_RECEIVABLE)}>
                {t('TRANSFER TO NOTE RECEIVABLE')}
              </Button>
              <Button mb="8px" variant="subtle" onClick={() => setStage(LockStage.UPDATE_SPONSOR_MEDIA)}>
                {t('UPDATE SPONSOR MEDIA')}
              </Button>
              <Button mb="8px" variant="tertiary" onClick={() => setStage(LockStage.UPDATE_RATING_LEGEND)}>
                {t('UPDATE RATING LEGEND')}
              </Button>
              <Button mb="8px" onClick={() => setStage(LockStage.CLAIM_NOTE)}>
                {t('CLAIM NOTE')}
              </Button>
              <Button mb="8px" onClick={() => setStage(LockStage.CLAIM_REVENUE_FROM_SPONSORS)}>
                {t('CLAIM REVENUE FROM SPONSORS')}
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
      {stage === LockStage.UPDATE_MINT_INFO && (
        <UpdateMintInfoStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
      {stage === LockStage.UPDATE_SPONSOR_MEDIA && (
        <UpdateSponsorMediaStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.TRANSFER_TO_NOTE_RECEIVABLE && (
        <UpdateTransferToNoteReceivableStage
          state={state}
          handleChange={handleChange}
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
      {stage === LockStage.UPDATE_PARAMETERS && (
        <UpdateParametersStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_DATA_KEEPER && (
        <UpdateDataKeeperStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_AUTOCHARGE && (
        <UpdateAutoChargeStage
          state={state}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_URI_GENERATOR && (
        <UpdateUriStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.VOTE && (
        <VoteStage
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
      {stage === LockStage.WITHDRAW && (
        <AdminWithdrawStage
          state={state}
          account={pool.id}
          currency={currency}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.CLAIM_REVENUE_FROM_SPONSORS && (
        <ClaimRevenueStage
          state={state}
          account={pool?.pendingFromSponsors}
          currency={currency}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.UPDATE_BOUNTY_ID && (
        <UpdateBountyStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
      {stage === LockStage.MINT_EXTRA && (
        <UpdateMintExtraStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_CATEGORY && (
        <UpdateCategoryStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
      {stage === LockStage.ADMIN_AUTOCHARGE && (
        <AutoChargeStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CLAIM_NOTE && (
        <ClaimNoteStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_RATING_LEGEND && (
        <UpdateRatingLegendStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_PROTOCOL && <DeleteAuditorStage continueToNextStage={continueToNextStage} />}
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
