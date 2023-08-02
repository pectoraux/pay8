import { gql, request } from 'graphql-request'
import { GRAPH_API_PROFILE, GRAPH_API_SSI } from 'config/constants/endpoints'
// import { getCollectionApi } from 'state/cancan/helpers'
import { identityTokenFields } from 'state/ssi/queries'
import { publicClient } from 'utils/wagmi'
import { getProfileAddress, getProfileHelperAddress, getTrustBountiesAddress } from 'utils/addressHelpers'
import { profileABI } from 'config/abi/profile'
import { profileHelperABI } from 'config/abi/profileHelper'
import { erc20ABI } from 'wagmi'
import { trustBountiesABI } from 'config/abi/trustBounties'

import { blacklistFields, registrationFields, accountFields, tokenFields, profileFields } from './queries'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: any
}

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
    console.log('fetched profile===========>', res.profile)
    return res.profile
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

export const getSharedEmail = async (accountAddress) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [sharedEmail] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getProfileAddress(),
        abi: profileABI,
        functionName: 'sharedEmail',
        args: [accountAddress?.toLowerCase()],
      },
    ],
  })
  return sharedEmail
}

export const getIsNameUsed = async (name) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [getIsNameTaken] = await bscClient.multicall({
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
  return getIsNameTaken
}

export const getProfileDataFromUser = async (address) => {
  console.log('2getProfilesData=================>', address)
  const bscClient = publicClient({ chainId: 4002 })
  const [profileId] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getProfileAddress(),
        abi: profileABI,
        functionName: 'addressToProfileId',
        args: [address],
      },
    ],
  })
  const profileData = await getProfileData(profileId?.toString())
  return {
    ...profileData,
  }
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

export const fetchProfiles = async () => {
  const gauges = await getProfilesData()
  const bscClient = publicClient({ chainId: 4002 })
  const profiles = await Promise.all(
    gauges
      .map(async (gauge) => {
        const [profileInfo, _badgeIds, broadcast] = await bscClient.multicall({
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
        // const _collectionId = profileInfo.result[6]
        const blackLateSeconds = profileInfo.result[7][0]
        const blackLateValue = profileInfo.result[7][1]
        const brownLateSeconds = profileInfo.result[8][0]
        const brownLateValue = profileInfo.result[8][1]
        const silverLateSeconds = profileInfo.result[9][0]
        const silverLateValue = profileInfo.result[9][1]
        const goldLateSeconds = profileInfo.result[10][0]
        const goldLateValue = profileInfo.result[10][1]

        let collection
        if (Number(gauge.collectionId)) {
          collection = {} // await getCollectionApi(gauge.collectionId);
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
                  args: [BigInt(token.bountyId)],
                },
              ],
            })
            return {
              ...token,
              tokenName,
              decimals,
              symbol,
              bountyBalance: bountyBalance.toString(),
            }
          }),
        )

        // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
        return {
          sousId: gauge.id,
          ...gauge,
          tokens,
          badgeIds,
          broadcast,
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

export const getProfile = async (address) => {
  try {
    const bscClient = publicClient({ chainId: 4002 })
    const [profileId] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getProfileAddress(),
          abi: profileABI,
          functionName: 'addressToProfileId',
          args: [address],
        },
      ],
    })
    let profileInfo
    if (parseInt(profileId.toString()) > 0) {
      const [_profileInfo] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: getProfileAddress(),
            abi: profileABI,
            functionName: 'profileInfo',
            args: [BigInt(profileId.toString())],
          },
        ],
      })
      profileInfo = _profileInfo
    }
    const res = {
      profile: profileInfo,
      profileId,
    }
    console.log('profileContract================>', res)
    return res
  } catch (e) {
    console.log('profileCallsResult4==================>', e)
    console.error(e)
    return null
  }
}
