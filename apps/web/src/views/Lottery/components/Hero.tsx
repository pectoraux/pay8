import styled, { keyframes } from 'styled-components'
import {
  Box,
  Flex,
  Heading,
  Balance,
  useMatchBreakpoints,
  IconButton,
  ArrowBackIcon,
  ArrowForwardIcon,
  CardBody,
} from '@pancakeswap/uikit'
import { useState } from 'react'
import Iframe from 'react-iframe'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TicketPurchaseCard } from '../svgs'
import BuyTicketsButton from './BuyTicketsButton'

const floatingStarsLeft = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(10px, 10px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const floatingStarsRight = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-10px, 10px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const floatingTicketLeft = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-10px, 15px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const floatingTicketRight = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(10px, 15px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const mainTicketAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(6deg);
  }
  to {
    transform: rotate(0deg);
  }
`

const TicketContainer = styled(Flex)`
  animation: ${mainTicketAnimation} 3s ease-in-out infinite;
`

const PrizeTotalBalance = styled(Balance)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StyledBuyTicketButton = styled(BuyTicketsButton)<{ disabled: boolean }>`
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.disabled : 'linear-gradient(180deg, #7645d9 0%, #452a7a 100%)'};
  width: 200px;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 240px;
  }
`

const ButtonWrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-4deg);
`

const TicketSvgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-4deg);
`

const Decorations = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(/images/decorations/bg-star.svg);
  background-repeat: no-repeat;
  background-position: center 0;
`

