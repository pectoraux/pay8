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
import { Vote } from 'state/types'
import { ToastDescriptionWithTx } from 'components/Toast'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useValuepoolVoterContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useGetBribe } from 'state/valuepools/hooks'
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

const Results: React.FC<any> = ({ proposal, hasAccountVoted }) => {
  const { t } = useTranslation()
  const totalVotes = proposal?.votes?.length ? proposal.votes.reduce((ac, v) => ac + parseInt(v.votingPower), 0) : 0
  const total1Votes = proposal?.votes?.length
    ? proposal.votes.filter((v) => v.like).reduce((ac, v) => ac + parseInt(v.votingPower), 0)
    : 0
  const total2Votes = proposal?.votes?.length
    ? proposal.votes.filter((v) => !v.like).reduce((ac, v) => ac + parseInt(v.votingPower), 0)
    : 0
  const count1 = proposal?.votes?.length ? proposal.votes.filter((v) => v.like)?.length : 0
  const count2 = proposal?.votes?.length ? proposal.votes.filter((v) => !v.like)?.length : 0
  const progress1 = (total1Votes * 100) / Math.max(totalVotes, 1)
  const progress2 = (total2Votes * 100) / Math.max(totalVotes, 1)
  const afterOneWeek = convertTimeToSeconds(proposal?.endTime || 0) < Date.now()
  const router = useRouter()
  const { toastSuccess } = useToast()
  const [pendingFb, setPendingFb] = useState(false)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const valuepoolVoterContract = useValuepoolVoterContract()
  const veAddress = proposal?.valuepool?.id
  const { data: bribe } = useGetBribe(proposal?.id)
  const diff = Math.max(
    differenceInSeconds(new Date(parseInt(proposal?.endTime) * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days, hours, minutes } = getTimePeriods(diff ?? 0)

  const handleApplyResults = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log('valuepoolVoterContract====================>', [proposal?.id, veAddress, proposal?.pool])
      return callWithGasPrice(valuepoolVoterContract, 'unlockBribe', [proposal?.id, veAddress, proposal?.pool]).catch(
        (err) => console.log('err====================>', err),
      )
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Bribe successfully unlocked'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('The bribe has been either sent to the valuepool or back to its creator depending on the vote results.')}
        </ToastDescriptionWithTx>,
      )
      router.push(`/valuepool/voting/${veAddress}`)
    } else {
      setPendingFb(false)
    }
  }, [t, router, proposal, veAddress, valuepoolVoterContract, toastSuccess, callWithGasPrice, fetchWithCatchTxError])

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
              {t('Aye')}
            </TextEllipsis>
            {hasAccountVoted && (
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
              {t('Nay')}
            </TextEllipsis>
            {hasAccountVoted && (
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
                disabled={!(bribe?.length && parseInt(bribe[0]?.toString()))}
                scale="sm"
                endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
                isLoading={pendingTx || pendingFb}
              >
                {t('Unlock Bribe')}
              </Button>
            ) : (
              <>
                <Timer minutes={minutes} hours={hours} days={days} />
                <StyledTimerText pt="18px">{days || hours || minutes ? t('left') : ''}</StyledTimerText>
              </>
            )}
          </Flex>
        </Box>
      </CardBody>
    </Card>
  )
}

export default Results
