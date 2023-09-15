import { FetchStatus } from 'config/constants/types'
import useSWR, { KeyedMutator } from 'swr'
import { getProfileData } from './helpers'

export const useProfileFromSSI = (
  address: string,
  fetchConfiguration = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  },
): {
  profile?: any
  isFetching: boolean
  isValidating: boolean
  refresh: KeyedMutator<any>
} => {
  const { data, status, mutate, isValidating } = useSWR(
    address ? [address, 'profile1'] : null,
    () => getProfileData(1, 0, address),
    fetchConfiguration,
  )
  return {
    profile: data,
    isFetching: status === FetchStatus.Fetching,
    isValidating,
    refresh: mutate,
  }
}
