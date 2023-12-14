import NodeRSA from 'encrypt-rsa'
import { AutoRenewIcon, Box, Button, Flex, Link, LinkExternal } from '@pancakeswap/uikit'
import { FC, useEffect, useRef, useState } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import RichTextEditor from 'components/RichText'
import {
  useDecryptArticle,
  useDecryptArticle2,
  useGetPaywallARP,
  useGetSubscriptionStatus,
  useGetThumbnailNContent,
} from 'state/cancan/hooks'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useNftStorage } from 'state/nftMarket/storage'
import { decryptArticle, decryptContent, getThumbnailNContent } from 'utils/cancan'

import { RoundedImage } from '../Collection/IndividualNFTPage/shared/styles'
import { useTranslation } from '@pancakeswap/localization'
import { FetchStatus } from 'config/constants/types'
import Iframe from 'react-iframe'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { useRouter } from 'next/router'

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
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [cursor, setCursor] = useState(0)
  const chks = nft?.images?.split(',')?.slice(1)
  const [loaded, setLoaded] = useState(Math.max(100, Math.ceil((5 * 100) / chks?.length)))
  // const { data: _article, refetch, status } = useDecryptArticle2(chks, 10)
  const _article = ''
  const { mp4, thumbnail, isArticle } = useGetThumbnailNContent(nft)
  const paywallId = useRouter().query.paywallId as any
  const [article, setArticle] = useState(_article ?? '')
  const { data: article2, status: status2, refetch } = useDecryptArticle2(chks, cursor)
  const paywallARP = useGetPaywallARP(nft?.collection?.id ?? '')
  const { ongoingSubscription } = useGetSubscriptionStatus(
    paywallARP?.paywallAddress ?? '',
    account ?? '',
    '0',
    paywallId,
  )
  useEffect(() => {
    if (!showThumbnail && isArticle && !article?.length) setArticle(_article)
  }, [isArticle, article, showThumbnail])

  useEffect(() => {
    if (!showThumbnail && article2?.length) {
      setArticle(article + article2)
    }
  }, [article, article2, showThumbnail])

  let _thumbnail = thumbnail
  let _mp4 = article

  if (!showThumbnail) {
    if (!isArticle) {
      const { thumbnail: __thumbnail, mp4: __mp4 } = decryptContent(nft, thumbnail, mp4, ongoingSubscription, account)
      _thumbnail = __thumbnail
      _mp4 = __mp4
    }
    if (tokenURI?.metadataUrl) {
      return <Iframe url={tokenURI.metadataUrl} height="500px" id="myId" />
      // eslint-disable-next-line no-else-return
    } else if (media) {
      return (
        <RichTextEditor
          readOnly
          value={`<iframe class="ql-video" frameborder="0" allowfullscreen="true" src="${media}" height="467" width="830"></iframe>`}
          id="rte"
        />
      )
    } else if (isArticle) {
      if (!parseInt(nft?.behindPaywall)) {
        return <RichTextEditor value={mp4} readOnly id="rte" />
      }
      if (ongoingSubscription) {
        return (
          <Flex flexDirection="column">
            {article?.length ? <RichTextEditor value={article} readOnly id="rte" /> : null}
            {loaded < 100 ? (
              <Button
                onClick={() => {
                  setCursor(cursor + 5)
                  setLoaded(Math.ceil(((cursor + 5) * 100) / chks.length))
                }}
              >
                {t('Fetch Article (%val%% Fetched So Far)', { val: loaded })}
              </Button>
            ) : null}
          </Flex>
        )
      }
    }
  }
  return <RoundedImage width={width} height={height} src={media ?? _thumbnail} alt={nft?.tokenId} as={as} {...props} />
}

export default NFTMedia
