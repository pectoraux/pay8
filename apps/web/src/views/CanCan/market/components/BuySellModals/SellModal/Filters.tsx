import styled from 'styled-components'
import { Box, Flex, Grid, Text } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import { Item } from 'views/CanCan/market/components/Filters'
import { WORKSPACES, COUNTRIES, CITIES, PRODUCTS } from 'config'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { ListTraitFilter } from './ListTraitFilter'
import { ListTraitFilter2 } from './ListTraitFilter2'

interface FiltersProps {
  nftFilters: any
  setNftFilters: (any) => void
  showWorkspace?: boolean
  showCountry: boolean
  showCity: boolean
  showProduct: boolean
}

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

const Filters: React.FC<any> = ({
  nftFilters,
  setNftFilters,
  showWorkspace = true,
  showCountry = true,
  showCity = true,
  showProduct = true,
}) => {
  const workspaces = Object.entries(WORKSPACES)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Workspace: accum.Workspace
        ? [...accum.Workspace, { traitType: 'Workspace', value: attr[0], count: attr[1] }]
        : [{ traitType: 'Workspace', value: attr[0], count: attr[1] }],
    }),
    {} as any,
  )
  const countries = Object.entries(COUNTRIES)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Country: nftFilters.workspace
        ? accum.Country
          ? [...accum.Country, { traitType: 'Country', value: attr[0], count: attr[1].Total }]
          : [
              {
                traitType: 'Country',
                value: attr[0],
                count:
                  nftFilters.workspace?.value && attr[1].Workspace ? attr[1].Workspace[nftFilters.workspace?.value] : 0,
              },
            ]
        : accum.Country
        ? [...accum.Country, { traitType: 'Country', value: attr[0], count: attr[1].Total }]
        : [{ traitType: 'Country', value: attr[0], count: attr[1].Total }],
    }),
    {} as any,
  )
  const cities = Object.entries(CITIES)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      City: nftFilters.workspace
        ? accum.City
          ? [...accum.City, { traitType: 'City', value: attr[0], count: attr[1].Total }]
          : [
              {
                traitType: 'City',
                value: attr[0],
                count:
                  nftFilters.workspace.value && attr[1].Workspace ? attr[1].Workspace[nftFilters.workspace.value] : 0,
              },
            ]
        : accum.City
        ? [...accum.City, { traitType: 'City', value: attr[0], count: attr[1].Total }]
        : [{ traitType: 'City', value: attr[0], count: attr[1].Total }],
    }),
    {} as any,
  )
  // .filter((item) => nftFilters.workspace ? item[1].Workspace === nftFilters.workspace?.value : true)
  const productsHome = Object.entries(PRODUCTS)?.reduce(
    (accum: any, attr: any) => ({
      ...accum,
      Product: nftFilters.city
        ? accum.Product
          ? [...accum.Product, { traitType: 'Product', value: attr[0], count: attr[1].City[nftFilters.city.value] }]
          : [
              {
                traitType: 'Product',
                value: attr[0],
                count: nftFilters.city.value ? attr[1].City[nftFilters.city.value] : 0,
              },
            ]
        : nftFilters.country
        ? accum.Product
          ? [
              ...accum.Product,
              { traitType: 'Product', value: attr[0], count: attr[1].Country[nftFilters.country.value] },
            ]
          : [
              {
                traitType: 'Product',
                value: attr[0],
                count: nftFilters.country.value ? attr[1].Country[nftFilters.country.value] : 0,
              },
            ]
        : accum.Product
        ? [...accum.Product, { traitType: 'Product', value: attr[0], count: attr[1].Total }]
        : [{ traitType: 'Product', value: attr[0], count: attr[1].Total }],
    }),
    {} as any,
  )
  const workspaceItems: Item[] = workspaces.Workspace.map((attr) => ({
    label: attr.value as string,
    count: attr.count ? attr.count : undefined,
    attr,
  }))
  const countryItems: Item[] = countries.Country.map((attr) => ({
    label: capitalize(attr.value as string),
    count: attr.count ? attr.count : undefined,
    attr,
  }))
  const cityItems: Item[] = cities.City.map((attr) => ({
    label: attr.value as string,
    count: attr.count ? attr.count : undefined,
    attr,
  }))
  const productItems: Item[] = productsHome.Product?.map((attr) => ({
    label: attr.value as string,
    count: attr.count ? attr.count : undefined,
    attr,
  }))

  return (
    <>
      <ScrollableFlexContainer>
        {showWorkspace && (
          <ListTraitFilter2
            key="workspace"
            title={capitalize('workspace')}
            traitType="workspace"
            items={workspaceItems}
            nftFilters={nftFilters}
            setNftFilters={setNftFilters}
          />
        )}
        {showCountry && (
          <ListTraitFilter
            key="country"
            title={capitalize('country')}
            traitType="country"
            items={countryItems}
            nftFilters={nftFilters}
            setNftFilters={setNftFilters}
            collectionAddress={ADDRESS_ZERO}
          />
        )}
        {showCity && (
          <ListTraitFilter
            key="city"
            title={capitalize('city')}
            traitType="city"
            items={cityItems}
            nftFilters={nftFilters}
            setNftFilters={setNftFilters}
            collectionAddress={ADDRESS_ZERO}
          />
        )}
        {showProduct && (
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
