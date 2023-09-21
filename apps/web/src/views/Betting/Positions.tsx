import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
import delay from 'lodash/delay'
import RoundCard from './components/RoundCard'
import useSwiper from './hooks/useSwiper'
import useOnViewChange from './hooks/useOnViewChange'
import { CHART_DOT_CLICK_EVENT } from './helpers'
import { DEFAULT_BET_SIZE } from 'config/constants/exchange'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useGetWinnersPerBracket, useGetWinnersPerBracketNPeriod } from 'state/bettings/hooks'

const StyledSwiper = styled.div`
  .swiper-wrapper {
    align-items: center;
    display: flex;
  }

  .swiper-slide {
    width: 320px;
  }
`

const Positions: React.FC<any> = ({ view, ogBetting, allBettings }) => {
  const { setSwiper, swiper } = useSwiper()
  const swiperIndex = 1

  useOnViewChange(swiperIndex, view)

  useEffect(() => {
    const handleChartDotClick = () => {
      setIsChangeTransition(true)
      delay(() => setIsChangeTransition(false), 3000)
    }
    swiper?.el?.addEventListener(CHART_DOT_CLICK_EVENT, handleChartDotClick)

    return () => {
      swiper?.el?.removeEventListener(CHART_DOT_CLICK_EVENT, handleChartDotClick)
    }
  }, [swiper?.el])
  const [isChangeTransition, setIsChangeTransition] = useState(false)
  const { bettingId } = useRouter().query
  const { isMobile } = useMatchBreakpoints()
  const divisor = isMobile ? 5 : 1
  const currEvent =
    ogBetting?.bettingEvents?.length && ogBetting?.bettingEvents[parseInt(bettingId?.toString() || '1') - 1]
  const arr2 = Array.from(
    { length: Math.min(parseInt(currEvent?.currPeriod || 0) + 2, parseInt(currEvent?.numberOfPeriods)) },
    (v, i) => i,
  )?.slice(-DEFAULT_BET_SIZE / divisor)

  const winBr = useGetWinnersPerBracketNPeriod(ogBetting?.id, currEvent?.bettingId, arr2, currEvent?.ticketSize)
  return (
    <StyledSwiper>
      <Swiper
        initialSlide={swiperIndex}
        onSwiper={setSwiper}
        spaceBetween={16}
        slidesPerView="auto"
        onBeforeDestroy={() => setSwiper(null)}
        freeMode={{ enabled: true, sticky: true, momentumRatio: 0.25, momentumVelocityRatio: 0.5 }}
        centeredSlides
        mousewheel
        keyboard
        resizeObserver
      >
        {allBettings &&
          ogBetting?.bettingEvents.map((bettingEvent) => (
            <SwiperSlide key={bettingEvent.id}>
              {({ isActive }) => {
                return (
                  <RoundCard
                    allBettings={allBettings}
                    betting={{ idx: bettingEvent?.bettingId, ...bettingEvent, status: 'Live' }}
                    isActive={isChangeTransition && isActive}
                  />
                )
              }}
            </SwiperSlide>
          ))}
        {!allBettings &&
          arr2.map((idx) => {
            const currPeriod = currEvent?.periods?.find((period) => parseInt(period.period) === idx)
            const betting =
              parseInt(currEvent?.currPeriod || 0) > idx ||
              parseInt(currEvent?.numberOfPeriods) - 1 === parseInt(currEvent?.currPeriod || 0)
                ? {
                    idx,
                    rewardsBreakDown: currEvent?.rewardsBreakDown,
                    action: currEvent?.action,
                    pricePerTicket: currEvent?.pricePerTicket,
                    adminShare: currEvent?.adminShare,
                    referrerShare: currEvent?.referrerShare,
                    finalNumber: currPeriod?.finalNumber,
                    countWinnersPerBracket: winBr[idx],
                    amountCollected: 0,
                    ...currEvent,
                    status: 'Past',
                  }
                : parseInt(currEvent?.currPeriod || 0) === idx
                ? {
                    idx,
                    rewardsBreakDown: currEvent?.rewardsBreakDown,
                    action: currEvent?.action,
                    pricePerTicket: currEvent?.pricePerTicket,
                    adminShare: currEvent?.adminShare,
                    referrerShare: currEvent?.referrerShare,
                    finalNumber: '',
                    countWinnersPerBracket: winBr[idx],
                    amountCollected: 0,
                    ...currEvent,
                    status: 'Live',
                  }
                : {
                    idx,
                    rewardsBreakDown: currEvent?.rewardsBreakDown,
                    action: currEvent?.action,
                    pricePerTicket: currEvent?.pricePerTicket,
                    adminShare: currEvent?.adminShare,
                    referrerShare: currEvent?.referrerShare,
                    finalNumber: '',
                    countWinnersPerBracket: winBr[idx],
                    amountCollected: 0,
                    ...currEvent,
                    status: 'Next',
                  }
            return (
              <SwiperSlide key={betting.id}>
                {({ isActive }) => (
                  <RoundCard betting={betting} allBettings={allBettings} isActive={isChangeTransition && isActive} />
                )}
              </SwiperSlide>
            )
          })}
      </Swiper>
    </StyledSwiper>
  )
}

export default Positions
