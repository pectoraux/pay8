import Iframe from 'react-iframe'
import { CardBody, Flex } from '@pancakeswap/uikit'

const CollectibleCardBody: React.FC<any> = ({ nft, nftLocation, currentAskPrice }) => {
  console.log('currentAskPrice=================>', currentAskPrice, nftLocation)
  return (
    <CardBody>
      <Flex justifyContent="center" alignItems="center" ml="10px">
        <Iframe url={nft} height="500px" id="myId" />
      </Flex>
    </CardBody>
  )
}

export default CollectibleCardBody