const StarsDecorations = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;

  & img {
    position: absolute;
  }

  & :nth-child(1) {
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;
    animation-delay: 0.25s;
  }
  & :nth-child(2) {
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  & :nth-child(3) {
    animation: ${floatingStarsRight} 4s ease-in-out infinite;
    animation-delay: 0.75s;
  }
  & :nth-child(4) {
    animation: ${floatingTicketLeft} 6s ease-in-out infinite;
    animation-delay: 0.2s;
  }
  & :nth-child(5) {
    animation: ${floatingTicketRight} 6s ease-in-out infinite;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & :nth-child(1) {
      left: 3%;
      top: 42%;
    }
    & :nth-child(2) {
      left: 9%;
      top: 23%;
    }
    & :nth-child(3) {
      right: 2%;
      top: 24%;
    }
    & :nth-child(4) {
      left: 8%;
      top: 67%;
    }
    & :nth-child(5) {
      right: 8%;
      top: 67%;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & :nth-child(1) {
      left: 10%;
      top: 42%;
    }
    & :nth-child(2) {
      left: 17%;
      top: 23%;
    }
    & :nth-child(3) {
      right: 10%;
      top: 24%;
    }
    & :nth-child(4) {
      left: 17%;
      top: 67%;
    }
    & :nth-child(5) {
      right: 17%;
      top: 67%;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    & :nth-child(1) {
      left: 19%;
      top: 42%;
    }
    & :nth-child(2) {
      left: 25%;
      top: 23%;
    }
    & :nth-child(3) {
      right: 19%;
      top: 24%;
    }
    & :nth-child(4) {
      left: 24%;
      top: 67%;
    }
    & :nth-child(5) {
      right: 24%;
      top: 67%;
    }
  }
`
const StyledSwiper = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    .swiper-wrapper {
      max-height: 750px;
    }
  }
`
const SwiperCircle = styled.div<{ isActive }>`
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.textDisabled)};
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 50%;
  cursor: pointer;
`
const INITIAL_SLIDE = 4

const Hero = ({ lottery, currentTokenId }) => {
  const { t } = useTranslation()
  // const cakePriceBusd = usePriceCakeBusd()
  // times(cakePriceBusd)
  const tokenData = lottery?.tokenData?.length ? lottery?.tokenData[currentTokenId] : {}
  const prizeInBusd = tokenData?.amountCollected ?? 0
  const prizeTotal = getBalanceNumber(prizeInBusd, tokenData?.decimals ?? 18)
  console.log('Hero=====================>', lottery, currentTokenId)
  const [swiperRef, setSwiperRef] = useState<SwiperCore>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const { isMd, isLg } = useMatchBreakpoints()

  const updateActiveIndex = ({ activeIndex: newActiveIndex }) => {
    if (newActiveIndex !== undefined) setActiveIndex(Math.ceil(newActiveIndex / slidesPerView))
  }
  let slidesPerView = 4
  let maxPageIndex = 3

  if (isMd) {
    slidesPerView = 2
    maxPageIndex = 6
  }

  if (isLg) {
    slidesPerView = 3
    maxPageIndex = 4
  }

  const nextSlide = () => {
    if (activeIndex < maxPageIndex - 1) {
      setActiveIndex((index) => index + 1)
      swiperRef.slideNext()
    }
  }

  const previousSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((index) => index - 1)
      swiperRef.slidePrev()
    }
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index / slidesPerView)
    swiperRef.slideTo(index)
  }

  const getHeroHeading = () => {
    // if (lottery?.status === LotteryStatus.OPEN) {
    return lottery.isNFT ? (
      <Box pt="56px" mb="52px">
        <StyledSwiper>
          <Swiper
            onSwiper={setSwiperRef}
            onActiveIndexChange={updateActiveIndex}
            spaceBetween={16}
            slidesPerView={slidesPerView}
            slidesPerGroup={slidesPerView}
            initialSlide={INITIAL_SLIDE}
          >
            {lottery?.tokenURIs?.map((tokenURI, index) => (
              <Iframe url={tokenURI} height="550px" id={lottery?.nftPrizes[index]?.id} />
            ))}
          </Swiper>
        </StyledSwiper>
        <Flex justifyContent="center" alignItems="center">
          <Heading mb="32px" scale="lg" color="#ffffff">
            {t('Your prize!')}
          </Heading>
          {lottery?.status !== LotteryStatus.OPEN ? (
            <Heading mb="24px" scale="xl" color="#ffffff">
              {t('Tickets on sale soon')}
            </Heading>
          ) : null}
        </Flex>
      </Box>
    ) : (
      <>
        <PrizeTotalBalance
          fontSize="64px"
          bold
          unit={` ${tokenData?.token?.symbol ?? ''}`}
          value={prizeTotal}
          mb="8px"
          decimals={3}
        />
        <Heading mb="32px" scale="lg" color="#ffffff">
          {t('in prizes!')}
        </Heading>
        {lottery?.status !== LotteryStatus.OPEN ? (
          <Heading mb="24px" scale="xl" color="#ffffff">
            {t('Tickets on sale soon')}
          </Heading>
        ) : null}
      </>
    )
  }
  // return (
  //   <Heading mb="24px" scale="xl" color="#ffffff">
  //     {t('Tickets on sale soon')}
  //   </Heading>
  // )
  // }

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Decorations />
      <StarsDecorations display={['none', 'none', 'block']}>
        <img src="/images/lottery/star-big.png" width="124px" height="109px" alt="" />
        <img src="/images/lottery/star-small.png" width="70px" height="62px" alt="" />
        <img src="/images/lottery/three-stars.png" width="130px" height="144px" alt="" />
        <img src="/images/lottery/ticket-l.png" width="123px" height="83px" alt="" />
        <img src="/images/lottery/ticket-r.png" width="121px" height="72px" alt="" />
      </StarsDecorations>
      <Heading mb="8px" scale="md" color="#ffffff" id="lottery-hero-title">
        {t('The %val% Lottery', { val: lottery?.id === '1' ? 'MarketPlace' : lottery?.collection?.name ?? '' })}
      </Heading>
      {getHeroHeading()}
      <TicketContainer
        position="relative"
        width={['240px', '288px']}
        height={['94px', '113px']}
        alignItems="center"
        justifyContent="center"
      >
        <ButtonWrapper>
          <StyledBuyTicketButton
            currentTokenId={currentTokenId}
            disabled={lottery?.status !== LotteryStatus.OPEN}
            fromHero
            themeMode="light"
          />
        </ButtonWrapper>
        <TicketSvgWrapper>
          <TicketPurchaseCard width="100%" />
        </TicketSvgWrapper>
      </TicketContainer>
    </Flex>
  )
}

export default Hero
