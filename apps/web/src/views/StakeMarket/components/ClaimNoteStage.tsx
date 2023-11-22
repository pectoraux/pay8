import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, Heading, Balance } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { NftToken } from 'state/cancan/types'
import { GreyedOutContainer, Divider } from './styles'
import { useGetNote } from 'state/stakemarket/hooks'
import { differenceInSeconds } from 'date-fns'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import styled from 'styled-components'
import Timer from 'views/StakeMarket/components/PoolsTable/Cells/Timer'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'

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

const StyledTimerText = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ state, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { data, refetch } = useGetNote(state.noteId)
  const revenue = data?.length ? data[0]?.toString() : '0'
  const expirationDate = data?.length ? data[1]?.toString() : '0'
  console.log('SetPriceStage=================>', data)

  useEffect(() => {
    refetch()
  }, [state])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const diff = Math.max(
    differenceInSeconds(new Date(parseInt(expirationDate) * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days, hours, minutes } = getTimePeriods(diff ?? 0)

  return (
    <>
      <GreyedOutContainer>
        <Balance
          lineHeight="1"
          color="textSubtle"
          fontSize="12px"
          decimals={state.decimals}
          value={getBalanceNumber(new BigNumber(revenue?.toString()), state.decimals)}
        />
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Pending Revenue')}
        </Text>
        {days || hours || minutes ? (
          <Flex flexDirection="row">
            <Timer minutes={minutes} hours={hours} days={days} />
            <StyledTimerText mt="20px">{days || hours || minutes ? t('before due') : ''}</StyledTimerText>
          </Flex>
        ) : (
          <StyledTimerText>{parseInt(revenue?.toString()) ? t('Note Claimable After Due Date') : ''}</StyledTimerText>
        )}
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Note ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="noteId"
          value={state.noteId}
          placeholder={t('input Id of transfer note')}
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
              'This will transfer all revenue currently due to this note to your account. Notes are mechanisms through which a stake owner can sell his/her rights to a future round of revenue from stake in order to access the revenues faster. A note unlocking a future round of revenue of 100 tokens can be sold for 95 tokens today for instance.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Claim')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
