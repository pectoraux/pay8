import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

export const BSC_BLOCK_TIME = 3

// CAKE_PER_BLOCK details
// 40 CAKE is minted per block
// 20 CAKE per block is sent to Burn pool (A farm just for burning cake)
// 10 CAKE per block goes to CAKE syrup pool
// 9 CAKE per block goes to Yield farms and lottery
// CAKE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// CAKE/Block in src/views/Home/components/CakeDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const CAKE_PER_BLOCK = 40
export const BLOCKS_PER_DAY = (60 / BSC_BLOCK_TIME) * 60 * 24
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365 // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = 'https://pancakeswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
export const DEFAULT_GAS_LIMIT = 250000n
export const BOOSTED_FARM_GAS_LIMIT = 500000n
export const BOOSTED_FARM_V3_GAS_LIMIT = 1000000n
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'

export const WORKSPACES = {
  'Real Estate': 0,
  Transportation: 0,
  HealthCare: 0,
  Food: 0,
  Beverage: 0,
  'Law & Order': 0,
  'Software & Telco': 0,
  'Apparel, Beauty & Cosmetics': 0,
  Energy: 0,
  Mining: 0,
  'Culture & Entertainment': 0,
  Education: 0,
  Finance: 0,
  NSFW: 0,
}

export const COUNTRIES = {
  All: 1000,
  Togo: {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
  USA: {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
  Ghana: {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
  France: {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
  'Burkina Faso': {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
}

export const CITIES = {
  All: 1000,
  'Lome, Togo': {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
  'New York, USA': {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
  'Accra, Ghana': {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
  'Paris, France': {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
  'Ouagadougou, Burkina Faso': {
    Total: 1,
    Workspace: {
      Healthcare: 100,
      'Real Estate': 131,
      Education: 111,
      'Software & Data': 121,
      Religions: 108,
      Spiritual: 86,
      Finance: 105,
      'Beauty, Fashion & Wellness': 81,
      'Manual Labor': 1336,
    },
  },
}

export const PRODUCTS = {
  All: 1000,
  'Blue shades': {
    Total: 1,
    Workspace: 'Healthcare',
    Country: {
      Togo: 11,
      Ghana: 13,
      Rwanda: 12,
      'Burkina Faso': 12,
      "Cote d'Ivoire": 10,
      USA: 80,
      France: 10,
      Cameroon: 81,
      Nigeria: 13,
    },
    City: {
      'Lome, Togo': 117,
      'Accra, Ghana': 131,
      'Kigali, Rwanda': 211,
      'Ouagadougou, Burkina Faso': 124,
      "Abidjan, Cote d'Ivoire": 102,
      'Washington, USA': 806,
      'Paris, France': 105,
      'Douala,Cameroon': 815,
      'Lagos, Nigeria': 136,
    },
  },
  'Green sunglasses': {
    Total: 2,
    Workspace: 'Healthcare',
    Country: {
      Togo: 11,
      Ghana: 13,
      Rwanda: 12,
      'Burkina Faso': 12,
      "Cote d'Ivoire": 10,
      USA: 80,
      France: 10,
      Cameroon: 81,
      Nigeria: 13,
    },
    City: {
      'Lome, Togo': 117,
      'Accra, Ghana': 131,
      'Kigali, Rwanda': 211,
      'Ouagadougou, Burkina Faso': 124,
      "Abidjan, Cote d'Ivoire": 102,
      'Washington, USA': 806,
      'Paris, France': 105,
      'Douala,Cameroon': 815,
      'Lagos, Nigeria': 136,
    },
  },
  'Gold frame sunglasses': {
    Total: 3,
    Workspace: 'Spiritual',
    Country: {
      Togo: 11,
      Ghana: 13,
      Rwanda: 12,
      'Burkina Faso': 12,
      "Cote d'Ivoire": 10,
      USA: 80,
      France: 10,
      Cameroon: 81,
      Nigeria: 13,
    },
    City: {
      'Lome, Togo': 777,
      'Accra, Ghana': 888,
      'Kigali, Rwanda': 211,
      'Ouagadougou, Burkina Faso': 124,
      "Abidjan, Cote d'Ivoire": 102,
      'Washington, USA': 806,
      'Paris, France': 105,
      'Douala,Cameroon': 815,
      'Lagos, Nigeria': 136,
    },
  },
}
