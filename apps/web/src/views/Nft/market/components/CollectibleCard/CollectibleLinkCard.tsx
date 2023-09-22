import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import ProductDetailsSection from './ProductDetailsSection'
import { nftsBaseUrl } from '../../constants'

const CollectibleLinkCard: React.FC<any> = ({
  nft,
  referrer,
  nftLocation,
  currentAskPrice,
  collectionId,
  isPaywall = false,
  ...props
}) => {
  const urlId = nft?.tokenId
  const collectionAddress = collectionId ?? (useRouter().query.collectionAddress as string)
  const link = isPaywall
    ? `${nftsBaseUrl}/collections/${collectionAddress}/paywall/${urlId}`
    : `${nftsBaseUrl}/collections/${collectionAddress}/${urlId}`

  return (
    <StyledCollectibleCard {...props}>
      <NextLinkFromReactRouter to={referrer ? `${link}?referrer=${referrer}` : `${link}`}>
        <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
      </NextLinkFromReactRouter>
      <ProductDetailsSection key={nft?.tokenId + nft?.collection?.id} paywall={nft} />
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
