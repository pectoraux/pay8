export const tokenFields = `
id
tokenAddress
addedToTokenSet
`

export const voteFields = `
id
createdAt
updatedAt
profileId
liked
`

export const sessionFields = `
id
user
active
amount
sessionId
mintSession
tokenAddress
identityTokenId
`

export const accountFields = `
id
owner
active
channel
moreInfo
timestamp
`

export const txFields = `
id
user
block
token
txType
netPrice
timestamp
`

export const rampFields2 = `
id
owner
collectionId
description
rampAddress
applicationLink
avatar
publishableKeys
secretKeys
clientIds
channels
profileId
likes
dislikes
sessions {
    ${sessionFields}
}
tokens {
    ${tokenFields}
}
votes {
    ${voteFields}
}
transactionHistory {
    ${txFields}
}
`

export const rampFields = `
id
owner
collectionId
description
rampAddress
applicationLink
avatar
publishableKeys
secretKeys
clientIds
channels
profileId
likes
dislikes
sessions {
    ${sessionFields}
}
tokens {
    ${tokenFields}
}
votes {
    ${voteFields}
}
transactionHistory {
    ${txFields}
}
`
