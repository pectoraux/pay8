import BigNumber from 'bignumber.js'
import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_GAMES } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getCollection } from 'state/cancan/helpers'
import { publicClient } from 'utils/wagmi'
import { getGameFactoryAddress, getGameHelperAddress, getGameMinterAddress } from 'utils/addressHelpers'
import { gameFactoryABI } from 'config/abi/gameFactory'
import { erc20ABI } from 'wagmi'
import { gameHelperABI } from 'config/abi/gameHelper'
import { gameMinterABI } from 'config/abi/gameMinter'

import { gameFields, protocolFields } from './queries'

export const fetchGameData = async (gameName, tokenId) => {
  return (await firestore.collection(gameName).doc(tokenId).get()).data()
}

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_GAMES,
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

export const getProtocols = async (first = 5, skip = 0, where = {}) => {
  try {
    const res = await request(
      GRAPH_API_GAMES,
      gql`
      query getProtocols($first: Int!, $skip: Int!, $where: Protocol_filter, $orderDirection: OrderDirection) 
      {
        protocols(first: $first, skip: $skip, where: $where) {
          ${protocolFields}
        }
      }
      `,
      {
        first,
        skip,
        where,
      },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocols===========>', error)
    return []
  }
}

export const getProtocol = async (gameAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_GAMES,
      gql`
        query getProtocolData($gameAddress: String!) 
        {
          protocols(where: { game: $gameAddress }) {
            ${protocolFields}
          }
        }
      `,
      { gameAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, gameAddress)
    return null
  }
}

