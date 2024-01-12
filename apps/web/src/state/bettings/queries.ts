export const ticketField = `
  id
  owner
  rewards
  ticketNumber
  ticketNumber2
  metadataUrl
  claimed
`

export const periodField = `
  id
  status
  auditor
  closedAt
  period
  finalNumber
  amountCollected
`
export const bettingEventFields = `
id
active
bettingId
token
action
adminShare
referrerShare
bracketDuration
pricePerTicket
discountDivisor
rewardsBreakdown
startTime
media
description
tickets {
  ${ticketField}
}
periods {
  ${periodField}
}
`

export const bettingFields = `
  id
  profileId
  owner
  active
  createdAt
  updatedAt
  countries
  cities
  bettingEvents {
    ${bettingEventFields}
  }
`
