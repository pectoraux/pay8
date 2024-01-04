import { CAKE } from '@pancakeswap/tokens'

// Addresses
import {
  getBCakeFarmBoosterAddress,
  getBCakeFarmBoosterProxyFactoryAddress,
  getBCakeFarmBoosterV3Address,
  getBunnyFactoryAddress,
  getCakeFlexibleSideVaultAddress,
  getCakeVaultAddress,
  getCrossFarmingReceiverAddress,
  getCrossFarmingSenderAddress,
  getFarmAuctionAddress,
  getLotteryV2Address,
  getMasterChefV2Address,
  getMasterChefV3Address,
  getNftMarketAddress,
  getNftSaleAddress,
  getNonBscVaultAddress,
  getPancakeProfileAddress,
  getPancakeSquadAddress,
  getPointCenterIfoAddress,
  getPotteryDrawAddress,
  getPredictionsV1Address,
  getStableSwapNativeHelperAddress,
  getTradingCompetitionAddressEaster,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMoD,
  getTradingCompetitionAddressMobox,
  getTradingRewardAddress,
  getV3AirdropAddress,
  getV3MigratorAddress,
  getAffiliateProgramAddress,
  getTradingRewardTopTradesAddress,
  getRampAdsAddress,
  getRampHelperAddress,
  getRampFactoryAddress,
  getTrustBountiesAddress,
  getTrustBountiesHelperAddress,
  getTrustBountiesVoterAddress,
  getAuditorHelperAddress,
  getAuditorHelper2Address,
  getAuditorNoteAddress,
  getWorldHelperAddress,
  getWorldHelper2Address,
  getWorldHelper3Address,
  getWorldNoteAddress,
  getContributorsVoterAddress,
  getAcceleratorVoterAddress,
  getReferralVoterAddress,
  getAuditorFactoryAddress,
  getCardAddress,
  getFutureCollateralsAddress,
  getWillFactoryAddress,
  getWillNoteAddress,
  getWorldFactoryAddress,
  getSponsorHelperAddress,
  getSponsorFactoryAddress,
  getMarketEventsAddress,
  getMarketCollectionsAddress,
  getMarketOrdersAddress,
  getMarketTradesAddress,
  getMarketHelperAddress,
  getMarketHelper2Address,
  getMarketHelper3Address,
  getNftMarketOrdersAddress,
  getNftMarketTradesAddress,
  getNftMarketHelperAddress,
  getNftMarketHelper2Address,
  getNftMarketHelper3Address,
  getMinterFactoryAddress,
  getPaywallMarketOrdersAddress,
  getPaywallMarketTradesAddress,
  getPaywallMarketHelperAddress,
  getPaywallMarketHelper2Address,
  getPaywallMarketHelper3Address,
  getPaywallARPHelperAddress,
  getPaywallARPFactoryAddress,
  getARPFactoryAddress,
  getARPHelperAddress,
  getARPNoteAddress,
  getARPMinterAddress,
  getBILLFactoryAddress,
  getBILLHelperAddress,
  getBILLNoteAddress,
  getBILLMinterAddress,
  getGameFactoryAddress,
  getGameHelperAddress,
  getGameHelper2Address,
  getGameMinterAddress,
  getNFTicketAddress,
  getNFTicketHelperAddress,
  getNFTicketHelper2Address,
  getStakeMarketVoterAddress,
  getStakeMarketBribeAddress,
  getStakeMarketAddress,
  getStakeMarketNoteAddress,
  getStakeMarketHeperAddress,
  getValuepoolVoterAddress,
  getValuepoolFactoryAddress,
  getVaFactoryAddress,
  getValuepoolHelperAddress,
  getValuepoolHelper2Address,
  getBettingFactoryAddress,
  getBettingHelperAddress,
  getBettingMinterAddress,
  getSSIAddress,
  getBusinessVoterAddress,
  getAffiliatesVoterAddress,
  getPoolGaugeAddress,
  getFeeToAddress,
  getProfileHelperAddress,
  getLotteryAddress,
  getLotteryHelperAddress,
  getRandomNumberGeneratorAddress,
  getLotteryRandomNumberGeneratorAddress,
  getProfileAddress,
  getNFTSVGAddress,
  getBusinessMinterAddress,
} from 'utils/addressHelpers'

