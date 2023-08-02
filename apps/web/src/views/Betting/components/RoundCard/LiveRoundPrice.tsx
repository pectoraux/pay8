import React, { memo, useMemo } from 'react'
import CountUp from 'react-countup'
import { Skeleton, TooltipText } from '@pancakeswap/uikit'

// interface LiveRoundPriceProps {
//   isBull: boolean
//   price: BigNumber
// }

const LiveRoundPrice: React.FC<any> = ({ isBull, price }) => {
  const priceAsNumber = 10 //useMemo(() => parseFloat(formatBigNumberToFixed(price, 4, 8)), [price])

  const priceColor = isBull ? 'success' : 'failure'

  return (
    <CountUp start={0} preserveValue delay={0} end={priceAsNumber} prefix="$" decimals={4} duration={1}>
      {({ countUpRef }) => (
        <TooltipText bold color={priceColor} fontSize="24px" style={{ minHeight: '36px' }}>
          <span ref={countUpRef} />
        </TooltipText>
      )}
    </CountUp>
  )
}

export default memo(LiveRoundPrice)
