import { getPoolContractBySousId } from '@pancakeswap/pools'

import { Abi, Address } from 'viem'
import { erc20ABI, usePublicClient, useWalletClient } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'

import addresses from 'config/constants/contracts'
import { useMemo } from 'react'
import { getMulticallAddress, getPredictionsV1Address, getZapAddress } from 'utils/addressHelpers'
import {
  getBCakeFarmBoosterContract,
  getBCakeFarmBoosterProxyFactoryContract,
  getBCakeFarmBoosterV3Contract,
  getBCakeProxyContract,
  getBunnyFactoryContract,
  getCakeFlexibleSideVaultV2Contract,
  getCakePredictionsContract,
  getCakeVaultV2Contract,
  getChainlinkOracleContract,
  getContract,
  getCrossFarmingProxyContract,
  getFarmAuctionContract,
  getIfoCreditAddressContract,
  getLotteryV2Contract,
  getMasterChefContract,
  getMasterChefV3Contract,
  getNftMarketContract,
  getNftSaleContract,
  getNonBscVaultContract,
  getPointCenterIfoContract,
  getPotteryDrawContract,
  getPotteryVaultContract,
  getPredictionsV1Contract,
  getPredictionsV2Contract,
  getProfileContract,
  getSidContract,
  getStableSwapNativeHelperContract,
  getTradingCompetitionContractEaster,
  getTradingCompetitionContractFanToken,
  getTradingCompetitionContractMoD,
  getTradingCompetitionContractMobox,
  getTradingRewardContract,
  getUnsContract,
  getAffiliateProgramContract,
  getV3AirdropContract,
  getV3MigratorContract,
  getTradingRewardTopTradesContract,
  getRampFactoryContract,
  getRampHelperContract,
  getRampAdsContract,
  getRampContract,
  getTrustBountiesContract,
  getTrustBountiesVoterContract,
  getTrustBountiesHelperContract,
  getReferralVoterContract,
  getFeeToContract,
  getPoolGaugeContract,
  getBettingMinterContract,
  getBettingHelperContract,
  getBettingFactoryContract,
  getValuepoolFactoryContract,
  getNFTicketHelper,
  getNFTicket,
  getPaywallContract,
  getVaContract,
  getValuepoolContract,
  getBribeContract,
  getGaugeContract,
  getSSIContract,
  getBusinessVoterContract,
  getVaFactoryContract,
  getValuepoolHelper2Contract,
  getValuepoolHelperContract,
  getValuepoolVoterContract,
  getSponsorHelperContract,
  getContributorsVoterContract,
  getAcceleratorVoterContract,
  getSponsorFactoryContract,
  getSponsorContract,
  getWorldNoteContract,
  getWorldHelper3Contract,
  getWorldHelper2Contract,
  getWorldHelperContract,
  getWorldFactoryContract,
  getWorldContract,
  getGameContract,
  getGameHelper2Contract,
  getGameHelperContract,
  getGameMinterContract,
  getGameFactoryContract,
  getBILLNoteContract,
  getBILLMinterContract,
  getBILLHelperContract,
  getBILLFactoryContract,
  getBILLContract,
  getWillNoteContract,
  getWillFactoryContract,
  getWillContract,
  getARPNoteContract,
  getARPMinterContract,
  getARPHelperContract,
  getARPFactoryContract,
  getARPContract,
  getAuditorNoteContract,
  getAuditorHelper2Contract,
  getAuditorHelperContract,
  getAuditorFactoryContract,
  getAuditorContract,
  getFutureCollateralsContract,
  getCardContract,
  getBettingContract,
  getVeContract,
  getStakeMarketVoterContract,
  getStakeMarketBribeContract,
  getStakeMarketHelperContract,
  getStakeMarketNoteContract,
  getStakeMarketContract,
  getMinterContract,
  getMinterFactoryContract,
  getNftMarketHelper3Contract,
  getNftMarketHelper2Contract,
  getNftMarketHelperContract,
  getNftMarketTradesContract,
  getNftMarketOrdersContract,
  getPaywallARPHelperContract,
  getPaywallARPFactoryContract,
  getPaywallMarketHelper2Contract,
  getPaywallMarketHelperContract,
  getPaywallMarketTradesContract,
  getPaywallMarketOrdersContract,
  getMarketHelper3Contract,
  getMarketHelper2Contract,
  getMarketHelperContract,
  getMarketTradesContract,
  getMarketOrdersContract,
  getMarketEventsContract,
  getMarketCollectionsContract,
  getProfileHelperContract,
  getLotteryContract,
  getLotteryRandomNumberGeneratorContract,
  getLotteryHelperContract,
  getNFTSVGContract,
  getBusinessMinterContract,
  getRampHelper2Contract,
  getExtraTokenContract,
  getExtraTokenFactoryContract,
} from 'utils/contractHelpers'