// ABI
import { cakePredictionsABI } from 'config/abi/cakePredictions'
import { crossFarmingProxyABI } from 'config/abi/crossFarmingProxy'
import { crossFarmingSenderABI } from 'config/abi/crossFarmingSender'
import { nftSaleABI } from 'config/abi/nftSale'
import { nonBscVaultABI } from 'config/abi/nonBscVault'
import { pointCenterIfoABI } from 'config/abi/pointCenterIfo'
import { predictionsV1ABI } from 'config/abi/predictionsV1'
import { stableSwapNativeHelperABI } from 'config/abi/stableSwapNativeHelper'

import {
  cakeFlexibleSideVaultV2ABI,
  cakeVaultV2ABI,
  getIfoCreditAddressContract as getIfoCreditAddressContract_,
} from '@pancakeswap/pools'
import { ChainId } from '@pancakeswap/sdk'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { sidABI } from 'config/abi/SID'
import { SIDResolverABI } from 'config/abi/SIDResolver'
import { affiliateProgramABI } from 'config/abi/affiliateProgram'
import { bCakeFarmBoosterABI } from 'config/abi/bCakeFarmBooster'
import { bCakeFarmBoosterProxyFactoryABI } from 'config/abi/bCakeFarmBoosterProxyFactory'
import { bCakeFarmBoosterV3ABI } from 'config/abi/bCakeFarmBoosterV3'
import { bCakeProxyABI } from 'config/abi/bCakeProxy'
import { bunnyFactoryABI } from 'config/abi/bunnyFactory'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { crossFarmingReceiverABI } from 'config/abi/crossFarmingReceiver'
import { farmAuctionABI } from 'config/abi/farmAuction'
import { lotteryV2ABI } from 'config/abi/lotteryV2'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { nftMarketABI } from 'config/abi/nftMarket'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { pancakeSquadABI } from 'config/abi/pancakeSquad'
import { potteryDrawABI } from 'config/abi/potteryDrawAbi'
import { potteryVaultABI } from 'config/abi/potteryVaultAbi'
import { predictionsV2ABI } from 'config/abi/predictionsV2'
import { tradingCompetitionEasterABI } from 'config/abi/tradingCompetitionEaster'
import { tradingCompetitionFanTokenABI } from 'config/abi/tradingCompetitionFanToken'
import { tradingCompetitionMoDABI } from 'config/abi/tradingCompetitionMoD'
import { tradingCompetitionMoboxABI } from 'config/abi/tradingCompetitionMobox'
import { tradingRewardABI } from 'config/abi/tradingReward'
import { v3AirdropABI } from 'config/abi/v3Airdrop'
import { v3MigratorABI } from 'config/abi/v3Migrator'
import { getViemClients, viemClients } from 'utils/viem'
import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address, erc20ABI, erc721ABI } from 'wagmi'

import rampAbi from 'config/abi/ramp.json'
import rampHelperAbi from 'config/abi/rampHelper.json'
import rampFactoryAbi from 'config/abi/rampFactory.json'
import rampAdsAbi from 'config/abi/rampAds.json'

import { rampABI } from 'config/abi/ramp'
import { rampHelperABI } from 'config/abi/rampHelper'
import { rampFactoryABI } from 'config/abi/rampFactory'
import { rampAdsABI } from 'config/abi/rampAds'
import { trustBountiesHelperABI } from 'config/abi/trustBountiesHelper'
import { trustBountiesVoterABI } from 'config/abi/trustBountiesVoter'
import { trustBountiesABI } from 'config/abi/trustBounties'

