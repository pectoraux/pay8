import { Flex } from '@pancakeswap/uikit'
import IfoVesting from './IfoVesting/index'

const IfoPoolVaultCard: React.FC<any> = () => {
  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      <IfoVesting />
    </Flex>
  )
}

export default IfoPoolVaultCard
