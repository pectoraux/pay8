import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/pools'

import Pools from 'views/Ramp'

const PoolsPage = () => <Pools />

PoolsPage.chains = SUPPORTED_CHAIN_IDS

export default PoolsPage
