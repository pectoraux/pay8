import { GRAPH_API_CANCAN } from 'config/constants/endpoints'
import { gql, request } from 'graphql-request'
import { isAddress } from 'utils'
import { erc20ABI } from 'wagmi'
import {
  getMarketCollectionsAddress,
  getMarketHelper2Address,
  getMarketHelper3Address,
  getMarketHelperAddress,
  getMarketOrdersAddress,
  getMarketTradesAddress,
  getNFTicketAddress,
  getNFTicketHelper2Address,
  getNFTicketHelperAddress,
  getNftMarketHelper2Address,
  getNftMarketHelper3Address,
  getNftMarketHelperAddress,
  getNftMarketOrdersAddress,
  getNftMarketTradesAddress,
  getPaywallARPHelperAddress,
  getPaywallMarketHelper2Address,
  getPaywallMarketHelper3Address,
  getPaywallMarketHelperAddress,
  getPaywallMarketOrdersAddress,
  getPaywallMarketTradesAddress,
} from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { Token } from '@pancakeswap/sdk'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import {
  announcementFields,
  askHistoryFields,
  collectibleFields,
  collectionBaseFields,
  extraNoteFields,
  itemFields,
  nftFields,
  paywallARPFields,
  paywallFields,
  transactionHistoryFields,
} from './queries'
import {
  AskOrder,
  CollectionMarketDataBaseFields,
  MarketEvent,
  NftActivityFilter,
  TokenMarketData,
  Transaction,
  UserActivity,
} from './types'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { firestore } from 'utils/firebase'
import { marketHelperABI } from 'config/abi/marketHelper'
import { paywallMarketHelperABI } from 'config/abi/paywallMarketHelper'
import { paywallABI } from 'config/abi/paywall'
import { marketOrdersABI } from 'config/abi/marketOrders'
import { nftMarketHelperABI } from 'config/abi/nftMarketHelper'
import { nftMarketHelper3ABI } from 'config/abi/nftMarketHelper3'
import { veABI } from 'config/abi/ve'
import { marketCollectionsABI } from 'config/abi/marketCollections'
import { nfticketHelperABI } from 'config/abi/nfticketHelper'
import { nfticketHelper2ABI } from 'config/abi/nfticketHelper2'
import { keccak256 } from 'viem'
import { minterABI } from 'config/abi/minter'
import { nftMarketOrdersABI } from 'config/abi/nftMarketOrders'
import { paywallARPHelperABI } from 'config/abi/paywallARPHelper'
import { paywallMarketOrdersABI } from 'config/abi/paywallMarketOrders'
import { marketTradesABI } from 'config/abi/marketTrades'
import { paywallMarketTradesABI } from 'config/abi/paywallMarketTrades'
import { nftMarketTradesABI } from 'config/abi/nftMarketTrades'
import { nfticketABI } from 'config/abi/nfticket'
import { marketHelper3ABI } from 'config/abi/marketHelper3'
import { paywallMarketHelper3ABI } from 'config/abi/paywallMarketHelper3'
import { paywallMarketHelper2ABI } from 'config/abi/paywallMarketHelper2'
import { marketHelper2ABI } from 'config/abi/marketHelper2'
import { nftMarketHelper2ABI } from 'config/abi/nftMarketHelper2'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        {
          tags(id: tags) {
            id
            name
          }
        }
      `,
      {},
    )
    console.log('getTag===========>', res)

    return res.tags?.length && res.tags[0]
  } catch (error) {
    console.error('Failed to fetch tags=============>', error)
    return null
  }
}

/**
 * API HELPERS
 */

export const getCollectionReviewsApi = async <T>(collectionAddress: string, tokenId: string) => {
  const data = await (await firestore.collection('reviews').doc(`${collectionAddress}-${tokenId}`).get()).data()
  return data
}

/**
 * Fetch all collections data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollections = async (where = {}) => {
  try {
    return getCollectionsSg(where)
  } catch (error) {
    console.error('Unable to fetch data==================>:', error)
    return null
  }
}

/**
 * Fetch collection data by combining data from the API (static metadata) and the Subgraph (dynamic market data)
 */
export const getCollection = async (collectionAddress: string) => {
  try {
    return getCollectionSg(collectionAddress)
  } catch (error) {
    console.error('Unable to fetch data:', error)
    return null
  }
}

/**
 * SUBGRAPH HELPERS
 */

/**
 * Fetch market data from a collection using the Subgraph
 * @returns
 */
export const getCollectionSg = async (collectionAddress: string): Promise<any> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            ${collectionBaseFields}
          }
        }
      `,
      { collectionAddress },
    )
    console.log('res.collection=======================>', res.collection)
    return res.collection
  } catch (error) {
    console.error('Failed to fetch collection', error, collectionAddress)
    return {}
  }
}

export const getTransactionsSg = async (chainId, userAddress: string): Promise<any> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getTransactionsData($userAddress: String!) {
          transactions(where: { buyer: $userAddress }) {
            nfTicketId
            metadataUrl
          }
        }
      `,
      { userAddress },
    )
    const txs = await Promise.all(
      res?.transactions?.map(async (tx) => {
        const bscClient = publicClient({ chainId: chainId })
        const [_tokenURI] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getNFTicketHelper2Address(),
              abi: nfticketHelper2ABI,
              functionName: 'tokenURI',
              args: [BigInt(tx.nfTicketId)],
            },
          ],
        })
        return {
          ...tx,
          metadataUrl: _tokenURI.result,
        }
      }),
    )
    console.log('res.transactions=======================>', txs, userAddress)
    return txs
  } catch (error) {
    console.error('Failed to fetch userAddress==========>', error, userAddress)
    return {}
  }
}

export const getPaywallSg = async (collectionAddress: string): Promise<CollectionMarketDataBaseFields> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getPaywallData($collectionAddress: String!) 
        {
          paywall(id: $collectionAddress) {
            ${paywallFields}
            transactionHistory {
              ${transactionHistoryFields}
            }
          }
        }
      `,
      { collectionAddress },
    )
    return res.paywall
  } catch (error) {
    console.error('Failed to fetch paywall=========>', error)
    return null
  }
}

