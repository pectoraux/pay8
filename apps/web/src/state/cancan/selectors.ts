import { getVeFromWorkspace } from 'utils/addressHelpers'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

export const selectFilteredData = (nfts, filters) => {
  const _ve = filters?.workspace?.value ? getVeFromWorkspace(filters?.workspace.value.toLowerCase()) : ADDRESS_ZERO
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

export const selectFilteredData3 = (registrations, filters, _tags) => {
  const _res =
    registrations?.length &&
    registrations?.filter((registration) => {
      const mtags = _tags?.map((tag) => tag.id)
      const tags = mtags?.toString()
      const res =
        registration.active &&
        (!filters.country ||
          filters.country.includes('All') ||
          filters.country.filter((value) =>
            registration?.userCollection?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
          )?.length > 0) &&
        (!filters.city ||
          filters.city.includes('All') ||
          filters.city.filter((value) =>
            registration?.userCollection?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
          )?.length > 0) &&
        (!filters.product ||
          filters.product.filter((value) => tags?.toLowerCase()?.split(',').includes(value?.toLowerCase()))?.length > 0)
      return res
    })
  return _res
}

export const selectFilteredData4 = (registrations, filters, _tags) => {
  const mtags = _tags?.map((tag) => tag.id)
  const tags = mtags?.toString()
  const _res =
    registrations?.length &&
    registrations?.filter((registration) => {
      const res =
        registration.active &&
        registration.partnerCollection?.id &&
        (!filters.country ||
          filters.country.includes('All') ||
          filters.country.filter((value) =>
            registration?.partnerCollection?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
          )?.length > 0) &&
        (!filters.city ||
          filters.city.includes('All') ||
          filters.city.filter((value) =>
            registration?.partnerCollection?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
          )?.length > 0) &&
        (!filters.product ||
          filters.product.filter((value) => tags?.toLowerCase()?.split(',').includes(value?.toLowerCase()))?.length > 0)
      return res
    })
  return _res
}
