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
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'

import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  lowestPrice?: number
  state: any
  account?: any
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
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

  const TooltipComponent = () => <Text>{t('.')}</Text>
  const TooltipComponent2 = () => <Text>{t('.')}</Text>
  const TooltipComponent3 = () => <Text>{t('.')}</Text>
  const TooltipComponent4 = () => <Text>{t('.')}</Text>
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
              {t('Action')}
            </Text>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="sm"
            variant="subtle"
            activeIndex={state.action}
            onItemClick={handleRawValueChange('action')}
          >
            <ButtonMenuItem>{t('Attach')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Kill Timer')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Detach')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
        <Divider />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Token ID')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="tokenId"
          value={state.tokenId}
          placeholder={t('input gaming ticket id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      {!state.action ? (
        <>
          <GreyedOutContainer>
            <Flex ref={targetRef3}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('End Date')}
              </Text>
              {tooltipVisible3 && tooltip3}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <DatePicker
              onChange={handleRawValueChange('period')}
              selected={state.period}
              placeholderText="YYYY/MM/DD"
            />
            <DatePickerPortal />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef4}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Attach To')}
              </Text>
              {tooltipVisible4 && tooltip4}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="toAddress"
              value={state.toAddress}
              placeholder={t('address of attachment recipient')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
        </>
      ) : null}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="500px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will attach, kill the timer or detach the specified token id. Please read the documentation for more details.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('%val%', { val: !state.action ? 'Attach' : state.action === 1 ? 'Kill Timer' : 'Detach' })}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
