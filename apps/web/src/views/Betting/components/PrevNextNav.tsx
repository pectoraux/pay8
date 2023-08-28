import {
  ArrowBackIcon,
  ArrowForwardIcon,
  BunnyCardsIcon,
  Flex,
  IconButton,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
// import { useGetSortedRoundsCurrentEpoch } from 'state/bettings/hooks'
import useSwiper from '../hooks/useSwiper'
import { DEFAULT_BET_SIZE } from 'config/constants/exchange'

const StyledPrevNextNav = styled(Flex)`
  align-items: center;
  display: none;
  justify-content: space-between;
  overflow: initial;
  position: relative;
  width: 128px;

  box-shadow: ${({ theme }) => theme.shadows.level1};
  border-radius: ${({ theme }) => theme.radii.default};
  background-color: ${({ theme }) => theme.card.background};

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
  }
`

const Icon = styled.div`
  cursor: pointer;
  left: 50%;
  margin-left: -32px;
  position: absolute;
`

const PrevNextNav = () => {
  const { swiper } = useSwiper()
  const { isMobile } = useMatchBreakpoints()
  const divisor = isMobile ? 5 : 1

  const handlePrevSlide = () => {
    swiper?.slidePrev()
  }

  const handleNextSlide = () => {
    swiper?.slideNext()
  }

  const handleSlideToLive = () => {
    if (swiper) {
      swiper.slideTo(DEFAULT_BET_SIZE / divisor)
    }
  }

  return (
    <StyledPrevNextNav>
      <IconButton variant="text" scale="sm" onClick={handlePrevSlide}>
        <ArrowBackIcon color="primary" width="24px" />
      </IconButton>
      <Icon onClick={handleSlideToLive}>
        <BunnyCardsIcon width="64px" />
      </Icon>
      <IconButton variant="text" scale="sm" onClick={handleNextSlide}>
        <ArrowForwardIcon color="primary" width="24px" />
      </IconButton>
    </StyledPrevNextNav>
  )
}

export default PrevNextNav
