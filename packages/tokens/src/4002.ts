import { ChainId, WBNB } from '@pancakeswap/sdk'

import { BUSD_FANTOM_TESTNET, CAKE_FANTOM_TESTNET } from './common'

export const fantomTestnetTokens = {
  wbnb: WBNB[ChainId.FANTOM_TESTNET],
  cake: CAKE_FANTOM_TESTNET,
  busd: BUSD_FANTOM_TESTNET,
}
