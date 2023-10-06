import { useEffect, useRef } from 'react'
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
  Skeleton,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import multiplyPriceByAmount from '@pancakeswap/utils/multiplyPriceByAmount'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { CurrencyLogo } from 'components/Logo'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { StyledItemRow } from 'views/CanCan/market/components/Filters/ListFilter/styles'
import { OptionType } from './types'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer, RightAlignedInput, FeeAmountCell } from './styles'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  state: any
  handleChange: (any) => void
  handleChoiceChange: () => void
  handleRawValueChange?: any
  continueToNextStage: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  nftToSell,
  thumbnail,
  variant,
  currency,
  collectionId,
  currentPrice,
  state,
  handleChange,
  handleChoiceChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const {
    price,
    bidDuration,
    minBidIncrementPercentage,
    transferrable,
    requireUpfrontPayment,
    rsrcTokenId,
    maxSupply,
    dropinTimer,
    options,
  } = state
  const adjustedPriceIsTheSame = variant === 'adjust' && parseFloat(currentPrice) === parseFloat(price)
  const priceAsFloat = parseFloat(price)
  const priceIsValid = !price || Number.isNaN(priceAsFloat) || priceAsFloat <= 0
  const tradingFee = (priceAsFloat / 100)?.toString()
  const tradingFeeAsNumber = parseFloat(tradingFee)
  const bnbPrice = useBNBBusdPrice()
  const priceInUsd = multiplyPriceByAmount(bnbPrice, priceAsFloat)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const getButtonText = () => {
    if (variant === 'adjust') {
      if (adjustedPriceIsTheSame || priceIsValid) {
        return t('Input New Sale Price')
      }
      return t('Adjust')
    }
    return t('Enable Listing')
  }

  const TooltipComponent = () => <Text>{t('Use this field to update the price of your product.')}</Text>
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This parameter is useful for product auctions and sets a duration in minutes after which the auction automatically closes. If for instance you set that number to 10, the auction will automatically close 10 minutes after the last bid unless a new bid is made.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        "NFTickets are eReceipts on the blockchain that users receive after each purchase as proof of purchase. If you don't want users to be able to transfer their NFTickets to other wallets, you can set this parameter to No. For instance when selling tickets to a concert or an event, you might want to prevent users from reselling their tickets and this might help you do just that.",
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'In case customer might want to purchase this item through the stake market, this parameters sets whether or not they should be required to send the purchase price to the stake when creating it. If you want to be sure the customers have the money for the purchase before being allowed to create a stake to purchase your item, you can set this parameter to Yes, if that is not a requirement, you can set it to No.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'In case your product has some ESG badge or some other one delivered by an auditor, you can attach that badge to your product by inputting its id right here. This adds to the credibility of your product in the marketplace, you can use it to prove that you are a trustworthy merchant, that your luxury items are authentic, etc.',
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
        'Pick the marketplace where the item is listed, pick Subscription if it is a subscription product, NFT if it is purchased from eCollectibles but not a subscription product and CanCan otherwise.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>{t('This sets the maximum number of the current product you have in stock for users.')}</Text>
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

  return (
    <>
      <Text fontSize="24px" bold p="16px">
        {t('Adjust Sale Price')}
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
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Adjust Price')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Flex>
          <Flex flex="1" alignItems="center">
            <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
            <Text bold>{currency?.symbol}</Text>
          </Flex>
          <Flex flex="2">
            <RightAlignedInput
              scale="sm"
              type="number"
              inputMode="decimal"
              id="price"
              name="price"
              value={price}
              ref={inputRef}
              onChange={handleChange}
            />
          </Flex>
        </Flex>
        <Flex alignItems="center" height="21px" justifyContent="flex-end">
          {!Number.isNaN(priceInUsd) && (
            <Text fontSize="12px" color="textSubtle">
              {`$${priceInUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </Text>
          )}
        </Flex>
        <Flex mt="8px">
          {Number.isFinite(tradingFeeAsNumber) ? (
            <Text small color="textSubtle" mr="8px">
              {t('Seller pays %percentage%% platform fee on sale', {
                percentage: tradingFeeAsNumber,
              })}
            </Text>
          ) : (
            <Skeleton width="70%" />
          )}
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt="16px">
          <Text small color="textSubtle">
            {t('Platform fee if sold')}
          </Text>
          {Number.isFinite(tradingFeeAsNumber) ? (
            <FeeAmountCell bnbAmount={tradingFeeAsNumber} currency={currency} tradingFee={1} />
          ) : (
            <Skeleton width={40} />
          )}
        </Flex>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Bid Duration (in minutes)')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="number"
          scale="sm"
          id="bidDuration"
          name="bidDuration"
          value={bidDuration || 0}
          placeholder="25"
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Min Bid Increment Percentage')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Slider
          min={0}
          max={100}
          value={minBidIncrementPercentage ?? 0}
          id="minBidIncrementPercentage"
          name="minBidIncrementPercentage"
          onValueChanged={handleRawValueChange('minBidIncrementPercentage')}
          valueLabel={`${minBidIncrementPercentage ?? 0}%`}
          step={1}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef4} paddingRight="5px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Make NFTickets Transferrable')}
            </Text>
            {tooltipVisible4 && tooltip4}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="sm"
            variant="subtle"
            activeIndex={transferrable ? 1 : 0}
            onItemClick={handleRawValueChange('transferrable')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef5} paddingRight="5px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Require Upfront Payment For Staking')}
            </Text>
            {tooltipVisible5 && tooltip5}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="sm"
            variant="subtle"
            activeIndex={requireUpfrontPayment ? 1 : 0}
            onItemClick={handleRawValueChange('requireUpfrontPayment')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Auditor Badge ID')}
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="number"
          scale="sm"
          id="rsrcTokenId"
          name="rsrcTokenId"
          value={rsrcTokenId ?? 0}
          placeholder={t('input badge id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef7}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Pick drop-in date')}
          </Text>
          {tooltipVisible7 && tooltip7}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <DatePicker
          onChange={handleRawValueChange('dropinTimer')}
          selected={dropinTimer ?? 0}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef8}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Maximum Supply')}
          </Text>
          {tooltipVisible8 && tooltip8}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="number"
          scale="sm"
          id="maxSupply"
          name="maxSupply"
          value={maxSupply}
          placeholder={t('input max supply')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will update the price of the item along with other parameters.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {getButtonText()}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
