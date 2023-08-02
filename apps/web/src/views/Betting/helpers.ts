import BigNumber from 'bignumber.js'
import { BetPosition } from 'state/types'
import { formatBigIntToFixed } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { FixedNumber } from 'ethers'

type formatPriceDifferenceProps = {
  price?: BigNumber
  minPriceDisplayed: BigNumber
  unitPrefix: string
  displayedDecimals: number
  decimals: number
}

const formatPriceDifference = ({
  price,
  minPriceDisplayed,
  unitPrefix,
  displayedDecimals,
  decimals,
}: formatPriceDifferenceProps) => {
  return `${unitPrefix}${formatBigIntToFixed(BigInt(price?.toString()), displayedDecimals, decimals)}`
}

export const formatUsdv2 = (usd: BigNumber, minPriceDisplayed: BigNumber, displayedDecimals: number) => {
  return formatPriceDifference({ price: usd, minPriceDisplayed, unitPrefix: '$', displayedDecimals, decimals: 8 })
}

export const formatBnbv2 = (bnb: BigNumber, displayedDecimals: number) => {
  return formatPriceDifference({
    price: bnb,
    minPriceDisplayed: BIG_ZERO,
    unitPrefix: '',
    displayedDecimals,
    decimals: 18,
  })
}

export const padTime = (num: number) => num.toString().padStart(2, '0')

export const formatRoundTime = (secondsBetweenBlocks: number) => {
  const { hours, minutes, seconds } = getTimePeriods(secondsBetweenBlocks)
  const minutesSeconds = `${padTime(minutes)}:${padTime(seconds)}`

  if (hours > 0) {
    return `${padTime(hours)}:${minutesSeconds}`
  }

  return minutesSeconds
}

export const getMultiplierV2 = (total: BigNumber, amount: BigNumber) => {
  if (!total) {
    return FixedNumber.from(0)
  }

  if (total.eq(0) || amount.eq(0)) {
    return FixedNumber.from(0)
  }

  const rewardAmountFixed = FixedNumber.from(total)
  const multiplierAmountFixed = FixedNumber.from(amount)

  return rewardAmountFixed.divUnsafe(multiplierAmountFixed)
}

export const getPriceDifference = (price: BigNumber, lockPrice: BigNumber) => {
  if (!price || !lockPrice) {
    return BIG_ZERO
  }

  return 0 // price.sub(lockPrice)
}

export const getRoundPosition = (lockPrice: BigNumber, closePrice: BigNumber) => {
  if (!closePrice) {
    return null
  }

  if (closePrice.eq(lockPrice)) {
    return BetPosition.HOUSE
  }

  return closePrice.gt(lockPrice) ? BetPosition.BULL : BetPosition.BEAR
}

export const CHART_DOT_CLICK_EVENT = 'CHART_DOT_CLICK_EVENT'
