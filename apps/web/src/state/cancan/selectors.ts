import { useGetNftFilters } from './hooks'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

export const selectFilteredData = (address, nfts) => {
  const filters = useGetNftFilters(address ?? '') as any
  const _ve = filters?.workspace?.value ? getVeFromWorkspace(filters?.workspace.value.toLowerCase()) : ADDRESS_ZERO
  console.log('selectFilteredData==============>', nfts, filters, _ve)
  return nfts?.filter(
    (nft) =>
      (!filters.workspace || nft?.ve?.toLowerCase() === _ve?.toLowerCase()) &&
      (!filters.country ||
        filters.country.includes('All') ||
        filters.country.filter((value) => nft?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()))
          ?.length > 0) &&
      (!filters.city ||
        filters.city.includes('All') ||
        filters.city.filter((value) => nft?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()))?.length >
          0) &&
      (!filters.product ||
        filters.product.includes('All') ||
        filters.product.filter((value) => nft?.products?.toLowerCase()?.split(',').includes(value?.toLowerCase()))
          ?.length > 0),
  )
}
