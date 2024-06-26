import { useRouter } from 'next/router'
import Container from 'components/Layout/Container'
import CollectionTraits from 'views/CanCan/market/Collection/Traits/CollectionTraits'

const Traits = () => {
  const collectionAddress = useRouter().query.collectionAddress as string

  return (
    <>
      <Container py="40px">
        <CollectionTraits collectionAddress={collectionAddress} />
      </Container>
    </>
  )
}

export default Traits
