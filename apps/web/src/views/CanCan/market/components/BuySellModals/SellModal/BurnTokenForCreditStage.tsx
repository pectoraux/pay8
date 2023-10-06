import {
  Flex,
  Grid,
  Text,
  Button,
  Input,
  ButtonMenu,
  ButtonMenuItem,
  ErrorIcon,
  LinkExternal,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'

interface TransferStageProps {
  nftToSell?: any
  lowestPrice: number
  burnForCreditToken: string
  setBurnForCreditToken: React.Dispatch<React.SetStateAction<string>>
  discountNumber: string
  setDiscountNumber: React.Dispatch<React.SetStateAction<string>>
  continueToNextStage: () => void
}

const BurnTokenForCreditStage: React.FC<any> = ({
  thumbnail,
  nftToSell,
  collectionId,
  state,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const TooltipComponent = () => (
    <Text>
      {t('This is the address of the token you want users to burn in exchange for a certain amount of credit.')}
    </Text>
  )
  const TooltipComponent2 = () => <Text>{t('This specifies the value of the discount in percentages.')}</Text>
  const TooltipComponent3 = () => (
    <Text>
      {t(
        "This specifies the address of the contract that checks whether a user's token is elligible or not for a discount.",
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        "This is the address where 'burnt' tokens go, it can be the zero address (0x0000000000000000000000000000000000000000) in case you want users tokens burnt, the marketplace trades contract in case you want the tokens to be sent back to their owners or any other address you would like the tokens being 'burnt' to be sent.  For subscription products, you should instead input the paywall market trades contracts and for eCollectibles, you should input the NFT market trades address if your want the tokens to be sent back to their owners.",
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        "This sets the id of the channel that has listed the product for which to grant customers store credits in exchange for 'burning' the token specified above.",
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        "This sets the id of the product for which to grant customers store credits in exchange for 'burning' the token specified above.",
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This specifies whether to remove all burn for credit token incentives that have been previously added or to add the current one in addition to them.',
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

  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Token to burn for credit')}
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
            {t('Address of token')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          scale="sm"
          placeholder={t('paste your token address')}
          name="token"
          value={state.token}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Discount number')}(%)
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          inputMode="decimal"
          pattern="^[0-9]+[.,]?[0-9]*$"
          scale="sm"
          name="discountNumber"
          value={state.discountNumber}
          placeholder={t('this number multiplies amount burn')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Checker')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="checker"
          value={state.checker}
          placeholder={t('this contract checks the validity of the tokens')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Destination')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="destination"
          value={state.destination}
          placeholder={t('this is where the tokens are sent')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Collection ID')}
          </Text>
          {tooltipVisible5 && tooltip5}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="collectionId"
          value={state.collectionId}
          placeholder={t('this is the channel to check against')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Product ID')}
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="productId"
          value={state.productId}
          placeholder={t('this is the product to check against')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef7} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Clear')}
            </Text>
            {tooltipVisible7 && tooltip7}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu scale="xs" variant="subtle" activeIndex={state.clear} onItemClick={handleRawValueChange('clear')}>
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t(
            "This action will create discounts on this product for users who burn this token. Discount = discount number * number of token burned. You can for instance create an incentive that rewards users with 10% of the current item's price in channel credits for this item in exchange for them 'burning' 1 BTC. Notice the way we use the term 'burn' in here doesn't necessarily implies actually burning the tokens, it might but it might just also send the tokens back to your users if you input the marketplace trades address in the destination field. For subscription products, you should instead input the paywall market trades contracts and for eCollectibles, you should input the NFT market trades address if your want the tokens to be sent back their owners.",
          )}
        </Text>
      </Grid>
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href="">{t('Learn more about burns for credit')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default BurnTokenForCreditStage