export const getGame = async (gameAddress) => {
  try {
    const res = await request(
      GRAPH_API_GAMES,
      gql`
        query getGame($gameAddress: String) 
        {
          game(id: $gameAddress) {
            ${gameFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { gameAddress },
    )
    console.log('getGame=================>', gameAddress, res)
    return res.game
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, gameAddress)
    return null
  }
}

export const getGames = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_GAMES,
      gql`
        query getGames($where: Game_filter) 
        {
          games(first: $first, skip: $skip, where: $where) {
            ${gameFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getGamesFromSg33=============>', res)
    return res.games
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchGame = async (gameId, chainId) => {
  const gameFromSg = await getGame(gameId)
  const bscClient = publicClient({ chainId: chainId })
  const [ticketInfo_, totalEarned] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getGameFactoryAddress(),
        abi: gameFactoryABI,
        functionName: 'ticketInfo_',
        args: [BigInt(gameId)],
      },
      {
        address: getGameFactoryAddress(),
        abi: gameFactoryABI,
        functionName: 'totalEarned',
        args: [BigInt(gameId)],
      },
    ],
  })
  const owner = ticketInfo_.result[0]
  const _token = ticketInfo_.result[1]
  const gameContract = ticketInfo_.result[2]
  const pricePerMinutes = ticketInfo_.result[3]
  const teamShare = ticketInfo_.result[4]
  const creatorShare = ticketInfo_.result[5]
  const referrerFee = ticketInfo_.result[6]
  const numPlayers = ticketInfo_.result[7]
  const totalScore = ticketInfo_.result[8]
  const totalPaid = ticketInfo_.result[9]
  const claimable = ticketInfo_.result[10]

  const collection = await getCollection(gameId)
  const [name, decimals, symbol] = await bscClient.multicall({
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
        functionName: 'decimals',
      },
      {
        address: _token,
        abi: erc20ABI,
        functionName: 'symbol',
      },
    ],
  })
  const objects = await Promise.all(
    gameFromSg?.objectNames?.map(async (objectName) => {
      const [gameTokenIds, numUserTokenIds] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: getGameHelperAddress(),
            abi: gameHelperABI,
            functionName: 'getAllProtocolObjects',
            args: [BigInt(gameId), objectName.name, BigInt(0)],
          },
          {
            address: getGameHelperAddress(),
            abi: gameHelperABI,
            functionName: 'resourceToObjectLength',
            args: [BigInt(gameId), objectName.name],
          },
        ],
      })
      const arr2 = Array.from({ length: parseInt(numUserTokenIds.result.toString()) }, (v, i) => i)
      const recipes = await Promise.all(
        arr2?.map(async (idx) => {
          const [_recipes] = await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: getGameHelperAddress(),
                abi: gameHelperABI,
                functionName: 'getResourceToObject',
                args: [BigInt(gameId), BigInt(idx), objectName.name],
              },
            ],
          })
          return _recipes.result
        }),
      )
      console.log('gameTokenIds=================>', gameTokenIds, recipes)
      return {
        ...objectName,
        gameTokenIds: gameTokenIds.result, // : getTokenIds(gameTokenIds.result, objectName.name, gameId),
        recipes, // : getTokenIds(userTokenIds, objectName.name, gameId),
      }
    }),
  )
  const accounts = await Promise.all(
    gameFromSg?.protocols
      ?.filter((protocol) => protocol.active)
      ?.map(async (protocol) => {
        const [gameInfo_, receiver, objectNames, userDeadLine, metadataUrl] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getGameMinterAddress(),
              abi: gameMinterABI,
              functionName: 'gameInfo_',
              args: [BigInt(protocol?.id)],
            },
            {
              address: getGameMinterAddress(),
              abi: gameMinterABI,
              functionName: 'getReceiver',
              args: [BigInt(protocol?.id)],
            },
            {
              address: getGameHelperAddress(),
              abi: gameHelperABI,
              functionName: 'getAllObjects',
              args: [BigInt(protocol?.id), BigInt(0)],
            },
            {
              address: getGameFactoryAddress(),
              abi: gameFactoryABI,
              functionName: 'userDeadLines_',
              args: [BigInt(protocol?.id), BigInt(gameId)],
            },
            {
              address: getGameHelperAddress(),
              abi: gameHelperABI,
              functionName: 'tokenURI',
              args: [BigInt(protocol?.id)],
            },
          ],
        })
        const tokenOwner = gameInfo_.result[0]
        const lender = gameInfo_.result[1]
        const game = gameInfo_.result[2]
        const timer = gameInfo_.result[3]
        const score = gameInfo_.result[4]
        const deadline = gameInfo_.result[5]
        const pricePercentile = gameInfo_.result[6]
        const price = gameInfo_.result[7]
        const won = gameInfo_.result[8]
        const gameCount = gameInfo_.result[9]
        const scorePercentile = gameInfo_.result[10]
        const gameMinutes = gameInfo_.result[11]

        return {
          ...protocol,
          tokenOwner,
          lender,
          game,
          metadataUrl: metadataUrl.result,
          receiver: receiver.result,
          objectNames: objectNames.result,
          timer: timer?.toString(),
          score: score.toString(),
          deadline: deadline.toString(),
          pricePercentile: pricePercentile.toString(),
          price: price.toString(),
          won: won.toString(),
          gameCount: gameCount.toString(),
          scorePercentile: scorePercentile.toString(),
          gameMinutes: gameMinutes.toString(),
          userDeadLine: userDeadLine.result.toString(),
          // userPercentile: userPercentile.toString(),
        }
      }),
  )

  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...gameFromSg,
    id: gameId,
    owner,
    gameContract,
    claimable,
    accounts,
    objects,
    collection,
    pricePerMinutes: pricePerMinutes.toString(),
    teamShare: new BigNumber(teamShare.toString()).dividedBy(100).toJSON(),
    creatorShare: new BigNumber(creatorShare.toString()).dividedBy(100).toJSON(),
    referrerFee: new BigNumber(referrerFee.toString()).dividedBy(100).toJSON(),
    // paidReceivable: paidReceivable.toString(),
    numPlayers: numPlayers.toString(),
    // percentile: percentile.toString(),
    totalPaid: totalPaid.toString(),
    totalScore: totalScore.toString(),
    totalEarned: totalEarned.result.toString(),
    token: new Token(
      56,
      _token,
      decimals.result,
      symbol.result?.toString(),
      name.result?.toString(),
      `https://tokens.payswap.org/images/${_token}.png`,
    ),
  }
}

// export const getTokenIds = async (objectTokenIds, name, gameId) => {
//   // const bscClient = publicClient({ chainId: 4002 })
//   // return objectTokenIds.map(async (tokenId) => {
//   //   const [getResourceToObject] = await bscClient.multicall({
//   //     allowFailure: true,
//   //     contracts: [
//   //       {
//   //         address: getGameHelperAddress(),
//   //         abi: gameHelperABI,
//   //         functionName: 'getResourceToObject',
//   //         args: [name, gameId],
//   //       },
//   //     ],
//   //   })
//   //   const category = getResourceToObject.result[0]
//   //   const ratings = getResourceToObject.result[1]

//     return {
//       category: objectTokenIds,
//       tokenId,
//       ratings,
//     }
//   // })
// }

export const fetchGames = async ({ fromGame, chainId }) => {
  const gamesFromSg = await getGames(0, 0, {})
  const games = await Promise.all(
    gamesFromSg
      .filter((game) => (fromGame ? game?.id === fromGame : true))
      .map(async (game) => {
        const data = await fetchGame(game.id, chainId)
        return {
          sousId: game.id,
          ...data,
        }
      })
      .flat(),
  )
  return games
}
