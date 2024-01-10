import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Input,
  Modal,
  Button,
  AutoRenewIcon,
  ErrorIcon,
  useToast,
  HelpIcon,
  useTooltip,
  ButtonMenu,
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { differenceInSeconds } from 'date-fns'
import { useAppDispatch } from 'state'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchLotteriesAsync } from 'state/lotteries'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useLotteryHelperContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { TimePicker } from 'views/AcceleratorVoting/components/DatePicker'
import { combineDateAndTime } from 'views/AcceleratorVoting/CreateProposal/helpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { StyledItemRow } from 'views/CanCan/market/components/Filters/ListFilter/styles'

import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateLotteryModal: React.FC<any> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { reload } = useRouter()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const lotteryHelperContract = useLotteryHelperContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const [state, setState] = useState<any>(() => ({
    valuepool: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    endAmount: '',
    useNFTicket: 0,
    isNFT: 0,
    riskpool: 0,
    treasuryFee: '',
    referrerFee: '',
    priceTicket: '',
    discountDivisor: '',
    rewardsBreakdown: '',
    lockDuration: '',
  }))
  const updateValue = (key: any, value: string | number | boolean | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }
  const handleRawValueChange = (key: string) => (value: Date | number | boolean | string) => {
    updateValue(key, value)
  }
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const start = combineDateAndTime(state.startDate, state.startTime)
      const end = combineDateAndTime(state.endDate, state.endTime)
      const startTime = Math.max(
        differenceInSeconds(new Date(start * 1000), new Date(), {
          roundingMethod: 'ceil',
        }),
        0,
      )
      const endTime = Math.max(
        differenceInSeconds(new Date(end * 1000), new Date(), {
          roundingMethod: 'ceil',
        }),
        0,
      )
      const endAmount = getDecimalAmount(state.endAmount ?? 0)
      const priceTicket = getDecimalAmount(state.priceTicket ?? 0)
      const args = [
        account,
        state.valuepool || ADDRESS_ZERO,
        startTime,
        endTime,
        endAmount.toString(),
        parseInt(state.lockDuration) * 60,
        !!state.useNFTicket,
        state.isNFT,
        [
          parseInt(state.treasuryFee) * 100,
          parseInt(state.referrerFee) * 100,
          priceTicket.toString(),
          parseInt(state.discountDivisor) * 100,
        ],
        state.rewardsBreakdown?.split(',')?.map((val) => parseFloat(val.trim()) * 100),
      ]
      console.log('receipt================>', lotteryHelperContract, args)
      return callWithGasPrice(lotteryHelperContract, 'startLottery', args).catch((err) => {
        console.log('err================>', err)
        setPendingFb(false)
        toastError(
          t('Issue creating lottery'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Lottery successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your Lottery contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchLotteriesAsync({ fromLottery: true, chainId }))
      delay(3000)
      reload()
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    state.startDate,
    state.startTime,
    state.endDate,
    state.endTime,
    state.endAmount,
    state.priceTicket,
    state.valuepool,
    state.lockDuration,
    state.useNFTicket,
    state.isNFT,
    state.treasuryFee,
    state.referrerFee,
    state.discountDivisor,
    state.rewardsBreakdown,
    account,
    lotteryHelperContract,
    callWithGasPrice,
    toastError,
    t,
    toastSuccess,
    dispatch,
    chainId,
    reload,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        'This sets the start date of your lottery and the field below enables you to set the specific time the lottery should start.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This sets the end date of your lottery and the field below enables you to set the specific time the lottery should end.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Some lotteries are setup to create an account for their winners in a Valuepool and lock their winnings in those accounts. If your lottery uses a Valuepool, input its address right here, otherwise leave this field empty.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        "This sets a lower bound on the size of the lottery prize pot (the prize pot of the primary currency of your lottery) that enables anyone to stop the lottery. Lotteries can be stopped automatically after their end date has passed or manually (by anyone) once their end amount is reached. This field enables you to set that value. If you don't want the lottery to be stopped before its end date, just input 0.",
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>{t("This sets the percentage of the prize pot that goes to the lottery's admin.")}</Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This sets the percentage of a ticket price you are willing to share with the referrer in the case of users that were referred by users. This is a mechanism that enables you to incentivise users to refer other users and the higher your referrer fee, the bigger the incentive.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => <Text>{t('')}</Text>
  const TooltipComponent8 = () => (
    <Text>
      {t(
        "In case your lottery uses a Valuepool, use this parameter to set a lock duration for users' winnings in the Valuepool ",
      )}
    </Text>
  )
  const TooltipComponent9 = () => (
    <Text>
      {t(
        'This sets the discount percentage on bulk ticket purchases. The price of N tickets is computed as this: ticket_price * N * (discount_divisor + 1 - N) / discount_divisor. There is a minimum requirement of 3% on this variable for all lotterues, meaning you cannot put any value lower than 3 in this field.',
      )}
    </Text>
  )
  const TooltipComponent10 = () => (
    <Text>
      {t(
        'This is a series of 6 percentages separated by commas; each percentage corresponds to a different bracket (there are a total of 6 brackets) and represents the share of the prize pot earned by users that have the winning number in that bracket. For a better explanation, checkout the page of a lottery',
      )}
    </Text>
  )
  const TooltipComponent11 = () => (
    <Text>
      {t(
        'This sets whether this is an NFT lottery or not. PaySwap enables users to participate in lotteries where the winner gets an NFT prize.',
      )}
    </Text>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef2,
    tooltip: tooltip2,
    tooltipVisible: tooltipVisible2,
  } = useTooltip(<TooltipComponent2 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef3,
    tooltip: tooltip3,
    tooltipVisible: tooltipVisible3,
  } = useTooltip(<TooltipComponent3 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef4,
    tooltip: tooltip4,
    tooltipVisible: tooltipVisible4,
  } = useTooltip(<TooltipComponent4 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef5,
    tooltip: tooltip5,
    tooltipVisible: tooltipVisible5,
  } = useTooltip(<TooltipComponent5 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef6,
    tooltip: tooltip6,
    tooltipVisible: tooltipVisible6,
  } = useTooltip(<TooltipComponent6 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef7,
    tooltip: tooltip7,
    tooltipVisible: tooltipVisible7,
  } = useTooltip(<TooltipComponent7 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef8,
    tooltip: tooltip8,
    tooltipVisible: tooltipVisible8,
  } = useTooltip(<TooltipComponent8 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef9,
    tooltip: tooltip9,
    tooltipVisible: tooltipVisible9,
  } = useTooltip(<TooltipComponent9 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef10,
    tooltip: tooltip10,
    tooltipVisible: tooltipVisible10,
  } = useTooltip(<TooltipComponent10 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef11,
    tooltip: tooltip11,
    tooltipVisible: tooltipVisible11,
  } = useTooltip(<TooltipComponent11 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Modal title={t('Create Lottery')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Start Date')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <DatePicker
          onChange={handleRawValueChange('startDate')}
          selected={state.startDate}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Start Time')}
        </Text>
        <TimePicker
          name="startTime"
          onChange={handleRawValueChange('startTime')}
          selected={state.startTime}
          placeholderText="00:00"
        />
        <DatePickerPortal />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('End Date')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <DatePicker onChange={handleRawValueChange('endDate')} selected={state.endDate} placeholderText="YYYY/MM/DD" />
        <DatePickerPortal />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('End Time')}
        </Text>
        <TimePicker
          name="endTime"
          onChange={handleRawValueChange('endTime')}
          selected={state.endTime}
          placeholderText="00:00"
        />
        <DatePickerPortal />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Valuepool Address')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="valuepool"
          value={state.valuepool}
          placeholder={t('input valuepool address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('End Amount')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="endAmount"
          value={state.endAmount}
          placeholder={t('input end amount')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Treasury Fee')}(%)
          </Text>
          {tooltipVisible5 && tooltip5}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="treasuryFee"
          value={state.treasuryFee}
          placeholder={t('input treasury fee')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Referrer Fee')}(%)
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="referrerFee"
          value={state.referrerFee}
          placeholder={t('input referrer fee')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Ticket Price')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="priceTicket"
          value={state.priceTicket}
          placeholder={t('input ticket price')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef8}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Lock Duration (in minutes)')}
          </Text>
          {tooltipVisible8 && tooltip8}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="lockDuration"
          value={state.lockDuration}
          placeholder={t('input lock duration')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef9}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Discount Divisor')}(%)
          </Text>
          {tooltipVisible9 && tooltip9}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="discountDivisor"
          value={state.discountDivisor}
          placeholder={t('input discount divisor')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef10}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Rewards Breakdown')}
          </Text>
          {tooltipVisible10 && tooltip10}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="rewardsBreakdown"
          value={state.rewardsBreakdown}
          placeholder="2.5,3.75,6.25,12.5,25,50"
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef11} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('NFT Prize?')}
            </Text>
            {tooltipVisible11 && tooltip11}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu scale="xs" variant="subtle" activeIndex={state.isNFT} onItemClick={handleRawValueChange('isNFT')}>
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('ERC721')}</ButtonMenuItem>
            <ButtonMenuItem>{t('ERC1155')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will create a new lottery with you as its Admin. Please read the documentation to learn more about Lotteries.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? (
          <Button
            mb="8px"
            onClick={handleCreateGauge}
            endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={pendingTx || pendingFb}
          >
            {t('Create Lottery')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateLotteryModal
