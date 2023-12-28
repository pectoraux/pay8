import { Box, Flex, Heading, Progress, ProgressBar } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { differenceInSeconds } from 'date-fns'
import { PublicIfoData } from '../../types'
import LiveTimer, { SoonTimer } from './Timer'

const BigCurve = styled(Box)<{ $status: PublicIfoData['status'] }>`
  width: 150%;
  position: absolute;
  top: -150%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 50%;
  }

  ${({ $status, theme }) => {
    switch ($status) {
      case 'coming_soon':
        return `
          background: ${theme.colors.tertiary};
        `
      case 'live':
        return `
          background: linear-gradient(#8051D6 100%, #492286 100%);
        `
      case 'finished':
        return `
          background: ${theme.colors.input};
        `
      default:
        return ''
    }
  }}
`

export const IfoRibbon = ({ data, status = 'live' }) => {
  let Component
  if (status === 'finished') {
    Component = <IfoRibbonEnd />
  } else if (status === 'live') {
    Component = <IfoRibbonLive data={data} />
  } else if (status === 'coming_soon') {
    Component = <IfoRibbonSoon />
  }
  const diff = Math.max(
    differenceInSeconds(new Date(), new Date(parseInt(data?.bid[1]) * 1000 ?? 0), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const diff2 = Math.max(
    differenceInSeconds(
      new Date(parseInt(data?.bid[1]) * 1000 + 86400 * 7 * 1000),
      new Date(parseInt(data?.bid[1]) * 1000 ?? 0),
      {
        roundingMethod: 'ceil',
      },
    ),
    0,
  )
  const progress = (diff * 100) / diff2

  return (
    <>
      {status === 'live' && (
        <Progress variant="flat">
          <ProgressBar
            $useDark
            $background="linear-gradient(273deg, #ffd800 -2.87%, #eb8c00 113.73%)"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </Progress>
      )}
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        minHeight={['48px', '48px', '48px', '75px']}
        position="relative"
        overflow="hidden"
      >
        {Component}
      </Flex>
    </>
  )
}

const IfoRibbonEnd = () => {
  const { t } = useTranslation()
  return (
    <>
      <BigCurve $status="finished" />
      <Box position="relative">
        <Heading as="h3" scale="lg" color="textSubtle">
          {t('Auction Finished!')}
        </Heading>
      </Box>
    </>
  )
}

const IfoRibbonSoon = () => {
  return (
    <>
      <BigCurve $status="coming_soon" />
      <Box position="relative">
        <Heading as="h3" scale="lg" color="secondary">
          <SoonTimer />
        </Heading>
      </Box>
    </>
  )
}

const IfoRibbonLive = ({ data }) => {
  return (
    <>
      <BigCurve $status="live" />
      <Box position="relative">
        <LiveTimer data={data} />
      </Box>
    </>
  )
}