export const getItemSg = async (collectionAddress: string): Promise<CollectionMarketDataBaseFields> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getItemData($collectionAddress: String!) 
        {
          item(id: $collectionAddress) {
            ${itemFields}
            transactionHistory {
              ${transactionHistoryFields}
            }
          }
        }
      `,
      { collectionAddress },
    )
    return {
      ...res.item,
    }
  } catch (error) {
    console.error('Failed to fetch item=========>', error)
    return null
  }
}

export const getItemsSg = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        {
          items(first: $first, skip: $skip, where: $where) {
            ${itemFields}
            transactionHistory {
              ${transactionHistoryFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    return {
      ...res.items,
    }
  } catch (error) {
    console.error('Failed to fetch items====================>', error)
    return []
  }
}

export const getNftSg = async (collectionAddress, chainId = 4002): Promise<CollectionMarketDataBaseFields> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getNftData($collectionAddress: String!) 
        {
          nft(id: $collectionAddress) {
            ${nftFields}
            transactionHistory {
              ${transactionHistoryFields}
            }
          }
        }
      `,
      { collectionAddress },
    )
    const bscClient = publicClient({ chainId: chainId })
    const [mintValues] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getNftMarketHelper3Address(),
          abi: nftMarketHelper3ABI,
          functionName: 'minter',
          args: [res.nft.collection.id, res.nft.tokenId],
        },
      ],
    })
    return {
      ...res.nft,
      minter: mintValues.result[0],
      nftokenId: mintValues.result[1],
      nftype: mintValues.result[2],
    }
  } catch (error) {
    console.error('Failed to fetch nft=========>', error)
    return null
  }
}

export const getNftsSg = async (first: number, skip: number, where, chainId = 4002) => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        {
          nfts(first: $first, skip: $skip, where: $where) {
            ${nftFields}
            # transactionHistory {
            #   ${transactionHistoryFields}
            # }
          }
        }
      `,
      { first, skip, where },
    )
    const bscClient = publicClient({ chainId: chainId })
    const nfts = await Promise.all(
      res.nfts.map(async (nft) => {
        const [mintValues] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getNftMarketHelper3Address(),
              abi: nftMarketHelper3ABI,
              functionName: 'minter',
              args: [nft.collection.id, nft.tokenId],
            },
          ],
        })
        return {
          ...nft,
          minter: mintValues.result[0],
          nftokenId: mintValues.result[1],
          nftype: mintValues.result[2],
        }
      }),
    )
    return {
      ...nfts,
    }
  } catch (error) {
    console.error('Failed to fetch nfts====================>', error)
    return []
  }
}

/**
 * Fetch market data from all collections using the Subgraph
 * @returns
 */
export const getCollectionsSg = async (where = {}): Promise<CollectionMarketDataBaseFields[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionsSg($where: Collection_filter) {
          collections(where: $where) {
            ${collectionBaseFields}
          }
        }
      `,
      {
        where,
      },
    )
    console.log('1useGetCollections==========>', where, res)
    return res.collections
  } catch (error) {
    console.error('Failed to fetch NFT collections====================>', error)
  }
  return []
}

/**
 * Fetch market data for nfts in a collection using the Subgraph
 * @param collectionAddress
 * @param first
 * @param skip
 * @returns
 */
export const getNftsFromCollectionSg = async (
  collectionAddress: string,
  first = 1000,
  skip = 0,
): Promise<TokenMarketData[]> => {
  // Squad to be sorted by tokenId as this matches the order of the paginated API return. For PBs - get the most recent,
  const isPBCollection = isAddress(collectionAddress) === pancakeBunniesAddress

  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getNftCollectionMarketData($collectionAddress: String!) {
          collection(id: $collectionAddress) {
            id
            items(orderBy:${isPBCollection ? 'updatedAt' : 'tokenId'}, skip: $skip, first: $first) {
             ${itemFields}
            }
          }
        }
      `,
      { collectionAddress: collectionAddress.toLowerCase(), skip, first },
    )
    return {
      ...res.collection.items,
      // images: res.collection.items?.map((item) => getImages(item.images)),
    }
  } catch (error) {
    console.error('Failed to fetch Items from collection', error)
    return []
  }
}

export const getCashback = async (collectionAddress, tokenId, isPaywall, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  try {
    const [cashback] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: isPaywall ? getPaywallMarketTradesAddress() : getMarketTradesAddress(),
          abi: isPaywall ? paywallMarketTradesABI : marketTradesABI,
          functionName: 'computeCashBack',
          args: [collectionAddress, tokenId],
        },
      ],
    })
    return cashback.result?.length && cashback.result[1]
  } catch (error) {
    console.error('===========>Failed to fetch cashback', error)
    return '0'
  }
}

export const getNftCashback = async (collectionAddress, tokenId, isPaywall, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  try {
    const [cashback] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: isPaywall ? getPaywallMarketTradesAddress() : getNftMarketTradesAddress(),
          abi: isPaywall ? paywallMarketTradesABI : nftMarketTradesABI,
          functionName: 'computeCashBack',
          args: [collectionAddress, tokenId],
        },
      ],
    })
    return cashback.result?.length && cashback.result[1]
  } catch (error) {
    console.error('===========>Failed to fetch cashback', error)
    return '0'
  }
}

export const getCashbackRevenue = async (collectionAddress, tokenId, isPaywall, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  try {
    const [cashback] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: isPaywall ? getPaywallMarketHelper2Address() : getMarketHelper2Address(),
          abi: isPaywall ? paywallMarketHelper2ABI : marketHelper2ABI,
          functionName: 'cashbackRevenue',
          args: [collectionAddress, keccak256(tokenId)],
        },
      ],
    })
    return cashback.result
  } catch (error) {
    console.error('===========>Failed to fetch cashback revenue', error)
    return null
  }
}

export const getNftCashbackRevenue = async (collectionAddress, tokenId, isPaywall, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  try {
    const [cashback] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: isPaywall ? getPaywallMarketHelper2Address() : getNftMarketHelper2Address(),
          abi: isPaywall ? paywallMarketHelper2ABI : nftMarketHelper2ABI,
          functionName: 'cashbackRevenue',
          args: [collectionAddress, keccak256(tokenId)],
        },
      ],
    })
    return cashback.result
  } catch (error) {
    console.error('===========>Failed to fetch cashback revenue', error)
    return null
  }
}

export const getTokenForCredit = async (collectionAddress, isPaywall, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  try {
    const [arrLength] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: isPaywall ? getPaywallMarketHelperAddress() : getMarketHelperAddress(),
          abi: isPaywall ? paywallMarketHelperABI : marketHelperABI,
          functionName: 'burnTokenForCreditLength',
          args: [collectionAddress],
        },
      ],
    })
    const arr = Array.from({ length: Number(arrLength.result) }, (v, i) => i)
    const credits = await Promise.all(
      arr?.map(async (idx) => {
        const [burnTokenForCredit] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: isPaywall ? getPaywallMarketHelperAddress() : getMarketHelperAddress(),
              abi: marketHelperABI,
              functionName: 'burnTokenForCredit',
              args: [collectionAddress, BigInt(idx)],
            },
          ],
        })
        const _token = burnTokenForCredit.result[0]
        const checker = burnTokenForCredit.result[1]
        const destination = burnTokenForCredit.result[2]
        const discount = burnTokenForCredit.result[3]
        const collectionId = burnTokenForCredit.result[4]
        const item = burnTokenForCredit.result[5]

        const [name, symbol] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: _token,
              abi: erc20ABI,
              functionName: 'name',
            },
            {
              address: _token,
              abi: erc20ABI,
              functionName: 'symbol',
            },
            // {
            //   address: _token,
            //   abi: erc20ABI,
            //   functionName: 'decimals',
            // },
          ],
        })
        let decimals = 18
        if (checker !== ADDRESS_ZERO) {
          const [_decimals] = await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: _token,
                abi: erc20ABI,
                functionName: 'decimals',
              },
            ],
          })
          decimals = _decimals.result
        }
        return {
          checker,
          destination,
          discount: discount.toString(),
          collectionId: collectionId.toString(),
          item,
          token: new Token(
            chainId,
            _token,
            decimals,
            symbol?.toString()?.toUpperCase(),
            name?.toString(),
            `https://tokens.payswap.org/images/${_token}.png`,
          ),
        }
      }),
    )
    console.log('arrLength=============>', arrLength, arr, credits)

    return credits
  } catch (error) {
    console.error('===========>Failed to fetch credits tokens', error)
    return []
  }
}

export const getNftTokenForCredit = async (collectionAddress, isPaywall, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  try {
    const [arrLength] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: isPaywall ? getPaywallMarketHelperAddress() : getNftMarketHelperAddress(),
          abi: isPaywall ? paywallMarketHelperABI : nftMarketHelperABI,
          functionName: 'burnTokenForCreditLength',
          args: [collectionAddress],
        },
      ],
    })
    const arr = Array.from({ length: Number(arrLength.result) }, (v, i) => i)
    const credits = await Promise.all(
      arr?.map(async (idx) => {
        const [burnTokenForCredit] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getNftMarketHelperAddress(),
              abi: nftMarketHelperABI,
              functionName: 'burnTokenForCredit',
              args: [collectionAddress, BigInt(idx)],
            },
          ],
        })
        const _token = burnTokenForCredit.result[0]
        const checker = burnTokenForCredit.result[1]
        const destination = burnTokenForCredit.result[2]
        const discount = burnTokenForCredit.result[3]
        const collectionId = burnTokenForCredit.result[4]
        const item = burnTokenForCredit.result[5]

        const [name, symbol, decimals] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: _token,
              abi: erc20ABI,
              functionName: 'name',
            },
            {
              address: _token,
              abi: erc20ABI,
              functionName: 'symbol',
            },
            {
              address: _token,
              abi: erc20ABI,
              functionName: 'decimals',
            },
          ],
        })
        return {
          checker,
          destination,
          discount: discount.toString(),
          collectionId: collectionId.toString(),
          item,
          token: new Token(
            56,
            _token,
            decimals.result,
            symbol?.toString()?.toUpperCase(),
            name?.toString(),
            `https://tokens.payswap.org/images/${_token}.png`,
          ),
        }
      }),
    )
    return credits
  } catch (error) {
    console.error('===========>Failed to fetch credits tokens', error)
    return []
  }
}

