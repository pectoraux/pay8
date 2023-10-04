import { ChainId, Percent, Token, WNATIVE } from '@pancakeswap/sdk'
import {
  bscTokens,
  bscTestnetTokens,
  USDC,
  USDT,
  BUSD,
  WBTC_ETH,
  arbitrumTokens,
  polygonZkEvmTokens,
  polygonZkEvmTestnetTokens,
  zksyncTokens,
  zkSyncTestnetTokens,
  lineaTestnetTokens,
  arbitrumGoerliTokens,
  fantomTestnetTokens,
} from '@pancakeswap/tokens'
import { ChainTokenList } from './types'

export {
  ADDITIONAL_BASES,
  V2_ROUTER_ADDRESS,
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
} from '@pancakeswap/smart-router/evm'

export const CHAIN_REFRESH_TIME = {
  [ChainId.ETHEREUM]: 12_000,
  [ChainId.GOERLI]: 12_000,
  [ChainId.BSC]: 6_000,
  [ChainId.BSC_TESTNET]: 6_000,
  [ChainId.FANTOM_TESTNET]: 6_000,
  [ChainId.ARBITRUM_ONE]: 4_000,
  [ChainId.ARBITRUM_GOERLI]: 4_000,
  [ChainId.POLYGON_ZKEVM]: 7_000,
  [ChainId.POLYGON_ZKEVM_TESTNET]: 7_000,
  [ChainId.ZKSYNC]: 3_000,
  [ChainId.ZKSYNC_TESTNET]: 3_000,
  [ChainId.LINEA_TESTNET]: 12_000,
} as const satisfies Record<ChainId, number>

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.GOERLI]: [USDC[ChainId.GOERLI], WNATIVE[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [bscTokens.usdt, bscTokens.cake, bscTokens.btcb],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
  [ChainId.FANTOM_TESTNET]: [fantomTestnetTokens.wbnb, fantomTestnetTokens.cake, fantomTestnetTokens.busd],
  [ChainId.ARBITRUM_ONE]: [arbitrumTokens.weth, arbitrumTokens.usdt, arbitrumTokens.usdc],
  [ChainId.ARBITRUM_GOERLI]: [arbitrumGoerliTokens.weth, arbitrumGoerliTokens.usdc],
  [ChainId.POLYGON_ZKEVM]: [polygonZkEvmTokens.weth, polygonZkEvmTokens.usdt, polygonZkEvmTokens.usdc],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [polygonZkEvmTestnetTokens.weth, polygonZkEvmTestnetTokens.usdt],
  [ChainId.ZKSYNC]: [zksyncTokens.usdc, zksyncTokens.weth],
  [ChainId.ZKSYNC_TESTNET]: [zkSyncTestnetTokens.usdc, zkSyncTestnetTokens.weth],
  [ChainId.LINEA_TESTNET]: [lineaTestnetTokens.usdc, lineaTestnetTokens.weth],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.GOERLI]: [USDC[ChainId.GOERLI], WNATIVE[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [bscTokens.wbnb, bscTokens.dai, bscTokens.busd, bscTokens.usdt, bscTokens.cake],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
  [ChainId.FANTOM_TESTNET]: [fantomTestnetTokens.wbnb, fantomTestnetTokens.cake, fantomTestnetTokens.busd],
  [ChainId.ARBITRUM_ONE]: [arbitrumTokens.weth, arbitrumTokens.usdt, arbitrumTokens.usdc],
  [ChainId.ARBITRUM_GOERLI]: [arbitrumGoerliTokens.weth, arbitrumGoerliTokens.usdc],
  [ChainId.POLYGON_ZKEVM]: [polygonZkEvmTokens.weth, polygonZkEvmTokens.usdt, polygonZkEvmTokens.usdc],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [polygonZkEvmTestnetTokens.weth, polygonZkEvmTestnetTokens.usdt],
  [ChainId.ZKSYNC]: [zksyncTokens.usdc, zksyncTokens.weth],
  [ChainId.ZKSYNC_TESTNET]: [zkSyncTestnetTokens.usdc, zkSyncTestnetTokens.weth],
  [ChainId.LINEA_TESTNET]: [lineaTestnetTokens.usdc, lineaTestnetTokens.weth],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.ETHEREUM]: [
    [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
    [WBTC_ETH, WNATIVE[ChainId.ETHEREUM]],
    [WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  ],
  [ChainId.BSC]: [
    [bscTokens.cake, bscTokens.wbnb],
    [bscTokens.busd, bscTokens.usdt],
    [bscTokens.dai, bscTokens.usdt],
  ],
  [ChainId.ARBITRUM_ONE]: [
    [arbitrumTokens.weth, arbitrumTokens.usdt],
    [arbitrumTokens.weth, arbitrumTokens.usdc],
  ],
  [ChainId.ARBITRUM_GOERLI]: [[arbitrumGoerliTokens.weth, arbitrumGoerliTokens.usdc]],
  [ChainId.POLYGON_ZKEVM]: [[polygonZkEvmTokens.weth, polygonZkEvmTokens.usdt]],
  [ChainId.ZKSYNC]: [[zksyncTokens.usdc, zksyncTokens.weth]],
  [ChainId.ZKSYNC_TESTNET]: [[zkSyncTestnetTokens.usdc, zkSyncTestnetTokens.weth]],
  [ChainId.LINEA_TESTNET]: [[lineaTestnetTokens.usdc, lineaTestnetTokens.weth]],
}

export const BIG_INT_ZERO = 0n
export const BIG_INT_TEN = 10n

// one basis point
export const BIPS_BASE = 10000n
export const ONE_BIPS = new Percent(1n, BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(100n, BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(300n, BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(500n, BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(1000n, BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(1500n, BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: bigint = BIG_INT_TEN ** 15n // .001 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(25n, BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// BNB
export const DEFAULT_INPUT_CURRENCY = 'BNB'
// CAKE
export const DEFAULT_OUTPUT_CURRENCY = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
// tUSD
export const DEFAULT_TFIAT = '0xbE04187288D198ed6F0d90eCAAca0fE42Dd434Fe'
export const DEFAULT_SYMBOL = 'USD'

export const DEFAULT_BET_SIZE = 50

// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = 'pancakeswap'
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = 500000n

export const LIMIT_ORDERS_DOCS_URL = 'https://docs.pancakeswap.finance/products/pancakeswap-exchange/limit-orders'

export const EXCHANGE_PAGE_PATHS = ['/swap', '/limit-orders', 'liquidity', '/add', '/find', '/remove']

export const LEVIATHANS = [
  '0x0a6479be4e6e2f990b3c900b4ce43b7ea5a18be7',
  '0x0f0b21eeacf69ed409983cf19de9829dc1212025',
  '0x17e5ead9479a4da2e7331fa160c1d87e664830ea',
  '0x18620dc4e3aa63851365adf9749552c8cec2c8cd',
  '0x1beed491328353b1392a747c894cc0374716e57d',
  '0x22554ec49087f469daa1bc96e3ec6ca23c9b3364',
  '0x25d94c26183a53323e468da3b7e5edf9214ba949',
  '0x2bd167daa30d9f74422af02a542b9c14b616be21',
  '0x3042c0469355d3350634f3b084a3f8d7f8848918',
  '0x333a6cd72cfbaf17517c2d4da3f6086e58eb8302',
  '0x346ad2d1c621ee64f8fac913a43ef527b1d281c3',
  '0x418d0519321e0e2b91f0d6c88cc6d7d098f523eb',
  '0x430493cab306486d48556443a62693dd1edad3df',
  '0x463c58be0272da19e488d60b582e6e8345f605c2',
  '0x4d2a9a85ddba5f0628152908dc1fda839df11de7',
  '0x549089aa33bd38da494f3bb4ac825f2af8a32842',
  '0x56942a57af5a4df637f7f2f45b935c969cecdb41',
  '0x588ed8119efc039b189776015c6ecacd5775553e',
  '0x6963c8d1821390b972a80d07fc706c5f79f0b322',
  '0x7b6d85f0b4d50d12a9cb9621b607f15124728e31',
  '0x800cff5de91bd4da1a0eb776d5280e9f081371fa',
  '0x800cff5de91bd4da1a0eb776d5280e9f081371fa',
  '0x8f93497b5a133fe0e3a3bbcd6fc337623d47b1c9',
  '0xaf7063316e9b27a02032a8f3cdb25aaff8aa639c',
  '0xbbd39bf784072f20fc7823121f38000633cb280a',
  '0xbdfc3525bf3131b9ea0c8ccec79f04bcae0ff970',
  '0xc2b8d935acbb72d16675f93f6fd30eb59cbe37da',
  '0xcf5cb744fdcc084475df8a26fe4b15085163f985',
  '0xd588ed626755300586d5d3dc7e0b6dcb927a0ba1',
  '0xd8bb438780c7a4f0acc279f3ef2ba6931952914b',
  '0xd994a268b2288e997320f5a0ccd94411b75e2dd7',
  '0xdab06eb2e6feb77cdc6003a7ad1f1d35ffdbb190',
  '0xdc171ae17575dbd70399908dbfdb68d95c660ada',
  '0xe2084376c9a426bc34c95413053310fdafd29207',
  '0xe4169d4ad3184e07594294d66d5df070497522da',
  '0xf65be8ce5fe2091659e5f56597db337489ddef38',
  '0x0bdabc785a5e1c71078d6242fb52e70181c1f316',
]
