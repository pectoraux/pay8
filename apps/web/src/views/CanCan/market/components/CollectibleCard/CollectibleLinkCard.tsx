import { useRouter } from 'next/router'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import ProductDetailsSection from './ProductDetailsSection'
import { cancanBaseUrl } from '../../constants'

const CollectibleLinkCard: React.FC<any> = ({
  nft,
  referrer,
  nftLocation,
  currentAskPrice,
  collectionId,
  paywallId,
  isPaywall = false,
  ...props
}) => {
  const urlId = nft?.tokenId
  const { query } = useRouter()
  const padding = paywallId?.length ? `?paywallId=${paywallId}` : ''
  const collectionAddress = collectionId ?? (query.collectionAddress as string)
  const link = isPaywall
    ? `${cancanBaseUrl}/collections/${collectionAddress}/paywall/${urlId}`
    : `${cancanBaseUrl}/collections/${collectionAddress}/${urlId}${padding}`
  return (
    <StyledCollectibleCard {...props}>
      <CardBody
        referrer={referrer}
        link={link}
        nft={nft}
        nftLocation={nftLocation}
        currentAskPrice={currentAskPrice ?? nft?.currentAskPrice}
      />
      <ProductDetailsSection key={nft?.tokenId + nft?.collection?.id} paywall={nft} />
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
