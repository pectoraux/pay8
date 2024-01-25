import { erc20ABI } from 'wagmi'
import { publicClient } from 'utils/wagmi'
import request, { gql } from 'graphql-request'
import { GRAPH_API_CARDS } from 'config/constants/endpoints'
import { cardABI } from 'config/abi/card'
import { getCardAddress } from 'utils/addressHelpers'

import { cardFields, tokenBalanceFields } from './queries'

export const getCard = async (cardId) => {
  try {
    const res = await request(
      GRAPH_API_CARDS,
      gql`
        query getCard($cardId: String) 
        {
          card(id: $cardId) {
            ${cardFields}
            balances {
              ${tokenBalanceFields}
            }
          }
        }
      `,
      { cardId },
    )
    console.log('getCard=================>', cardId, res)
    return res.card
  } catch (error) {
    console.error('Failed to fetch card=============>', error, cardId)
    return null
  }
}

export const getCards = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_CARDS,
      gql`
        query getCards($where: Card_filter) 
        {
          cards(first: $first, skip: $skip, where: $where) {
            ${cardFields}
            balances {
              ${tokenBalanceFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getCardsFromSg33=============>', res)
    return res.cards
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchCard = async (ownerAddress, chainId) => {
  const card = await getCard(ownerAddress.toLowerCase())
  const bscClient = publicClient({ chainId })
  const balances = await Promise.all(
    card?.balances?.map(async (tk) => {
      const [name, decimals, symbol] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: tk.tokenAddress,
            abi: erc20ABI,
            functionName: 'name',
          },
          {
            address: tk.tokenAddress,
            abi: erc20ABI,
            functionName: 'decimals',
          },
          {
            address: tk.tokenAddress,
            abi: erc20ABI,
            functionName: 'symbol',
          },
        ],
      })
      return {
        ...tk,
        name,
        symbol,
        decimals,
      }
    }),
  )
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...card,
    balances,
  }
}

export const fetchCards = async ({ fromCard, chainId }) => {
  const fromGraph = await getCards(1000, 0, {})
  try {
    const cards = await Promise.all(
      fromGraph
        ?.map(async (card) => {
          const bscClient = publicClient({ chainId })
          const [profileId, adminFee] = await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: getCardAddress(),
                abi: cardABI,
                functionName: 'profileId',
                args: [card?.username],
              },
              {
                address: getCardAddress(),
                abi: cardABI,
                functionName: 'adminFee',
              },
            ],
          })
          const balances = await Promise.all(
            card?.balances?.map(async (tk) => {
              const [name, decimals, symbol, balance] = await bscClient.multicall({
                allowFailure: true,
                contracts: [
                  {
                    address: tk.tokenAddress,
                    abi: erc20ABI,
                    functionName: 'name',
                  },
                  {
                    address: tk.tokenAddress,
                    abi: erc20ABI,
                    functionName: 'decimals',
                  },
                  {
                    address: tk.tokenAddress,
                    abi: erc20ABI,
                    functionName: 'symbol',
                  },
                  {
                    address: getCardAddress(),
                    abi: cardABI,
                    functionName: 'balance',
                    args: [card?.username, tk.tokenAddress],
                  },
                ],
              })
              return {
                ...tk,
                name: name?.result?.toString(),
                symbol: symbol?.result?.toString()?.toUpperCase(),
                decimals: decimals.result,
                balance: balance.result?.toString(),
              }
            }),
          )
          return {
            sousId: card?.id,
            ...card,
            balances,
            profileId: profileId.result?.toString(),
            adminFee: adminFee.result?.toString(),
          }
        })
        .flat(),
    )
    return cards
  } catch (err) {
    console.log('fetchCards err========================>', err)
  }
  return null
}
