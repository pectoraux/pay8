import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Input,
  ErrorIcon,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
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
    <Text>{t('You need the password of the card to unlock enough funds from it to make the purchase.')}</Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t('You need to specify the address of the owner of the channel to which the item to purchase belongs.')}
    </Text>
  )
  const TooltipComponent3 = () => <Text>{t('You need to specify the id of the item to purchase.')}</Text>

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

  return (
    <>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef}>
            <Text
              fontSize="12px"
              color="secondary"
              textTransform="uppercase"
              paddingTop="13px"
              paddingRight="50px"
              bold
            >
              {t('Are you a referrer')}
            </Text>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="sm"
            variant="subtle"
            activeIndex={state.referrer}
            onItemClick={handleRawValueChange('referrer')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
        <Divider />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Lottery ID')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="lotteryId"
          value={state.lotteryId}
          placeholder={t('input lottery id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      {!state.referrer ? (
        <GreyedOutContainer>
          <Flex ref={targetRef3}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Identity Token ID')}
            </Text>
            {tooltipVisible3 && tooltip3}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="identityTokenId"
            value={state.identityTokenId}
            placeholder={t('input identity token id')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
      ) : null}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'The will your pending rewards in the specified lottery. Please read the documentation for more information.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Withdraw')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