import { acceleratorVoterABI } from 'config/abi/acceleratorvoter'
import { arpABI } from 'config/abi/arp'
import { arpFactoryABI } from 'config/abi/arpFactory'
import { arpHelperABI } from 'config/abi/arpHelper'
import { arpMinterABI } from 'config/abi/arpMinter'
import { arpNoteABI } from 'config/abi/arpNote'
import { auditorABI } from 'config/abi/auditor'
import { auditorFactoryABI } from 'config/abi/auditorFactory'
import { auditorHelperABI } from 'config/abi/auditorHelper'
import { auditorHelper2ABI } from 'config/abi/auditorHelper2'
import { auditorNoteABI } from 'config/abi/auditorNote'
import { bettingABI } from 'config/abi/betting'
import { bettingFactoryABI } from 'config/abi/bettingFactory'
import { bettingHelperABI } from 'config/abi/bettingHelper'
import { bettingMinterABI } from 'config/abi/bettingMinter'
import { billABI } from 'config/abi/bill'
import { billFactoryABI } from 'config/abi/billFactory'
import { billHelperABI } from 'config/abi/billHelper'
import { billMinterABI } from 'config/abi/billMinter'
import { billNoteABI } from 'config/abi/billNote'
import { bribeABI } from 'config/abi/bribe'
import { businessBribeFactoryABI } from 'config/abi/businessBribeFactory'
import { businessGaugeABI } from 'config/abi/businessGauge'
import { businessGaugeFactoryABI } from 'config/abi/businessGaugeFactory'
import { businessMinterABI } from 'config/abi/businessMinter'
import { businessBribeABI } from 'config/abi/businessBribe'
import { businessVoterABI } from 'config/abi/businessVoter'
import { cardABI } from 'config/abi/card'
import { contributorsVoterABI } from 'config/abi/contributorsVoter'
import { extraTokenABI } from 'config/abi/extraToken'
import { extraTokenFactoryABI } from 'config/abi/extraTokenFactory'
import { feeToABI } from 'config/abi/feeTo'
import { futureCollateralsABI } from 'config/abi/futureCollaterals'
import { gameABI } from 'config/abi/game'
import { gameFactoryABI } from 'config/abi/gameFactory'
import { gameHelperABI } from 'config/abi/gameHelper'
import { gameHelper2ABI } from 'config/abi/gameHelper2'
import { gameMinterABI } from 'config/abi/gameMinter'
import { gaugeABI } from 'config/abi/gauge'
import { lotteryABI } from 'config/abi/lottery'
import { lotteryHelperABI } from 'config/abi/lotteryHelper'
import { lotteryRandomNumberGeneratorABI } from 'config/abi/lotteryRandomNumberGenerator'
import { nftSVGABI } from 'config/abi/nftSVG'
import { marketCollectionsABI } from 'config/abi/marketCollections'
import { marketEventsABI } from 'config/abi/marketEvents'
import { marketHelperABI } from 'config/abi/marketHelper'
import { marketHelper2ABI } from 'config/abi/marketHelper2'
import { marketHelper3ABI } from 'config/abi/marketHelper3'
import { marketOrdersABI } from 'config/abi/marketOrders'
import { marketTradesABI } from 'config/abi/marketTrades'
import { minterABI } from 'config/abi/minter'
import { minterFactoryABI } from 'config/abi/minterFactory'
import { nfticketABI } from 'config/abi/nfticket'
import { nfticketHelperABI } from 'config/abi/nfticketHelper'
import { nfticketHelper2ABI } from 'config/abi/nfticketHelper2'
import { nftMarketHelperABI } from 'config/abi/nftMarketHelper'
import { nftMarketHelper2ABI } from 'config/abi/nftMarketHelper2'
import { nftMarketHelper3ABI } from 'config/abi/nftMarketHelper3'
import { nftMarketOrdersABI } from 'config/abi/nftMarketOrders'
import { nftMarketTradesABI } from 'config/abi/nftMarketTrades'
import { paywallABI } from 'config/abi/paywall'
import { paywallARPFactoryABI } from 'config/abi/paywallARPFactory'
import { paywallARPHelperABI } from 'config/abi/paywallARPHelper'
import { paywallMarketHelperABI } from 'config/abi/paywallMarketHelper'
import { paywallMarketHelper2ABI } from 'config/abi/paywallMarketHelper2'
import { paywallMarketHelper3ABI } from 'config/abi/paywallMarketHelper3'
import { paywallMarketOrdersABI } from 'config/abi/paywallMarketOrders'
import { paywallMarketTradesABI } from 'config/abi/paywallMarketTrades'
import { poolGaugeABI } from 'config/abi/poolGauge'
import { profileABI } from 'config/abi/profile'
import { profileHelperABI } from 'config/abi/profileHelper'
import { referralBribeABI } from 'config/abi/referralBribe'
import { referralBribeFactoryABI } from 'config/abi/referralBribeFactory'
import { referralVoterABI } from 'config/abi/referralVoter'
import { sponsorABI } from 'config/abi/sponsor'
import { sponsorFactoryABI } from 'config/abi/sponsorFactory'
import { sponsorNoteABI } from 'config/abi/sponsorNote'
import { stakeMarketABI } from 'config/abi/stakeMarket'
import { stakeMarketBribeABI } from 'config/abi/stakeMarketBribe'
import { stakeMarketHelperABI } from 'config/abi/stakeMarketHelper'
import { stakeMarketNoteABI } from 'config/abi/stakeMarketNote'
import { stakeMarketVoterABI } from 'config/abi/stakeMarketVoter'
import { ssiABI } from 'config/abi/ssi'
import { vaABI } from 'config/abi/va'
import { valuePoolABI } from 'config/abi/valuePool'
import { vestingABI } from 'config/abi/vesting'
import { valuePoolFactoryABI } from 'config/abi/valuePoolFactory'
import { valuePoolHelperABI } from 'config/abi/valuePoolHelper'
import { valuePoolHelper2ABI } from 'config/abi/valuePoolHelper2'
import { valuePoolVoterABI } from 'config/abi/valuePoolVoter'
import { veABI } from 'config/abi/ve'
import { veFactoryABI } from 'config/abi/veFactory'
import { willABI } from 'config/abi/will'
import { willFactoryABI } from 'config/abi/willFactory'
import { willNoteABI } from 'config/abi/willNote'
import { worldABI } from 'config/abi/world'
import { worldFactoryABI } from 'config/abi/worldFactory'
import { worldHelperABI } from 'config/abi/worldHelper'
import { worldHelper2ABI } from 'config/abi/worldHelper2'
import { worldHelper3ABI } from 'config/abi/worldHelper3'
import { worldNoteABI } from 'config/abi/worldNote'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    publicClient: publicClient ?? viemClients[chainId],
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20ABI, address, signer })
}

