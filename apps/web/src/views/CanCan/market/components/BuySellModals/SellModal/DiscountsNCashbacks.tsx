import {
  Flex,
  Grid,
  Text,
  Button,
  Input,
  ErrorIcon,
  LinkExternal,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'

interface TransferStageProps {
  nftToSell?: any
  lowestPrice: number
  state: any
  handleRawValueChange?: any
  continueToNextStage: () => void
}

const DiscountsNCashbacks: React.FC<any> = ({
  thumbnail,
  nftToSell,
  state,
  collectionId,
  activeButtonIndex,
  setActiveButtonIndex,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const isInvalidField1 = false
  const isInvalidField2 = false
  const {
    discountStatus,
    discountStart,
    cashNotCredit,
    checkIdentityCode,
    checkItemOnly,
    cashbackStatus,
    cashbackStart,
    discountNumbers,
    discountCost,
    cashbackNumbers,
    cashbackCost,
  } = state
  const TooltipComponent = () => (
    <Text>
      {t(
        'The discount status show whether a discount is active or not. Pick Open to create a new discount or close to close an existing one.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t('This sets the date at which the marketplace will start to apply your discount to products being bought.')}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'This sets the discount number parameters which are basically a series of 6 numbers that the marketplace contract uses to compute the discount each customer is elligible to depending on the total number of their past purchases on your channel. For that purpose, it will check those numbers against customers NFTickets/eReceipts. Take the series 24642153,25642153,10,20,100,1 for instance; the first 2 numbers are time periods in seconds that tell the marketplace that only users that have made purchases between timestamps 24642153 and 25642153 are elligible for the discount. The 3rd one tells the marketplace to apply a 10% discount on the purchase price of the current product the user is trying to buy. The 4th and 5th numbers set consecutively a lower and upper threshold on the total number of items users eligible for a discount must have purchased between the prespecified time periods. Finally the last number sets a limit on the number of times a single user can claim this discount on a product. In summary the previous 6 numbers tell the marketplace to apply only once per address, a discount of 10% on purchases made by customers that have in the past between time periods 24642153 & 25642153 purchased between 20 and 100 items from the channel.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This sets the discount cost parameters which are basically a series of 6 numbers that the marketplace contract uses to compute the discount each customer is elligible to depending on the total cost of their past purchases on your channel. For that purpose, it will check those numbers against customers NFTickets/eReceipts. Take the series 24642153,25642153,10,20,100,1 for instance; the first 2 numbers are time periods in seconds that tell the marketplace that only users that have made purchases between timestamps 24642153 and 25642153 are elligible for the discount. The 3rd one tells the marketplace to apply a 10% discount on the purchase price of the current product the user is trying to buy. The 4th and 5th numbers set consecutively a lower and upper threshold on the total cost of items users eligible for a discount must have purchased between the prespecified time periods. Finally the last number sets a limit on the number of times a single user can claim this discount on a product. In summary the previous 6 numbers tell the marketplace to apply only once per address, a discount of 10% on purchases made by customers that have in the past between time periods 24642153 & 25642153 purchased between 20 and 100 tokens worth of items from the channel. Using this parameter in conjuction with the previous one enables you to define complex discount conditions. You can for instance target users that have bought a certain number of items that have cost a certain amount in a certain time period.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'The cashback status show whether a cashback is active or not. Pick Open to create a new cashback or close to close an existing one.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t('This sets the date at which the marketplace will start to give out cashback on products purchases.')}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This sets the cashback number parameters which are basically a series of 6 numbers that the marketplace contract uses to compute the cashback each customer is elligible to depending on the total number of their past purchases on your channel. For that purpose, it will check those numbers against customers NFTickets/eReceipts. Take the series 24642153,25642153,10,20,100,1 for instance; the first 2 numbers are time periods in seconds that tell the marketplace that only users that have made purchases between timestamps 24642153 and 25642153 are elligible for the cashback. The 3rd one tells the marketplace to apply a cashback of 10% on the purchase price of the current product. The 4th and 5th numbers set consecutively a lower and upper threshold on the total number of items users eligible for a cashback must have purchased between the prespecified time periods. Finally the last number sets a limit on the number of times a single user can claim this cashback on the product. In summary the previous 6 numbers tell the marketplace to apply only once per address, a cashback of 10% on purchases made by customers that have in the past between time periods 24642153 & 25642153 purchased between 20 and 100 items from the channel.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        'This sets the cashback cost parameters which are basically a series of 6 numbers that the marketplace contract uses to compute the cashback each customer is elligible to depending on the total cost of their past purchases on your channel. For that purpose, it will check those numbers against customers NFTickets/eReceipts. Take the series 24642153,25642153,10,20,100,1 for instance; the first 2 numbers are time periods in seconds that tell the marketplace that only users that have made purchases between timestamps 24642153 and 25642153 are elligible for the cashback. The 3rd one tells the marketplace to apply a cashback of 10% on the purchase price of the current product. The 4th and 5th numbers set consecutively a lower and upper threshold on the total cost of items users eligible for a cashback must have purchased between the prespecified time periods. Finally the last number sets a limit on the number of times a single user can claim this cashback on the product. In summary the previous 6 numbers tell the marketplace to apply only once per address, a cashback of 10% on purchases made by customers that have in the past between time periods 24642153 & 25642153 purchased between 20 and 100 tokens worth of items from the channel. Using this parameter in conjuction with the previous one enables you to define complex cashback conditions. You can for instance target users that have bought a certain number of items that have cost a certain amount in a certain time period.',
      )}
    </Text>
  )
  const TooltipComponent9 = () => (
    <Text>{t('This specifies whether cashbacks should be given in store credit or cash.')}</Text>
  )
  const TooltipComponent10 = () => (
    <Text>
      {t(
        "The marketplace keeps track of the number of times a user has benefited from a certain discount/cashback in order to make sure that number doesn't pass the limit set when specifying the discount/cashback parameters. Users might be able to circumvent that by using a different wallet address, in case that might be a problem for your discount/cashback program, you can set this parameter to Yes in order to identify each user by their unique ssids which are unique to users instead of their wallet addresses which are note necessarily unique.",
      )}
    </Text>
  )
  const TooltipComponent11 = () => (
    <Text>
      {t(
        'This parameter sets whether to check the discount/cashback parameters only on the purchase history involving the current item or all items from the channel.',
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
  const discountSection = (
    <>
      <GreyedOutContainer style={{ paddingTop: '50px' }}>
        <StyledItemRow>
          <Flex ref={targetRef} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Status')}
            </Text>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={discountStatus}
            onItemClick={handleRawValueChange('discountStatus')}
          >
            <ButtonMenuItem>{t('Pending')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Open')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Close')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Start Date')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <DatePicker
          onChange={handleRawValueChange('discountStart')}
          selected={discountStart}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Percent of discount for users based on their brackets (from numbers)')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          name="discountNumbers"
          value={discountNumbers}
          placeholder="24642153,25642153,10,20,100,1"
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Percent of discount for users based on their brackets (from cost)')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          name="discountCost"
          value={discountCost}
          placeholder="24642153,25642153,10,20,100,1"
          onChange={handleChange}
        />
      </GreyedOutContainer>
    </>
  )

  const cashbackSection = (
    <>
      <GreyedOutContainer style={{ paddingTop: '50px' }}>
        <StyledItemRow>
          <Flex ref={targetRef5} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Status')}
            </Text>
            {tooltipVisible5 && tooltip5}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={cashbackStatus}
            onItemClick={handleRawValueChange('cashbackStatus')}
          >
            <ButtonMenuItem>{t('Pending')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Open')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Close')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Start Date')}
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <DatePicker
          name="cashbackStart"
          onChange={handleRawValueChange('cashbackStart')}
          selected={cashbackStart}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef7}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Percent of cashback for users based on their brackets (from numbers)')}
          </Text>
          {tooltipVisible7 && tooltip7}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          name="cashbackNumbers"
          value={cashbackNumbers}
          placeholder="24642153,25642153,10,20,100,1"
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef8}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Percent of cashback for users based on their brackets (from cost)')}
          </Text>
          {tooltipVisible8 && tooltip8}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          name="cashbackCost"
          value={cashbackCost}
          placeholder="24642153,25642153,10,20,100,1"
          onChange={handleChange}
        />
      </GreyedOutContainer>
    </>
  )

  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Discounts & Cashbacks')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell?.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <ButtonMenu scale="sm" activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
        <ButtonMenuItem>{t('Discounts')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Cashbacks')}</ButtonMenuItem>
      </ButtonMenu>
      {!activeButtonIndex ? discountSection : cashbackSection}
      {!activeButtonIndex ? null : (
        <GreyedOutContainer>
          <Divider />
          <StyledItemRow>
            <Flex ref={targetRef9} paddingRight="50px">
              <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" bold>
                {t('Rewards in')}
              </Text>
              {tooltipVisible9 && tooltip9}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <ButtonMenu
              scale="sm"
              variant="subtle"
              activeIndex={cashNotCredit}
              onItemClick={handleRawValueChange('cashNotCredit')}
            >
              <ButtonMenuItem>{t('Credits')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Cash')}</ButtonMenuItem>
            </ButtonMenu>
          </StyledItemRow>
        </GreyedOutContainer>
      )}
      {!activeButtonIndex ? (
        <GreyedOutContainer>
          <StyledItemRow>
            <Flex ref={targetRef10} paddingRight="50px">
              <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" bold>
                {t('Check identity')}
              </Text>
              {tooltipVisible10 && tooltip10}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <ButtonMenu
              scale="sm"
              variant="subtle"
              activeIndex={checkIdentityCode}
              onItemClick={handleRawValueChange('checkIdentityCode')}
            >
              <ButtonMenuItem>{t('No')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
            </ButtonMenu>
          </StyledItemRow>
        </GreyedOutContainer>
      ) : null}
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef11} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" bold>
              {t('Check Only Item')}
            </Text>
            {tooltipVisible11 && tooltip11}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="sm"
            variant="subtle"
            activeIndex={checkItemOnly}
            onItemClick={handleRawValueChange('checkItemOnly')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
        <Divider />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t(
            "This action will create discounts on this product for users either based on number of purchases made or value of purchases starting from a specified date. Please read each parameter's explanation for more details.",
          )}
        </Text>
      </Grid>
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href="https://docs.payswap.org/products/cancan/discounts">
          {t('Learn more about discounts & cashbacks')}
        </LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage} disabled={isInvalidField1 || isInvalidField2}>
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default DiscountsNCashbacks
