import useSWRImmutable from 'swr/immutable'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { getVotingPower } from '../stakemarketvoting/helpers'

export const useGetVotingPower = (veAddress: string, tokenId: string) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWRImmutable(['votingpower1', veAddress, tokenId], async () => getVotingPower(veAddress, tokenId, chainId))
  return { data, refetch, status }
}