import { ChainId, WNATIVE, pancakePairV2ABI } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { nonfungiblePositionManagerABI } from '@pancakeswap/v3-sdk'
import { multicallABI } from 'config/abi/Multicall'
import { erc20Bytes32ABI } from 'config/abi/erc20_bytes32'
import { ifoV1ABI } from 'config/abi/ifoV1'
import { ifoV2ABI } from 'config/abi/ifoV2'
import { ifoV3ABI } from 'config/abi/ifoV3'
import { wbethBscABI } from 'config/abi/wbethBSC'
import { wbethEthABI } from 'config/abi/wbethETH'
import { zapABI } from 'config/abi/zap'
import { WBETH } from 'config/constants/liquidStaking'
import { VaultKey } from 'state/types'

import { erc721CollectionABI } from 'config/abi/erc721collection'
import { infoStableSwapABI } from 'config/abi/infoStableSwap'
import { wethABI } from 'config/abi/weth'
import { Wallet } from 'ethers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: Address) => {
  return useContract(address, ifoV1ABI)
}

export const useIfoV2Contract = (address: Address) => {
  return useContract(address, ifoV2ABI)
}

export const useIfoV3Contract = (address: Address) => {
  return useContract(address, ifoV3ABI)
}

export const useERC20 = (address: any) => {
  return useContract(address, erc20ABI)
}

export const useCake = () => {
  const { chainId } = useActiveChainId()

  return useContract(CAKE[chainId].address ?? CAKE[ChainId.BSC].address, erc20ABI)
}

export const useBunnyFactory = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBunnyFactoryContract(signer), [signer])
}

export const useProfileContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getProfileContract(signer), [signer])
}

export const useLotteryV2Contract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getLotteryV2Contract(signer), [signer])
}

export const useMasterchef = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefContract(signer, chainId), [signer, chainId])
}

export const useSousChef = (id) => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  const publicClient = usePublicClient({ chainId })
  return useMemo(
    () =>
      getPoolContractBySousId({
        sousId: id,
        signer,
        chainId,
        publicClient,
      }),
    [id, signer, chainId, publicClient],
  )
}

export const usePointCenterIfoContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPointCenterIfoContract(signer), [signer])
}

export const useTradingCompetitionContractEaster = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractEaster(signer), [signer])
}

export const useTradingCompetitionContractFanToken = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractFanToken(signer), [signer])
}

export const useTradingCompetitionContractMobox = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractMobox(signer), [signer])
}

export const useTradingCompetitionContractMoD = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingCompetitionContractMoD(signer), [signer])
}

export const useVaultPoolContract = <T extends VaultKey>(
  vaultKey: T,
):
  | (T extends VaultKey.CakeVault
      ? ReturnType<typeof getCakeVaultV2Contract>
      : ReturnType<typeof getCakeFlexibleSideVaultV2Contract>)
  | null => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => {
    if (vaultKey === VaultKey.CakeVault) {
      return getCakeVaultV2Contract(signer, chainId)
    }
    if (vaultKey === VaultKey.CakeFlexibleSideVault) {
      return getCakeFlexibleSideVaultV2Contract(signer, chainId)
    }
    return null
  }, [signer, vaultKey, chainId]) as any
}

export const useCakeVaultContract = () => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  return useMemo(() => getCakeVaultV2Contract(signer, chainId), [signer, chainId])
}

export const useIfoCreditAddressContract = () => {
  return useMemo(() => getIfoCreditAddressContract(), [])
}

export const usePredictionsContract = (address: Address, tokenSymbol: string) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => {
    if (address === getPredictionsV1Address()) {
      return getPredictionsV1Contract(signer)
    }
    const getPredContract = tokenSymbol === 'CAKE' ? getCakePredictionsContract : getPredictionsV2Contract

    return getPredContract(address, signer)
  }, [address, tokenSymbol, signer])
}

export const useChainlinkOracleContract = (address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getChainlinkOracleContract(address, signer), [signer, address])
}

export const useNftSaleContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftSaleContract(signer), [signer])
}

export const useFarmAuctionContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getFarmAuctionContract(signer), [signer])
}

export const useNftMarketContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketContract(signer), [signer])
}

export const useErc721CollectionContract = (collectionAddress: Address) => {
  return useContract(collectionAddress, erc721CollectionABI)
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
) {
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20ABI)
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}

export function useWBETHContract() {
  const { chainId } = useActiveChainId()

  const abi = useMemo(
    () => ([ChainId.ETHEREUM, ChainId.GOERLI].includes(chainId) ? wbethEthABI : wbethBscABI),
    [chainId],
  )

  return useContract(chainId ? WBETH[chainId] : undefined, abi)
}

