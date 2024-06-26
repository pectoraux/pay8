import NodeRSA from 'encrypt-rsa'
import { Box, BoxProps } from '@pancakeswap/uikit'
import { FC, useEffect, useRef } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import RichTextEditor from 'components/RichText'
import { useGetPaywallARP, useGetSubscriptionStatus, useTryVideoNftMedia } from 'state/cancan/hooks'
import { NftToken } from 'state/nftMarket/types'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { useNftStorage } from 'state/nftMarket/storage'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { RoundedImage } from '../Collection/IndividualNFTPage/shared/styles'

const StyledAspectRatio = styled(Box)`
  position: absolute;
  inset: 0;
`

export const AspectRatio = ({ ratio, children, ...props }) => (
  <Box width="100%" height={0} pb={`${100 / ratio}%`} position="relative" {...props}>
    <StyledAspectRatio>{children}</StyledAspectRatio>
  </Box>
)

const NFTMedia: FC<any> = ({ width, height, nft, borderRadius = 'default', as, ...props }) => {
  const dispatch = useAppDispatch()
  const { setTryVideoNftMedia } = useNftStorage()
  const { account } = useWeb3React()
  const paywallARP = useGetPaywallARP(nft?.collection?.id ?? '', nft?.tokenId) as any
  const { ongoingSubscription } = useGetSubscriptionStatus(
    paywallARP?.paywallAddress ?? '',
    account ?? '',
    '0',
    nft?.tokenId,
  )
  const vidRef = useRef(null)
  const { observerRef, isIntersecting } = useIntersectionObserver()

  useEffect(() => {
    if (vidRef.current) {
      if (isIntersecting) {
        vidRef.current.play().catch((error) => {
          if (error instanceof DOMException && error.name === 'NotAllowedError') {
            setTryVideoNftMedia(false)
          }
        })
      } else {
        vidRef.current.pause()
      }
    }
  }, [dispatch, isIntersecting, setTryVideoNftMedia])
  // [gif, mp4, webm, original, thumbnail]
  let mp4
  let chunks
  let thumbnail
  try {
    chunks = nft?.images && nft?.images?.split(',')
    thumbnail = chunks?.length > 0 && nft?.images?.split(',')[0]
    mp4 = chunks?.length > 1 && nft?.images?.split(',').slice(1).join(',')
  } catch (err) {
    chunks = nft?.images
    thumbnail = nft?.images?.length > 0 && nft?.images[0]
    mp4 = nft?.images?.length > 1 && nft?.images?.slice(1).join(',')
  }
  if (
    Number(nft?.behindPaywall ?? 0) &&
    (ongoingSubscription || nft?.currentSeller?.toLowerCase() === account?.toLowerCase())
  ) {
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
  if (mp4.length > 400) {
    return <RichTextEditor value={mp4} readOnly id="rte" />
  }
  return <RoundedImage width={width} height={height} src={thumbnail} alt={nft?.tokenId} as={as} {...props} />
}

export default NFTMedia
