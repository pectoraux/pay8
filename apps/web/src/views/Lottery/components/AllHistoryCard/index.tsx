import { useState, useRef, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Card, Text, Skeleton, CardHeader, Box } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchLottery } from 'state/lotteries/helpers'
import { useActiveChainId } from 'hooks/useActiveChainId'

import RoundSwitcher from './RoundSwitcher'
import { getDrawnDate } from '../../helpers'
import PreviousRoundCardBody from '../PreviousRoundCard/Body'
import PreviousRoundCardFooter from '../PreviousRoundCard/Footer'

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  z-index: 2;
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const AllHistoryCard = ({ currentTokenId }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const dispatch = useAppDispatch()
  const { lotteryData } = useLottery()
  const { chainId } = useActiveChainId()
  const { id: currentLotteryId, history } = lotteryData
  const [latestRoundId, setLatestRoundId] = useState(null)
  const [selectedRoundId, setSelectedRoundId] = useState(currentLotteryId)
  const [selectedLotteryNodeData, setSelectedLotteryNodeData] = useState(lotteryData)
  const timer = useRef(null)
  console.log(
    'currentTokenId===================>',
    currentTokenId,
    selectedRoundId,
    lotteryData,
    selectedLotteryNodeData,
  )
  const currTokenData = useMemo(
    () => (lotteryData?.tokenData?.length ? lotteryData?.tokenData[parseInt(currentTokenId)] : {}),
    [lotteryData, currentTokenId],
  )

  useEffect(() => {
    setSelectedRoundId(currentLotteryId)
  }, [currentLotteryId])

  useEffect(() => {
    if (Number(currentLotteryId) > 0) {
      const mostRecentFinishedRoundId = history?.length ? history[history?.length - 1]?.id : 1
      setLatestRoundId(mostRecentFinishedRoundId)
      //     setSelectedRoundId(mostRecentFinishedRoundId ?? '')
    }
  }, [currentLotteryId, history])

  useEffect(() => {
    setSelectedLotteryNodeData(null)

    const fetchLotteryData = async () => {
      const _lotteryData = await fetchLottery(selectedRoundId, chainId)
      setSelectedLotteryNodeData(_lotteryData)
    }

    timer.current = setInterval(() => {
      if (selectedRoundId) {
        fetchLotteryData()
      }
      clearInterval(timer.current)
    }, 1000)

    return () => clearInterval(timer.current)
  }, [selectedRoundId, currentLotteryId, dispatch, chainId])

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setSelectedRoundId(value)
      if (parseInt(value, 10) <= 0) {
        setSelectedRoundId('')
      }
      if (parseInt(value, 10) >= latestRoundId) {
        setSelectedRoundId(latestRoundId.toString())
      }
    } else {
      setSelectedRoundId('')
    }
  }

  const handleArrowButtonPress = (targetRound) => {
    if (targetRound && history?.find((lot) => Number(lot?.id) === Number(targetRound))?.length) {
      setSelectedRoundId(targetRound.toString())
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setSelectedRoundId(currentLotteryId)
    }
  }
  return (
    <StyledCard>
      <StyledCardHeader>
        <RoundSwitcher
          isLoading={false}
          selectedRoundId={selectedRoundId}
          mostRecentRound={latestRoundId}
          handleInputChange={handleInputChange}
          handleArrowButtonPress={handleArrowButtonPress}
        />
        <Box mt="8px">
          {Number(selectedLotteryNodeData?.endTime ?? 0) ? (
            <Text fontSize="14px">
              {t('Drawn %val%', { val: getDrawnDate(locale, selectedLotteryNodeData?.endTime) })}
            </Text>
          ) : (
            <Skeleton width="185px" height="21px" />
          )}
        </Box>
      </StyledCardHeader>
      <PreviousRoundCardBody
        currentTokenId={currentTokenId}
        currTokenData={currTokenData}
        lotteryNodeData={selectedLotteryNodeData}
        lotteryId={selectedRoundId}
        latestId={history?.length ? history[history?.length - 1]?.id : currentLotteryId}
      />
      {parseInt(lotteryData?.isNFT) ? null : (
        <PreviousRoundCardFooter
          currentTokenId={currentTokenId}
          lotteryNodeData={selectedLotteryNodeData}
          lotteryId={selectedRoundId}
        />
      )}
    </StyledCard>
  )
}

export default AllHistoryCard