export const getErc721Contract = (address: Address, walletClient?: WalletClient) => {
  return getContract({
    abi: erc721ABI,
    address,
    signer: walletClient,
  })
}
export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getPointCenterIfoContract = (signer?: WalletClient) => {
  return getContract({ abi: pointCenterIfoABI, address: getPointCenterIfoAddress(), signer })
}
export const getCakeContract = (chainId?: number) => {
  return getContract({
    abi: erc20ABI,
    address: chainId ? CAKE[chainId]?.address : CAKE[ChainId.BSC].address,
    chainId,
  })
}

export const getProfileContract = (signer?: WalletClient) => {
  return getContract({ abi: profileABI, address: getProfileAddress(), signer })
}

export const getBunnyFactoryContract = (signer?: WalletClient) => {
  return getContract({ abi: bunnyFactoryABI, address: getBunnyFactoryAddress(), signer })
}
export const getLotteryV2Contract = (signer?: WalletClient) => {
  return getContract({ abi: lotteryV2ABI, address: getLotteryV2Address(), signer })
}

export const getTradingCompetitionContractEaster = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionEasterABI,
    address: getTradingCompetitionAddressEaster(),
    signer,
  })
}

export const getTradingCompetitionContractFanToken = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionFanTokenABI,
    address: getTradingCompetitionAddressFanToken(),
    signer,
  })
}
export const getTradingCompetitionContractMobox = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoboxABI,
    address: getTradingCompetitionAddressMobox(),
    signer,
  })
}

export const getTradingCompetitionContractMoD = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoDABI,
    address: getTradingCompetitionAddressMoD(),
    signer,
  })
}

export const getCakeVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: cakeVaultV2ABI, address: getCakeVaultAddress(chainId), signer, chainId })
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: cakeFlexibleSideVaultV2ABI,
    address: getCakeFlexibleSideVaultAddress(chainId),
    signer,
    chainId,
  })
}

export const getPredictionsV2Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: predictionsV2ABI, address, signer })
}

export const getPredictionsV1Contract = (signer?: WalletClient) => {
  return getContract({ abi: predictionsV1ABI, address: getPredictionsV1Address(), signer })
}

export const getCakePredictionsContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: cakePredictionsABI, address, signer })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getFarmAuctionContract = (signer?: WalletClient) => {
  return getContract({ abi: farmAuctionABI, address: getFarmAuctionAddress(), signer })
}

export const getNftMarketContract = (signer?: WalletClient) => {
  return getContract({ abi: nftMarketABI, address: getNftMarketAddress(), signer })
}

export const getNftSaleContract = (signer?: WalletClient) => {
  return getContract({ abi: nftSaleABI, address: getNftSaleAddress(), signer })
}
export const getPancakeSquadContract = (signer?: WalletClient) => {
  return getContract({ abi: pancakeSquadABI, address: getPancakeSquadAddress(), signer })
}