export function useBytes32TokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Bytes32ABI)
}

export function usePairContract(pairAddress?: Address) {
  return useContract(pairAddress, pancakePairV2ABI)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export const usePotterytVaultContract = (address: Address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPotteryVaultContract(address, signer), [address, signer])
}

export const usePotterytDrawContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPotteryDrawContract(signer), [signer])
}

export function useZapContract() {
  const { chainId } = useActiveChainId()
  return useContract(getZapAddress(chainId), zapABI)
}

export function useBCakeFarmBoosterContract() {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBCakeFarmBoosterContract(signer), [signer])
}

export function useBCakeFarmBoosterV3Contract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBCakeFarmBoosterV3Contract(signer, chainId), [signer, chainId])
}

export function useBCakeFarmBoosterProxyFactoryContract() {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBCakeFarmBoosterProxyFactoryContract(signer), [signer])
}

export function useBCakeProxyContract(proxyContractAddress: Address) {
  const { data: signer } = useWalletClient()
  return useMemo(
    () => proxyContractAddress && getBCakeProxyContract(proxyContractAddress, signer),
    [signer, proxyContractAddress],
  )
}

export const useNonBscVault = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNonBscVaultContract(signer, chainId), [signer, chainId])
}

export const useSIDContract = (address, chainId) => {
  return useMemo(() => getSidContract(address, chainId), [address, chainId])
}

export const useUNSContract = (address, chainId, provider) => {
  return useMemo(() => getUnsContract(address, chainId, provider), [chainId, address, provider])
}

export const useCrossFarmingProxy = (proxyContractAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => proxyContractAddress && getCrossFarmingProxyContract(proxyContractAddress, signer, chainId),
    [proxyContractAddress, signer, chainId],
  )
}

export const useStableSwapNativeHelperContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStableSwapNativeHelperContract(signer, chainId), [signer, chainId])
}

export function useV3NFTPositionManagerContract() {
  return useContract(addresses.nftPositionManager, nonfungiblePositionManagerABI)
}

export function useMasterchefV3() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefV3Contract(signer, chainId), [signer, chainId])
}

export function useV3MigratorContract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3MigratorContract(signer, chainId), [chainId, signer])
}

export const useTradingRewardContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingRewardContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useV3AirdropContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3AirdropContract(signer), [signer])
}

export const useInfoStableSwapContract = (infoAddress?: Address) => {
  return useContract(infoAddress, infoStableSwapABI)
}

export const useAffiliateProgramContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getAffiliateProgramContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useTradingRewardTopTraderContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingRewardTopTradesContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useRampFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getRampFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useRampHelper = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getRampHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useRampHelper2 = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getRampHelper2Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useRampAds = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getRampAdsContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useRampContract = (rampAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => rampAddress && getRampContract(rampAddress, signer, chainId), [rampAddress, signer, chainId])
}

export const useExtraTokenContract = (extraTokenAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => extraTokenAddress && getExtraTokenContract(extraTokenAddress, signer, chainId),
    [extraTokenAddress, signer, chainId],
  )
}

export const useExtraTokenFactoryContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getExtraTokenFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useTrustBountiesContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getTrustBountiesContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useTrustBountiesHelperContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getTrustBountiesHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useTrustBountiesVoterContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getTrustBountiesVoterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

/**
 * Payswap
 */

export const useProfileHelperContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getProfileHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useLotteryContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getLotteryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useLotteryRandomNumberGenerator = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getLotteryRandomNumberGeneratorContract(signer, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useLotteryHelperContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getLotteryHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useMarketCollectionsContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMarketCollectionsContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useMarketEventsContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMarketEventsContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useMarketOrdersContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMarketOrdersContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useMarketTradesContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMarketTradesContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useMarketHelperContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMarketHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useMarketHelper2Contract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMarketHelper2Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useMarketHelper3Contract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMarketHelper3Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const usePaywallMarketOrdersContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getPaywallMarketOrdersContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const usePaywallMarketTradesContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getPaywallMarketTradesContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const usePaywallMarketHelperContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getPaywallMarketHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const usePaywallMarketHelper2Contract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getPaywallMarketHelper2Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const usePaywallARPFactoryContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getPaywallARPFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const usePaywallARPHelperContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getPaywallARPHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useNftMarketOrdersContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketOrdersContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useNftMarketTradesContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketTradesContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useNftMarketHelperContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useNftMarketHelper2Contract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketHelper2Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useNftMarketHelper3Contract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNftMarketHelper3Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useMinterFactoryContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMinterFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useMinterContract = (minterAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => minterAddress && getRampContract(minterAddress, signer, chainId),
    [minterAddress, signer, chainId],
  )
}

