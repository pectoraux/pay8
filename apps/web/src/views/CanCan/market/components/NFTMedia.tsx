import NodeRSA from 'encrypt-rsa'
import { Box } from '@pancakeswap/uikit'
import { FC, useEffect, useRef } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import RichTextEditor from 'components/RichText'
import { useGetPaywallARP, useGetSubscriptionStatus } from 'state/cancan/hooks'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useNftStorage } from 'state/nftMarket/storage'
import { decryptContent, getThumbnailNContent } from 'utils/cancan'

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

const NFTMedia: FC<any> = ({ width, height, nft, showThumbnail = true, borderRadius = 'default', as, ...props }) => {
  const dispatch = useAppDispatch()
  const { setTryVideoNftMedia } = useNftStorage()
  const { account } = useWeb3React()
  const paywallARP = useGetPaywallARP(nft?.collection?.id ?? '')
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

  let { mp4, thumbnail, isArticle } = getThumbnailNContent(nft)
  const { thumbnail: _thumbnail, mp4: _mp4 } = decryptContent(nft, thumbnail, mp4, ongoingSubscription, account)
  if (isArticle && !showThumbnail) {
    return <RichTextEditor value={_mp4} readOnly id="rte" />
  }
  return <RoundedImage width={width} height={height} src={_thumbnail} alt={nft?.name} as={as} {...props} />
}

export default NFTMedia