export const getPotteryVaultContract = (address: Address, walletClient?: WalletClient) => {
  return getContract({ abi: potteryVaultABI, address, signer: walletClient })
}

export const getPotteryDrawContract = (walletClient?: WalletClient) => {
  return getContract({ abi: potteryDrawABI, address: getPotteryDrawAddress(), signer: walletClient })
}

export const getIfoCreditAddressContract = (signer?: WalletClient) => {
  return getIfoCreditAddressContract_(ChainId.BSC, getViemClients, signer)
}

export const getBCakeFarmBoosterContract = (signer?: WalletClient) => {
  return getContract({ abi: bCakeFarmBoosterABI, address: getBCakeFarmBoosterAddress(), signer })
}

export const getBCakeFarmBoosterV3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: bCakeFarmBoosterV3ABI, address: getBCakeFarmBoosterV3Address(chainId), signer, chainId })
}

export const getBCakeFarmBoosterProxyFactoryContract = (signer?: WalletClient) => {
  return getContract({
    abi: bCakeFarmBoosterProxyFactoryABI,
    address: getBCakeFarmBoosterProxyFactoryAddress(),
    signer,
  })
}

export const getBCakeProxyContract = (proxyContractAddress: Address, signer?: WalletClient) => {
  return getContract({ abi: bCakeProxyABI, address: proxyContractAddress, signer })
}

export const getNonBscVaultContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: nonBscVaultABI, address: getNonBscVaultAddress(chainId), chainId, signer })
}

export const getSidContract = (address: Address, chainId: number) => {
  return getContract({ abi: sidABI, address, chainId })
}

export const getUnsContract = (address: Address, chainId?: ChainId, publicClient?: PublicClient) => {
  return getContract({
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
        ],
        name: 'reverseNameOf',
        outputs: [
          {
            internalType: 'string',
            name: 'reverseUri',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    chainId,
    address,
    publicClient,
  })
}

export const getSidResolverContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: SIDResolverABI, address, signer })
}

export const getCrossFarmingSenderContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderABI,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingReceiverContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverABI,
    address: getCrossFarmingReceiverAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingProxyContract = (
  proxyContractAddress: Address,
  signer?: WalletClient,
  chainId?: number,
) => {
  return getContract({ abi: crossFarmingProxyABI, address: proxyContractAddress, chainId, signer })
}

export const getStableSwapNativeHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stableSwapNativeHelperABI,
    address: getStableSwapNativeHelperAddress(chainId),
    chainId,
    signer,
  })
}

export const getMasterChefContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: masterChefV2ABI,
    address: getMasterChefV2Address(chainId),
    chainId,
    signer,
  })
}
export const getMasterChefV3Contract = (signer?: WalletClient, chainId?: number) => {
  const mcv3Address = getMasterChefV3Address(chainId)
  return mcv3Address
    ? getContract({
        abi: masterChefV3ABI,
        address: getMasterChefV3Address(chainId),
        chainId,
        signer,
      })
    : null
}

export const getV3MigratorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: v3MigratorABI,
    address: getV3MigratorAddress(chainId),
    chainId,
    signer,
  })
}

export const getTradingRewardContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardAddress(chainId),
    signer,
    chainId,
  })
}

export const getV3AirdropContract = (walletClient?: WalletClient) => {
  return getContract({
    abi: v3AirdropABI,
    address: getV3AirdropAddress(),
    signer: walletClient,
  })
}

export const getAffiliateProgramContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: affiliateProgramABI,
    address: getAffiliateProgramAddress(chainId),
  })
}

export const getTradingRewardTopTradesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardTopTradesAddress(chainId),
    signer,
    chainId,
  })
}

export const getTrustBountiesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: trustBountiesABI,
    address: getTrustBountiesAddress(chainId),
    signer,
    chainId,
  })
}

export const getTrustBountiesHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: trustBountiesHelperABI,
    address: getTrustBountiesHelperAddress(chainId),
    signer,
    chainId,
  })
}

export const getTrustBountiesVoterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: trustBountiesVoterABI,
    address: getTrustBountiesVoterAddress(chainId),
    signer,
    chainId,
  })
}

/** #########################################################
    Payswap
**/

export const getVeContract = (veAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: veABI,
    address: veAddress,
    signer,
    chainId,
  })
}

