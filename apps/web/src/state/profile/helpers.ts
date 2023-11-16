import BigNumber from 'bignumber.js'
import { gql, request } from 'graphql-request'
import { GRAPH_API_PROFILE, GRAPH_API_SSI } from 'config/constants/endpoints'
import { identityTokenFields } from 'state/ssi/queries'
import { getCollection } from 'state/cancan/helpers'
import { blacklistFields, registrationFields, accountFields, tokenFields, profileFields } from './queries'
import { publicClient } from 'utils/wagmi'
import { profileABI } from 'config/abi/profile'
import { getProfileAddress, getProfileHelperAddress, getTrustBountiesAddress } from 'utils/addressHelpers'
import { Address } from 'viem'
import { profileHelperABI } from 'config/abi/profileHelper'
import { erc20ABI } from 'wagmi'
import { trustBountiesABI } from 'config/abi/trustBounties'

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
  const bscClient = publicClient({ chainId: chainId })
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
  const bscClient = publicClient({ chainId: chainId })
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

export const getProfileDataFromUser = async (address, chainId) => {
  const profileId = await getProfileId(address, chainId)
  return getProfileData(profileId)
}

export const getProfileId = async (address, chainId) => {
  const bscClient = publicClient({ chainId: chainId })
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

export const fetchProfiles = async ({ chainId }) => {
  const gauges = await getProfilesData(1000, 0, { active: true })
  const profiles = await Promise.all(
    gauges
      .map(async (gauge) => {
        const bscClient = publicClient({ chainId: chainId })
        const [profileInfo, _badgeIds, accounts, broadcast] = await bscClient.multicall({
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
                  args: [BigInt(token.bountyId ?? 0)],
                },
              ],
            })
            return {
              ...token,
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

export const getProfile = async (address, chainId) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
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
