import NodeRSA from 'encrypt-rsa'

export function getThumbnailNContent(nft) {
  let chunks = nft?.images && nft?.images?.split(',')
  let thumbnail
  let mp4
  try {
    // process article
    thumbnail = chunks[0]
    mp4 = chunks.slice(1).join(',')
    if (!mp4) {
      // process regular product
      mp4 = thumbnail
    }
  } catch (err) {}
  return {
    mp4,
    thumbnail,
    isArticle: thumbnail !== mp4,
  }
}

export function decryptContent(nft, thumbnail, mp4, ongoingSubscription, account) {
  if (
    Number(nft?.behindPaywall ?? 0) &&
    (ongoingSubscription || nft?.currentSeller?.toLowerCase() === account?.toLowerCase())
  ) {
    console.log('ongoingSubscription================>Done')
    const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)
    try {
      mp4 = mp4
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: mp4,
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      thumbnail = thumbnail
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: thumbnail,
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
    } catch (err) {
      console.log('nftmedia==============>', err)
    }
  }
  return {
    mp4,
    thumbnail,
  }
}
