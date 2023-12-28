import { Ifo } from 'config/constants/types'
import { useGetBoughtProfileAuctionData } from 'state/profile/hooks'
import IfoFoldableCard from './IfoFoldableCard'

interface Props {
  ifo: Ifo
}

const IfoCardV3Data: React.FC<any> = ({ ifo, index }) => {
  const { data, refetch } = useGetBoughtProfileAuctionData(ifo)
  console.log('arr2===============>', data, ifo)

  return <IfoFoldableCard ifo={ifo} status="finished" index={index} data={data} refetch={refetch} />
}

export default IfoCardV3Data
