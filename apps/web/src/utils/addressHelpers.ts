import { ChainId } from '@pancakeswap/sdk'
import addresses from 'config/constants/contracts'
import { VaultKey } from 'state/types'

export interface Addresses {
  [chainId: number]: `0x${string}`
}

export const getAddressFromMap = (address: Addresses, chainId?: number): `0x${string}` => {
  return address[chainId] ? address[chainId] : address[ChainId.FANTOM_TESTNET]
}

export const getAddressFromMapNoFallback = (address: Addresses, chainId?: number): `0x${string}` | null => {
  return address[chainId]
}

export const getMasterChefV2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.masterChef, chainId)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall, chainId)
}
export const getLotteryV2Address = () => {
  return getAddressFromMap(addresses.lotteryV2)
}
export const getPancakeProfileAddress = () => {
  return getAddressFromMap(addresses.pancakeProfile)
}
export const getPancakeBunniesAddress = () => {
  return getAddressFromMap(addresses.pancakeBunnies)
}
export const getBunnyFactoryAddress = () => {
  return getAddressFromMap(addresses.bunnyFactory)
}
export const getPredictionsV1Address = () => {
  return getAddressFromMap(addresses.predictionsV1)
}
export const getPointCenterIfoAddress = () => {
  return getAddressFromMap(addresses.pointCenterIfo)
}
export const getTradingCompetitionAddressEaster = () => {
  return getAddressFromMap(addresses.tradingCompetitionEaster)
}
export const getTradingCompetitionAddressFanToken = () => {
  return getAddressFromMap(addresses.tradingCompetitionFanToken)
}

export const getTradingCompetitionAddressMobox = () => {
  return getAddressFromMap(addresses.tradingCompetitionMobox)
}

export const getTradingCompetitionAddressMoD = () => {
  return getAddressFromMap(addresses.tradingCompetitionMoD)
}

export const getVaultPoolAddress = (vaultKey: VaultKey) => {
  if (!vaultKey) {
    return null
  }
  return getAddressFromMap(addresses[vaultKey])
}

export const getCakeVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.cakeVault, chainId)
}

export const getCakeFlexibleSideVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.cakeFlexibleSideVault, chainId)
}

export const getFarmAuctionAddress = () => {
  return getAddressFromMap(addresses.farmAuction)
}

export const getNftMarketAddress = () => {
  return getAddressFromMap(addresses.nftMarket)
}
export const getNftSaleAddress = () => {
  return getAddressFromMap(addresses.nftSale)
}
export const getPancakeSquadAddress = () => {
  return getAddressFromMap(addresses.pancakeSquad)
}
export const getPotteryDrawAddress = () => {
  return getAddressFromMap(addresses.potteryDraw)
}

export const getZapAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.zap, chainId)
}

export const getBCakeFarmBoosterAddress = () => {
  return getAddressFromMap(addresses.bCakeFarmBooster)
}

export const getBCakeFarmBoosterV3Address = (chainId?: number) => {
  return getAddressFromMap(addresses.bCakeFarmBoosterV3, chainId)
}

export const getBCakeFarmBoosterProxyFactoryAddress = () => {
  return getAddressFromMap(addresses.bCakeFarmBoosterProxyFactory)
}

export const getNonBscVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.nonBscVault, chainId)
}

export const getCrossFarmingSenderAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingSender, chainId)
}

export const getCrossFarmingReceiverAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingReceiver, chainId)
}

export const getStableSwapNativeHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stableSwapNativeHelper, chainId)
}

export const getMasterChefV3Address = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.masterChefV3, chainId)
}

export const getV3MigratorAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Migrator, chainId)
}

export const getTradingRewardAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingReward, chainId)
}

export const getV3AirdropAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Airdrop, chainId)
}

export const getAffiliateProgramAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.affiliateProgram, chainId)
}

export const getTradingRewardTopTradesAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingRewardTopTrades, chainId)
}

export const getRampAdsAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.rampAds, chainId)
}

export const getRampHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.rampHelper, chainId)
}

export const getRampFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.rampFactory, chainId)
}

export const getTrustBountiesAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.trustbounties, chainId)
}

export const getTrustBountiesHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.trustbountiesHelper, chainId)
}

export const getTrustBountiesVoterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.trustbountiesvoter, chainId)
}

export const getVeFromWorkspace = (wk: string, chainId?: number) => {
  return getAddressFromMap(addresses[wk], chainId)
}

export const getProfileAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.profile, chainId)
}

export const getProfileHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.profileHelper, chainId)
}

export const getPoolGaugeAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.poolGauge, chainId)
}

export const getFeeToAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.feeTo, chainId)
}

export const getCardAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.card, chainId)
}

export const getFutureCollateralsAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.futureCollaterals, chainId)
}

export const getBettingFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.bettingFactory, chainId)
}

export const getBettingHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.bettingHelper, chainId)
}

