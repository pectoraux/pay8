import NodeRSA from 'encrypt-rsa'
import { AutoRenewIcon, Box, Button, Flex, Link, LinkExternal } from '@pancakeswap/uikit'
import { FC, useEffect, useRef, useState } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import RichTextEditor from 'components/RichText'
import { useDecryptArticle, useDecryptArticle2, useGetPaywallARP, useGetSubscriptionStatus } from 'state/cancan/hooks'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useNftStorage } from 'state/nftMarket/storage'
import { decryptArticle, decryptContent, getThumbnailNContent } from 'utils/cancan'

import { RoundedImage } from '../Collection/IndividualNFTPage/shared/styles'
import { useTranslation } from '@pancakeswap/localization'
import { FetchStatus } from 'config/constants/types'
import Iframe from 'react-iframe'

const StyledAspectRatio = styled(Box)`
  position: absolute;
  inset: 0;
`

export const AspectRatio = ({ ratio, children, ...props }) => (
  <Box width="100%" height={0} pb={`${100 / ratio}%`} position="relative" {...props}>
    <StyledAspectRatio>{children}</StyledAspectRatio>
  </Box>
)
const PADLENTH = 10

const NFTMedia: FC<any> = ({
  width,
  height,
  nft,
  tokenURI = null,
  media = null,
  showThumbnail = true,
  borderRadius = 'default',
  as,
  ...props
}) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { setTryVideoNftMedia } = useNftStorage()
  const { account } = useWeb3React()
  const [cursor, setCursor] = useState(0)
  const chks = nft?.images?.split(',')?.slice(1)
  const { data: _article, refetch, status } = useDecryptArticle(chks)
  const [article, setArticle] = useState(_article ?? '')
  const { data: article2, status: status2 } = useDecryptArticle2(chks, cursor)
  const paywallARP = useGetPaywallARP(nft?.collection?.id ?? '')
  const { ongoingSubscription } = useGetSubscriptionStatus(
    paywallARP?.paywallAddress ?? '',
    account ?? '',
    '0',
    nft?.tokenId,
  )
  // const vidRef = useRef(null)
  // const { observerRef, isIntersecting } = useIntersectionObserver()

  useEffect(() => {
    if (!showThumbnail && article2?.length) {
      setArticle(article + article2)
    }
  }, [article2])

  useEffect(() => {
    if (!showThumbnail) {
      if (!article?.length) setArticle(_article)
      // if (vidRef.current) {
      //   if (isIntersecting) {
      //     vidRef.current.play().catch((error) => {
      //       if (error instanceof DOMException && error.name === 'NotAllowedError') {
      //         setTryVideoNftMedia(false)
      //       }
      //     })
      //   } else {
      //     vidRef.current.pause()
      //   }
      // }
    }
  }, [
    dispatch,
    article,
    // isIntersecting, setTryVideoNftMedia
  ])
  let { mp4, thumbnail, isArticle } = getThumbnailNContent(nft)
  let _thumbnail = thumbnail
  let _mp4 = article
  if (!isArticle && !showThumbnail) {
    const { thumbnail: __thumbnail, mp4: __mp4 } = decryptContent(nft, thumbnail, mp4, ongoingSubscription, account)
    _thumbnail = __thumbnail
    _mp4 = __mp4
  }

  if (tokenURI?.metadataUrl && !showThumbnail) {
    return <Iframe url={tokenURI.metadataUrl} height="500px" id="myId" />
  }
  if (media && !showThumbnail) {
    return (
      <RichTextEditor
        readOnly
        value={`<iframe class="ql-video" frameborder="0" allowfullscreen="true" src="${media}" height="467" width="830"></iframe>`}
        id="rte"
      />
    )
  }
  if (isArticle && !showThumbnail) {
    if (!parseInt(nft?.behindPaywall)) {
      return <RichTextEditor value={mp4} readOnly id="rte" />
    }
    return (
      <Flex flexDirection="column">
        {status === FetchStatus.Fetched && article?.length ? (
          <RichTextEditor value={article} readOnly id="rte" />
        ) : null}
        {status === FetchStatus.Fetched && article?.length && chks?.length > cursor ? (
          <Button
            onClick={() => {
              setCursor(cursor + 10)
            }}
          >
            {t('Fetch More (%val%% Fetched So Far)', { val: Math.ceil((cursor * 100) / chks.length) })}
          </Button>
        ) : null}
      </Flex>
    )
  }
  return <RoundedImage width={width} height={height} src={media} alt={nft?.name} as={as} {...props} />
}

export default NFTMedia
