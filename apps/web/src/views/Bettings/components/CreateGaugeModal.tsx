import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  useERC20,
  useBettingContract,
  useBettingMinter,
  useBettingHelper,
  useErc721CollectionContract,
} from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useMemo, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { combineDateAndTime } from 'views/ReferralsVoting/CreateProposal/helpers'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { encodeAlphabet } from 'views/Betting/components/BuyTicketsModal/generateTicketNumbers'
import { useGetTokenForCredit } from 'state/bettings/hooks'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateParametersStage from './UpdateParametersStage'
import InjectFundsStage from './InjectFundsStage'
import UpdateSponsorMediaStage from './UpdateSponsorMediaStage'
import UpdateAdminStage from './UpdateAdminStage'
import UpdateUriStage from './UpdateUriStage'
import UpdatePartnerEventStage from './UpdatePartnerEventStage'
import UpdateMembershipStage from './UpdateMembershipStage'
import BuyTicketStage from './BuyTicketStage'
import BurnStage from './BurnStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import UpdateBurnForCreditStage from './UpdateBurnForCreditStage'
import BurnForCreditStage from './BurnForCreditStage'
import RegisterTagStage from './RegisterTagStage'
import UpdatePricePerMinuteStage from './UpdatePricePerMinuteStage'
import UpdateExcludedContentStage from './UpdateExcludedContentStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import SponsorTagStage from './SponsorTagStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import WithdrawStage from './WithdrawStage'
import DeleteStage from './DeleteStage'
import DeleteBettingEventStage from './DeleteBettingEventStage'
import SetBettingResultStage from './SetBettingResultStage'
import ClaimTicketStage from './ClaimTicketStage'
import CloseBettingStage from './CloseBettingStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.CLOSE_BETTING]: t('Close Betting Event'),
  [LockStage.USER_WITHDRAW]: t('Withdraw'),
  [LockStage.UPDATE_PROTOCOL]: t('Create/Update Event'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.BUY_TICKETS]: t('Buy Tickets'),
  [LockStage.UPDATE_PARTNER_EVENT]: t('Update Partner Event'),
  [LockStage.UPDATE_MEMBERSHIP_PARAMETERS]: t('Update Membership Parameters'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT]: t('Update Burn For Credit'),
  [LockStage.BURN_FOR_CREDIT]: t('Burn For Credit'),
  [LockStage.DELETE]: t('Delete Contract'),
  [LockStage.BURN]: t('Burn'),
  [LockStage.UPDATE_ADMIN]: t('Update Admin'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.CLAIM_TICKETS]: t('Claim Tickets'),
  [LockStage.UPDATE_SPONSOR_MEDIA]: t('Update Sponsor Media'),
  [LockStage.SET_BETTING_RESULTS]: t('Set Betting Results'),
  [LockStage.UPDATE_PRICE_PER_MINUTE]: t('Update Price Per Minute'),
  [LockStage.UPDATE_EXCLUDED_CONTENT]: t('Update Excluded Content'),
  [LockStage.SPONSOR_TAG]: t('Sponsor Tag'),
  [LockStage.INJECT_FUNDS]: t('Inject Funds'),
  [LockStage.REGISTER_TAG]: t('Register To Tag'),
  [LockStage.UPDATE_URI_GENERATOR]: t('Update URI Generator'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Protocol'),
  [LockStage.CONFIRM_CLAIM_TICKETS]: t('Back'),
  [LockStage.CONFIRM_BUY_TICKETS]: t('Back'),
  [LockStage.CONFIRM_BURN_FOR_CREDIT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA]: t('Back'),
  [LockStage.CONFIRM_SET_BETTING_RESULTS]: t('Back'),
  [LockStage.CONFIRM_CLOSE_BETTING]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_USER_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT]: t('Back'),
  [LockStage.CONFIRM_BURN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARTNER_EVENT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MEMBERSHIP_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ADMIN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_REGISTER_TAG]: t('Back'),
  [LockStage.CONFIRM_UPDATE_URI_GENERATOR]: t('Back'),
  [LockStage.CONFIRM_SPONSOR_TAG]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT]: t('Back'),
  [LockStage.CONFIRM_INJECT_FUNDS]: t('Back'),
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
  const [stage, setStage] = useState(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const bettingContract = useBettingContract(pool?.id || router.query.betting || '')
  const bettingMinterContract = useBettingMinter()
  const bettingHelperContract = useBettingHelper()
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  console.log('mcurrencyy===============>', currAccount, currency, pool, bettingContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  const [state, setState] = useState<any>(() => ({
    owner: pool?.owner,
    partnerPaywall: '',
    callsInterval: '',
    times: '',
    bettingId2: '',
    avatar: pool?.collection?.avatar,
    collectionId: pool?.collectionId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    newMinTicketNumber: pool?.newMinTicketNumber,
    newTicketRange: pool?.newTicketRange,
    ticketSize: currAccount?.ticketSize,
    ticketId: '',
    betting: pool?.id ?? '',
    amountPayable: '',
    amountReceivable: getBalanceNumber(currAccount?.pricePerTicket ?? 0, currency?.decimals),
    periodReceivable: currAccount?.bracketDuration ?? '',
    startReceivable: convertTimeToSeconds(currAccount?.startReceivable ?? 0),
    description: currAccount?.description ?? '',
    media: currAccount?.media ?? '',
    identityTokenId: '0',
    discountDivisor: parseInt(currAccount?.discountDivisor || '0') / 100,
    adminShare: currAccount?.adminShare ?? '',
    referrerShare: currAccount?.referrerShare ?? '',
    ticketNumbers: '',
    rewardsBreakdown: currAccount?.rewardsBreakdown?.toString() ?? '',
    pricePerMinute: '',
    action: '',
    item: '',
    discount: '',
    destination: '',
    checker: '',
    clear: 0,
    alphabetEncoding: 0,
    tag: '',
    message: '',
    sponsor: '',
    bettingId: currAccount?.bettingId ?? '0',
    subjects: currAccount?.subjects ?? '',
    uriGenerator: '',
    token: currency?.address,
    startTime: '',
    add: 0,
    contentType: '',
    period: '0',
    numberOfPeriods: currAccount?.numberOfPeriods ?? '0',
    name: pool?.name,
    finalNumbers: '',
    fungible: 0,
    brackets: '',
    bettingProfileId: '',
    decimals: currency?.decimals,
    // owner: currAccount?.owner || account
  }))
  const { data: burnForCreditTokens } = useGetTokenForCredit(pool?.id) as any
  const burnForCreditToken = useMemo(
    () => burnForCreditTokens?.length > state.position && burnForCreditTokens[state.position],
    [burnForCreditTokens, state.position],
  )
  const tokenContract = useErc721CollectionContract(burnForCreditToken?.token?.address || '')

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
      case LockStage.INJECT_FUNDS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_INJECT_FUNDS:
        setStage(LockStage.INJECT_FUNDS)
        break
      case LockStage.CLOSE_BETTING:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLOSE_BETTING:
        setStage(LockStage.CLOSE_BETTING)
        break
      case LockStage.BURN:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BURN:
        setStage(LockStage.BURN)
        break
      case LockStage.UPDATE_PARTNER_EVENT:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PARTNER_EVENT:
        setStage(LockStage.UPDATE_PARTNER_EVENT)
        break
      case LockStage.UPDATE_MEMBERSHIP_PARAMETERS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MEMBERSHIP_PARAMETERS:
        setStage(LockStage.UPDATE_MEMBERSHIP_PARAMETERS)
        break
      case LockStage.REGISTER_TAG:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_REGISTER_TAG:
        setStage(LockStage.REGISTER_TAG)
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
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
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
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROTOCOL:
        setStage(LockStage.UPDATE_PROTOCOL)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_ADMIN:
        setStage(LockStage.UPDATE_ADMIN)
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
      case LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT:
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
      case LockStage.CONFIRM_USER_WITHDRAW:
        setStage(LockStage.USER_WITHDRAW)
        break
      case LockStage.USER_WITHDRAW:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BUY_TICKETS:
        setStage(LockStage.BUY_TICKETS)
        break
      case LockStage.BUY_TICKETS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_TICKETS:
        setStage(LockStage.CLAIM_TICKETS)
        break
      case LockStage.CLAIM_TICKETS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SET_BETTING_RESULTS:
        setStage(LockStage.SET_BETTING_RESULTS)
        break
      case LockStage.SET_BETTING_RESULTS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BURN_FOR_CREDIT:
        setStage(LockStage.BURN_FOR_CREDIT)
        break
      case LockStage.BURN_FOR_CREDIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.BURN:
        setStage(LockStage.CONFIRM_BURN)
        break
      case LockStage.UPDATE_PARTNER_EVENT:
        setStage(LockStage.CONFIRM_UPDATE_PARTNER_EVENT)
        break
      case LockStage.UPDATE_MEMBERSHIP_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_MEMBERSHIP_PARAMETERS)
        break
      case LockStage.CLOSE_BETTING:
        setStage(LockStage.CONFIRM_CLOSE_BETTING)
        break
      case LockStage.BUY_TICKETS:
        setStage(LockStage.CONFIRM_BUY_TICKETS)
        break
      case LockStage.USER_WITHDRAW:
        setStage(LockStage.CONFIRM_USER_WITHDRAW)
        break
      case LockStage.SET_BETTING_RESULTS:
        setStage(LockStage.CONFIRM_SET_BETTING_RESULTS)
        break
      case LockStage.CLAIM_TICKETS:
        setStage(LockStage.CONFIRM_CLAIM_TICKETS)
        break
      case LockStage.UPDATE_PRICE_PER_MINUTE:
        setStage(LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.CONFIRM_SPONSOR_TAG)
        break
      case LockStage.REGISTER_TAG:
        setStage(LockStage.CONFIRM_REGISTER_TAG)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.CONFIRM_DELETE_PROTOCOL)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.CONFIRM_UPDATE_ADMIN)
        break
      case LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT)
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
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_URI_GENERATOR:
        setStage(LockStage.CONFIRM_UPDATE_URI_GENERATOR)
        break
      case LockStage.BURN_FOR_CREDIT:
        setStage(LockStage.CONFIRM_BURN_FOR_CREDIT)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.INJECT_FUNDS:
        setStage(LockStage.CONFIRM_INJECT_FUNDS)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, bettingContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [bettingContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start processing your transactions!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_SET_BETTING_RESULTS) {
        const args = [
          state.bettingId,
          state.identityTokenId,
          state.finalNumbers
            ?.split(',')
            ?.filter((fn) => !!fn)
            ?.map((fn) => encodeAlphabet(fn, currAccount?.ticketSize)),
        ]
        console.log('CONFIRM_SET_BETTING_RESULTS===============>', args)
        return callWithGasPrice(bettingContract, 'setBettingResults', args).catch((err) =>
          console.log('CONFIRM_SET_BETTING_RESULTS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const time = combineDateAndTime(state.startReceivable, state.startTime)
        const startReceivable = Math.max(Number(time) - Number(Date.now() / 1000), 0)
        const rewardsBreakdown = Array.from({ length: parseInt(currAccount?.ticketSize ?? '6') - 1 }, (v, i) => 0)
        const args = [
          currency?.address,
          !!state.alphabetEncoding,
          parseInt(startReceivable.toString()),
          state.numberOfPeriods,
          state.bettingId,
          [
            parseFloat(state.adminShare) * 100,
            parseFloat(state.referrerShare) * 100,
            parseFloat(state.periodReceivable) * 60,
            amountReceivable.toString(),
            parseFloat(state.discountDivisor) * 100,
          ],
          [...rewardsBreakdown, 10000],
          // state.rewardsBreakdown
          //   ?.split(',')
          //   ?.map((rwb) => rwb?.trim())
          //   .map((rwb) => parseInt(rwb) * 100),
          state.action,
          state.media,
          state.description,
          state.subjects,
        ]
        console.log('CONFIRM_UPDATE_PROTOCOL===============>', bettingContract, args)
        return callWithGasPrice(bettingContract, 'updateBettingEvent', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const padding = Array.from({ length: parseInt(currAccount?.ticketSize ?? '6') }, (v, i) => i?.toString())
        const newMinTicketNumber = ['1', ...padding]
        const newTicketRange = Array.from({ length: parseInt(currAccount?.ticketSize ?? '6') }, (v, i) => '9')
        const args = [state.collectionId, newMinTicketNumber?.join(''), newTicketRange?.join(''), state.ticketSize]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(bettingContract, 'updateParameters', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_MEMBERSHIP_PARAMETERS) {
        const args = [state.betting, state.partnerPaywall, state.times, state.callsInterval]
        console.log('CONFIRM_UPDATE_MEMBERSHIP_PARAMETERS===============>', args)
        return callWithGasPrice(bettingHelperContract, 'updateMembershipParams', args).catch((err) =>
          console.log('CONFIRM_UPDATE_MEMBERSHIP_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARTNER_EVENT) {
        const args = [state.bettingId, state.bettingId2]
        console.log('CONFIRM_UPDATE_PARTNER_EVENT===============>', args)
        return callWithGasPrice(bettingContract, 'updatePartnerEvent', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARTNER_EVENT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_TICKETS) {
        const args = [state.bettingId, state.ticketNumbers?.split(','), state.brackets?.split(',')]
        console.log('CONFIRM_CLAIM_TICKETS===============>', args)
        return callWithGasPrice(bettingContract, 'claimTickets', args).catch((err) =>
          console.log('CONFIRM_CLAIM_TICKETS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BURN_FOR_CREDIT) {
        const amount = !state.fungible
          ? state.amountReceivable
          : getDecimalAmount(state.amountReceivable, currency?.decimals)?.toString()
        const args = [state.betting, state.position, amount]
        console.log('CONFIRM_BURN_FOR_CREDIT===============>', args)
        return callWithGasPrice(tokenContract, 'setApprovalForAll', [bettingHelperContract.address, true])
          .then(() => delay(5000))
          .then(() =>
            callWithGasPrice(bettingHelperContract, 'burnForCredit', args).catch((err) =>
              console.log('CONFIRM_BURN_FOR_CREDIT===============>', err),
            ),
          )
      }
      if (stage === LockStage.CONFIRM_SPONSOR_TAG) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.sponsor, pool?.id, amountReceivable.toString(), state.tag, state.message]
        console.log('CONFIRM_SPONSOR_TAG===============>', args)
        return callWithGasPrice(bettingMinterContract, 'sponsorTag', args).catch((err) =>
          console.log('CONFIRM_SPONSOR_TAG===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA) {
        console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>')
        const args = [state.bettingProfileId, state.tag]
        return callWithGasPrice(bettingMinterContract, 'updateSponsorMedia', args).catch((err) =>
          console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_INJECT_FUNDS) {
        console.log('CONFIRM_INJECT_FUNDS===============>')
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.bettingId, state.period, amountReceivable.toString()]
        return callWithGasPrice(bettingContract, 'injectFunds', args).catch((err) =>
          console.log('CONFIRM_INJECT_FUNDS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT) {
        const args = [state.tag, state.contentType, !!state.add]
        console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', args)
        return callWithGasPrice(bettingHelperContract, 'updateExcludedContent', args).catch((err) =>
          console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE) {
        const pricePerMinute = getDecimalAmount(state.pricePerMinute ?? 0, currency?.decimals)
        console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', [pricePerMinute?.toString()])
        return callWithGasPrice(bettingHelperContract, 'updatePricePerAttachMinutes', [
          pricePerMinute?.toString(),
        ]).catch((err) => console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', err))
      }
      if (stage === LockStage.CONFIRM_BURN) {
        console.log('CONFIRM_BURN===============>', [state.tokenId])
        return callWithGasPrice(bettingMinterContract, 'burn', [state.tokenId]).catch((err) =>
          console.log('CONFIRM_BURN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_REGISTER_TAG) {
        const args = [state.tag, !!state.add]
        console.log('CONFIRM_REGISTER_TAG===============>', args)
        return callWithGasPrice(bettingMinterContract, 'updateTagRegistration', args).catch((err) =>
          console.log('CONFIRM_REGISTER_TAG===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        console.log('CONFIRM_UPDATE_OWNER===============>', [state.owner])
        return callWithGasPrice(bettingContract, 'updateDev', [state.owner]).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_ADMIN) {
        console.log('CONFIRM_UPDATE_ADMIN===============>', [state.owner, !!state.add])
        return callWithGasPrice(bettingContract, 'updateAdmin', [state.owner, !!state.add]).catch((err) =>
          console.log('CONFIRM_UPDATE_ADMIN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [currency?.address, amount.toString()]
        console.log('CONFIRM_WITHDRAW===============>', args)
        return callWithGasPrice(bettingContract, 'withdraw', args).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        console.log('CONFIRM_DELETE_PROTOCOL===============>', [state.bettingId])
        return callWithGasPrice(bettingContract, 'deleteProtocol', [state.bettingId]).catch((err) =>
          console.log('CONFIRM_DELETE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        console.log('CONFIRM_DELETE_PROTOCOL===============>', [pool?.id])
        return callWithGasPrice(bettingHelperContract, 'deleteBetting', [pool?.id]).catch((err) =>
          console.log('CONFIRM_DELETE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_USER_WITHDRAW) {
        const args = state.add ? [currency?.address] : [state.ticketId]
        const method = state.add ? 'withdrawReferrerFee' : 'userWithdraw'
        console.log('CONFIRM_USER_WITHDRAW===============>', args)
        return callWithGasPrice(bettingContract, method, args).catch((err) =>
          console.log('CONFIRM_USER_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT) {
        const args = [
          state.token,
          state.betting,
          state.checker,
          state.destination,
          state.bettingId,
          !state.checker || state.checker === ADDRESS_ZERO
            ? parseInt(state.discount ?? '0') * 100
            : getDecimalAmount(state.discount, state.decimals)?.toString(),
          state.collectionId,
          !!state.clear,
          state.item,
        ]
        console.log('CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT===============>', args)
        return callWithGasPrice(bettingHelperContract, 'updateBurnTokenForCredit', args).catch((err) =>
          console.log('CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLOSE_BETTING) {
        const args = [state.bettingId]
        console.log('CONFIRM_CLOSE_BETTING===============>', args)
        return callWithGasPrice(bettingContract, 'closeBetting', args).catch((err) =>
          console.log('CONFIRM_CLOSE_BETTING===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_URI_GENERATOR) {
        console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', [state.uriGenerator, bettingContract.address])
        return callWithGasPrice(bettingHelperContract, 'updateUriGenerator', [
          state.uriGenerator,
          bettingContract.address,
        ]).catch((err) => console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', err))
      }
      if (stage === LockStage.CONFIRM_BUY_TICKETS) {
        const args = [
          state.bettingId,
          account,
          ADDRESS_ZERO,
          state.identityTokenId,
          state.period,
          state.ticketNumbers?.split(','),
        ]
        console.log('CONFIRM_BUY_TICKETS===============>', args)
        return callWithGasPrice(bettingContract, 'buyWithContract', args).catch((err) =>
          console.log('CONFIRM_BUY_TICKETS===============>', err, bettingContract),
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
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.BUY_TICKETS)}>
            {t('BUY TICKETS')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.CLAIM_TICKETS)}>
            {t('CLAIM TICKETS')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.SET_BETTING_RESULTS)}>
            {t('SET BETTING RESULTS')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.INJECT_FUNDS)}>
            {t('INJECT FUNDS')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.BURN_FOR_CREDIT)}>
            {t('BURN FOR CREDIT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.USER_WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.SPONSOR_TAG)}>
            {t('SPONSOR TAG')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_SPONSOR_MEDIA)}>
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
            {t('CREATE/UPDATE EVENT')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.INJECT_FUNDS)}>
            {t('INJECT FUNDS')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT)}>
            {t('UPDATE BURN TOKEN FOR CREDIT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PARAMETERS)}>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.REGISTER_TAG)}>
            {t('REGISTER TO TAG')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_ADMIN)}>
            {t('UPDATE ADMIN')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_EXCLUDED_CONTENT)}>
            {t('UPDATE EXCLUDED CONTENT')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_PRICE_PER_MINUTE)}>
            {t('UPDATE PRICE PER MINUTES')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_URI_GENERATOR)}>
            {t('UPDATE URI GENERATOR')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={() => setStage(LockStage.UPDATE_MEMBERSHIP_PARAMETERS)}>
            {t('UPDATE MEMBERSHIP PARAMETERS')}
          </Button>
          <Button variant="subtle" mb="8px" onClick={() => setStage(LockStage.UPDATE_PARTNER_EVENT)}>
            {t('UPDATE PARTNER EVENT')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CLOSE_BETTING)}>
            {t('CLOSE BETTING')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.SET_BETTING_RESULTS)}>
            {t('SET BETTING RESULTS')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>
          {location === 'fromBetting' ? (
            <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE_PROTOCOL)}>
              {t('DELETE BETTING EVENT')}
            </Button>
          ) : null}
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE)}>
            {t('DELETE BETTING CONTRACT')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.UPDATE_PARAMETERS && (
        <UpdateParametersStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.INJECT_FUNDS && (
        <InjectFundsStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_URI_GENERATOR && (
        <UpdateUriStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_MEMBERSHIP_PARAMETERS && (
        <UpdateMembershipStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_PARTNER_EVENT && (
        <UpdatePartnerEventStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.BUY_TICKETS && (
        <BuyTicketStage
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
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.CLAIM_TICKETS && (
        <ClaimTicketStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.SET_BETTING_RESULTS && (
        <SetBettingResultStage
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
      {stage === LockStage.BURN_FOR_CREDIT && (
        <BurnForCreditStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.USER_WITHDRAW && (
        <WithdrawStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_OWNER && (
        <UpdateOwnerStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
      {stage === LockStage.UPDATE_SPONSOR_MEDIA && (
        <UpdateSponsorMediaStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_ADMIN && (
        <UpdateAdminStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT && (
        <UpdateBurnForCreditStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CLOSE_BETTING && (
        <CloseBettingStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.REGISTER_TAG && (
        <RegisterTagStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_PROTOCOL && <DeleteBettingEventStage continueToNextStage={continueToNextStage} />}
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