export const getNFTMarketTokenForCredit = async (collectionAddress, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  try {
    const [arrLength] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getNftMarketHelperAddress(),
          abi: nftMarketHelperABI,
          functionName: 'burnTokenForCreditLength',
          args: [collectionAddress],
        },
      ],
    })
    const arr = Array.from({ length: Number(arrLength.result) }, (v, i) => i)
    const credits = await Promise.all(
      arr?.map(async (idx) => {
        const [burnTokenForCredit] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getNftMarketHelperAddress(),
              abi: nftMarketHelperABI,
              functionName: 'burnTokenForCredit',
              args: [collectionAddress, BigInt(idx)],
            },
          ],
        })
        const _token = burnTokenForCredit.result[0]
        const checker = burnTokenForCredit.result[1]
        const destination = burnTokenForCredit.result[2]
        const discount = burnTokenForCredit.result[3]
        const collectionId = burnTokenForCredit.result[4]
        const item = burnTokenForCredit.result[5]

        const [name, symbol] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: _token,
              abi: erc20ABI,
              functionName: 'name',
            },
            {
              address: _token,
              abi: erc20ABI,
              functionName: 'symbol',
            },
          ],
        })
        return {
          checker,
          destination,
          discount: discount.toString(),
          collectionId: collectionId.toString(),
          item,
          token: new Token(
            56,
            _token,
            18,
            symbol?.toString()?.toUpperCase(),
            name?.toString(),
            `https://tokens.payswap.org/images/${_token}.png`,
          ),
        }
      }),
    )
    return credits
  } catch (error) {
    console.error('===========>Failed to fetch credits tokens', error)
    return []
  }
}

export const getPaywallARP = async (collectionAddress: string, first = 1000, skip = 0): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getPaywallARPMarketData($collectionAddress: String!) {
          paywallARP(id: $collectionAddress) {
            ${paywallARPFields}
          }
        }
      `,
      { collectionAddress, skip, first },
    )
    console.log('res.paywallARP===============>', collectionAddress, res.paywallARP)
    return res.paywallARP
  } catch (error) {
    console.error('Failed to fetch paywallARP======>', error)
    return []
  }
}

/**
 * Fetch market data for PancakeBunnies NFTs by bunny id using the Subgraph
 * @param bunnyId - bunny id to query
 * @param existingTokenIds - tokens that are already loaded into redux
 * @returns
 */
export const getMarketDataForTokenIds = async (
  collectionAddress: string,
  existingTokenIds: string[],
): Promise<TokenMarketData[]> => {
  try {
    if (existingTokenIds.length === 0) {
      return []
    }
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getMarketDataForTokenIds($collectionAddress: String!, $where: Item_filter) {
          collection(id: $collectionAddress) {
            id
            items(first: 1000, where: $where) {
              ${itemFields}
            }
          }
        }
      `,
      {
        collectionAddress: collectionAddress.toLowerCase(),
        where: { tokenId_in: existingTokenIds },
      },
    )
    return {
      ...res.collection.items,
      // images: res.collection.items?.map((item) => getImages(item.images)),
    }
  } catch (error) {
    console.error(`Failed to fetch market data for Items stored tokens`, error)
    return []
  }
}

export const getNftsMarketData = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getNftsMarketData($first: Int, $skip: Int!, $where: Item_filter, $orderBy: Item_orderBy, $orderDirection: OrderDirection) 
        {
          items(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${itemFields}
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    console.log('res.items=============>', res, where, first, skip, orderBy, orderDirection)
    const r = res.items.map((item) => {
      console.log('item========>', item)
      return {
        ...item,
      }
    })
    console.log('r===============>', r)
    return r
  } catch (error) {
    console.error('1Failed to fetch Items market data================>', error)
    return []
  }
}

export const getNftsMarketData2 = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getNftsMarketData2($first: Int, $skip: Int!, $where: NFT_filter, $orderBy: NFT_orderBy, $orderDirection: OrderDirection) 
        {
          nfts(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${nftFields}
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    console.log('res.nfts=============>', res, where, first, skip, orderBy, orderDirection)
    return res.nfts.map((nft) => {
      return {
        ...nft,
      }
    })
  } catch (error) {
    console.error('Failed to fetch nfts market data================>', error)
    return []
  }
}

export const getPaywallsMarketData = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getPaywallsMarketData($first: Int, $skip: Int!, $where: Paywall_filter, $orderBy: Paywall_orderBy, $orderDirection: OrderDirection) 
        {
          paywalls(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${paywallFields}
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    return res.items
  } catch (error) {
    console.error('2Failed to fetch Items market data================>', error)
    return []
  }
}

/**
 * Returns the lowest/highest price of any NFT in a collection
 */
export const getLeastMostPriceInCollection = async (
  collectionAddress: string,
  orderDirection: 'asc' | 'desc' = 'asc',
) => {
  try {
    const response = await getNftsMarketData({ collection: collectionAddress }, 1, 'currentAskPrice', orderDirection)

    if (response.length === 0) {
      return 0
    }

    const [nftSg] = response
    return parseFloat(nftSg.currentAskPrice)
  } catch (error) {
    console.error(`Failed to lowest price NFTs in collection ${collectionAddress}`, error)
    return 0
  }
}

