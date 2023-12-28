import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  Heading,
  Balance,
  ButtonMenu,
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import _toNumber from 'lodash/toNumber'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useGetPendingFromNote } from 'state/arps/hooks'
import BigNumber from 'bignumber.js'
import { StyledItemRow } from 'views/CanCan/market/components/Filters/ListFilter/styles'
import { differenceInSeconds } from 'date-fns'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import styled from 'styled-components'
import Timer from 'views/StakeMarket/components/PoolsTable/Cells/Timer'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
  continueToNextStage?: () => void
}

const StyledTimerText = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ state, handleChange, handleRawValueChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { data, refetch } = useGetPendingFromNote(state.tokenId)
  const revenue =
    data?.note?.length && state.adminNote
      ? data?.pendingRevenueFromNote
      : data?.note?.length
      ? data.note[0]?.toString()
      : '0'
  const expirationDate = data?.note?.length ? data.note[1]?.toString() : '0'
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  useEffect(() => {
    refetch()
  }, [state])

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
      <GreyedOutContainer style={{ paddingTop: '10px' }}>
        <StyledItemRow>
          <Text fontSize="12px" paddingRight="50px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
            {t('Is Admin Note?')}
          </Text>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.adminNote}
            onItemClick={handleRawValueChange('adminNote')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
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
              'This will withdraw revenues currently due to this note. Please read the documentation for more details.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Claim Pending Revenue')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
