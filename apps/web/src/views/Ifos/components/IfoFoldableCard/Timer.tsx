import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Flex, Heading, PocketWatchIcon, Text, Link, TimerIcon } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { getBlockExploreLink } from 'utils'
import { PublicIfoData } from 'views/Ifos/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { differenceInSeconds } from 'date-fns'

interface Props {
  publicIfoData: PublicIfoData
}

const GradientText = styled(Heading)`
  background: -webkit-linear-gradient(#ffd800, #eb8c00);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.5);
`

const FlexGap = styled(Flex)<{ gap: string }>`
  gap: ${({ gap }) => gap};
`

export const SoonTimer: React.FC<any> = () => {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()

  return (
    <Flex justifyContent="center" position="relative">
      <Link external href={getBlockExploreLink(100000, 'countdown', chainId)} color="secondary">
        <FlexGap gap="8px" alignItems="center">
          <Heading as="h3" scale="lg" color="secondary">
            {t('Waiting for first bid on Profile ID')}
          </Heading>
        </FlexGap>
        <TimerIcon ml="4px" color="secondary" />
      </Link>
    </Flex>
  )
}

const EndInHeading = styled(Heading)`
  color: white;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 24px;
  }
`

const LiveNowHeading = styled(EndInHeading)`
  color: white;
  ${({ theme }) => theme.mediaQueries.md} {
    background: -webkit-linear-gradient(#ffd800, #eb8c00);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px rgba(0, 0, 0, 0.5);
  }
`

const LiveTimer: React.FC<any> = ({ data }) => {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const diff = Math.max(
    differenceInSeconds(new Date(parseInt(data?.bid[1]) * 1000 + 86400 * 7 * 1000), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const timeUntil = getTimePeriods(diff ?? 0)
  return (
    <Flex justifyContent="center" position="relative">
      <Link external href={getBlockExploreLink(100000, 'countdown', chainId)} color="white">
        <PocketWatchIcon width="42px" mr="8px" />
        <FlexGap gap="8px" alignItems="center">
          <LiveNowHeading textTransform="uppercase" as="h3">{`${t('Live Now')}!`}</LiveNowHeading>
          <EndInHeading as="h3" scale="lg" color="white">
            {t('Ends in')}
          </EndInHeading>
          <FlexGap gap="4px" alignItems="baseline">
            {timeUntil.days ? (
              <>
                <GradientText scale="lg">{timeUntil.days}</GradientText>
                <Text color="white">{t('d')}</Text>
              </>
            ) : null}
            {timeUntil.days || timeUntil.hours ? (
              <>
                <GradientText scale="lg">{timeUntil.hours}</GradientText>
                <Text color="white">{t('h')}</Text>
              </>
            ) : null}
            <>
              <GradientText scale="lg">
                {!timeUntil.days && !timeUntil.hours && timeUntil.minutes === 0 ? '< 1' : timeUntil.minutes}
              </GradientText>
              <Text color="white">{t('m')}</Text>
            </>
          </FlexGap>
        </FlexGap>
        <TimerIcon ml="4px" color="white" />
      </Link>
    </Flex>
  )
}

export default LiveTimer
