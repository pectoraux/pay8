import { useMemo } from 'react'
import styled from 'styled-components'
import { Box, Flex, Grid, Text } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import { NftAttribute } from 'state/cancan/types'
import { Item } from 'views/CanCan/market/components/Filters'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { WORKSPACES } from 'config'
import { ListTraitFilter } from './ListTraitFilter'

interface FiltersProps {
  address: string
  variant: 'product' | 'paywall'
  attributes: NftAttribute[]
}

const GridContainer = styled(Grid)`
  margin-bottom: 16px;
  padding: 0 16px;
  grid-gap: 8px 16px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'filterByTitle .'
    'attributeFilters attributeFilters'
    '. sortByTitle'
    'filterByControls sortByControls';
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'filterByTitle . .'
      'attributeFilters attributeFilters attributeFilters'
      '. . sortByTitle'
      'filterByControls . sortByControls';
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 2fr 5fr 1fr;
    grid-template-areas:
      'filterByTitle . .'
      'filterByControls attributeFilters attributeFilters'
      '. . sortByTitle'
      '. . sortByControls';
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1.3fr 5fr 1fr;
    grid-template-areas:
      'filterByTitle . sortByTitle'
      'filterByControls attributeFilters sortByControls';
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    grid-template-columns: 1fr 5fr 1fr;
  }
`

const FilterByTitle = styled(Text)`
  grid-area: filterByTitle;
`

const FilterByControls = styled(Box)`
  grid-area: filterByControls;
`

const SortByTitle = styled(Text)`
  grid-area: sortByTitle;
`

const SortByControls = styled(Box)`
  grid-area: sortByControls;
`

const ScrollableFlexContainer = styled(Flex)`
  grid-area: attributeFilters;
  align-items: center;
  flex: 1;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: wrap;
    overflow-x: revert;
  }
`

const Filters: React.FC<any> = ({ collection, nftFilters, setNftFilters, workspace = true }) => {
  let Country = require('country-state-city').Country
  let City = require('country-state-city').City
  const code = useMemo(
    () =>
      nftFilters?.country?.length &&
      Country.getAllCountries()?.find((val) => val.name === nftFilters.country[0])?.isoCode,
    [nftFilters],
  )
  const workspaces = Object.entries(WORKSPACES)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Workspace: accum.Workspace
        ? [...accum.Workspace, { traitType: 'Workspace', value: attr[0], count: attr[1] }]
        : [{ traitType: 'Workspace', value: attr[0], count: attr[1] }],
    }),
    {} as any,
  )
  const countries = Object.entries(Country.getAllCountries())?.reduce(
    (accum: any, attr: any) => ({
      Country: accum.Country
        ? [...accum.Country, { traitType: 'Country', value: attr[1].name, count: 0 }]
        : [{ traitType: 'Country', value: attr[1].name, count: 0 }],
    }),
    { traitType: 'Country', value: 'All', count: 0 } as any,
  )
  const cities: any =
    Object.values(City.getCitiesOfCountry(code ?? ''))?.reduce(
      (accum: any, attr: any) => ({
        City: accum.City
          ? [...accum.City, { traitType: 'City', value: attr.name, count: 0 }]
          : [{ traitType: 'City', value: attr.name, count: 0 }],
      }),
      { traitType: 'City', value: 'All', count: 0 } as any,
    ) || []
  const productsHome =
    collection?.products?.split(',')?.reduce(
      (accum: any, attr: any) => ({
        ...accum,
        Product: accum.Product
          ? [...accum.Product, { traitType: 'Product', value: attr, count: 0 }]
          : [{ traitType: 'Product', value: attr, count: 0 }],
      }),
      {} as any,
    ) || []
  const workspaceItems: Item[] = workspaces.Workspace.map((attr) => ({
    label: attr.value as string,
    count: attr.count ? attr.count : undefined,
    attr,
  }))
  let countryItems =
    countries.Country?.map((attr) => ({
      label: capitalize(attr.value as string),
      count: attr.count ? attr.count : undefined,
      attr,
    })) || []
  countryItems.push({
    label: 'All',
    count: 0,
    attr: {
      traitType: 'Country',
      value: 'All',
      count: 0,
    },
  })
  let cityItems =
    cities.City?.map((attr) => ({
      label: attr.value as string,
      count: attr.count ? attr.count : undefined,
      attr,
    })) || []
  cityItems.push({
    label: 'All',
    count: 0,
    attr: {
      traitType: 'City',
      value: 'All',
      count: 0,
    },
  })
  const productItems: Item[] = productsHome.Product?.map((attr) => ({
    label: attr.value as string,
    count: attr.count ? attr.count : undefined,
    attr,
  }))

  return (
    <>
      <ScrollableFlexContainer>
        {workspace && (
          <ListTraitFilter
            key="workspace"
            title={capitalize('workspace')}
            traitType="workspace"
            items={workspaceItems}
            nftFilters={nftFilters}
            setNftFilters={setNftFilters}
            collectionAddress={ADDRESS_ZERO}
          />
        )}
        <ListTraitFilter
          key="country"
          title={capitalize('country')}
          traitType="country"
          items={countryItems}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          collectionAddress={ADDRESS_ZERO}
        />
        <ListTraitFilter
          key="city"
          title={capitalize('city')}
          traitType="city"
          items={cityItems}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          collectionAddress={ADDRESS_ZERO}
        />
        {productItems && (
          <ListTraitFilter
            key="product"
            title={capitalize('product tags')}
            traitType="product"
            items={productItems ?? []}
            nftFilters={nftFilters}
            setNftFilters={setNftFilters}
            collectionAddress={ADDRESS_ZERO}
          />
        )}
      </ScrollableFlexContainer>
    </>
  )
}

export default Filters
