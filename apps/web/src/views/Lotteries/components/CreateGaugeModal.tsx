import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  useERC20,
  useErc721CollectionContract,
  useLotteryContract,
  useLotteryHelperContract,
  useLotteryRandomNumberGenerator,
} from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useMemo, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { combineDateAndTime } from 'views/Voting/CreateProposal/helpers'
import { differenceInSeconds } from 'date-fns'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useGetTokenForCredit } from 'state/lottery/hooks'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import ClaimTicketStage from './ClaimTicketStage'
import StartLotteryStage from './StartLotteryStage'
import AddTokenStage from './AddTokenStage'
import RandomNumberFeesStage from './RandomNumberFeesStage'
import UpdateBurnForCreditStage from './UpdateBurnForCreditStage'
import ClaimLotteryStage from './ClaimLotteryStage'
import InjectFundsStage from './InjectFundsStage'
import WithdrawStage from './WithdrawStage'
import BurnForCreditStage from './BurnForCreditStage'
import DrawFinalNumberStage from './DrawFinalNumberStage'
import WithdrawStage2 from './WithdrawStage2'
import CloseLotteryStage from './CloseLotteryStage'
import BuyTicketStage from './BuyTicketStage'
import LocationStage from './LocationStage'
import UpdateNftPrizesStage from './UpdateNftPrizesStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES]: t('Random Number Fees'),
  [LockStage.START_LOTTERY]: t('Start Lottery'),
  [LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT]: t('Update Burn Token For Credit'),
  [LockStage.CLAIM_LOTTERY_REVENUE]: t('Claim Lottery Revenue'),
  [LockStage.INJECT_FUNDS]: t('Inject Funds'),
  [LockStage.ADD_TOKEN]: t('Add Token'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.BURN_TOKEN_FOR_CREDIT]: t('Burn Token For Credit'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.DRAW_FINAL_NUMBER]: t('Draw Final Number'),
  [LockStage.BUY_TICKETS]: t('Buy Tickets'),
  [LockStage.CLOSE_LOTTERY]: t('Close Lottery'),
  [LockStage.CLAIM_TICKETS]: t('Claim Tickets'),
  [LockStage.UPDATE_NFT_PRIZES]: t('Add NFT Prize'),
  [LockStage.ADMIN_WITHDRAW]: t('Withdraw NFT Prize'),
  [LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES]: t('Back'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_ADMIN_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_START_LOTTERY]: t('Back'),
  [LockStage.CONFIRM_ADD_TOKEN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_NFT_PRIZES]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT]: t('Back'),
  [LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE]: t('Back'),
  [LockStage.CONFIRM_CLAIM_TICKETS]: t('Back'),
  [LockStage.CONFIRM_INJECT_FUNDS]: t('Back'),
  [LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_DRAW_FINAL_NUMBER]: t('Back'),
  [LockStage.CONFIRM_BUY_TICKETS]: t('Back'),
  [LockStage.CONFIRM_CLOSE_LOTTERY]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({ variant = 'user', pool, currAccount, currency, onDismiss }) => {
  const [stage, setStage] = useState(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const referrerAddress = router.query.referrer as string
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const lotteryContract = useLotteryContract()
  const lotteryHelperContract = useLotteryHelperContract()
  const randomNumberGeneratorContract = useLotteryRandomNumberGenerator()
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  console.log('mcurrencyy===============>', currAccount, currency, pool, lotteryContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  const [state, setState] = useState<any>(() => ({
    lockDuration: '',
    endAmount: '',
    endReceivable: '',
    startReceivable: '',
    valuepool: '',
    periodReceivable: '',
    token: currency?.address,
    prizeAddress: pool?.nftPrizes?.length ? pool?.nftPrizes[0]?.tokenAddress : '',
    treasuryFee: '',
    referrerFee: '',
    discountDivisor: '',
    startTime: '',
    endTime: '',
    rewardsBreakdown: '',
    useNFTicket: 0,
    isNFT: 0,
    collectionId: '',
    checker: '',
    toAddress: '',
    destination: '',
    clear: 0,
    add: 0,
    reinject: 0,
    fromSponsors: 0,
    fungible: 0,
    referrer: 0,
    position: '',
    discount: '',
    item: '',
    nfticketId: '0',
    tokenId: '',
    identityTokenId: '0',
    ticketNumbers: '',
    brackets: '',
    lotteryId: pool?.id ?? '',
    owner: pool?.owner,
    decimals: currency?.decimals,
    customTags: '',
  }))

  const [nftFilters, setNftFilters] = useState<any>({
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
  const { data: burnForCreditTokens } = useGetTokenForCredit(pool?.collectionId) as any
  const burnForCreditToken = useMemo(
    () => burnForCreditTokens?.length > state.position && burnForCreditTokens[state.position],
    [burnForCreditTokens, state.position],
  )
  const tokenContract = useErc721CollectionContract(burnForCreditToken?.token?.address || '')
  const tokenContract2 = useErc721CollectionContract(state.token || '')
  console.log('tokenContract==================>', tokenContract, burnForCreditToken, burnForCreditTokens)

  const goBack = () => {
    switch (stage) {
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.WITHDRAW:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES:
        setStage(LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES)
        break
      case LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_INJECT_FUNDS:
        setStage(LockStage.INJECT_FUNDS)
        break
      case LockStage.INJECT_FUNDS:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DRAW_FINAL_NUMBER:
        setStage(LockStage.DRAW_FINAL_NUMBER)
        break
      case LockStage.DRAW_FINAL_NUMBER:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
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
      case LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADMIN_WITHDRAW:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_ADD_TOKEN:
        setStage(LockStage.ADD_TOKEN)
        break
      case LockStage.ADD_TOKEN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_NFT_PRIZES:
        setStage(LockStage.UPDATE_NFT_PRIZES)
        break
      case LockStage.UPDATE_NFT_PRIZES:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLOSE_LOTTERY:
        setStage(LockStage.CLOSE_LOTTERY)
        break
      case LockStage.CLOSE_LOTTERY:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_START_LOTTERY:
        setStage(LockStage.START_LOTTERY)
        break
      case LockStage.START_LOTTERY:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE:
        setStage(LockStage.CLAIM_LOTTERY_REVENUE)
        break
      case LockStage.CLAIM_LOTTERY_REVENUE:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
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
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.CONFIRM_UPDATE_LOCATION)
        break
      case LockStage.INJECT_FUNDS:
        setStage(LockStage.CONFIRM_INJECT_FUNDS)
        break
      case LockStage.ADD_TOKEN:
        setStage(LockStage.CONFIRM_ADD_TOKEN)
        break
      case LockStage.BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.BUY_TICKETS:
        setStage(LockStage.CONFIRM_BUY_TICKETS)
        break
      case LockStage.CLAIM_TICKETS:
        setStage(LockStage.CONFIRM_CLAIM_TICKETS)
        break
      case LockStage.UPDATE_NFT_PRIZES:
        setStage(LockStage.CONFIRM_UPDATE_NFT_PRIZES)
        break
      case LockStage.CLAIM_LOTTERY_REVENUE:
        setStage(LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE)
        break
      case LockStage.CLOSE_LOTTERY:
        setStage(LockStage.CONFIRM_CLOSE_LOTTERY)
        break
      case LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES:
        setStage(LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES)
        break
      case LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.START_LOTTERY:
        setStage(LockStage.CONFIRM_START_LOTTERY)
        break
      case LockStage.DRAW_FINAL_NUMBER:
        setStage(LockStage.CONFIRM_DRAW_FINAL_NUMBER)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(LockStage.CONFIRM_ADMIN_WITHDRAW)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, lotteryContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [lotteryContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start receiving payments for audits!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_START_LOTTERY) {
        const endAmount = getDecimalAmount(state.endAmount ?? 0, currency?.decimals)
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const timeReceivable = combineDateAndTime(state.startReceivable, state.startTime)?.toString()
        const timeReceivable2 = combineDateAndTime(state.endDate, state.endTime)?.toString()
        const startReceivable = Math.max(
          differenceInSeconds(new Date(timeReceivable ? parseInt(timeReceivable) * 1000 : 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        console.log('startReceivable===================>', startReceivable)
        const endReceivable = Math.max(
          differenceInSeconds(new Date(timeReceivable2 ? parseInt(timeReceivable2) * 1000 : 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args = [
          account,
          state.valuepool || ADDRESS_ZERO,
          startReceivable.toString(),
          endReceivable.toString(),
          endAmount.toString(),
          parseInt(state.lockDuration ?? 0) * 60,
          !!state.useNFTicket,
          state.isNFT,
          [
            parseInt(state.treasuryFee ?? '0') * 100,
            parseInt(state.referrerFee ?? '0') * 100,
            amountReceivable.toString(),
            parseInt(state.discountDivisor ?? '0') * 100,
          ],
          state.rewardsBreakdown?.split(',')?.map((val) => parseFloat(val.trim()) * 100),
        ]
        console.log('CONFIRM_START_LOTTERY===============>', lotteryHelperContract, args)
        return callWithGasPrice(lotteryHelperContract, 'startLottery', args).catch((err) =>
          console.log('CONFIRM_START_LOTTERY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_LOCATION) {
        const customTags = state.customTags?.split(',')
        const args = [
          '1',
          state.collectionId,
          nftFilters?.country?.toString(),
          nftFilters?.city?.toString(),
          '0',
          '0',
          ADDRESS_ZERO,
          nftFilters?.product?.length ? nftFilters?.product[0] : customTags?.length && customTags[0],
        ]
        console.log('CONFIRM_UPDATE_LOCATION===============>', args)
        return callWithGasPrice(lotteryContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [amountReceivable?.toString()]
        console.log('CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES===============>', args)
        return callWithGasPrice(randomNumberGeneratorContract, 'addFee', args).catch((err) =>
          console.log('CONFIRM_CONTRIBUTE_RANDOM_NUMBER_FEES===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT) {
        const args = [
          state.token,
          state.checker ?? ADDRESS_ZERO,
          state.destination,
          !state.checker || state.checker === ADDRESS_ZERO
            ? parseInt(state.discount ?? '0') * 100
            : getDecimalAmount(state.discount, state.decimals)?.toString(),
          state.collectionId,
          !!state.clear,
          state.item,
        ]
        console.log('CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT===============>', args)
        return callWithGasPrice(lotteryHelperContract, 'updateBurnTokenForCredit', args).catch((err) =>
          console.log('CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_LOTTERY_REVENUE) {
        const args = state.fromSponsors ? [state.lotteryId] : [state.lotteryId, currency.address]
        const method = state.fromSponsors ? 'claimLotteryRevenueFomSponsors' : 'claimLotteryRevenue'
        console.log('CONFIRM_CLAIM_LOTTERY_REVENUE===============>', args)
        return callWithGasPrice(lotteryContract, method, args).catch((err) =>
          console.log('CONFIRM_CLAIM_LOTTERY_REVENUE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_INJECT_FUNDS) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.lotteryId, amountReceivable.toString(), currency?.address, !!state.reinject]
        console.log('CONFIRM_INJECT_FUNDS===============>', args)
        return callWithGasPrice(lotteryContract, 'injectFunds', args).catch((err) =>
          console.log('CONFIRM_INJECT_FUNDS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_TOKEN) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.token, state.lotteryId, amountReceivable.toString()]
        console.log('CONFIRM_ADD_TOKEN===============>', args)
        return callWithGasPrice(lotteryContract, 'updatePricePerTicket', args).catch((err) =>
          console.log('CONFIRM_ADD_TOKEN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const args = parseInt(pool?.isNFT)
          ? [state.token, state.lotteryId]
          : !state.referrer
          ? [state.token, state.lotteryId, state.identityTokenId]
          : [state.lotteryId, currency.address]
        const method =
          parseInt(pool?.isNFT) && variant !== 'user'
            ? 'withdrawNFTPendingReward'
            : !state.referrer
            ? 'withdrawPendingReward'
            : 'withrawReferrerFee'
        console.log('CONFIRM_WITHDRAW===============>', method, args)
        return callWithGasPrice(lotteryContract, method, args).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADMIN_WITHDRAW) {
        const args = [state.prizeAddress, state.lotteryId]
        console.log('CONFIRM_WITHDRAW===============>', args)
        return callWithGasPrice(lotteryHelperContract, 'withdrawNFTPrize', args).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT) {
        const amount = !state.fungible
          ? state.amountReceivable
          : getDecimalAmount(state.amountReceivable ?? 0)?.toString()
        const args = [state.owner, state.position, amount]
        console.log('CONFIRM_BURN_TOKEN_FOR_CREDIT===============>', args, tokenContract)
        return callWithGasPrice(tokenContract, 'setApprovalForAll', [lotteryHelperContract.address, true])
          .then(() => delay(5000))
          .then(() =>
            callWithGasPrice(lotteryHelperContract, 'burnForCredit', args).catch((err) =>
              console.log('CONFIRM_BURN_TOKEN_FOR_CREDIT===============>', err),
            ),
          )
      }
      if (stage === LockStage.CONFIRM_DRAW_FINAL_NUMBER) {
        const args = [state.lotteryId]
        console.log('CONFIRM_DRAW_FINAL_NUMBER===============>', args)
        return callWithGasPrice(lotteryContract, 'drawFinalNumberAndMakeLotteryClaimable', args).catch((err) =>
          console.log('CONFIRM_DRAW_FINAL_NUMBER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BUY_TICKETS) {
        const args = [
          state.owner,
          account,
          referrerAddress || ADDRESS_ZERO,
          'lotto',
          state.nfticketId,
          state.identityTokenId,
          state.ticketNumbers?.split(','),
        ]
        console.log('CONFIRM_BUY_TICKETS===============>', args)
        return callWithGasPrice(lotteryContract, 'buyWithContract', args).catch((err) =>
          console.log('CONFIRM_BUY_TICKETS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLOSE_LOTTERY) {
        const args = [state.lotteryId]
        console.log('CONFIRM_CLOSE_LOTTERY===============>', args)
        return callWithGasPrice(lotteryContract, 'closeLottery', args).catch((err) =>
          console.log('CONFIRM_CLOSE_LOTTERY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_TICKETS) {
        const args = [state.token, state.lotteryId, state.ticketNumbers.split(','), state.brackets.split(',')]
        console.log('CONFIRM_CLAIM_TICKETS===============>', args)
        return callWithGasPrice(lotteryContract, 'claimTickets', args).catch((err) =>
          console.log('CONFIRM_CLAIM_TICKETS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_NFT_PRIZES) {
        const args = [state.token, account, state.lotteryId, state.tokenId]
        console.log('CONFIRM_UPDATE_NFT_PRIZES===============>', args, tokenContract2)
        return callWithGasPrice(tokenContract2, 'setApprovalForAll', [lotteryHelperContract.address, true])
          .then(() => delay(5000))
          .then(() =>
            callWithGasPrice(lotteryHelperContract, 'updateNFTPrizes', args).catch((err) =>
              console.log('CONFIRM_UPDATE_NFT_PRIZES===============>', err),
            ),
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
          <Button mb="8px" onClick={() => setStage(LockStage.CLAIM_TICKETS)}>
            {t('CLAIM TICKETS')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.DRAW_FINAL_NUMBER)}>
            {t('DRAW FINAL NUMBER')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.BURN_TOKEN_FOR_CREDIT)}>
            {t('BURN TOKEN FOR CREDIT')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.ADMIN_WITHDRAW)}>
            {t('WITHDRAW NFT PRIZE')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.INJECT_FUNDS)}>
            {t('INJECT FUNDS')}
          </Button>
          <Button
            variant="success"
            mb="8px"
            disabled={Number(pool?.id) !== 1}
            onClick={() => setStage(LockStage.CLAIM_LOTTERY_REVENUE)}
          >
            {t('CLAIM LOTTERY REVENUE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.CLOSE_LOTTERY)}>
            {t('CLOSE LOTTERY')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES)}>
            {t('CONTRIBUTE RANDOM NUMBER FEES')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.ADD_TOKEN)}>
            {t('ADD NEW TOKEN')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.INJECT_FUNDS)}>
            {t('INJECT FUNDS')}
          </Button>
          <Button
            variant="success"
            mb="8px"
            disabled={Number(pool?.id) !== 1}
            onClick={() => setStage(LockStage.CLAIM_LOTTERY_REVENUE)}
          >
            {t('CLAIM LOTTERY REVENUE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT)}>
            {t('UPDATE BURN TOKEN FOR CREDIT')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.START_LOTTERY)}>
            {t('START LOTTERY')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.DRAW_FINAL_NUMBER)}>
            {t('DRAW FINAL NUMBER')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_NFT_PRIZES)}>
            {t('ADD NFT PRIZE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.CLOSE_LOTTERY)}>
            {t('CLOSE LOTTERY')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES)}>
            {t('CONTRIBUTE RANDOM NUMBER FEES')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.ADMIN_WITHDRAW)}>
            {t('WITHDRAW NFT PRIZE')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.CONTRIBUTE_RANDOM_NUMBER_FEES && (
        <RandomNumberFeesStage
          state={state}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.START_LOTTERY && (
        <StartLotteryStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.ADD_TOKEN && (
        <AddTokenStage
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
      {stage === LockStage.CLAIM_LOTTERY_REVENUE && (
        <ClaimLotteryStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CLAIM_TICKETS && (
        <ClaimTicketStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.INJECT_FUNDS && (
        <InjectFundsStage
          state={state}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.WITHDRAW && (
        <WithdrawStage
          state={state}
          account={pool.id}
          currency={currency}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.ADMIN_WITHDRAW && (
        <WithdrawStage2 state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.BURN_TOKEN_FOR_CREDIT && (
        <BurnForCreditStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DRAW_FINAL_NUMBER && (
        <DrawFinalNumberStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.BUY_TICKETS && (
        <BuyTicketStage
          state={state}
          account={account}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_NFT_PRIZES && (
        <UpdateNftPrizesStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
      {stage === LockStage.CLOSE_LOTTERY && (
        <CloseLotteryStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
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

export default CreateGaugeModal
