import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  ButtonMenu,
  ButtonMenuItem,
  Button,
  Input,
  ErrorIcon,
  useTooltip,
  HelpIcon,
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
const BurnForCreditStage: React.FC<SetPriceStageProps> = ({
  state,
  handleChange,
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

  const TooltipComponent = () => (
    <Text>
      {t(
        'This sets the position/index of the burn for credit discount for which you would like to claim discounts. The index is available in the parameters section of this betting contract.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This is necessary for the betting contract to understand how to transfer your token. Pick No if it is not an NFT and Yes otherwise.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Input your NFT token id in case your token is not fungible and the amount of token to burn in case your token is fungible.',
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

  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Betting Contract Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="betting"
          value={state.betting}
          placeholder={t('input bettng contract address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Credit Index')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="position"
          value={state.position}
          placeholder={t('input credit index')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef2} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Is Credit token fungible?')}
            </Text>
            {tooltipVisible2 && tooltip2}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.fungible}
            onItemClick={handleRawValueChange('fungible')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {!state.fungible ? t('Token ID') : t('Amount Receivable')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input %val%', { val: !state.fungible ? 'token id' : 'amount receivable' })}
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
              'The burns your tokens for discount on your ticket prices in the betting event. Please read the documentation for more information.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Burn for credit')}
        </Button>
      </Flex>
    </>
  )
}

export default BurnForCreditStage
