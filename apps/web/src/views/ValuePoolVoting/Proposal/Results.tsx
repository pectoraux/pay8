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
import Countdown from 'views/Lottery/components/Countdown'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useValuepoolVoterContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import TextEllipsis from '../components/TextEllipsis'
import { useGetBribe } from 'state/valuepools/hooks'

// interface ResultsProps {
//   choices: string[]
//   votes: Vote[]
//   votesLoadingStatus: FetchStatus
// }

const Results: React.FC<any> = ({ proposal, hasAccountVoted }) => {
  const { t } = useTranslation()
  const totalVotes = proposal?.votes?.length ? proposal.votes.reduce((ac, v) => ac + parseInt(v.votingPower), 0) : 0
  const total1Votes = proposal?.votes?.length
    ? proposal.votes.filter((v) => v.choice === 'Attacker').reduce((ac, v) => ac + parseInt(v.votingPower), 0)
    : 0
  const total2Votes = proposal?.votes?.length
    ? proposal.votes.filter((v) => v.choice === 'Defender').reduce((ac, v) => ac + parseInt(v.votingPower), 0)
    : 0
  const count1 = proposal?.votes?.length ? proposal.votes.filter((v) => v.choice === 'Attacker')?.length : 0
  const count2 = proposal?.votes?.length ? proposal.votes.filter((v) => v.choice === 'Defender')?.length : 0
  const progress1 = (total1Votes * 100) / Math.max(totalVotes, 1)
  const progress2 = (total2Votes * 100) / Math.max(totalVotes, 1)
  const afterOneWeek = convertTimeToSeconds(proposal?.endTime || 0) < Date.now()
  const router = useRouter()
  const { toastSuccess } = useToast()
  const [pendingFb, setPendingFb] = useState(false)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const valuepoolVoterContract = useValuepoolVoterContract()
  const veAddress = proposal?.id?.split('-')?.length && proposal?.id?.split('-')[0]
  const pool = proposal?.id?.split('-')?.length && proposal?.id?.split('-')[1]
  const { data: bribe } = useGetBribe(veAddress, pool)

  const handleApplyResults = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log('valuepoolVoterContract====================>', [veAddress, pool])
      return callWithGasPrice(valuepoolVoterContract, 'unlockBribe', [veAddress, pool]).catch((err) =>
        console.log('err====================>', err),
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
  }, [
    t,
    router,
    proposal,
    veAddress,
    pool,
    valuepoolVoterContract,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

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
              {t('Defender')}
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
              <Countdown
                nextEventTime={convertTimeToSeconds(proposal?.endTime || 0)}
                postCountdownText={t('left')}
                color="#FDAB32"
              />
            )}
          </Flex>
        </Box>
      </CardBody>
    </Card>
  )
}

export default Results