/**
 * Fetch user trading data for buyTradeHistory, sellTradeHistory and askOrderHistory from the Subgraph
 * @param where a User_filter where condition
 * @returns a UserActivity object
 */
export const getUserActivity = async (address: string): Promise<UserActivity> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getUserActivity($address: String!) {
          user(id: $address) {
            buyTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${transactionHistoryFields}
              item {
                ${itemFields}
              }
            }
            sellTradeHistory(first: 250, orderBy: timestamp, orderDirection: desc) {
              ${transactionHistoryFields}
              item {
                ${itemFields}
              }
            }
            askOrderHistory(first: 500, orderBy: timestamp, orderDirection: desc) {
              id
              block
              timestamp
              orderType
              askPrice
              item {
                ${itemFields}
              }
            }
          }
        }
      `,
      { address },
    )

    return res.user || { askOrderHistory: [], buyTradeHistory: [], sellTradeHistory: [] }
  } catch (error) {
    console.error('Failed to fetch user Activity', error)
    return {
      askOrderHistory: [],
      buyTradeHistory: [],
      sellTradeHistory: [],
    }
  }
}

export const getCollectionActivity = async (
  chainId,
  address: string,
  nftActivityFilter: NftActivityFilter,
  itemPerQuery,
  query = 'item_',
) => {
  const getAskOrderEvent = (orderType: MarketEvent) => {
    switch (orderType) {
      case MarketEvent.UNLISTED:
        return ['CancelItem', 'CancelPaywall', 'CancelNFT']
      case MarketEvent.NEW:
        return ['NewItem', 'NewPaywall', 'NewNFT']
      default:
        return ['ModifyItem', 'ModifyPaywall', 'ModifyNFT']
    }
  }

  const hasCollectionFilter = nftActivityFilter.collectionFilters.length > 0

  const collectionFilterGql = hasCollectionFilter
    ? `${query}: { products_contains_nocase: ${JSON.stringify(
        nftActivityFilter.collectionFilters,
      )}, collection: "${address}"}`
    : `collection: ${JSON.stringify(address)}`

  const askOrderTypeFilter = nftActivityFilter.typeFilters
    .filter((marketEvent) => marketEvent !== MarketEvent.SOLD)
    .map((marketEvent) => getAskOrderEvent(marketEvent))

  const askOrderIncluded = nftActivityFilter.typeFilters.length === 0 || askOrderTypeFilter.length > 0

  const askOrderTypeFilterGql = askOrderTypeFilter.length > 0 ? `orderType_in: [${askOrderTypeFilter}]` : ``

  const transactionIncluded =
    nftActivityFilter.typeFilters.length === 0 ||
    nftActivityFilter.typeFilters.some(
      (marketEvent) => marketEvent === MarketEvent.BUY || marketEvent === MarketEvent.SOLD,
    )

  let askOrderQueryItem = itemPerQuery / 2
  let transactionQueryItem = itemPerQuery / 2

  if (!askOrderIncluded || !transactionIncluded) {
    askOrderQueryItem = !askOrderIncluded ? 0 : itemPerQuery
    transactionQueryItem = !transactionIncluded ? 0 : itemPerQuery
  }

  const askOrderGql = askOrderIncluded
    ? `askOrders(first: ${askOrderQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}, ${askOrderTypeFilterGql}
          }) {
              id
              block
              timestamp
              orderType
              askPrice
              seller {
                id
              }
              item {
                ${itemFields}
              }
              paywall {
                ${paywallFields}
              }
              nft {
                ${nftFields}
              }
          }`
    : ``

  const transactionGql = transactionIncluded
    ? `transactions(first: ${transactionQueryItem}, orderBy: timestamp, orderDirection: desc, where:{
            ${collectionFilterGql}
          }) {
            ${transactionHistoryFields}
            item {
                ${itemFields}
            }
            paywall {
              ${paywallFields}
            }
            nft {
              ${nftFields}
            }
          }`
    : ``

  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionActivity {
          ${askOrderGql}
          ${transactionGql}
        }
      `,
    )
    const txs = await Promise.all(
      res?.transactions?.map(async (tx) => {
        const bscClient = publicClient({ chainId: chainId })
        const [_tokenURI] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getNFTicketHelper2Address(),
              abi: nfticketHelper2ABI,
              functionName: 'tokenURI',
              args: [BigInt(tx.nfTicketId)],
            },
          ],
        })
        return {
          ...tx,
          metadataUrl: _tokenURI.result,
        }
      }),
    )
    const result = { askOrders: res?.askOrders, transactions: txs }
    console.log('GRAPH_API_CANCAN============>', result, res, askOrderGql, transactionGql)
    return result || { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('1Failed to fetch collection Activity===========>', askOrderGql, error)
    return {
      askOrders: [],
      transactions: [],
    }
  }
}

