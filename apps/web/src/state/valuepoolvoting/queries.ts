export const voteFields = `
  id
  tokenId
  profileId
  identityTokenId
  votingPower
  like
  created
  updated
`

export const valuepoolFields = `
id
period
minPeriod
minDifference
collectionId
minBountyRequired
minimumLockValue
voteOption
created
updated
`

export const proposalFields = `
id
active
owner
pool
title
description
upVotes
downVotes
created
updated
countries
cities
products
amount
endTime
votes{
  ${voteFields}
}
valuepool {
  ${valuepoolFields}
}
`
