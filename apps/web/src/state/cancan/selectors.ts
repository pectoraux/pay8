import { getVeFromWorkspace } from 'utils/addressHelpers'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { getTagFromProductId } from './helpers'

export const selectFilteredData = (nfts, filters) => {
  const _ve = filters?.workspace?.value ? getVeFromWorkspace(filters?.workspace.value.toLowerCase()) : ADDRESS_ZERO
  return nfts?.filter(async (nft) => {
    const tags = await getTagFromProductId(nft?.id)
    console.log('selectFilteredData==============>', nfts, filters, _ve, tags)
    return (
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
        filters.product.filter((value) => tags?.toLowerCase()?.split(',').includes(value?.toLowerCase()))?.length > 0)
    )
  })
}

export const selectFilteredData2 = (nfts, filters) => {
  const _ve = filters?.workspace?.value ? getVeFromWorkspace(filters?.workspace.value.toLowerCase()) : ADDRESS_ZERO
  console.log('1selectFilteredData==============>', nfts, filters, _ve)
  return nfts?.filter(async (nft) => {
    const tags = await getTagFromProductId(nft?.id)
    return (
      (!filters.workspace || nft?.workspaces?.toLowerCase() === _ve?.toLowerCase()) &&
      (!filters.country ||
        filters.country.includes('All') ||
        filters.country.filter((value) => nft?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()))
          ?.length > 0) &&
      (!filters.city ||
        filters.city.includes('All') ||
        filters.city.filter((value) => nft?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()))?.length >
          0) &&
      (!filters.product ||
        filters.product.filter((value) => tags?.toLowerCase()?.split(',').includes(value?.toLowerCase()))?.length > 0)
    )
  })
}
