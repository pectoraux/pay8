export const ssiFields = `
id
owner
auditor
question
answer
dataType
searchable
startTime
endTime
`

export const profileFields = `
id
owner
publicKey
encyptedPrivateKey
dataAudited {
    ${ssiFields}
}
`
export const identityTokenFields = `
id
owner
metadataUrl
`