export const getTokenActivity = async (
  chainId,
  tokenId: string,
  collectionAddress: string,
): Promise<{ askOrders: AskOrder[]; transactions: Transaction[] }> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionActivity($tokenId: BigInt!, $collectionAddress: ID!) {
          items(where:{tokenId: $tokenId, collection_: {id: $collectionAddress}}) {
            transactionHistory(orderBy: timestamp, orderDirection: desc) {
              ${transactionHistoryFields}
            }
            askHistory(orderBy: timestamp, orderDirection: desc) {
                ${askHistoryFields}
            }
          }
        }
      `,
      { tokenId, collectionAddress },
    )
    if (res.items.length > 0) {
      console.log('res.items=====================>', res.items)
      const txs = await Promise.all(
        res.items[0].transactionHistory?.map(async (tx) => {
          const bscClient = publicClient({ chainId: chainId })
          const [_tokenURI] = await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: getNFTicketHelper2Address(),
                abi: nfticketHelper2ABI,
                functionName: 'tokenURI',
                args: [BigInt(tx.nfTicketId)],
              },
            ],
          })
          return {
            ...tx,
            metadataUrl: _tokenURI.result,
          }
        }),
      )
      return { askOrders: res.items[0].askHistory, transactions: txs }
    }
    return { askOrders: [], transactions: [] }
  } catch (error) {
    console.error('1Failed to fetch token Activity==================>', error)
    return {
      askOrders: [],
      transactions: [],
    }
  }
}

/**
 * Get the most recently listed NFTs
 * @param first Number of nfts to retrieve
 * @returns NftTokenSg[]
 */
export const getLatestListedItems = async (first: number): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getLatestNftMarketData($first: Int) {
          items(orderBy: updatedAt , orderDirection: desc, first: $first) {
            ${itemFields}
            collection {
              id
            }
          }
        }
      `,
      { first },
    )

    return {
      ...res.items,
      // images: res.items?.map((item) => getImages(item.images)),
    }
  } catch (error) {
    console.error('3Failed to fetch Items market data========>', error)
    return []
  }
}

export const getLatestListedNfts = async (first: number): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getLatestNftMarketData($first: Int) {
          nfts(orderBy: updatedAt , orderDirection: desc, first: $first) {
            ${itemFields}
            collection {
              id
            }
          }
        }
      `,
      { first },
    )

    return {
      ...res.items,
      // images: res.items?.map((item) => getImages(item.images)),
    }
  } catch (error) {
    console.error('3Failed to fetch Items market data========>', error)
    return []
  }
}

export const getUsersItemsData = async (
  collectionId,
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
): Promise<TokenMarketData[]> => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectionData($collectionId: String!) {
          collection(id: $collectionId) {
            registrations {
              user {
                id
              }
            }
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    return res.collection?.registrations
  } catch (error) {
    console.error('5Failed to fetch Items market data============>', error)
    return []
  }
}

export const getCollectionAnnouncements = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
          {
            items(first: $first, skip: $skip, where: $where) {
              ${announcementFields}
            }
          }
        `,
      { first, skip, where },
    )
    return res.announcements
  } catch (error) {
    console.error('Failed to fetch announcements====================>', error)
    return []
  }
}

