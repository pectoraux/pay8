import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import {
  bscTestnetTokens,
  bscTokens,
  ethereumTokens,
  goerliTestnetTokens,
  zkSyncTestnetTokens,
  polygonZkEvmTokens,
} from '@pancakeswap/tokens'
import type { CommonPrice } from '../../src/fetchFarmsV3'
import type { FarmV3SupportedChainId } from '../../src'

export const CAKE_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

export type PriceHelper = {
  chain: string
  list: ERC20Token[]
}

export const CHAIN_ID_TO_CHAIN_NAME = {
  [ChainId.BSC]: 'bsc',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.GOERLI]: 'ethereum',
  [ChainId.BSC_TESTNET]: 'bsc',
  [ChainId.FANTOM_TESTNET]: 'ftm',
  [ChainId.POLYGON_ZKEVM]: 'polygon_zkevm',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '',
  [ChainId.ZKSYNC_TESTNET]: '',
} // satisfies Record<FarmV3SupportedChainId, string>

export const priceHelperTokens = {
  [ChainId.ETHEREUM]: {
    chain: 'ethereum',
    list: [ethereumTokens.weth, ethereumTokens.usdc, ethereumTokens.usdt],
  },
  [ChainId.BSC]: {
    chain: 'bsc',
    list: [bscTokens.wbnb, bscTokens.usdt, bscTokens.busd, bscTokens.eth],
  },
  [ChainId.POLYGON_ZKEVM]: {
    chain: 'polygon_zkevm',
    list: [polygonZkEvmTokens.weth, polygonZkEvmTokens.usdc, polygonZkEvmTokens.usdt, polygonZkEvmTokens.matic],
  },
} satisfies Record<number, PriceHelper>

// for testing purposes
export const DEFAULT_COMMON_PRICE: any = {
  [ChainId.ETHEREUM]: {},
  [ChainId.GOERLI]: {
    [goerliTestnetTokens.mockA.address]: '10',
  },
  [ChainId.BSC]: {},
  [ChainId.BSC_TESTNET]: {
    [bscTestnetTokens.mockA.address]: '10',
    [bscTestnetTokens.usdt.address]: '1',
    [bscTestnetTokens.busd.address]: '1',
    [bscTestnetTokens.usdc.address]: '1',
  },
  [ChainId.FANTOM_TESTNET]: {
    [bscTestnetTokens.mockA.address]: '10',
    [bscTestnetTokens.usdt.address]: '1',
    [bscTestnetTokens.busd.address]: '1',
    [bscTestnetTokens.usdc.address]: '1',
  },
  [ChainId.ZKSYNC_TESTNET]: {
    [zkSyncTestnetTokens.mock.address]: '10',
  },
  [ChainId.POLYGON_ZKEVM]: {},
  [ChainId.POLYGON_ZKEVM_TESTNET]: {},
}
