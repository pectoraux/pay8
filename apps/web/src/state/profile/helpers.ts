import { gql, request } from 'graphql-request'
import { GRAPH_API_PROFILE, GRAPH_API_SSI } from 'config/constants/endpoints'
import { identityTokenFields } from 'state/ssi/queries'
import { getCollection } from 'state/cancan/helpers'
import { publicClient } from 'utils/wagmi'
import { profileABI } from 'config/abi/profile'
import { getProfileAddress, getProfileHelperAddress, getTrustBountiesAddress } from 'utils/addressHelpers'
import { Address, createPublicClient, createWalletClient, http, custom } from 'viem'
import { profileHelperABI } from 'config/abi/profileHelper'
import { erc20ABI } from 'wagmi'
import { trustBountiesABI } from 'config/abi/trustBounties'
import { fantomTestnet } from 'viem/chains'
import { blacklistFields, registrationFields, accountFields, tokenFields, profileFields } from './queries'

export const getProfileData = async (profileId) => {
  try {
    const res = await request(
      GRAPH_API_PROFILE,
      gql`
      query getProfileData($profileId: String) 
      {
        profile(id: $profileId) {
          ${profileFields}
          tokens {
            ${tokenFields}
          }
          accounts {
            ${accountFields}
          }
          following {
            ${registrationFields}
          }
          followers {
            ${registrationFields}
          }
          blacklist {
            ${blacklistFields}
          }
        }
      }
      `,
      { profileId },
    )
    console.log('fetch profile===========>', res)
    return res
  } catch (error) {
    console.error('Failed to fetch profile===========>', error)
  }
  return null
}

export const getProfilesData = async (first = 5, skip = 0, where = {}) => {
  try {
    const res = await request(
      GRAPH_API_PROFILE,
      gql`
      query getProfilesData($where: Profile_filter) 
      {
        profiles(first: $first, skip: $skip, where: $where) {
          ${profileFields}
          tokens {
            ${tokenFields}
          }
          accounts {
            ${accountFields}
          }
          following {
            ${registrationFields}
          }
          followers {
            ${registrationFields}
          }
          blacklist {
            ${blacklistFields}
          }
        }
      }
      `,
      { first, skip, where },
    )
    console.log('Failed to fetch profiles===========>', res)
    return res.profiles
  } catch (error) {
    console.error('Failed to fetch profiles===========>', error)
    return []
  }
}

export const getSharedEmail = async (accountAddress, chainId) => {
  const bscClient = publicClient({ chainId })
  const [shared] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getProfileAddress(),
        abi: profileABI,
        functionName: 'sharedEmail',
        args: [accountAddress as Address],
      },
    ],
  })
  return shared.result
}

export const getIsNameUsed = async (name, chainId) => {
  const bscClient = publicClient({ chainId })
  const [isNameTaken] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getProfileAddress(),
        abi: profileABI,
        functionName: 'getIsNameTaken',
        args: [name],
      },
    ],
  })
  return isNameTaken.result
}

export const getIsCrush = async (account, profileId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [isCrush] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getProfileHelperAddress(),
        abi: profileHelperABI,
        functionName: 'checkCrush',
        args: [BigInt(profileId)],
      },
    ],
  })
  console.log('getIsCrush===================>', account, profileId, isCrush)
  return isCrush.result
}

export const getProfileDataFromUser = async (address, chainId) => {
  const profileId = await getProfileId(address, chainId)
  return getProfileData(profileId)
}

export const getProfileId = async (address, chainId) => {
  const bscClient = publicClient({ chainId })
  const [profileId] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getProfileAddress(),
        abi: profileABI,
        functionName: 'addressToProfileId',
        args: [address as Address],
      },
    ],
  })
  return profileId.result?.toString()
}

