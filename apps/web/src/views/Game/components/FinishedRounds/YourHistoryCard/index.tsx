import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, Text, CardHeader, Flex, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import RoundSwitcher from '../AllHistoryCard/RoundSwitcher'
import PreviousRoundCardBody from './PreviousRoundCardBody'

const StyledCard = styled(Card)`
  width: 100%;
  margin: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 579px;
  }
`

const StyledCardHeader = styled(CardHeader)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  background: none;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const YourHistoryCard = ({ tokenId, data }) => {
  const { t } = useTranslation()
  const [obj, setObj] = useState([])
  useEffect(() => setObj(data?.accounts?.find((ac) => ac?.id === tokenId)?.objectNames), [data?.accounts, tokenId])

  const [selectedRoundId, setSelectedRoundId] = useState('1')
  const latestRoundId = obj?.length
  console.log('YourHistoryCard==============>', data, obj)

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
    if (targetRound) {
      setSelectedRoundId(targetRound.toString())
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setSelectedRoundId('1')
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
        <Flex mt={['8px', '8px', '8px', '0px']} alignSelf={['flex-start', 'flex-start', 'flex-start', 'center']}>
          {obj &&
            (obj?.length > parseInt(selectedRoundId) - 1 ? (
              <Text fontSize="14px">
                {t('Object Name: ')} {obj[parseInt(selectedRoundId) - 1]}
              </Text>
            ) : null)}
        </Flex>
      </StyledCardHeader>
      {obj?.length ? (
        <PreviousRoundCardBody
          tokenId={tokenId}
          data={data}
          latestRoundId={latestRoundId}
          roundId={parseInt(selectedRoundId) - 1}
          objectName={obj[parseInt(selectedRoundId) - 1]}
        />
      ) : (
        <Flex m="24px auto" flexDirection="column" alignItems="center" width="240px">
          <Text mb="8px">{tokenId ? t('No Recipe Found') : t('Please Input a Token ID')}</Text>
          <BunnyPlaceholderIcon height="64px" width="64px" />
        </Flex>
      )}
    </StyledCard>
  )
}

export default YourHistoryCard
