import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, Balance, Heading } from '@pancakeswap/uikit'
import _toNumber from 'lodash/toNumber'

import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { differenceInSeconds } from 'date-fns'
import styled from 'styled-components'
import Timer from 'views/StakeMarket/components/PoolsTable/Cells/Timer'
import { useGetPendingFromNote } from 'state/sponsors/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { GreyedOutContainer, Divider } from './styles'

const StyledTimerText = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

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
  const { data, refetch } = useGetPendingFromNote(state.tokenId)
  const revenue = data?.length && data[0]?.toString()
  const expirationDate = data?.length ? data[1]?.toString() : '0'

  useEffect(() => {
    refetch()
  }, [refetch, state])

  const diff = Math.max(
    differenceInSeconds(new Date(parseInt(expirationDate) * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days, hours, minutes } = getTimePeriods(diff ?? 0)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

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
          {t('Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="tokenId"
          value={state.tokenId}
          placeholder={t('input token id')}
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
              'This will withdraw revenues currently due to this note. How do notes work? A note that unlocks a payment of 10 tokens in 2 weeks from now, can be minted and sold today for 8 tokens for instance. A note is basically like an IOU that gives its owner the right to claim a certain amount from a sponsorship deal in the future. Deal owners can mint notes on deals created for them which they can sell at a slightly lesser price than the payment the note will be able to unlock in the future. That way they get to access their future payments early and the party that buys the note gets to earn some interest from the note when it becomes due. You cannot mint more notes than the maximum allowed by the protocol',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" variant="danger" onClick={continueToNextStage}>
          {t('Claim Pending Revenue')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