export const getCollectibles = async (where) => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getCollectibleData($where: Collectible_filter) {
          collectibles(where: $where) {
              ${collectibleFields}
            }
          }
        `,
      { where },
    )
    console.log('1getCollectibles==================>', where, res)
    return res.collectibles
  } catch (error) {
    console.error('Failed to fetch collectibles====================>', error)
    return []
  }
}

export const getExtraNote = async (where) => {
  try {
    const res = await request(
      GRAPH_API_CANCAN,
      gql`
        query getExtraNoteData($where: ExtraNote_filter) {
          extraNotes(where: $where) {
              ${extraNoteFields}
            }
          }
        `,
      { where },
    )
    console.log('1getExtraNote==================>', where, res)
    return res.extraNotes
  } catch (error) {
    console.error('Failed to fetch extraNotes====================>', error)
    return []
  }
}

export const getPaymentCredits = async (collectionAddress, tokenId, address, chainId = 4002) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [credits] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getMarketOrdersAddress(),
          abi: marketOrdersABI,
          functionName: 'getPaymentCredits',
          args: [address, collectionAddress, tokenId],
        },
      ],
    })
    return credits.result.toString()
  } catch (error) {
    console.error('===========>Failed to fetch payment credits', error)
    return []
  }
}

export const getMedia = async (minterAddress, chainId = 4002) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [media] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: minterAddress,
          abi: minterABI,
          functionName: 'media',
          args: [BigInt('0')],
        },
      ],
    })
    return media.result?.toString()
  } catch (error) {
    console.error('===========>Failed to fetch payment media', error)
    return []
  }
}

export const getAskOrder = async (collectionAddress, tokenId, chainId = 4002) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [askOrder] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getMarketOrdersAddress(),
          abi: marketOrdersABI,
          functionName: 'getAskDetails',
          args: [collectionAddress, keccak256(tokenId)],
        },
      ],
    })
    return askOrder.result
  } catch (error) {
    console.error('getAskOrder===========>Failed to fetch item order', error)
    return []
  }
}

export const getPaywallAskOrder = async (collectionAddress, tokenId, chainId = 4002) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [askOrder] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getPaywallMarketOrdersAddress(),
          abi: paywallMarketOrdersABI,
          functionName: 'getAskDetails',
          args: [collectionAddress, keccak256(tokenId)],
        },
      ],
    })
    return askOrder.result
  } catch (error) {
    console.error('getAskOrder===========>Failed to fetch nft order', error)
    return []
  }
}

export const getNftAskOrder = async (collectionAddress, tokenId, chainId = 4002) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [askOrder] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getNftMarketOrdersAddress(),
          abi: nftMarketOrdersABI,
          functionName: 'getAskDetails',
          args: [collectionAddress, keccak256(tokenId)],
        },
      ],
    })
    return askOrder.result
  } catch (error) {
    console.error('getAskOrder===========>Failed to fetch nft order', error)
    return []
  }
}

export const getSubscriptionStatus = async (paywallAddress, account, nfticketId, tokenId, chainId = 4002) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [isOngoing] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: paywallAddress,
          abi: paywallABI,
          functionName: 'ongoingSubscription',
          args: [account ?? '', nfticketId, tokenId],
        },
      ],
    })
    return isOngoing.result
  } catch (error) {
    console.error('===========>Failed to fetch ongoing subscription', error)
    return false
  }
}

export const getProtocolInfo = async (paywallAddress, account, tokenId, chainId = 4002) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [protocolId, subscription] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: paywallAddress,
          abi: paywallABI,
          functionName: 'addressToProtocolId',
          args: [account, tokenId],
        },
        {
          address: paywallAddress,
          abi: paywallABI,
          functionName: 'subscription',
        },
      ],
    })
    const [protocolInfo, dueReceivables, profileIdRequired, paused, pricePerSecond, bufferTime] =
      await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: paywallAddress,
            abi: paywallABI,
            functionName: 'protocolInfo',
            args: [protocolId.result],
          },
          {
            address: paywallAddress,
            abi: paywallABI,
            functionName: 'getDueReceivable',
            args: [protocolId.result],
          },
          {
            address: paywallAddress,
            abi: paywallABI,
            functionName: 'profileIdRequired',
          },
          {
            address: paywallAddress,
            abi: paywallABI,
            functionName: 'paused',
          },
          {
            address: paywallAddress,
            abi: paywallABI,
            functionName: 'pricePerSecond',
          },
          {
            address: paywallAddress,
            abi: paywallABI,
            functionName: 'bufferTime',
          },
        ],
      })
    return {
      protocolInfo: protocolInfo.result,
      dueReceivables: dueReceivables.result,
      profileIdRequired: profileIdRequired.result,
      paused: paused.result,
      pricePerSecond: pricePerSecond.result,
      bufferTime: bufferTime.result,
      protocolId: protocolId.result,
      subscription: subscription.result,
    }
  } catch (error) {
    console.error('===========>Failed to fetch protocolInfo', error)
    return false
  }
}

export const getDiscounted = async (
  collectionAddress,
  account,
  tokenId,
  price,
  options,
  identityTokenId = 0,
  isPaywall = false,
  chainId = 4002,
) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [data] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: isPaywall ? getPaywallMarketHelperAddress() : getMarketHelperAddress(),
          abi: isPaywall ? paywallMarketHelperABI : marketHelperABI,
          functionName: 'getRealPrice',
          args: [collectionAddress, account, tokenId, options, BigInt(identityTokenId), price],
        },
      ],
    })
    const res = {
      discount: data.result?.length > 0 ? data.result[0].toString() : BIG_ZERO,
      discounted: data.result?.length > 1 ? data.result[1] : false,
    }
    return res
  } catch (error) {
    console.error('===========>Failed to fetch discounted price', error)
    return {
      discount: BIG_ZERO,
      discounted: false,
    }
  }
}

export const getNftDiscounted = async (
  collectionAddress,
  account,
  tokenId,
  price,
  options,
  identityTokenId = 0,
  isPaywall = false,
  chainId = 4002,
) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [data] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: isPaywall ? getPaywallMarketHelperAddress() : getNftMarketHelperAddress(),
          abi: isPaywall ? paywallMarketHelperABI : nftMarketHelperABI,
          functionName: 'getRealPrice',
          args: [collectionAddress, account, tokenId, options, BigInt(identityTokenId), price],
        },
      ],
    })
    const res = {
      discount: data.result?.length > 0 ? data.result[0].toString() : BIG_ZERO,
      discounted: data.result?.length > 1 ? data.result[1] : false,
    }
    return res
  } catch (error) {
    console.error('===========>Failed to fetch discounted price', error)
    return {
      discount: BIG_ZERO,
      discounted: false,
    }
  }
}

export const getCollectionContracts = async (collectionAddress: string) => {
  return (await firestore.collection('contracts').doc(collectionAddress).get()).data()
}

export const getVeToken = async (veAddress, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  const [tokenAddress] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: veAddress,
        abi: veABI,
        functionName: 'token',
      },
    ],
  })
  return tokenAddress
}

export const getPendingRevenue = async (tokenAddress, collectionAddress, chainId = 4002) => {
  try {
    const bscClient = publicClient({ chainId: chainId })
    const [
      marketPendingRevenue,
      marketCashbackFund,
      paywallMarketPendingRevenue,
      paywallMarketCashbackFund,
      nftMarketPendingRevenue,
      nftMarketCashbackFund,
    ] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getMarketTradesAddress(),
          abi: marketTradesABI,
          functionName: 'pendingRevenue',
          args: [tokenAddress, collectionAddress],
        },
        {
          address: getMarketTradesAddress(),
          abi: marketTradesABI,
          functionName: 'cashbackFund',
          args: [tokenAddress, collectionAddress],
        },
        {
          address: getPaywallMarketTradesAddress(),
          abi: paywallMarketTradesABI,
          functionName: 'pendingRevenue',
          args: [tokenAddress, collectionAddress],
        },
        {
          address: getPaywallMarketTradesAddress(),
          abi: paywallMarketTradesABI,
          functionName: 'cashbackFund',
          args: [tokenAddress, collectionAddress],
        },
        {
          address: getNftMarketTradesAddress(),
          abi: nftMarketTradesABI,
          functionName: 'pendingRevenue',
          args: [tokenAddress, collectionAddress],
        },
        {
          address: getNftMarketTradesAddress(),
          abi: nftMarketTradesABI,
          functionName: 'cashbackFund',
          args: [tokenAddress, collectionAddress],
        },
      ],
    })
    return {
      marketPendingRevenue: marketPendingRevenue.result,
      marketCashbackFund: marketCashbackFund.result,
      paywallMarketPendingRevenue: paywallMarketPendingRevenue.result,
      paywallMarketCashbackFund: paywallMarketCashbackFund.result,
      nftMarketPendingRevenue: nftMarketPendingRevenue.result,
      nftMarketCashbackFund: nftMarketCashbackFund.result,
    }
  } catch {
    return null
  }
}

export const getPendingRevenueFromNote = async (tokenAddress, tokenId, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  const [marketNoteRevenue, paywallNoteRevenue, nftNoteRevenue] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getMarketTradesAddress(),
        abi: marketTradesABI,
        functionName: 'pendingRevenueFromNote',
        args: [tokenAddress, tokenId],
      },
      {
        address: getPaywallMarketTradesAddress(),
        abi: paywallMarketTradesABI,
        functionName: 'pendingRevenueFromNote',
        args: [tokenAddress, tokenId],
      },
      {
        address: getNftMarketTradesAddress(),
        abi: nftMarketTradesABI,
        functionName: 'pendingRevenueFromNote',
        args: [tokenAddress, tokenId],
      },
    ],
  })
  return {
    marketNoteRevenue: marketNoteRevenue.result,
    paywallNoteRevenue: paywallNoteRevenue.result,
    nftNoteRevenue: nftNoteRevenue.result,
  }
}

export const getTokenURIs = async (collectionOwner, chainId) => {
  const bscClient = publicClient({ chainId: chainId })
  const [marketNote, paywallNote, nftNote] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getMarketTradesAddress(),
        abi: marketTradesABI,
        functionName: 'notes',
        args: [collectionOwner],
      },
      {
        address: getPaywallMarketTradesAddress(),
        abi: paywallMarketTradesABI,
        functionName: 'notes',
        args: [collectionOwner],
      },
      {
        address: getNftMarketTradesAddress(),
        abi: nftMarketTradesABI,
        functionName: 'notes',
        args: [collectionOwner],
      },
    ],
  })
  const [marketNoteURI, paywallNoteURI, nftNoteURI] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getMarketHelper3Address(),
        abi: marketHelper3ABI,
        functionName: 'tokenURI',
        args: [marketNote.result[2]],
      },
      {
        address: getPaywallMarketHelper3Address(),
        abi: paywallMarketHelper3ABI,
        functionName: 'tokenURI',
        args: [paywallNote.result[2]],
      },
      {
        address: getNftMarketHelper3Address(),
        abi: nftMarketHelper3ABI,
        functionName: 'tokenURI',
        args: [nftNote.result[2]],
      },
    ],
  })
  return {
    marketNote: marketNote.result,
    paywallNote: paywallNote.result,
    nftNote: nftNote.result,
    marketNoteURI: marketNoteURI.result,
    paywallNoteURI: paywallNoteURI.result,
    nftNoteURI: nftNoteURI.result,
  }
}

export const getCollectionId = async (address, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  const [collectionId] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getMarketCollectionsAddress(),
        abi: marketCollectionsABI,
        functionName: 'addressToCollectionId',
        args: [address],
      },
    ],
  })
  return collectionId.result
}

export const getSponsorRevenue = async (collectionId, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  const [revenue] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getNFTicketHelperAddress(),
        abi: nfticketHelperABI,
        functionName: 'pendingRevenue',
        args: [collectionId],
      },
    ],
  })
  return revenue.result
}

export const getSuperchatRevenue = async (collectionId, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  const [revenue] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getNFTicketAddress(),
        abi: nfticketABI,
        functionName: 'pendingRevenue',
        args: [collectionId],
      },
    ],
  })
  return revenue.result
}

export const getPricePerMinute = async (merchantId, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  const [pricePerMinute] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getNFTicketHelperAddress(),
        abi: nfticketHelperABI,
        functionName: 'pricePerAttachMinutes',
        args: [merchantId],
      },
    ],
  })
  return pricePerMinute.result
}

export const getEstimateVotes = async (collectionId, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  const [votes] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getNFTicketHelperAddress(),
        abi: nfticketHelperABI,
        functionName: 'estimateVotes',
        args: [collectionId],
      },
    ],
  })
  return {
    likes: votes.result?.length ? votes.result[0]?.toString() : '0',
    dislikes: votes.result?.length ? votes.result[1]?.toString() : '0',
  }
}

export const getPaywallPricePerMinute = async (paywallAddress, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  const [pricePerMinute] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: paywallAddress,
        abi: paywallABI,
        functionName: 'pricePerSecond',
      },
    ],
  })
  return pricePerMinute.result
}

export const getTimeEstimate = async (collectionId, item, marketPlaceHelper, options, chainId = 4002) => {
  const bscClient = publicClient({ chainId: chainId })
  const [itemPrice] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getNFTicketHelperAddress(),
        abi: nfticketHelperABI,
        functionName: 'getTimeEstimates',
        args: [collectionId, item, marketPlaceHelper, []],
      },
    ],
  })
  const [itemPriceWithOptions] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getNFTicketHelperAddress(),
        abi: nfticketHelperABI,
        functionName: 'getTimeEstimates',
        args: [collectionId, item, marketPlaceHelper, options],
      },
    ],
  })

  return {
    itemPrice: itemPrice.result,
    itemPriceWithOptions: itemPriceWithOptions.result,
  }
}
