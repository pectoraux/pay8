import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Text,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Progress,
  Tag,
  useToast,
  Button,
  AutoRenewIcon,
  CheckmarkCircleIcon,
} from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import Countdown from 'views/Lottery/components/Countdown'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useStakeMarketVoterContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { differenceInSeconds } from 'date-fns'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import styled from 'styled-components'

import TextEllipsis from '../components/TextEllipsis'
import Timer from './Timer'

// interface ResultsProps {
//   choices: string[]
//   votes: Vote[]
//   votesLoadingStatus: FetchStatus
// }

const StyledTimerText = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Results: React.FC<any> = ({ litigation, hasAccountVoted, hasVotedForAttacker, hasVotedForDefender }) => {
  const { t } = useTranslation()
  const totalVotes = litigation?.votes?.length ? litigation.votes.reduce((ac, v) => ac + parseInt(v.votingPower), 0) : 0
  const total1Votes = litigation?.votes?.length
    ? litigation.votes.filter((v) => v.choice === 'Attacker').reduce((ac, v) => ac + parseInt(v.votingPower), 0)
    : 0
  const total2Votes = litigation?.votes?.length
    ? litigation.votes.filter((v) => v.choice === 'Defender').reduce((ac, v) => ac + parseInt(v.votingPower), 0)
    : 0
  const count1 = litigation?.votes?.length ? litigation.votes.filter((v) => v.choice === 'Attacker')?.length : 0
  const count2 = litigation?.votes?.length ? litigation.votes.filter((v) => v.choice === 'Defender')?.length : 0
  const progress1 = (total1Votes * 100) / Math.max(totalVotes, 1)
  const progress2 = (total2Votes * 100) / Math.max(totalVotes, 1)
  const afterOneWeek = convertTimeToSeconds(litigation?.endTime || 0) < Date.now()
  const router = useRouter()
  const { toastSuccess } = useToast()
  const [pendingFb, setPendingFb] = useState(false)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const stakeMarketVoterContract = useStakeMarketVoterContract()
  const diff = Math.max(
    differenceInSeconds(new Date(parseInt(litigation?.endTime) * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days, hours, minutes } = getTimePeriods(diff ?? 0)

  const handleApplyResults = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [litigation?.ve, litigation?.id]
      console.log('stakeMarketVoterContract====================>', args)
      return callWithGasPrice(stakeMarketVoterContract, 'updateStakeFromVoter', args).catch((err) => {
        console.log('err====================>', err)
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Results successfully applied'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start receiving votes accordingly.')}
        </ToastDescriptionWithTx>,
      )
      router.push('/stakemarket/voting')
    } else {
      setPendingFb(false)
    }
  }, [t, router, litigation, stakeMarketVoterContract, toastSuccess, callWithGasPrice, fetchWithCatchTxError])

  return (
    <Card>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Current Results')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Box key="attacker" mt="24px">
          <Flex alignItems="center" mb="8px">
            <TextEllipsis mb="4px" title={t('Attacker')}>
              {t('Attacker')}
            </TextEllipsis>
            {hasAccountVoted && hasVotedForAttacker && (
              <Tag variant="success" outline ml="8px">
                <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
              </Tag>
            )}
          </Flex>
          <Box mb="4px">
            <Progress primaryStep={progress1} scale="sm" />
          </Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">{t('%total% Vote(s)', { total: formatNumber(count1, 0, 2) })}</Text>
            <Text>{progress1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</Text>
          </Flex>
        </Box>
        <Box key="defender" mt="24px">
          <Flex alignItems="center" mb="8px">
            <TextEllipsis mb="4px" title={t('Defender')}>
              {t('Defender')}
            </TextEllipsis>
            {hasAccountVoted && hasVotedForDefender && (
              <Tag variant="success" outline ml="8px">
                <CheckmarkCircleIcon mr="4px" /> {t('Voted')}
              </Tag>
            )}
          </Flex>
          <Box mb="4px">
            <Progress primaryStep={progress2} scale="sm" />
          </Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">{t('%total% Vote(s)', { total: formatNumber(count2, 0, 2) })}</Text>
            <Text>{progress2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</Text>
          </Flex>
          <Flex mt="8px" mb="8px" justifyContent="center" alignItems="center">
            {afterOneWeek ? (
              <Button
                variant="secondary"
                onClick={handleApplyResults}
                scale="sm"
                endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
                isLoading={pendingTx || pendingFb}
              >
                {t('Apply Results')}
              </Button>
            ) : (
              <>
                <Timer minutes={minutes} hours={hours} days={days} />
                <StyledTimerText pt="18px">{t('left')}</StyledTimerText>
              </>
            )}
          </Flex>
        </Box>
      </CardBody>
    </Card>
  )
}

export default Results