export const getBettingMinterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.bettingMinter, chainId)
}

export const getAuditorHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.auditorHelper, chainId)
}

export const getAuditorHelper2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.auditorHelper2, chainId)
}

export const getAuditorNoteAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.auditorNote, chainId)
}

export const getWillNoteAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.willNote, chainId)
}

export const getWillFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.willFactory, chainId)
}

export const getWorldHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.worldHelper, chainId)
}

export const getWorldHelper2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.worldHelper2, chainId)
}

export const getWorldHelper3Address = (chainId?: number) => {
  return getAddressFromMap(addresses.worldHelper3, chainId)
}

export const getWorldNoteAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.worldNote, chainId)
}

export const getWorldFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.worldFactory, chainId)
}

export const getContributorsVoterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.contributorsVoter, chainId)
}

export const getAcceleratorVoterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.acceleratorVoter, chainId)
}

export const getAuditorFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.auditorFactory, chainId)
}

export const getSponsorHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.sponsorHelper, chainId)
}

export const getSponsorFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.sponsorFactory, chainId)
}

export const getMarketEventsAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.marketEvents, chainId)
}

export const getMarketCollectionsAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.marketCollections, chainId)
}

export const getMarketOrdersAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.marketOrders, chainId)
}

export const getMarketTradesAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.marketTrades, chainId)
}

export const getMarketHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.marketHelper, chainId)
}

export const getMarketHelper2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.marketHelper2, chainId)
}

export const getMarketHelper3Address = (chainId?: number) => {
  return getAddressFromMap(addresses.marketHelper3, chainId)
}

export const getNftMarketOrdersAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.nftMarketOrders, chainId)
}

export const getNftMarketTradesAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.nftMarketTrades, chainId)
}

export const getNftMarketHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.nftMarketHelper, chainId)
}

export const getNftMarketHelper2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.nftMarketHelper2, chainId)
}

export const getNftMarketHelper3Address = (chainId?: number) => {
  return getAddressFromMap(addresses.nftMarketHelper3, chainId)
}

export const getMinterFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.minterFactory, chainId)
}

export const getPaywallMarketOrdersAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.paywallMarketOrders, chainId)
}

export const getPaywallMarketTradesAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.paywallMarketTrades, chainId)
}

export const getPaywallMarketHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.paywallMarketHelper, chainId)
}

export const getPaywallMarketHelper2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.paywallMarketHelper2, chainId)
}

export const getPaywallMarketHelper3Address = (chainId?: number) => {
  return getAddressFromMap(addresses.paywallMarketHelper3, chainId)
}

export const getPaywallARPHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.paywallARPHelper, chainId)
}

export const getPaywallARPFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.paywallARPFactory, chainId)
}

export const getARPFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.ARPFactory, chainId)
}

export const getARPMinterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.ARPMinter, chainId)
}

export const getARPHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.ARPHelper, chainId)
}

export const getARPNoteAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.ARPNote, chainId)
}

export const getBILLFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.BILLFactory, chainId)
}

export const getBILLMinterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.BILLMinter, chainId)
}

export const getBILLHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.BILLHelper, chainId)
}

export const getBILLNoteAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.BILLNote, chainId)
}

export const getLotteryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.lottery, chainId)
}

export const getRandomNumberGeneratorAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.randomNumberGenerator, chainId)
}

export const getLotteryRandomNumberGeneratorAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.lotteryRandomNumberGenerator, chainId)
}

export const getLotteryHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.lotteryHelper, chainId)
}

export const getNFTSVGAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.nftSVG, chainId)
}

export const getGameFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.gameFactory, chainId)
}

export const getGameMinterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.gameMinter, chainId)
}

export const getGameHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.gameHelper, chainId)
}

export const getGameHelper2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.gameHelper2, chainId)
}

export const getNFTicketAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.nfticket, chainId)
}

export const getNFTicketHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.nfticketHelper, chainId)
}

export const getNFTicketHelper2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.nfticketHelper2, chainId)
}

export const getStakeMarketAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stakemarket, chainId)
}

export const getStakeMarketNoteAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stakemarketNote, chainId)
}

export const getStakeMarketHeperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stakemarketHelper, chainId)
}

export const getStakeMarketVoterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stakemarketVoter, chainId)
}

export const getStakeMarketBribeAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stakemarketBribe, chainId)
}

export const getValuepoolVoterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.valuepoolVoter, chainId)
}

export const getValuepoolHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.valuepoolHelper, chainId)
}

export const getValuepoolHelper2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.valuepoolHelper2, chainId)
}

export const getSSIAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.ssi, chainId)
}

export const getVaFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.vaFactory, chainId)
}

export const getValuepoolFactoryAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.valuepoolFactory, chainId)
}

export const getBusinessVoterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.businessVoter, chainId)
}

export const getReferralVoterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.referralVoter, chainId)
}

export const getAffiliatesVoterAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.affiliatesVoter, chainId)
}