export const getRampContract = (rampAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: rampABI,
    address: rampAddress,
    signer,
    chainId,
  })
}

export const getRampAdsContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: rampAdsABI,
    address: getRampAdsAddress(),
    signer,
    chainId,
  })
}

export const getRampFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: rampFactoryABI,
    address: getRampFactoryAddress(),
    signer,
    chainId,
  })
}

export const getRampHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: rampHelperABI,
    address: getRampHelperAddress(),
    signer,
    chainId,
  })
}

export const getAuditorHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: auditorHelperABI,
    address: getAuditorHelperAddress(),
    signer,
    chainId,
  })
}

export const getAuditorHelper2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: auditorHelper2ABI,
    address: getAuditorHelper2Address(),
    signer,
    chainId,
  })
}

export const getAuditorNoteContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: auditorNoteABI,
    address: getAuditorNoteAddress(),
    signer,
    chainId,
  })
}

export const getWorldHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: worldHelperABI,
    address: getWorldHelperAddress(),
    signer,
    chainId,
  })
}

export const getWorldHelper2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: worldHelper2ABI,
    address: getWorldHelper2Address(),
    signer,
    chainId,
  })
}

export const getWorldHelper3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: worldHelper3ABI,
    address: getWorldHelper3Address(),
    signer,
    chainId,
  })
}

export const getWorldNoteContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: worldNoteABI,
    address: getWorldNoteAddress(),
    signer,
    chainId,
  })
}

export const getContributorsVoterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: contributorsVoterABI,
    address: getContributorsVoterAddress(),
    signer,
    chainId,
  })
}

export const getBusinessMinterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: businessMinterABI,
    address: getBusinessMinterAddress(),
    signer,
    chainId,
  })
}

export const getAcceleratorVoterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: acceleratorVoterABI,
    address: getAcceleratorVoterAddress(),
    signer,
    chainId,
  })
}

export const getReferralVoterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: referralVoterABI,
    address: getReferralVoterAddress(),
    signer,
    chainId,
  })
}

export const getAuditorFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: auditorFactoryABI,
    address: getAuditorFactoryAddress(),
    signer,
    chainId,
  })
}

export const getAuditorContract = (auditorContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: auditorABI,
    address: auditorContractAddress,
    signer,
    chainId,
  })
}

export const getCardContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: cardABI,
    address: getCardAddress(),
    signer,
    chainId,
  })
}

export const getFutureCollateralsContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: futureCollateralsABI,
    address: getFutureCollateralsAddress(),
    signer,
    chainId,
  })
}

export const getWillContract = (willContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: willABI,
    address: willContractAddress,
    signer,
    chainId,
  })
}

export const getWillFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: willFactoryABI,
    address: getWillFactoryAddress(),
    signer,
    chainId,
  })
}

export const getWillNoteContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: willNoteABI,
    address: getWillNoteAddress(),
    signer,
    chainId,
  })
}

export const getWorldFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: worldFactoryABI,
    address: getWorldFactoryAddress(),
    signer,
    chainId,
  })
}

export const getWorldContract = (worldContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: worldABI,
    address: worldContractAddress,
    signer,
    chainId,
  })
}

export const getSponsorHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: sponsorNoteABI,
    address: getSponsorHelperAddress(),
    signer,
    chainId,
  })
}

export const getSponsorFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: sponsorFactoryABI,
    address: getSponsorFactoryAddress(),
    signer,
    chainId,
  })
}

export const getSponsorContract = (sponsorContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: sponsorABI,
    address: sponsorContractAddress,
    signer,
    chainId,
  })
}

export const getMarketEventsContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: marketEventsABI,
    address: getMarketEventsAddress(),
    signer,
    chainId,
  })
}

export const getMarketCollectionsContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: marketCollectionsABI,
    address: getMarketCollectionsAddress(),
    signer,
    chainId,
  })
}

export const getMarketOrdersContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: marketOrdersABI,
    address: getMarketOrdersAddress(),
    signer,
    chainId,
  })
}

export const getMarketTradesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: marketTradesABI,
    address: getMarketTradesAddress(),
    signer,
    chainId,
  })
}

export const getMarketHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: marketHelperABI,
    address: getMarketHelperAddress(),
    signer,
    chainId,
  })
}

export const getMarketHelper2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: marketHelper2ABI,
    address: getMarketHelper2Address(),
    signer,
    chainId,
  })
}

