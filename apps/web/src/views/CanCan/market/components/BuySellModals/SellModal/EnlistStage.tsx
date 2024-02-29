import { useEffect, useRef, useState } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Slider,
  Button,
  ButtonMenuItem,
  ButtonMenu,
  Input,
  ErrorIcon,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { DatePicker, DatePickerPortal, TimePicker } from 'views/ValuePoolVoting/components/DatePicker'

import Options from './Options'
import { Divider } from '../shared/styles'
import { GreyedOutContainer } from './styles'
import Filters from './Filters'

// interface SetPriceStageProps {
//   state: EnlistFormState
//   handleChange: (any) => void
//   handleChoiceChange: () => void
//   handleRawValueChange?: any
//   continueToNextStage: () => void
// }

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const EnlistStage: React.FC<any> = ({
  state,
  variant,
  nftFilters,
  setNftFilters,
  handleChange,
  handleChoiceChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const [advanced, setAdvanced] = useState<any>(0)
  const TooltipComponent = () => (
    <Text>
      {t(
        "This sets the workspace of your product. In case you can't find one that works for your product, pick Software & Telco & Other. The workspace of your product helps users find your products more easily and makes you eligible for weekly token rewards.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>{t('This sets the maximum number of the current product you have in stock for users.')}</Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'This sets the purchase price of the token. In case you want to use dynamic pricing on the current item, just input 0 here.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        "This enables you to add options to your product. Options enable users to customize their orders. The category field sets the category of the option, the element field set the actual option, the currency field sets the unit of the count - set this to # if you want each count to be an increment in the number of the item; the element price is the price of each element; the element min parameter is min amount of the element customers can order; the element max is the maximum amount of the element customers can order. In case you want to enable users to pick between options $1 Tilapia and $2 Tilapia for the meat on top of their food, you add 2 options, the first one (category='Meat'; Element='$1 Tilapia'; Currency='#', Element Price='1', Element Min='0', Element Max='100') & the second one (category='Meat'; Element='$2 Tilapia'; Currency='#', Element Price='2', Element Min='0', Element Max='100'). You can add as many options as you want to your product and you can add multiple categories each with their own list of options.",
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'You can fine tune more parameters about your product. These parameters are not necessary to update in order to list your product but offer more options to customize your product.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This parameter is useful for product drops and sets a date the product will drop in the marketplace i.e. become available for purchase.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This parameter is useful for product auctions and sets a duration in minutes after which the auction automatically closes. If for instance you set that number to 10, the auction will automatically close 10 minutes after the last bid unless a new bid is made.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        "This parameter is useful for product auctions and sets the percentage increment between each bid. If this parameter is set to 10% with a starting price of 100 for instance, the first bid will be 100, the second bid will be 110, the third will be 120, etc. The bid price will keep increasing by 10% between each bid until there's no bidders left",
      )}
    </Text>
  )
  const TooltipComponent9 = () => (
    <Text>
      {t(
        'In case your product has some ESG badge or some other one delivered by an auditor, you can attach that badge to your product by inputting its id right here. This adds to the credibility of your product in the marketplace, you can use it to prove that you are a trustworthy merchant, that your luxury items are authentic, etc.',
      )}
    </Text>
  )
  const TooltipComponent10 = () => (
    <Text>
      {t(
        "NFTickets are eReceipts on the blockchain that users receive after each purchase as proof of purchase. If you don't want users to be able to transfer their NFTickets to other wallets, you can set this parameter to No. For instance when selling tickets to a concert or an event, you might want to prevent users from reselling their tickets and this might help you do just that.",
      )}
    </Text>
  )
  const TooltipComponent11 = () => (
    <Text>
      {t(
        'In case customer might want to purchase this item through the stake market, this parameters sets whether or not they should be required to send the purchase price to the stake when creating it. If you want to be sure the customers have the money for the purchase before being allowed to create a stake to purchase your item, you can set this parameter to Yes, if that is not a requirement, you can set it to No.',
      )}
    </Text>
  )
  const TooltipComponent12 = () => (
    <Text>
      {t(
        'Dynamic prices enables you to set multiple prices for the same product, you can set the price of your product to appreciate over time by specifying the array of prices right here, for instance: 1,2,3,4,5',
      )}
    </Text>
  )
  const TooltipComponent13 = () => (
    <Text>
      {t(
        'This field works together with the previous to set the dynamic pricing scheme. The current price index in the array specified above is computed with the following formula: current_timestamp - start / period with current_timetamp being the time in seconds at the current time.',
      )}
    </Text>
  )
  const TooltipComponent14 = () => (
    <Text>
      {t(
        'This parameter sets whether the item is tradable or not. Set it to No if you do not want users to be able to purchase the current item which can be the case for articles, blog posts, etc.',
      )}
    </Text>
  )
  const TooltipComponent15 = () => (
    <Text>
      {t(
        "Make sure you have select a FIAT token in the drop-down menu on top of the List Product/List Paywall button before clicking them. If you've done socials, pick Yes",
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
  const {
    targetRef: targetRef14,
    tooltip: tooltip14,
    tooltipVisible: tooltipVisible14,
  } = useTooltip(<TooltipComponent14 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef15,
    tooltip: tooltip15,
    tooltipVisible: tooltipVisible15,
  } = useTooltip(<TooltipComponent15 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  console.log('state.options===============>', state.options, !!state.options[0]?.category)
  return (
    <>
      <Flex alignSelf="center">
        <Flex ref={targetRef}>
          <Filters
            nftFilters={nftFilters}
            setNftFilters={setNftFilters}
            showCountry={false}
            showCity={false}
            showProduct={false}
          />
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
      </Flex>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Maximum Supply')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="number"
          scale="sm"
          name="maxSupply"
          value={state.maxSupply}
          placeholder={t('input maximum supply')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Asking Price')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="number"
          scale="sm"
          name="currentAskPrice"
          value={state.currentAskPrice}
          placeholder={t('input item price')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Add or remove options (Required)')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Options
          name="options"
          addValue={variant === 'paywall'}
          choices={state.options}
          onChange={handleChoiceChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('View advanced parameters?')}
          </Text>
          {tooltipVisible5 && tooltip5}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <ButtonMenu scale="xs" variant="subtle" activeIndex={advanced} onItemClick={(e) => setAdvanced(e)}>
          <ButtonMenuItem>{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      {advanced ? (
        <>
          <GreyedOutContainer>
            <Flex ref={targetRef6}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Pick drop-in date')}
              </Text>
              {tooltipVisible6 && tooltip6}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <DatePicker
              onChange={handleRawValueChange('dropinDate')}
              selected={state.dropinDate}
              placeholderText="YYYY/MM/DD"
            />
            <DatePickerPortal />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Box>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Drop-in Time')}
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
            <Flex ref={targetRef7}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Bid Duration (in minutes)')}
              </Text>
              {tooltipVisible7 && tooltip7}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="number"
              scale="sm"
              name="bidDuration"
              value={state.bidDuration}
              placeholder={t('input bid duration')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef8}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Bid Increment Percentage')}
              </Text>
              {tooltipVisible8 && tooltip8}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Slider
              min={0}
              max={100}
              value={!state.minBidIncrementPercentage ? 0 : state.minBidIncrementPercentage}
              name="minBidIncrementPercentage"
              onValueChanged={handleRawValueChange('minBidIncrementPercentage')}
              valueLabel={`${state.minBidIncrementPercentage}%`}
              step={1}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef9}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Auditor Badge ID')}
              </Text>
              {tooltipVisible9 && tooltip9}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="number"
              scale="sm"
              name="rsrcTokenId"
              value={state.rsrcTokenId}
              placeholder={t('input auditor badge id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <StyledItemRow>
              <Flex ref={targetRef10} paddingRight="5px">
                <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="10px" bold>
                  {t('Make NFTickets Transferrable')}
                </Text>
                {tooltipVisible10 && tooltip10}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <ButtonMenu
                scale="sm"
                variant="subtle"
                activeIndex={state.transferrable}
                onItemClick={handleRawValueChange('transferrable')}
              >
                <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
              </ButtonMenu>
            </StyledItemRow>
          </GreyedOutContainer>
          <GreyedOutContainer>
            <StyledItemRow>
              <Flex ref={targetRef11} paddingRight="5px">
                <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="10px" bold>
                  {t('Require Upfront Payment')}
                </Text>
                {tooltipVisible11 && tooltip11}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <ButtonMenu
                scale="sm"
                variant="subtle"
                activeIndex={state.requireUpfrontPayment}
                onItemClick={handleRawValueChange('requireUpfrontPayment')}
              >
                <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
              </ButtonMenu>
            </StyledItemRow>
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef12}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Dynamic Prices')}
              </Text>
              {tooltipVisible12 && tooltip12}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="prices"
              value={state.prices}
              placeholder={t('input dynamic prices')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef13}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Dynamic pricing start and period')}
              </Text>
              {tooltipVisible13 && tooltip13}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <StyledItemRow>
              <Input
                type="text"
                scale="sm"
                name="start"
                value={state.start}
                placeholder={t('input start')}
                onChange={handleChange}
              />
              <span style={{ padding: '8px' }} />
              <Input
                type="text"
                scale="sm"
                name="period"
                value={state.period}
                placeholder={t('input period')}
                onChange={handleChange}
              />
            </StyledItemRow>
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef14}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Is the item tradable?')}
              </Text>
              {tooltipVisible14 && tooltip14}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <StyledItemRow>
              <ButtonMenu
                scale="xs"
                variant="subtle"
                activeIndex={state.isTradable}
                onItemClick={handleRawValueChange('isTradable')}
              >
                <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
              </ButtonMenu>
            </StyledItemRow>
          </GreyedOutContainer>
        </>
      ) : null}
      <GreyedOutContainer>
        <Flex ref={targetRef15}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Did you pick a FIAT token?')}
          </Text>
          {tooltipVisible15 && tooltip15}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <ButtonMenu
          scale="xs"
          variant="subtle"
          activeIndex={state.usetFIAT}
          onItemClick={handleRawValueChange('usetFIAT')}
        >
          <ButtonMenuItem>{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {variant === 'paywall'
              ? t('This will create a paywall behind which you can add products later.')
              : t('This will list the product in the marketplace for users to order.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={
            !state.usetFIAT ||
            !state.tokenId?.split(' ')?.join('-')?.trim()?.length ||
            (variant === 'paywall' &&
              (!state.options.length ||
                (state.options.length &&
                  (!state.options[0]?.category ||
                    !state.options[0]?.element ||
                    !state.options[0]?.currency ||
                    !state.options[0]?.value ||
                    !state.options[0]?.unitPrice ||
                    !state.options[0]?.value ||
                    !state.options[0]?.min ||
                    !state.options[0]?.max))))
          }
        >
          {t('Create Listing')}
        </Button>
      </Flex>
    </>
  )
}

export default EnlistStage
