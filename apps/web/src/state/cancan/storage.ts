import { NftFilter, NftActivityFilter, MarketEvent, NftAttribute } from 'state/cancan/types'
import { useAtom } from 'jotai'
import cloneDeep from 'lodash/cloneDeep'
import { nftMarketFiltersAtom, nftMarketActivityFiltersAtom, tryVideoNftMediaAtom } from 'state/cancan/atoms'
import { useCallback } from 'react'

const initialNftFilterState: NftFilter = {
  activeFilters: {},
  showNftFilters: {},
  showOnlyUsers: false,
  showOnlyOnSale: true,
  showSearch: '',
  ordering: {
    field: 'currentAskPrice',
    direction: 'asc',
  },
}

const initialNftActivityFilterState: NftActivityFilter = {
  typeFilters: [],
  collectionFilters: [],
}

export function useNftStorage() {
  const [nftMarketFilters, setNftMarketFilters] = useAtom(nftMarketFiltersAtom)
  const [nftMarketActivityFilters, setNftMarketActivityFilters] = useAtom(nftMarketActivityFiltersAtom)
  const [tryVideoNftMedia, setTryVideoNftMedia] = useAtom(tryVideoNftMediaAtom)

  const addActivityTypeFilters = useCallback(
    ({ collection, field }: { collection: string; field: MarketEvent }) => {
      if (nftMarketActivityFilters[collection]) {
        nftMarketActivityFilters[collection].typeFilters.push(field)
      } else {
        nftMarketActivityFilters[collection] = {
          ...cloneDeep(initialNftActivityFilterState),
          typeFilters: [field],
        }
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const addActivityCollectionFilters = useCallback(
    ({ address, collection }) => {
      if (nftMarketActivityFilters[address]) {
        nftMarketActivityFilters[address].collectionFilters.push(collection)
      } else {
        nftMarketActivityFilters[address] = {
          ...cloneDeep(initialNftActivityFilterState),
          collectionFilters: [collection],
        }
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const removeActivityTypeFilters = useCallback(
    ({ collection, field }: { collection: string; field: MarketEvent }) => {
      if (nftMarketActivityFilters[collection]) {
        nftMarketActivityFilters[collection].typeFilters = nftMarketActivityFilters[collection].typeFilters.filter(
          (activeFilter) => activeFilter !== field,
        )
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const removeActivityCollectionFilters = useCallback(
    ({ address, collection }) => {
      if (nftMarketActivityFilters[address]) {
        nftMarketActivityFilters[address].collectionFilters = nftMarketActivityFilters[
          address
        ].collectionFilters.filter((activeFilter) => activeFilter !== collection)
      }
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [setNftMarketActivityFilters, nftMarketActivityFilters],
  )

  const removeAllActivityFilters = useCallback(
    (collectionAddress: string) => {
      nftMarketActivityFilters[collectionAddress] = cloneDeep(initialNftActivityFilterState)
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    },
    [nftMarketActivityFilters, setNftMarketActivityFilters],
  )

  const removeAllActivityCollectionFilters = useCallback(() => {
    if (nftMarketActivityFilters['']) {
      nftMarketActivityFilters[''].collectionFilters = []
      setNftMarketActivityFilters({ ...nftMarketActivityFilters })
    }
  }, [nftMarketActivityFilters, setNftMarketActivityFilters])

  const setShowOnlyOnSale = useCallback(
    ({ collection, showOnlyOnSale }: { collection: string; showOnlyOnSale: boolean }) => {
      if (nftMarketFilters[collection]) {
        nftMarketFilters[collection].showOnlyOnSale = showOnlyOnSale
      } else {
        nftMarketFilters[collection] = {
          ...cloneDeep(initialNftFilterState),
          showOnlyOnSale,
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [setNftMarketFilters, nftMarketFilters],
  )

  const setShowOnlyUsers = useCallback(
    ({ collection, showOnlyUsers }: { collection: string; showOnlyUsers: boolean }) => {
      if (nftMarketFilters[collection]) {
        nftMarketFilters[collection].showOnlyUsers = showOnlyUsers
      } else {
        nftMarketFilters[collection] = {
          ...cloneDeep(initialNftFilterState),
          showOnlyUsers,
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [setNftMarketFilters, nftMarketFilters],
  )

  const setShowNftFilters = useCallback(
    ({ collection, showNftFilters }: { collection: string; showNftFilters: any }) => {
      if (nftMarketFilters[collection]) {
        nftMarketFilters[collection].showNftFilters = showNftFilters
      } else {
        nftMarketFilters[collection] = {
          ...cloneDeep(initialNftFilterState),
          showNftFilters,
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [setNftMarketFilters, nftMarketFilters],
  )

  const setShowSearch = useCallback(
    ({ collection, showSearch }: { collection: string; showSearch: string }) => {
      if (nftMarketFilters[collection]) {
        nftMarketFilters[collection].showSearch = showSearch
      } else {
        nftMarketFilters[collection] = {
          ...cloneDeep(initialNftFilterState),
          showSearch,
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [setNftMarketFilters, nftMarketFilters],
  )

  const setOrdering = useCallback(
    ({ collection, field, direction }: { collection: string; field: string; direction: 'asc' | 'desc' }) => {
      if (nftMarketFilters[collection]) {
        nftMarketFilters[collection].ordering = {
          field,
          direction,
        }
      } else {
        nftMarketFilters[collection] = {
          ...cloneDeep(initialNftFilterState),
          ordering: {
            field,
            direction,
          },
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [setNftMarketFilters, nftMarketFilters],
  )

  const removeAllItemFilters = useCallback(
    (collectionAddress: string) => {
      nftMarketFilters[collectionAddress] = { ...cloneDeep(initialNftActivityFilterState) }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [nftMarketFilters, setNftMarketFilters],
  )

  const updateItemFilters = useCallback(
    ({ collectionAddress, nftFilters }: { collectionAddress: string; nftFilters: any }) => {
      if (nftMarketFilters[collectionAddress]) {
        nftMarketFilters[collectionAddress] = {
          ...nftMarketFilters[collectionAddress],
          activeFilters: { ...nftFilters },
        }
      } else {
        nftMarketFilters[collectionAddress] = {
          ...cloneDeep(initialNftFilterState),
          activeFilters: { ...nftFilters },
        }
      }
      setNftMarketFilters({ ...nftMarketFilters })
    },
    [nftMarketFilters, setNftMarketFilters],
  )

  return {
    nftMarketFilters,
    nftMarketActivityFilters,
    tryVideoNftMedia,
    addActivityTypeFilters,
    addActivityCollectionFilters,
    removeActivityTypeFilters,
    removeActivityCollectionFilters,
    removeAllActivityFilters,
    removeAllActivityCollectionFilters,
    setShowOnlyOnSale,
    setShowOnlyUsers,
    setShowSearch,
    setShowNftFilters,
    setOrdering,
    setTryVideoNftMedia,
    removeAllItemFilters,
    updateItemFilters,
  }
}
