import { profileHelperABI } from 'config/abi/profileHelper'
import { getProfileHelperAddress } from 'utils/addressHelpers'

import { publicClient } from 'utils/wagmi'

/**
 * Gets all public data of an IFO
 */

export const fetchProfileAuctionData = async ({ chainId }) => {
  try {
    const client = publicClient({ chainId })
    const [boughtProfileId] = await client.multicall({
      contracts: [
        {
          abi: profileHelperABI,
          address: getProfileHelperAddress(),
          functionName: 'boughtProfileId',
        },
      ],
      allowFailure: false,
    })
    console.log('boughtProfileId==================>', boughtProfileId)
    const [bid] = await client.multicall({
      contracts: [
        {
          abi: profileHelperABI,
          address: getProfileHelperAddress(),
          functionName: 'bids',
          args: [BigInt(boughtProfileId)],
        },
      ],
      allowFailure: true,
    })
    return {
      bid: {},
      boughtProfileId,
    }
  } catch (err) {
    console.log('err====================>', err)
  }
  return null
}
