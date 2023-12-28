import { Container } from '@pancakeswap/uikit'
import { ifosConfig } from 'config/constants'
import { Ifo } from 'config/constants/types'
import { useGetProfileAuctionData } from 'state/profile/hooks'
import IfoCardV3Data from './components/IfoCardV3Data'
import IfoLayout from './components/IfoLayout'

const inactiveIfo: Ifo[] = ifosConfig.filter((ifo) => !ifo.isActive)

const PastIfo = () => {
  const { data } = useGetProfileAuctionData()
  const arr2 = Array.from({ length: parseInt(data?.boughtProfileId) - 1 }, (v, i) => i + 1)
  return (
    <Container>
      <IfoLayout maxWidth="736px" m="auto" width="100%" id="past-ifos" py={['24px', '24px', '40px']}>
        {arr2.map((ifo, index) => (
          <IfoCardV3Data key={ifo} ifo={ifo} index={index} />
        ))}
      </IfoLayout>
    </Container>
  )
}

export default PastIfo
