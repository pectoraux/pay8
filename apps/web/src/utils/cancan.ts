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
    const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)
    try {
      mp4 = mp4
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: mp4,
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
          })
        : ''
      thumbnail = thumbnail
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: thumbnail,
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
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

function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'))
}

export const encryptArticle = (encryptRsa, str) => {
  const chks = chunkString(str, 400)
  const encryptedChks = chks?.map((chk, index) => {
    try {
      return chk
        ? encryptRsa.encryptStringWithRsaPublicKey({
            text: chk,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY_4096,
          })
        : ''
    } catch (err) {
      console.log('encryptArticle============>', err, chk?.length, index)
    }
  })
  return encryptedChks?.join(',')
}

export const decryptAllArticle = (chks) => {
  // chks = chks?.slice(0, 10)
  const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY_4096, process.env.NEXT_PUBLIC_PRIVATE_KEY_4096)
  const decryptedChks = chks?.map((chk, index) => {
    try {
      return chk
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: chk,
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
          })
        : ''
    } catch (err) {
      console.log('decryptArticle============>', err, chk?.length, index)
    }
  })
  return decryptedChks?.join('')
}

export const decryptArticle = (chks) => {
  chks = chks?.slice(0, 10)
  const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY_4096, process.env.NEXT_PUBLIC_PRIVATE_KEY_4096)
  const decryptedChks = chks?.map((chk, index) => {
    try {
      return chk
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: chk,
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
          })
        : ''
    } catch (err) {
      console.log('decryptArticle============>', err, chk?.length, index)
    }
  })
  return decryptedChks?.join('')
}

export const decryptArticle2 = (chks, cursor) => {
  if (cursor < 10) {
    return ''
  }
  chks = chks?.slice(cursor, cursor + 10)
  const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY_4096, process.env.NEXT_PUBLIC_PRIVATE_KEY_4096)
  const decryptedChks = chks?.map((chk, index) => {
    try {
      return chk
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: chk,
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
          })
        : ''
    } catch (err) {
      console.log('decryptArticle============>', err, chk?.length, index)
    }
  })
  return decryptedChks?.join('')
}
