import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  HelpIcon,
  useTooltip,
  ButtonMenu,
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DatePicker, DatePickerPortal, TimePicker } from 'views/Voting/components/DatePicker'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'

import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ state, handleChange, handleRawValueChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        'Some lotteries are setup to create an account for their winners in a Valuepool and lock their winnings in those accounts. If your lottery uses a Valuepool, input its address right here, otherwise leave this field empty.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "This sets a lower bound on the size of the lottery prize pot (the prize pot of the primary currency of your lottery) that enables anyone to stop the lottery. Lotteries can be stopped automatically after their end date has passed or manually (by anyone) once their end amount is reached. This field enables you to set that value. If you don't want the lottery to be stopped before its end date, just input 0.",
      )}
    </Text>
  )
  const TooltipComponent3 = () => <Text>{t('You need to specify the id of the item to purchase.')}</Text>
  const TooltipComponent4 = () => (
    <Text>
      {t(
        "In case your lottery uses a Valuepool, use this parameter to set a lock duration for users' winnings in the Valuepool",
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'This sets the start date of your lottery and the field below enables you to set the specific time the lottery should start.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => <Text>{t('')}</Text>
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This sets the end date of your lottery and the field below enables you to set the specific time the lottery should end.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => <Text>{t('')}</Text>
  const TooltipComponent9 = () => <Text>{t('')}</Text>
  const TooltipComponent10 = () => (
    <Text>{t("This sets the percentage of the prize pot that goes to the lottery's admin.")}</Text>
  )
  const TooltipComponent11 = () => (
    <Text>
      {t(
        'This sets the percentage of a ticket price you are willing to share with the referrer in the case of users that were referred by users. This is a mechanism that enables you to incentivise users to refer other users and the higher your referrer fee, the bigger the incentive.',
      )}
    </Text>
  )
  const TooltipComponent12 = () => (
    <Text>
      {t(
        'This sets the discount percentage on bulk ticket purchases. The price of N tickets is computed as this: ticket_price * N * (discount_divisor + 1 - N) / discount_divisor. There is a minimum requirement of 3% on this variable for all lotterues, meaning you cannot put any value lower than 3 in this field.',
      )}
    </Text>
  )
  const TooltipComponent13 = () => (
    <Text>
      {t(
        'This is a series of 6 percentages separated by commas; each percentage corresponds to a different bracket (there are a total of 6 brackets) and represents the share of the prize pot earned by users that have the winning number in that bracket. For a better explanation, checkout the page of a lottery',
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
  const {
    targetRef: targetRef12,
    tooltip: tooltip12,
    tooltipVisible: tooltipVisible12,
  } = useTooltip(<TooltipComponent12 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef13,
    tooltip: tooltip13,
    tooltipVisible: tooltipVisible13,
  } = useTooltip(<TooltipComponent13 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Valuepool Address')}
          </Text>
          {tooltipVisible && tooltip}
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
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Ending Amount')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="endAmount"
          value={state.endAmount}
          placeholder={t('input an ending amount')}
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
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input ticket price')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Lock Duration (in minutes)')}
          </Text>
          {tooltipVisible4 && tooltip4}
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
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Start Date')}
          </Text>
          {tooltipVisible5 && tooltip5}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <DatePicker
          onChange={handleRawValueChange('startReceivable')}
          selected={state.startReceivable}
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
        <Flex ref={targetRef7}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('End Date')}
          </Text>
          {tooltipVisible7 && tooltip7}
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
      {/* <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef9}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
              {t('Use NFTicket')}
            </Text>
            {tooltipVisible9 && tooltip9}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.useNFTicket}
            onItemClick={handleRawValueChange('useNFTicket')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer> */}
      <GreyedOutContainer>
        <Flex ref={targetRef10}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Treasury Fee')}(%)
          </Text>
          {tooltipVisible10 && tooltip10}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="treasuryFee"
          value={state.treasuryFee}
          placeholder={t('input your treasury fee')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef11}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Referrer Fee')}(%)
          </Text>
          {tooltipVisible11 && tooltip11}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="referrerFee"
          value={state.referrerFee}
          placeholder={t('input your referrer fee')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef12}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Discount Divisor')}(%)
          </Text>
          {tooltipVisible12 && tooltip12}
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
        <Flex ref={targetRef13}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Rewards Breakdown')}
          </Text>
          {tooltipVisible13 && tooltip13}
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
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
            {t('NFT Prize?')}
          </Text>
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
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
              'This will start a new lottery with you as its admin. Please read the documentation for more information on each parameter',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Start Lottery')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
