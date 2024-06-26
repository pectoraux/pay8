export const objectFields = `
id
name
active
createdAt
updatedAt
`

export const gameFields = `
  id
  owner
  token
  createdAt
  updatedAt
  gameContract
  active
  claimable
  tokenId
  gameName
  gameLink
  gameAPI
  pricePerMinutes
  creatorShare
  referrerFee
  teamShare
  objectNames {
    ${objectFields}
  }
`

export const protocolFields = `
  id
  active
  owner
  game
  minutes
  metadataUrl
  purchasedAt
`