export const useStakeMarketContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStakeMarketContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useStakeMarketNoteContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStakeMarketNoteContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useStakeMarketHelperContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStakeMarketHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useStakeMarketBribeContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStakeMarketBribeContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useStakeMarketVoterContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStakeMarketVoterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useVeContract = (veAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => veAddress && getVeContract(veAddress, signer, chainId), [veAddress, signer, chainId])
}

export const useBettingContract = (bettingAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => bettingAddress && getBettingContract(bettingAddress, signer, chainId),
    [bettingAddress, signer, chainId],
  )
}

export const useCardContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getCardContract(signer, chainId), [signer, chainId])
}

export const useFutureCollateralContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getFutureCollateralsContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useAuditorContract = (auditorAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => auditorAddress && getAuditorContract(auditorAddress, signer, chainId),
    [auditorAddress, signer, chainId],
  )
}

export const useAuditorFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getAuditorFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useAuditorHelper = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getAuditorHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useAuditorHelper2 = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getAuditorHelper2Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useAuditorNote = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getAuditorNoteContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useARPContract = (arpAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => arpAddress && getARPContract(arpAddress, signer, chainId), [arpAddress, signer, chainId])
}

export const useARPFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getARPFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useARPHelper = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getARPHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useARPMinter = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getARPMinterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useARPNote = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getARPNoteContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useWILLContract = (willAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => willAddress && getWillContract(willAddress, signer, chainId), [willAddress, signer, chainId])
}

export const useWILLFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getWillFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useWILLNote = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getWillNoteContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useBILLContract = (billAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => billAddress && getBILLContract(billAddress, signer, chainId), [billAddress, signer, chainId])
}

export const useBILLFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBILLFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useBILLHelper = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBILLHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useBILLMinter = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBILLMinterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useBILLNote = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBILLNoteContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useGameFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getGameFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useGameMinter = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getGameMinterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useGameHelper = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getGameHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useGameHelper2 = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getGameHelper2Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useGameContract = (gameAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => gameAddress && getGameContract(gameAddress, signer, chainId), [gameAddress, signer, chainId])
}

export const useWorldContract = (worldAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => worldAddress && getWorldContract(worldAddress, signer, chainId), [worldAddress, signer, chainId])
}

export const useWorldFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getWorldFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useWorldHelper = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getWorldHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useWorldHelper2 = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getWorldHelper2Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useWorldHelper3 = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getWorldHelper3Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useWorldNote = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getWorldNoteContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useSponsorContract = (sponsorAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => sponsorAddress && getSponsorContract(sponsorAddress, signer, chainId),
    [sponsorAddress, signer, chainId],
  )
}

export const useSponsorFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getSponsorFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useAcceleratorContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getAcceleratorVoterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useContributorsContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getContributorsVoterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useBusinessMinterContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBusinessMinterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useSponsorHelper = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getSponsorHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useValuepoolVoterContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getValuepoolVoterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useValuepoolHelperContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getValuepoolHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useValuepoolHelper2Contract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getValuepoolHelper2Contract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useVaFactoryContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getVaFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useBusinessVoter = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBusinessVoterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useSSIContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getSSIContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useGaugeContract = (gaugeAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => gaugeAddress && getGaugeContract(gaugeAddress, signer, chainId), [gaugeAddress, signer, chainId])
}

export const useBribeContract = (bribeAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => bribeAddress && getBribeContract(bribeAddress, signer, chainId), [bribeAddress, signer, chainId])
}

export const useValuepoolContract = (valuepoolAddress: any) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => valuepoolAddress && getValuepoolContract(valuepoolAddress, signer, chainId),
    [valuepoolAddress, signer, chainId],
  )
}

export const useVaContract = (vaAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => vaAddress && getVaContract(vaAddress, signer, chainId), [vaAddress, signer, chainId])
}

export const usePaywallContract = (paywallAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => paywallAddress && getPaywallContract(paywallAddress, signer, chainId),
    [paywallAddress, signer, chainId],
  )
}

export const useNFTSVGContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNFTSVGContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useNFTicket = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNFTicket(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useNFTicketHelper = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNFTicketHelper(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useValuepoolFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getValuepoolFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useBettingFactory = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBettingFactoryContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useBettingHelper = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBettingHelperContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useBettingMinter = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBettingMinterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const usePoolGaugeContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getPoolGaugeContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useFeeToContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getFeeToContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useReferralVoter = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getReferralVoterContract(signer, chainId_ ?? chainId), [signer, chainId_, chainId])
}