export const getMarketHelper3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: marketHelper3ABI,
    address: getMarketHelper3Address(),
    signer,
    chainId,
  })
}

export const getNftMarketOrdersContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftMarketOrdersABI,
    address: getNftMarketOrdersAddress(),
    signer,
    chainId,
  })
}

export const getNftMarketTradesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftMarketTradesABI,
    address: getNftMarketTradesAddress(),
    signer,
    chainId,
  })
}

export const getNftMarketHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftMarketHelperABI,
    address: getNftMarketHelperAddress(),
    signer,
    chainId,
  })
}

export const getNftMarketHelper2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftMarketHelper2ABI,
    address: getNftMarketHelper2Address(),
    signer,
    chainId,
  })
}

export const getNftMarketHelper3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftMarketHelper3ABI,
    address: getNftMarketHelper3Address(),
    signer,
    chainId,
  })
}

export const getMinterFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: minterFactoryABI,
    address: getMinterFactoryAddress(),
    signer,
    chainId,
  })
}

export const getPaywallMarketOrdersContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: paywallMarketOrdersABI,
    address: getPaywallMarketOrdersAddress(),
    signer,
    chainId,
  })
}

export const getPaywallMarketTradesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: paywallMarketTradesABI,
    address: getPaywallMarketTradesAddress(),
    signer,
    chainId,
  })
}

export const getPaywallMarketHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: paywallMarketHelperABI,
    address: getPaywallMarketHelperAddress(),
    signer,
    chainId,
  })
}

export const getPaywallMarketHelper2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: paywallMarketHelper2ABI,
    address: getPaywallMarketHelper2Address(),
    signer,
    chainId,
  })
}

export const getPaywallMarketHelper3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: paywallMarketHelper3ABI,
    address: getPaywallMarketHelper3Address(),
    signer,
    chainId,
  })
}

export const getPaywallARPHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: paywallARPHelperABI,
    address: getPaywallARPHelperAddress(),
    signer,
    chainId,
  })
}

export const getPaywallARPFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: paywallARPFactoryABI,
    address: getPaywallARPFactoryAddress(),
    signer,
    chainId,
  })
}

export const getARPContract = (arpContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: arpABI,
    address: arpContractAddress,
    signer,
    chainId,
  })
}

export const getARPFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: arpFactoryABI,
    address: getARPFactoryAddress(),
    signer,
    chainId,
  })
}

export const getARPHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: arpHelperABI,
    address: getARPHelperAddress(),
    signer,
    chainId,
  })
}

export const getARPNoteContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: arpNoteABI,
    address: getARPNoteAddress(),
    signer,
    chainId,
  })
}

export const getARPMinterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: arpMinterABI,
    address: getARPMinterAddress(),
    signer,
    chainId,
  })
}

export const getBILLContract = (billContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: billABI,
    address: billContractAddress,
    signer,
    chainId,
  })
}

export const getBILLFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: billFactoryABI,
    address: getBILLFactoryAddress(),
    signer,
    chainId,
  })
}

export const getBILLHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: billHelperABI,
    address: getBILLHelperAddress(),
    signer,
    chainId,
  })
}

export const getBILLNoteContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: billNoteABI,
    address: getBILLNoteAddress(),
    signer,
    chainId,
  })
}

export const getBILLMinterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: billMinterABI,
    address: getBILLMinterAddress(),
    signer,
    chainId,
  })
}

export const getGameContract = (gameContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: gameABI,
    address: gameContractAddress,
    signer,
    chainId,
  })
}

export const getGameFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: gameFactoryABI,
    address: getGameFactoryAddress(),
    signer,
    chainId,
  })
}

export const getGameHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: gameHelperABI,
    address: getGameHelperAddress(),
    signer,
    chainId,
  })
}

export const getGameHelper2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: gameHelper2ABI,
    address: getGameHelper2Address(),
    signer,
    chainId,
  })
}

export const getGameMinterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: gameMinterABI,
    address: getGameMinterAddress(),
    signer,
    chainId,
  })
}

export const getNFTicket = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nfticketABI,
    address: getNFTicketAddress(),
    signer,
    chainId,
  })
}

export const getNFTicketHelper = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nfticketHelperABI,
    address: getNFTicketHelperAddress(),
    signer,
    chainId,
  })
}

