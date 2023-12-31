import NodeRSA from 'encrypt-rsa'

export function getThumbnailNContent(nft) {
  const chunks = nft?.images && nft?.images?.split(',')
  let thumbnail
  let mp4
  try {
    if (chunks?.length && chunks[0] === 'img') {
      return {
        mp4: chunks[1],
        thumbnail: chunks[1],
        isArticle: false,
        contentType: chunks[0],
      }
    }
    if (chunks?.length && chunks[0] === 'video') {
      return {
        mp4: chunks[2],
        thumbnail: chunks[1],
        isArticle: false,
        contentType: chunks[0],
      }
    }
    if (chunks?.length && chunks[0] === 'form') {
      return {
        mp4: chunks[2],
        thumbnail: chunks[1],
        isArticle: false,
        contentType: chunks[0],
      }
    }
    // process article
    thumbnail = chunks[0]
    mp4 = chunks.slice(1).join(',')
    if (!mp4?.trim()?.length) {
      // process regular product
      mp4 = thumbnail
    }
  } catch (err) {
    console.log('1getThumbnailNContent===============>', err)
  }
  return {
    mp4,
    thumbnail,
    isArticle: thumbnail !== mp4 && mp4?.length > 0,
  }
}

export function decryptContent(nft, thumbnail, mp4, ongoingSubscription, account) {
  if (
    Number(nft?.behindPaywall ?? 0) &&
    (ongoingSubscription || nft?.currentSeller?.toLowerCase() === account?.toLowerCase())
  ) {
    const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)
    try {
      // eslint-disable-next-line no-param-reassign
      mp4 = mp4
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: mp4,
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
          })
        : ''
      const _thumbnail = thumbnail
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: thumbnail,
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
          })
        : ''
      // eslint-disable-next-line no-param-reassign
      thumbnail = _thumbnail ?? thumbnail
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
  return str.match(new RegExp(`.{1,${length}}`, 'g'))
}

export const encryptArticle = (encryptRsa, str) => {
  const chks = chunkString(str, 400)
  // eslint-disable-next-line array-callback-return
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
  // eslint-disable-next-line array-callback-return
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
  try {
    // eslint-disable-next-line no-param-reassign
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
  } catch (err) {
    console.log('err decryptArticle============>', err)
  }
}

export const decryptArticle2 = (chks, cursor) => {
  if (chks?.length < 1) {
    return ''
  }
  chks = chks?.slice(cursor, cursor + 5)
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
      console.log('err decryptArticle2============>', err, chk?.length, index)
    }
  })
  return decryptedChks?.join('')
}
