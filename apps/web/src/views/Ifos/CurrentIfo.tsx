import { Ifo } from 'config/constants/types'

import { IfoCurrentCard } from './components/IfoFoldableCard'
import IfoContainer from './components/IfoContainer'
import { useGetProfileAuctionData } from '../../state/profile/hooks'

interface TypeProps {
  activeIfo: Ifo
}

const CurrentIfo: React.FC<React.PropsWithChildren<TypeProps>> = ({ activeIfo }) => {
  const { data, refetch } = useGetProfileAuctionData()
  return <IfoContainer ifoSection={<IfoCurrentCard ifo={activeIfo} data={data} refetch={refetch} />} />
}

export default CurrentIfo
