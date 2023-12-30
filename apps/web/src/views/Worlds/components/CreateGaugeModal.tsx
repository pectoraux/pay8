import BigNumber from 'bignumber.js'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, LinkExternal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  useERC20,
  useWorldContract,
  useWorldHelper,
  useWorldHelper2,
  useWorldHelper3,
  useWorldNote,
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
import { differenceInSeconds } from 'date-fns'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateParametersStage from './UpdateParametersStage'
import UpdateAutoChargeStage from './UpdateAutoChargeStage'
import UpdateTaxContractStage from './UpdateTaxContractStage'
import UpdateTokenIdsStage from './UpdateTokenIdsStage'
import ClaimNoteFromSponsorStage from './ClaimNoteFromSponsorStage'
import UpdateCodeInfoStage from './UpdateCodeInfoStage'
import UpdateCategoryStage from './UpdateCategoryStage'
import UpdatePricePerMinuteStage from './UpdatePricePerMinuteStage'
import UpdateExcludedContentStage from './UpdateExcludedContentStage'
import UpdateWorldBountyStage from './UpdateWorldBountyStage'
import UpdateMintPastWorldStage from './UpdateMintPastWorldStage'
import UpdateMintPresentWorldStage from './UpdateMintPresentWorldStage'
import UpdateUriStage from './UpdateUriStage'
import UpdateSponsorMediaStage from './UpdateSponsorMediaStage'
import SponsorTagStage from './SponsorTagStage'
import UpdateTagRegistrationStage from './UpdateTagRegistrationStage'
import UpdateTransferToNoteReceivableStage from './UpdateTransferToNoteReceivableStage'
import UpdateBountyStage from './UpdateBountyStage'
import UpdateProfileStage from './UpdateProfileStage'
import VoteStage from './VoteStage'
import ClaimNoteStage from './ClaimNoteStage'
import AutoChargeStage from './AutoChargeStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import UpdateDevStage from './UpdateDevStage'
import UpdateAdminStage from './UpdateAdminStage'
import DeleteStage from './DeleteStage'
import DeleteRampStage from './DeleteRampStage'
import UpdateDiscountDivisorStage from './UpdateDiscountDivisorStage'
import UpdatePenaltyDivisorStage from './UpdatePenaltyDivisorStage'
import LocationStage from './LocationStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_ADMIN]: t('Update Admin'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Bounty Required'),
  [LockStage.UPDATE_PROTOCOL]: t('Update Protocol'),
  [LockStage.VOTE]: t('Vote'),
  [LockStage.UPDATE_AUTOCHARGE]: t('Update Autocharge'),
  [LockStage.UPDATE_TAX_CONTRACT]: t('Update Tax Contract'),
  [LockStage.ADMIN_AUTOCHARGE]: t('Pay Due Receivable'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.UPDATE_DISCOUNT_DIVISOR]: t('Update Discount Divisor'),
  [LockStage.UPDATE_PENALTY_DIVISOR]: t('Update Penalty Divisor'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Protocol'),
  [LockStage.UPDATE_BOUNTY]: t('Update Bounty'),
  [LockStage.UPDATE_TOKEN_IDS]: t('Update Token IDs'),
  [LockStage.TRANSFER_RECEIVABLE_TO_NOTE]: t('Transfer Note'),
  [LockStage.CLAIM_NOTE]: t('Claim Note'),
  [LockStage.UPDATE_TAG_REGISTRATION]: t('Update Tag Registration'),
  [LockStage.CLAIM_TOKEN_SPONSOR_FUND]: t('Claim Pending From Sponsor'),
  [LockStage.UPDATE_SPONSOR_MEDIA]: t('Update Sponsor Media'),
  [LockStage.UPDATE_CODE_INFO]: t('Update Code Info'),
  [LockStage.UPDATE_CATEGORY]: t('Update Category'),
  [LockStage.UPDATE_PRICE_PER_MINUTES]: t('Update Price Per Minute'),
  [LockStage.UPDATE_EXCLUDED_CONTENT]: t('Update Excluded Content'),
  [LockStage.UPDATE_WORLD_BOUNTY]: t('Update World Bounty'),
  [LockStage.MINT_PAST_WORLD]: t('Mint Past World'),
  [LockStage.MINT_PRESENT_WORLD]: t('Mint World'),
  [LockStage.UPDATE_URI_GENERATOR]: t('Update URI Generator'),
  [LockStage.SPONSOR_TAG]: t('Sponsor Tag'),
  [LockStage.UPDATE_DEV]: t('Update Contract Owner'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_SPONSOR_TAG]: t('Back'),
  [LockStage.CONFIRM_UPDATE_URI_GENERATOR]: t('Back'),
  [LockStage.CONFIRM_MINT_PRESENT_WORLD]: t('Back'),
  [LockStage.CONFIRM_MINT_PAST_WORLD]: t('Back'),
  [LockStage.CONFIRM_UPDATE_WORLD_BOUNTY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTES]: t('Back'),
  [LockStage.CONFIRM_UPDATE_CATEGORY]: t('Back'),
  [LockStage.CONFIRM_CLAIM_PENDING]: t('Back'),
  [LockStage.CONFIRM_UPDATE_CODE_INFO]: t('Back'),
  [LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA]: t('Back'),
  [LockStage.CONFIRM_CLAIM_TOKEN_SPONSOR_FUND]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAG_REGISTRATION]: t('Back'),
  [LockStage.CONFIRM_CLAIM_NOTE]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_RECEIVABLE_TO_NOTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TOKEN_IDS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DEV]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ADMIN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAX_CONTRACT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_ADMIN_AUTOCHARGE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_PROTOCOL]: t('Back'),
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
  currency,
  currAccount,
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
  const stakingTokenContract = useERC20(currency?.address || router.query?.userCurrency || '')
  const worldContract = useWorldContract(pool?.worldAddress || router.query.world || '')
  const worldNoteContract = useWorldNote()
  const worldHelperContract = useWorldHelper()
  const worldHelper2Contract = useWorldHelper2()
  const worldHelper3Contract = useWorldHelper3()
  console.log('mcurrencyy===============>', currAccount, currency, pool, worldContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  // console.log("router===================>", router)
  // const { state: status, userAccount, session_id, userCurrency, amount } = router.query
  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    amountPayable: '',
    taxAddress: '',
    toAddress: '',
    numPeriods: '',
    category: 0,
    contentType: '',
    uriGenerator: '',
    nfts: '',
    first4: '',
    last4: '',
    planet: '',
    amountReceivable: getBalanceNumber(currAccount?.amountReceivable ?? 0, currAccount?.token?.decimals),
    periodReceivable: parseInt(currAccount?.periodReceivable ?? '0') / 60,
    startReceivable: currAccount?.startReceivable,
    description: currAccount?.description,
    rating: currAccount?.description ?? '',
    media: pool?.media,
    identityTokenId: '0',
    protocolId: currAccount?.protocolId ?? '0',
    autoCharge: 0,
    like: 0,
    add: 0,
    optionId: currAccount?.optionId ?? '0',
    decimals: currAccount?.token?.decimals ?? currency?.decimals ?? 18,
    factor: '',
    period: '',
    cap: '',
    message: '',
    world: pool?.id,
    ve: pool?._ve,
    token: currency?.address,
    name: pool?.name,
    applicationLink: pool?.world?.applicationLink,
    accounts: currAccount?.id,
    customTags: '',
    // owner: currAccount?.owner || account
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
  const handleRawValueChange = (key: any) => (value: any) => {
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
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_AUTOCHARGE:
        setStage(LockStage.UPDATE_AUTOCHARGE)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAX_CONTRACT:
        setStage(LockStage.UPDATE_TAX_CONTRACT)
        break
      case LockStage.UPDATE_TOKEN_IDS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TOKEN_IDS:
        setStage(LockStage.UPDATE_TOKEN_IDS)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_ADMIN:
        setStage(LockStage.UPDATE_ADMIN)
        break
      case LockStage.UPDATE_DEV:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DEV:
        setStage(LockStage.UPDATE_DEV)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BOUNTY:
        setStage(LockStage.UPDATE_BOUNTY)
        break
      case LockStage.ADMIN_AUTOCHARGE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADMIN_AUTOCHARGE:
        setStage(LockStage.ADMIN_AUTOCHARGE)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROTOCOL:
        setStage(LockStage.UPDATE_PROTOCOL)
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
      case LockStage.CONFIRM_TRANSFER_RECEIVABLE_TO_NOTE:
        setStage(LockStage.TRANSFER_RECEIVABLE_TO_NOTE)
        break
      case LockStage.TRANSFER_RECEIVABLE_TO_NOTE:
        setStage(LockStage.ADMIN_SETTINGS)
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
      case LockStage.CONFIRM_CLAIM_NOTE:
        setStage(LockStage.CLAIM_NOTE)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SPONSOR_TAG:
        setStage(LockStage.SPONSOR_TAG)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAG_REGISTRATION:
        setStage(LockStage.UPDATE_TAG_REGISTRATION)
        break
      case LockStage.UPDATE_TAG_REGISTRATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_CODE_INFO:
        setStage(LockStage.UPDATE_CODE_INFO)
        break
      case LockStage.UPDATE_CODE_INFO:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_PENDING:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.CONFIRM_UPDATE_CATEGORY:
        setStage(LockStage.UPDATE_CATEGORY)
        break
      case LockStage.UPDATE_CATEGORY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTES:
        setStage(LockStage.UPDATE_PRICE_PER_MINUTES)
        break
      case LockStage.UPDATE_PRICE_PER_MINUTES:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_WORLD_BOUNTY:
        setStage(LockStage.UPDATE_WORLD_BOUNTY)
        break
      case LockStage.UPDATE_WORLD_BOUNTY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_MINT_PAST_WORLD:
        setStage(LockStage.MINT_PAST_WORLD)
        break
      case LockStage.MINT_PAST_WORLD:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_MINT_PRESENT_WORLD:
        setStage(LockStage.MINT_PRESENT_WORLD)
        break
      case LockStage.MINT_PRESENT_WORLD:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_URI_GENERATOR:
        setStage(LockStage.UPDATE_URI_GENERATOR)
        break
      case LockStage.UPDATE_URI_GENERATOR:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_TOKEN_SPONSOR_FUND:
        setStage(LockStage.CLAIM_TOKEN_SPONSOR_FUND)
        break
      case LockStage.CLAIM_TOKEN_SPONSOR_FUND:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
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
      case LockStage.UPDATE_AUTOCHARGE:
        setStage(LockStage.CONFIRM_UPDATE_AUTOCHARGE)
        break
      case LockStage.UPDATE_TAX_CONTRACT:
        setStage(LockStage.CONFIRM_UPDATE_TAX_CONTRACT)
        break
      case LockStage.UPDATE_TOKEN_IDS:
        setStage(LockStage.CONFIRM_UPDATE_TOKEN_IDS)
        break
      case LockStage.UPDATE_DEV:
        setStage(LockStage.CONFIRM_UPDATE_DEV)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.CONFIRM_UPDATE_ADMIN)
        break
      case LockStage.UPDATE_CODE_INFO:
        setStage(LockStage.CONFIRM_UPDATE_CODE_INFO)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.CLAIM_TOKEN_SPONSOR_FUND:
        setStage(LockStage.CONFIRM_CLAIM_TOKEN_SPONSOR_FUND)
        break
      case LockStage.VOTE:
        setStage(LockStage.CONFIRM_VOTE)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.CONFIRM_DELETE_PROTOCOL)
        break
      case LockStage.TRANSFER_RECEIVABLE_TO_NOTE:
        setStage(LockStage.CONFIRM_TRANSFER_RECEIVABLE_TO_NOTE)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.CONFIRM_CLAIM_NOTE)
        break
      case LockStage.UPDATE_TAG_REGISTRATION:
        setStage(LockStage.CONFIRM_UPDATE_TAG_REGISTRATION)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.CONFIRM_SPONSOR_TAG)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.ADMIN_AUTOCHARGE:
        setStage(LockStage.CONFIRM_ADMIN_AUTOCHARGE)
        break
      case LockStage.UPDATE_PENALTY_DIVISOR:
        setStage(LockStage.CONFIRM_UPDATE_PENALTY_DIVISOR)
        break
      case LockStage.UPDATE_DISCOUNT_DIVISOR:
        setStage(LockStage.CONFIRM_UPDATE_DISCOUNT_DIVISOR)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_CATEGORY:
        setStage(LockStage.CONFIRM_UPDATE_CATEGORY)
        break
      case LockStage.UPDATE_PRICE_PER_MINUTES:
        setStage(LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTES)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_WORLD_BOUNTY:
        setStage(LockStage.CONFIRM_UPDATE_WORLD_BOUNTY)
        break
      case LockStage.MINT_PAST_WORLD:
        setStage(LockStage.CONFIRM_MINT_PAST_WORLD)
        break
      case LockStage.MINT_PRESENT_WORLD:
        setStage(LockStage.CONFIRM_MINT_PRESENT_WORLD)
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
        return requiresApproval(stakingTokenContract, account, worldContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [worldContract.address, MaxUint256])
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
        return callWithGasPrice(worldNoteContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        let args
        try {
          const amountReceivable = getDecimalAmount(new BigNumber(state.amountReceivable), currency.decimals)
          const startReceivable = Math.max(
            differenceInSeconds(new Date(state.startReceivable), new Date(), {
              roundingMethod: 'ceil',
            }),
            0,
          )
          args = [
            state.owner,
            currency.address,
            [amountReceivable.toString(), state.periodReceivable, startReceivable.toString(), state.optionId],
            state.identityTokenId,
            state.protocolId,
            state.rating,
            state.media.toString(),
            state.description,
          ]
        } catch (err) {
          console.log('CONFIRM_UPDATE_PROTOCOL===============>', err)
        }
        console.log('CONFIRM_UPDATE_PROTOCOL===============>', worldContract, args)
        return callWithGasPrice(worldContract, 'updateProtocol', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_ADMIN) {
        return callWithGasPrice(worldContract, 'updateAdmin', [state.owner, !!state.add]).catch((err) =>
          console.log('CONFIRM_UPDATE_ADMIN===============>', err, worldContract),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DEV) {
        return callWithGasPrice(worldContract, 'updateDev', [state.owner]).catch((err) =>
          console.log('CONFIRM_UPDATE_DEV===============>', err, worldContract),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY) {
        return callWithGasPrice(worldContract, 'updateBounty', [state.bountyId, state.tokenId]).catch((err) =>
          console.log('CONFIRM_UPDATE_BOUNTY===============>', err, worldContract),
        )
      }
      if (stage === LockStage.CONFIRM_ADMIN_AUTOCHARGE) {
        return callWithGasPrice(worldContract, 'autoCharge', [state.accounts?.split(','), state.numPeriods]).catch(
          (err) => console.log('CONFIRM_ADMIN_AUTOCHARGE===============>', err, worldContract),
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
        return callWithGasPrice(worldContract, 'updateDiscountDivisor', args).catch((err) =>
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
        return callWithGasPrice(worldContract, 'updatePenaltyDivisor', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PENALTY_DIVISOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(new BigNumber(state.amountPayable), currency.decimals)
        return callWithGasPrice(worldContract, 'withdraw', [currency.address, amount.toString()]).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        console.log('CONFIRM_DELETE_PROTOCOL===============>', [state.protocolId])
        return callWithGasPrice(worldContract, 'deleteProtocol', [state.protocolId]).catch((err) =>
          console.log('CONFIRM_DELETE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_RECEIVABLE_TO_NOTE) {
        const args = [pool?.worldAddress, state.toAddress, state.tokenId, state.numPeriods]
        console.log('CONFIRM_TRANSFER_RECEIVABLE_TO_NOTE==============>', args)
        return callWithGasPrice(worldHelper3Contract, 'transferDueToNoteReceivable', args).catch((err) =>
          console.log('CONFIRM_TRANSFER_RECEIVABLE_TO_NOTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
        const args = [state.tokenId]
        return callWithGasPrice(worldHelper3Contract, 'claimPendingRevenueFromNote', args).catch((err) =>
          console.log('CONFIRM_CLAIM_NOTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAG_REGISTRATION) {
        const args = [state.tag, !!state.add]
        return callWithGasPrice(worldHelperContract, 'updateTagRegistration', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TAG_REGISTRATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SPONSOR_TAG) {
        const amount = getDecimalAmount(new BigNumber(state.amountReceivable), currency.decimals)
        const args = [state.sponsor, state.world, amount.toString(), state.tag, state.message]
        return callWithGasPrice(worldHelperContract, 'sponsorTag', args).catch((err) =>
          console.log('CONFIRM_SPONSOR_TAG===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_CODE_INFO) {
        const args = [state.world, state.accounts?.split(','), state.rating]
        return callWithGasPrice(worldHelperContract, 'updateCodeInfo', args).catch((err) =>
          console.log('CONFIRM_UPDATE_CODE_INFO===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA) {
        const args = [state.protocolId, state.tag]
        return callWithGasPrice(worldHelperContract, 'updateSponsorMedia', args).catch((err) =>
          console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_TOKEN_SPONSOR_FUND) {
        const args = [state.tokenId]
        console.log('CONFIRM_CLAIM_TOKEN_SPONSOR_FUND===============>', args)
        return callWithGasPrice(worldHelperContract, 'claimPendingRevenueFromTokenId', args).catch((err) =>
          console.log('CONFIRM_CLAIM_TOKEN_SPONSOR_FUND===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_PENDING) {
        return callWithGasPrice(worldHelperContract, 'claimPendingRevenue', []).catch((err) =>
          console.log('CONFIRM_CLAIM_PENDING===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_CATEGORY) {
        const args = [state.world, state.category + 1]
        return callWithGasPrice(worldHelper2Contract, 'updateCategory', args).catch((err) =>
          console.log('CONFIRM_UPDATE_CATEGORY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTES) {
        const amount = getDecimalAmount(new BigNumber(state.amountReceivable), currency.decimals)
        const args = [amount.toString()]
        return callWithGasPrice(worldHelper3Contract, 'updatePricePerAttachMinutes', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PRICE_PER_MINUTES===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT) {
        const args = [state.tag, state.contentType, !!state.add]
        return callWithGasPrice(worldHelper3Contract, 'updateExcludedContent', args).catch((err) =>
          console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_WORLD_BOUNTY) {
        const args = [state.world, state.bountyId]
        console.log('CONFIRM_UPDATE_WORLD_BOUNTY===============>', args)
        return callWithGasPrice(worldHelper2Contract, 'updateBounty', args).catch((err) =>
          console.log('CONFIRM_UPDATE_WORLD_BOUNTY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MINT_PAST_WORLD) {
        try {
          const startReceivable = Math.max(
            differenceInSeconds(new Date(state.startReceivable ?? 0), new Date(0), {
              roundingMethod: 'ceil',
            }),
            0,
          )
          const args = [
            state.toAddress,
            state.world,
            startReceivable.toString(),
            state.planet,
            state.first4
              ?.split(',')
              ?.map((first4) => [
                first4[0]?.toLowerCase(),
                first4[1]?.toLowerCase(),
                first4[2]?.toLowerCase(),
                first4[3]?.toLowerCase(),
              ]),
            state.last4
              ?.split(',')
              ?.map((last4) => [
                last4[0]?.toLowerCase(),
                last4[1]?.toLowerCase(),
                last4[2]?.toLowerCase(),
                last4[3]?.toLowerCase(),
              ]),
            state.nfts?.split(',')?.map((nft) => [nft?.toLowerCase()]),
          ]
          console.log('CONFIRM_MINT_PAST_WORLD===============>', args)
          return callWithGasPrice(worldHelper2Contract, 'mintPastWorld', args).catch((err) =>
            console.log('CONFIRM_MINT_PAST_WORLD===============>', state.startReceivable, err),
          )
        } catch (err) {
          console.log('1CONFIRM_MINT_PAST_WORLD===============>', err)
        }
      }
      if (stage === LockStage.CONFIRM_MINT_PRESENT_WORLD) {
        try {
          const args = [
            state.toAddress,
            state.world,
            state.planet,
            state.first4
              ?.split(',')
              ?.map((first4) => [
                first4[0]?.toLowerCase(),
                first4[1]?.toLowerCase(),
                first4[2]?.toLowerCase(),
                first4[3]?.toLowerCase(),
              ]),
            state.last4
              ?.split(',')
              ?.map((last4) => [
                last4[0]?.toLowerCase(),
                last4[1]?.toLowerCase(),
                last4[2]?.toLowerCase(),
                last4[3]?.toLowerCase(),
              ]),
            state.nfts?.split(',')?.map((nft) => [nft?.toLowerCase()]),
          ]
          console.log('CONFIRM_MINT_PRESENT_WORLD===============>', args)
          return callWithGasPrice(worldHelper2Contract, 'batchMint', args).catch((err) =>
            console.log('CONFIRM_MINT_PRESENT_WORLD===============>', args, err),
          )
        } catch (err) {
          console.log('1CONFIRM_MINT_PRESENT_WORLD===============>', err)
        }
      }
      if (stage === LockStage.CONFIRM_UPDATE_URI_GENERATOR) {
        const args = [state.world, state.uriGenerator]
        console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', args)
        return callWithGasPrice(worldHelper2Contract, 'updateUriGenerator', args).catch((err) =>
          console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        console.log('CONFIRM_DELETE===============>', [pool?.id])
        return callWithGasPrice(worldNoteContract, 'deleteWorld', [pool?.id]).catch((err) =>
          console.log('CONFIRM_DELETE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_AUTOCHARGE) {
        console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', [!!state.autoCharge, state.tokenId])
        return callWithGasPrice(worldContract, 'updateAutoCharge', [!!state.autoCharge, state.tokenId]).catch((err) =>
          console.log('CONFIRM_UPDATE_AUTOCHARGE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAX_CONTRACT) {
        return callWithGasPrice(worldContract, 'updateTaxContract', [state.taxAddress]).catch((err) =>
          console.log('CONFIRM_UPDATE_TAX_CONTRACT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_IDS) {
        return callWithGasPrice(worldContract, 'updateTokenIds', [state.accounts?.split(','), !!state.add]).catch(
          (err) => console.log('CONFIRM_UPDATE_TOKEN_IDS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_VOTE) {
        return callWithGasPrice(worldNoteContract, 'vote', [state.world, !!state.like]).catch((err) =>
          console.log('CONFIRM_VOTE===============>', err),
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
            <LinkExternal color="success" href={pool.auditor?.applicationLink} bold>
              {t('APPLY FOR AN AUDIT')}
            </LinkExternal>
          </Flex>
          <Button mb="8px" variant="text" onClick={() => setStage(LockStage.ADMIN_AUTOCHARGE)}>
            {t('PAY DUE RECEIVABLE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.VOTE)}>
            {t('VOTE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.SPONSOR_TAG)}>
            {t('SPONSOR TAG')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_AUTOCHARGE)}>
            {t('UPDATE AUTOCHARGE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_TAX_CONTRACT)}>
            {t('UPDATE TAX CONTRACT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_TOKEN_IDS)}>
            {t('UPDATE TOKEN IDS')}
          </Button>
          {/* <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY)}>
            {t('UPDATE BOUNTY')}
          </Button> */}
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.UPDATE_SPONSOR_MEDIA)}>
            {t('UPDATE SPONSOR MEDIA')}
          </Button>
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.CLAIM_TOKEN_SPONSOR_FUND)}>
            {t('CLAIM TOKEN SPONSOR FUND')}
          </Button>
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.CLAIM_NOTE)}>
            {t('CLAIM NOTE')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_PROTOCOL)}>
            {t('CREATE/UPDATE ACCOUNT')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.MINT_PAST_WORLD)}>
            {t('MINT PAST WORLD')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.MINT_PRESENT_WORLD)}>
            {t('MINT WORLD')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          <Button mb="8px" variant="text" onClick={() => setStage(LockStage.UPDATE_WORLD_BOUNTY)}>
            {t('UPDATE WORLD BOUNTY')}
          </Button>
          {/* <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PARAMETERS)}>
            {t('UPDATE BOUNTY REQUIRED')}
          </Button> */}
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_CODE_INFO)}>
            {t('UPDATE CODE NFO')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_CATEGORY)}>
            {t('UPDATE CATEGORY')}
          </Button>
          <Button mb="8px" variant="text" onClick={() => setStage(LockStage.ADMIN_AUTOCHARGE)}>
            {t('PAY DUE RECEIVABLE')}
          </Button>
          <Button mb="8px" variant="subtle" onClick={() => setStage(LockStage.UPDATE_DISCOUNT_DIVISOR)}>
            {t('UPDATE DISCOUNT DIVISOR')}
          </Button>
          <Button mb="8px" variant="subtle" onClick={() => setStage(LockStage.UPDATE_PENALTY_DIVISOR)}>
            {t('UPDATE PENALTY DIVISOR')}
          </Button>
          <Button mb="8px" variant="subtle" onClick={() => setStage(LockStage.TRANSFER_RECEIVABLE_TO_NOTE)}>
            {t('TRANSFER RECEIVABLE TO NOTE')}
          </Button>
          <Button mb="8px" variant="text" onClick={() => setStage(LockStage.UPDATE_ADMIN)}>
            {t('UPDATE ADMIN')}
          </Button>
          <Button mb="8px" variant="tertiary" onClick={() => setStage(LockStage.UPDATE_DEV)}>
            {t('UPDATE CONTRACT OWNER')}
          </Button>
          {/* <Button mb="8px" variant="tertiary" onClick={() => setStage(LockStage.UPDATE_BOUNTY)}>
            {t('UPDATE BOUNTY')}
          </Button> */}
          <Button mb="8px" variant="text" onClick={() => setStage(LockStage.UPDATE_TAG_REGISTRATION)}>
            {t('UPDATE TAG REGISTRATION')}
          </Button>
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.UPDATE_PRICE_PER_MINUTES)}>
            {t('UPDATE PRICE PER MINUTES')}
          </Button>
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.UPDATE_EXCLUDED_CONTENT)}>
            {t('UPDATE EXCLUDED CONTENT')}
          </Button>
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.UPDATE_URI_GENERATOR)}>
            {t('UPDATE URI GENERATOR')}
          </Button>
          <Button mb="8px" variant="text" onClick={() => setStage(LockStage.UPDATE_SPONSOR_MEDIA)}>
            {t('UPDATE SPONSOR MEDIA')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.CLAIM_TOKEN_SPONSOR_FUND)}>
            {t('CLAIM TOKEN SPONSOR FUND')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.CONFIRM_CLAIM_PENDING)}>
            {t('CONFIRM CLAIM PENDING')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE_PROTOCOL)}>
            {t('DELETE PROTOCOL')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE)}>
            {t('DELETE WORLD')}
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
      {stage === LockStage.UPDATE_DEV && (
        <UpdateDevStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_ADMIN && (
        <UpdateAdminStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PARAMETERS && (
        <UpdateParametersStage
          state={state}
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
      {stage === LockStage.UPDATE_TAG_REGISTRATION && (
        <UpdateTagRegistrationStage
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
      {stage === LockStage.TRANSFER_RECEIVABLE_TO_NOTE && (
        <UpdateTransferToNoteReceivableStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CLAIM_NOTE && (
        <ClaimNoteStage
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
      {stage === LockStage.UPDATE_PROTOCOL && (
        <UpdateProtocolStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_TOKEN_IDS && (
        <UpdateTokenIdsStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_BOUNTY && (
        <UpdateBountyStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_PROFILE_ID && <UpdateProfileStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.ADMIN_AUTOCHARGE && (
        <AutoChargeStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
      {stage === LockStage.CLAIM_TOKEN_SPONSOR_FUND && (
        <ClaimNoteFromSponsorStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_CODE_INFO && (
        <UpdateCodeInfoStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_CATEGORY && (
        <UpdateCategoryStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PRICE_PER_MINUTES && (
        <UpdatePricePerMinuteStage
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
      {stage === LockStage.UPDATE_WORLD_BOUNTY && (
        <UpdateWorldBountyStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.MINT_PAST_WORLD && (
        <UpdateMintPastWorldStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.MINT_PRESENT_WORLD && (
        <UpdateMintPresentWorldStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_URI_GENERATOR && (
        <UpdateUriStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_PROTOCOL && <DeleteRampStage continueToNextStage={continueToNextStage} />}
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