export const getSSIDatum = async (account: string) => {
  try {
    const res = await request(
      GRAPH_API_SSI,
      gql`
        query getSSIData($account: String!) {
          identityTokens(
            where: { owner: $account }
          ) {
              ${identityTokenFields}
            }
        }
      `,
      { account },
    )
    console.log('1res.profile=======================>', account, res)
    return res.identityTokens
  } catch (error) {
    console.error('Failed to fetch ssidata=================>', error)
    return null
  }
}

export const getProfileAuctionData = async (chainId) => {
  const bscClient = publicClient({ chainId })
  const [_boughtProfileId] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        abi: profileHelperABI,
        address: getProfileHelperAddress(),
        functionName: 'boughtProfileId',
      },
    ],
  })

  const [bid] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        abi: profileHelperABI,
        address: getProfileHelperAddress(),
        functionName: 'bids',
        args: [BigInt(_boughtProfileId.result)],
      },
    ],
  })
  return {
    bid: bid.result,
    boughtProfileId: _boughtProfileId.result?.toString(),
  }
}

export const getBoughtProfileAuctionData = async (profileId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [bid] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        abi: profileHelperABI,
        address: getProfileHelperAddress(),
        functionName: 'bids',
        args: [BigInt(profileId)],
      },
    ],
  })
  return {
    bid: bid.result,
    boughtProfileId: profileId,
  }
}

export const fetchProfiles = async ({ chainId }) => {
  const gauges = await getProfilesData(1000, 0, { active: true })
  const profiles = await Promise.all(
    gauges
      .map(async (gauge) => {
        const bscClient = publicClient({ chainId })
        const [profileInfo, _badgeIds, accounts, broadcast, crushCount] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getProfileAddress(),
              abi: profileABI,
              functionName: 'profileInfo',
              args: [BigInt(gauge.id)],
            },
            {
              address: getProfileAddress(),
              abi: profileABI,
              functionName: 'getAllBadgeIds',
              args: [BigInt(gauge.id), BigInt(0)],
            },
            {
              address: getProfileAddress(),
              abi: profileABI,
              functionName: 'getAllAccounts',
              args: [BigInt(gauge.id), BigInt(0)],
            },
            {
              address: getProfileHelperAddress(),
              abi: profileHelperABI,
              functionName: 'broadcast',
              args: [BigInt(gauge.id)],
            },
            {
              address: getProfileHelperAddress(),
              abi: profileHelperABI,
              functionName: 'crushCount',
              args: [BigInt(gauge.id)],
            },
          ],
        })
        const ssid = profileInfo.result[0]
        const name = profileInfo.result[1]
        const ssidAuditorProfileId = profileInfo.result[2]
        const createdAt = profileInfo.result[3]
        const activePeriod = profileInfo.result[4]
        const paidPayable = profileInfo.result[5]
        const _collectionId = profileInfo.result[6]
        const blackLateSeconds = profileInfo.result[7]?.lateSeconds
        const blackLateValue = profileInfo.result[7]?.lateValue
        const brownLateSeconds = profileInfo.result[8]?.lateSeconds
        const brownLateValue = profileInfo.result[8]?.lateValue
        const silverLateSeconds = profileInfo.result[9]?.lateSeconds
        const silverLateValue = profileInfo.result[9]?.lateValue
        const goldLateSeconds = profileInfo.result[10]?.lateSeconds
        const goldLateValue = profileInfo.result[10]?.lateValue
        let collection
        if (Number(gauge.collectionId)) {
          collection = await getCollection(gauge.collectionId)
        }
        const badgeIds = _badgeIds.result.map((badgeId) => badgeId.toString())
        const tokens = await Promise.all(
          gauge?.tokens?.map(async (token) => {
            const [_bountyId] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: getProfileAddress(),
                  abi: profileABI,
                  functionName: 'bounties',
                  args: [BigInt(gauge.id), token.tokenAddress],
                },
              ],
            })
            const [tokenName, decimals, symbol, bountyBalance] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: token.tokenAddress,
                  abi: erc20ABI,
                  functionName: 'name',
                },
                {
                  address: token.tokenAddress,
                  abi: erc20ABI,
                  functionName: 'decimals',
                },
                {
                  address: token.tokenAddress,
                  abi: erc20ABI,
                  functionName: 'symbol',
                },
                {
                  address: getTrustBountiesAddress(),
                  abi: trustBountiesABI,
                  functionName: 'getBalance',
                  args: [BigInt(_bountyId.result ?? 0)],
                },
              ],
            })
            return {
              ...token,
              bountyId: _bountyId.result,
              tokenName: tokenName.result,
              decimals: decimals.result,
              symbol: symbol.result?.toUpperCase(),
              bountyBalance: bountyBalance.result.toString(),
            }
          }),
        )

        // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
        return {
          sousId: gauge.id,
          ...gauge,
          accounts: accounts.result,
          tokens,
          badgeIds,
          broadcast: broadcast.result,
          collection,
          ssid,
          name,
          crushCount: crushCount.result.toString(),
          ssidAuditorProfileId: ssidAuditorProfileId.toString(),
          createdAt: createdAt.toString(),
          activePeriod: activePeriod.toString(),
          paidPayable: paidPayable.toString(),
          blackLateSeconds: blackLateSeconds.toString(),
          blackLateValue: blackLateValue.toString(),
          brownLateSeconds: brownLateSeconds.toString(),
          brownLateValue: brownLateValue.toString(),
          silverLateSeconds: silverLateSeconds.toString(),
          silverLateValue: silverLateValue.toString(),
          goldLateSeconds: goldLateSeconds.toString(),
          goldLateValue: goldLateValue.toString(),
        }
      })
      .flat(),
  )
  return profiles
}

