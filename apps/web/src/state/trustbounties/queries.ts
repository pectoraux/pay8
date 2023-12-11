export const bountyBalanceField = `
id
source
amount
createdAt
updatedAt
`

export const bountyField = `
id,
active,
avatar,
collectionId,
owner,
token,
terms,
bountySource,
parentBounty,
timestamp,
claims {
  id,
  hunter,
  winner,
  friendly,
  atPeace,
  endTime,
  amount,
}
bountyBalances {
  ${bountyBalanceField}
}
`

export const approvalField = `
id,
active,
amount,
endTime,
timestamp,
bounty {
  id
},
partnerBounty {
  id
},

`
