import { getVeFromWorkspace } from 'utils/addressHelpers'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

export const selectFilteredData = (nfts, filters) => {
  const _ve = filters?.workspace?.value ? getVeFromWorkspace(filters?.workspace.value.toLowerCase()) : ADDRESS_ZERO
  console.log('nftsnfts===============>', nfts)
  const _res =
    nfts?.length &&
    nfts?.filter((nft) => {
      const mtags = nft?.tags?.map((tag) => tag.id)
      const tags = mtags?.toString()
      const res =
        (!filters.workspace || nft?.ve?.toLowerCase() === _ve?.toLowerCase()) &&
        (!filters.country ||
          filters.country.includes('All') ||
          filters.country.filter((value) => nft?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()))
            ?.length > 0) &&
        (!filters.city ||
          filters.city.includes('All') ||
          filters.city.filter((value) => nft?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()))
            ?.length > 0) &&
        (!filters.product ||
          filters.product.filter((value) => tags?.toLowerCase()?.split(',').includes(value?.toLowerCase()))?.length > 0)
      return res
    })
  return _res
}

export const selectFilteredData2 = (nfts, filters) => {
  const _ve = filters?.workspace?.value ? getVeFromWorkspace(filters?.workspace.value.toLowerCase()) : ADDRESS_ZERO
  return nfts?.filter((nft) => {
    const mtags = nft?.tags?.map((tag) => tag.id)
    const tags = mtags?.toString()
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
