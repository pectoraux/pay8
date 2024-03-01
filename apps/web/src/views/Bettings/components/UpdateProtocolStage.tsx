import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
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
        'This sets the number of betting periods you would like to have. A betting period is a window during which you accept bets for your event. A single betting event can have multiple betting periods. Input 0 if you want your betting event to have an infinite number of betting periods; otherwise, input the number of betting periods you wish to have.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This sets the duration in minutes of each betting period. A betting period is a window during which you accept bets for your event.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'This sets the start date of your first betting period. The field below sets the specific time your first betting period starts.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'The betting contract does not work with letters so letters need to be encoded. This enables the betting contract to accept alphanumerical answers and not just numbers. If the options for your betting event will include letters, pick the option Yes; otherwise, pick the option No',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'Input a description of your betting event. Use this field to provide guidelines on how to bet and for call to actions.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'Input a link to media about your betting event. You can input a tutorial on how to bet on this event for your users.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'List your betting event options separated by commas. If, for instance, you want your users to pick between Ali1 and Ali2, you will input Ali1, Ali2 here. If you are using alphabet encoding, then just input a-z here.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        "The action of your betting event can be a question; for instance, if you want users to bet on who is going to score, your action will be 'Who is going to score?' and the subjects of that action will be something like 'Player1, Player2', which you will be putting above.",
      )}
    </Text>
  )
  const TooltipComponent9 = () => (
    <Text>
      {t(
        'The rewards breakdown is how you are willing to distribute the prize pot between users. There are six brackets and your input here will need 6 comma-separated numbers, each between 0 and 100 and all summing up to 100 (e.g., 0,0,0,0,25,75). All betting options are series numbers',
      )}
    </Text>
  )
  const TooltipComponent10 = () => <Text>{t('This sets the percentage of the prize pot that goes to the admin.')}</Text>
  const TooltipComponent11 = () => (
    <Text>
      {t(
        'This sets the percentage of a ticket price that goes to the referrer. This is only relevant for users that were referred to the betting event. It is a mechanism to incentivise users to refer other users to the betting event so the more of the ticket price you accept to share with referrers, the bigger the incentive to refer your betting event to other users.',
      )}
    </Text>
  )
  const TooltipComponent12 = () => (
    <Text>
      {t(
        'This sets the discount percentage on bulk ticket purchases. The price of N tickets is computed as this: ticket_price * N * (discount_divisor + 1 - N) / discount_divisor. There is a minimum requirement of 3% on this variable for all betting events meaning you cannot put any value lower than 3 in this field.',
      )}
    </Text>
  )
  const TooltipComponent13 = () => (
    <Text>
      {t('Input 0 to create a new betting event otherwise input the id of a betting event you would like to update.')}
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
        <Flex ref={targetRef13}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Betting Event ID')}
          </Text>
          {tooltipVisible13 && tooltip13}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="bettingId"
          value={state.bettingId}
          placeholder={t('input betting event id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Number of Periods')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="numberOfPeriods"
          value={state.numberOfPeriods}
          placeholder={t('input 0 for infinite periods')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Price Per Ticket')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input price per ticket')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Bracket Duration in minutes')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="periodReceivable"
          value={state.periodReceivable}
          placeholder={t('input bracket duration in minutes')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Start Date')}
          </Text>
          {tooltipVisible3 && tooltip3}
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
        <Box>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Start Time')}
          </Text>
          <TimePicker
            name="startTime"
            onChange={handleRawValueChange('startTime')}
            selected={state.startTime}
            placeholderText="00:00"
          />
        </Box>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef4} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Alphabet Encoding')}
            </Text>
            {tooltipVisible4 && tooltip4}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.alphabetEncoding ? 1 : 0}
            onItemClick={handleRawValueChange('alphabetEncoding')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      {state.alphabetEncoding ? null : (
        <GreyedOutContainer>
          <Flex ref={targetRef9}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Rewards Breakdown')}
            </Text>
            {tooltipVisible9 && tooltip9}
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
      )}
      <GreyedOutContainer>
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Description')}
          </Text>
          {tooltipVisible5 && tooltip5}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="description"
          value={state.description}
          placeholder={t('input betting event description')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Link to Attached Media')}
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="media"
          value={state.media}
          placeholder={t('input link to attached media')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef7}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('List subjects')}
          </Text>
          {tooltipVisible7 && tooltip7}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="subjects"
          value={state.subjects}
          placeholder={t('input comma separated list of subjects')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef8}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Action')}
          </Text>
          {tooltipVisible8 && tooltip8}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="action"
          value={state.action}
          placeholder={t('input action')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      {/* <GreyedOutContainer>
        <Flex ref={targetRef9}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Rewards Breakdown')}(%)
          </Text>
          {tooltipVisible9 && tooltip9}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="rewardsBreakdown"
          value={state.rewardsBreakdown}
          placeholder={t('input rewards breakdown')}
          onChange={handleChange}
        />
      </GreyedOutContainer> */}
      <GreyedOutContainer>
        <Flex ref={targetRef10}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Admin Share')}(%)
          </Text>
          {tooltipVisible10 && tooltip10}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="adminShare"
          value={state.adminShare}
          placeholder={t('input admin share')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef11}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Referrer Share')}(%)
          </Text>
          {tooltipVisible11 && tooltip11}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="referrerShare"
          value={state.referrerShare}
          placeholder={t('input referrer share')}
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
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will create a new account or update parameters of an old one. Please read the documentation for more information on each parameter',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Create or Update Account')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