export const getIsUnique = async (profileId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [unique] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getProfileAddress(),
        abi: profileABI,
        functionName: 'isUnique',
        args: [profileId],
      },
    ],
  })
  return unique.result
}

export const getProfile = async (address, chainId) => {
  try {
    const bscClient = publicClient({ chainId })
    const [profileId] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getProfileAddress(),
          abi: profileABI,
          functionName: 'addressToProfileId',
          args: [address as Address],
        },
      ],
    })
    let profileInfo
    if (BigInt(profileId.result.toString()) > 0) {
      const [_profileInfo] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: getProfileAddress(),
            abi: profileABI,
            functionName: 'profileInfo',
            args: [BigInt(profileId.result.toString())],
          },
        ],
      })
      let collection
      if (Number(_profileInfo.result[6]?.toString())) {
        collection = await getCollection(_profileInfo.result[6]?.toString())
      }
      profileInfo = {
        ssid: _profileInfo.result[0],
        name: _profileInfo.result[1],
        ssidAuditorProfileId: _profileInfo.result[2]?.toString(),
        createdAt: _profileInfo.result[3]?.toString(),
        activePeriod: _profileInfo.result[4]?.toString(),
        paidPayable: _profileInfo.result[5]?.toString(),
        collectionId: _profileInfo.result[6]?.toString(),
        collection,
        black: {
          lateSeconds: _profileInfo.result[7][0]?.toString(),
          lateValue: _profileInfo.result[7][1]?.toString(),
        },
        brown: {
          lateSeconds: _profileInfo.result[8][0]?.toString(),
          lateValue: _profileInfo.result[8][1]?.toString(),
        },
        silver: {
          lateSeconds: _profileInfo.result[9][0]?.toString(),
          lateValue: _profileInfo.result[9][0]?.toString(),
        },
        gold: {
          lateSeconds: _profileInfo.result[10][0]?.toString(),
          lateValue: _profileInfo.result[10][1]?.toString(),
        },
      }
    }
    const res = {
      profile: profileInfo,
      profileId,
    }
    return res
  } catch (e) {
    console.log('4profileContract==================>', e)
    console.error(e)
    return null
  }
}
