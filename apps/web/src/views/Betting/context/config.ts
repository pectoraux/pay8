import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_CAKE, GRAPH_API_PREDICTION_BNB } from 'config/constants/endpoints'
import { bscTokens } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getAddress } from 'ethers/lib/utils'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

const DEFAULT_MIN_PRICE_USD_DISPLAYED = BIG_ZERO // BigNumber.from(10000)

export default {
  BNB: {
    address: ADDRESS_ZERO, // getAddress(addresses.predictionsBNB),
    api: GRAPH_API_PREDICTION_BNB,
    chainlinkOracleAddress: ADDRESS_ZERO, // getAddress(addresses.chainlinkOracleBNB),
    minPriceUsdDisplayed: DEFAULT_MIN_PRICE_USD_DISPLAYED,
    displayedDecimals: 4,
    token: bscTokens.bnb,
  },
  CAKE: {
    address: ADDRESS_ZERO, // getAddress(addresses.predictionsCAKE),
    api: GRAPH_API_PREDICTION_CAKE,
    chainlinkOracleAddress: ADDRESS_ZERO, //getAddress(addresses.chainlinkOracleCAKE),
    minPriceUsdDisplayed: DEFAULT_MIN_PRICE_USD_DISPLAYED,
    displayedDecimals: 4,
    token: bscTokens.cake,
  },
}