export const getNFTicketHelper2 = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nfticketHelper2ABI,
    address: getNFTicketHelper2Address(),
    signer,
    chainId,
  })
}

export const getPaywallContract = (paywallAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: paywallABI,
    address: paywallAddress,
    signer,
    chainId,
  })
}

export const getMinterContract = (minterAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: minterABI,
    address: minterAddress,
    signer,
    chainId,
  })
}

export const getStakeMarketVoterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stakeMarketVoterABI,
    address: getStakeMarketVoterAddress(),
    signer,
    chainId,
  })
}

export const getStakeMarketBribeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stakeMarketBribeABI,
    address: getStakeMarketBribeAddress(),
    signer,
    chainId,
  })
}

export const getStakeMarketContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stakeMarketABI,
    address: getStakeMarketAddress(),
    signer,
    chainId,
  })
}

export const getStakeMarketNoteContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stakeMarketNoteABI,
    address: getStakeMarketNoteAddress(),
    signer,
    chainId,
  })
}

export const getStakeMarketHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stakeMarketHelperABI,
    address: getStakeMarketHeperAddress(),
    signer,
    chainId,
  })
}

export const getValuepoolVoterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: valuePoolVoterABI,
    address: getValuepoolVoterAddress(),
    signer,
    chainId,
  })
}

export const getValuepoolContract = (valuepoolAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: valuePoolABI,
    address: valuepoolAddress,
    signer,
  })
}

export const getValuepoolFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: valuePoolFactoryABI,
    address: getValuepoolFactoryAddress(chainId),
    signer,
    chainId,
  })
}

export const getVaFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: veFactoryABI,
    address: getVaFactoryAddress(),
    signer,
    chainId,
  })
}

export const getValuepoolHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: valuePoolHelperABI,
    address: getValuepoolHelperAddress(),
    signer,
    chainId,
  })
}

export const getValuepoolHelper2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: valuePoolHelper2ABI,
    address: getValuepoolHelper2Address(),
    signer,
    chainId,
  })
}

export const getBettingContract = (bettingAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bettingABI,
    address: bettingAddress,
    signer,
    chainId,
  })
}

export const getBettingFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bettingFactoryABI,
    address: getBettingFactoryAddress(),
    signer,
    chainId,
  })
}

export const getBettingHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bettingHelperABI,
    address: getBettingHelperAddress(),
    signer,
    chainId,
  })
}

export const getBettingMinterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bettingMinterABI,
    address: getBettingMinterAddress(),
    signer,
    chainId,
  })
}

export const getSSIContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: ssiABI,
    address: getSSIAddress(),
    signer,
    chainId,
  })
}

export const getGaugeContract = (gaugeContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: gaugeABI,
    address: gaugeContractAddress,
    signer,
    chainId,
  })
}

export const getBribeContract = (bribeContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bribeABI,
    address: bribeContractAddress,
    signer,
    chainId,
  })
}

export const getVaContract = (vaAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: vaABI,
    address: vaAddress,
    signer,
    chainId,
  })
}

export const getVestingContract = (vestingContractAddress: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: vestingABI,
    address: vestingContractAddress,
    signer,
    chainId,
  })
}

export const getBusinessVoterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: businessVoterABI,
    address: getBusinessVoterAddress(),
    signer,
    chainId,
  })
}

export const getAffiliatesVoterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: businessVoterABI,
    address: getAffiliatesVoterAddress(),
    signer,
    chainId,
  })
}

export const getPoolGaugeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: poolGaugeABI,
    address: getPoolGaugeAddress(),
    signer,
    chainId,
  })
}

export const getFeeToContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: feeToABI,
    address: getFeeToAddress(),
    signer,
    chainId,
  })
}

export const getProfileHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: profileHelperABI,
    address: getProfileHelperAddress(),
    signer,
    chainId,
  })
}

export const getLotteryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: lotteryABI,
    address: getLotteryAddress(),
    signer,
    chainId,
  })
}

export const getLotteryHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: lotteryHelperABI,
    address: getLotteryHelperAddress(),
    signer,
    chainId,
  })
}

export const getLotteryRandomNumberGeneratorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: lotteryRandomNumberGeneratorABI,
    address: getLotteryRandomNumberGeneratorAddress(),
    signer,
    chainId,
  })
}

export const getNFTSVGContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftSVGABI,
    address: getNFTSVGAddress(),
    signer,
    chainId,
  })
}
