import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, useTooltip, HelpIcon } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'

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
const SetPriceStage: React.FC<any> = ({ state, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()

  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <>
      <Text>
        {t(
          'There are 6 brackets going from 0 to 5. To check for multiple brackets at the same time, for instance brackets 0-5 for ticket #1, you will input 1,1,1,1,1,1 in the field above and 0,1,2,3,4,5 in this field',
        )}
      </Text>
      {/* {creatorFeeAsNumber > 0 && (
        <Text>{t('%percentage%% royalties to the collection owner', { percentage: creatorFee })}</Text>
      )}
      <Text>{t('%percentage%% trading fee will be used to buy & burn CAKE', { percentage: tradingFee })}</Text> */}
    </>,
    { placement: 'auto' },
  )

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Lottery ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="lotteryId"
          value={state.lotteryId}
          placeholder={t('input lottery id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Ticket IDs')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="ticketNumbers"
          value={state.ticketNumbers}
          placeholder={t('comma separated ticket ids')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex flexDirection="row">
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Brackets')}
          </Text>
          <Flex ref={targetRef}>
            <HelpIcon color="textSubtle" ml="6px" />
          </Flex>
        </Flex>
        {tooltipVisible && tooltip}
        <Input
          type="text"
          scale="sm"
          name="brackets"
          value={state.brackets}
          placeholder={t('comma separated list of brackets')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('The will claim earnings of listed ticket numbers. Please read the documentation for more details.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          // disabled={priceIsValid || adjustedPriceIsTheSame || priceIsOutOfRange}
        >
          {t('Claim Tickets')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
