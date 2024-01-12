import { erc20ABI } from 'wagmi'
import { publicClient } from 'utils/wagmi'
import request, { gql } from 'graphql-request'
import { GRAPH_API_CARDS } from 'config/constants/endpoints'

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
  const fromGraph = await getCards(0, 0, {})
  try {
    const cards = await Promise.all(
      fromGraph
        ?.map(async (card, index) => {
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
                name: name?.result?.toString(),
                symbol: symbol?.result?.toString()?.toUpperCase(),
                decimals: decimals.result,
              }
            }),
          )
          return {
            sousId: card?.id,
            ...card,
            balances,
          }
        })
        .flat(),
    )
    return cards
  } catch (err) {
    console.log('fetchCards err========================>', err)
  }
}
