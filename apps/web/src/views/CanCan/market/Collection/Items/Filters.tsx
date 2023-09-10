import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, ButtonMenu, ButtonMenuItem, Flex, Grid, Text, CommunityIcon } from '@pancakeswap/uikit'
import capitalize from 'lodash/capitalize'
import isEmpty from 'lodash/isEmpty'
import { useGetNftFilters, useGetNftShowOnlyOnSale, useGetNftShowOnlyUsers } from 'state/cancan/hooks'
import { NftAttribute } from 'state/cancan/types'
import { useTranslation } from '@pancakeswap/localization'
import { Item, ListTraitFilter } from 'views/CanCan/market/components/Filters'
import { useNftStorage } from 'state/cancan/storage'
import groupBy from 'lodash/groupBy'
import { FcHome } from 'react-icons/fc'
import { FaHandshake } from 'react-icons/fa'
import useGetCollectionDistribution from '../../hooks/useGetCollectionDistribution'

import TagFilters from './TagFilters'
import SortSelect from './SortSelect'

interface FiltersProps {
  address: string
  collection: any
  setDisplayText: (string) => void
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

const Filters: React.FC<React.PropsWithChildren<FiltersProps>> = ({ address, collection, setDisplayText }) => {
  // const { data } = useGetCollectionDistribution(address)
  const { t } = useTranslation()
  const showOnlyNftsUsers = useGetNftShowOnlyUsers(address)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(address)
  const { setShowOnlyOnSale, setShowOnlyUsers } = useNftStorage()
  const [, setActiveButtonIndex] = useState(showOnlyNftsOnSale ? 1 : 0)

  useEffect(() => {
    if (showOnlyNftsOnSale && !showOnlyNftsUsers) {
      setActiveButtonIndex(1)
      setDisplayText(t('Partners'))
    } else if (!showOnlyNftsOnSale && showOnlyNftsUsers) {
      setActiveButtonIndex(2)
      setDisplayText(t('Users'))
    } else {
      setActiveButtonIndex(0)
      setDisplayText(t('Home'))
    }
  }, [setActiveButtonIndex, showOnlyNftsOnSale, showOnlyNftsUsers, setDisplayText, t])

  const onActiveButtonChange = (newIndex: number) => {
    if (newIndex === 0) {
      setShowOnlyOnSale({ collection: address, showOnlyOnSale: false })
      setShowOnlyUsers({ collection: address, showOnlyUsers: false })
    } else if (newIndex === 1) {
      setShowOnlyOnSale({ collection: address, showOnlyOnSale: true })
      setShowOnlyUsers({ collection: address, showOnlyUsers: false })
    } else if (newIndex === 2) {
      setShowOnlyOnSale({ collection: address, showOnlyOnSale: false })
      setShowOnlyUsers({ collection: address, showOnlyUsers: true })
    }
  }

  return (
    <GridContainer>
      <FilterByTitle textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
        {t('Filter by')}
      </FilterByTitle>
      <FilterByControls>
        <ButtonMenu
          scale="sm"
          activeIndex={!showOnlyNftsOnSale && showOnlyNftsUsers ? 2 : showOnlyNftsOnSale && !showOnlyNftsUsers ? 1 : 0}
          onItemClick={onActiveButtonChange}
        >
          <ButtonMenuItem className="tour-2">
            <FcHome />
          </ButtonMenuItem>
          <ButtonMenuItem className="tour-3">
            <FaHandshake color="#280D5F" />
          </ButtonMenuItem>
          <ButtonMenuItem className="tour-4">
            <CommunityIcon />
          </ButtonMenuItem>
        </ButtonMenu>
      </FilterByControls>
      <Box className="tour-5">
        <TagFilters address={address} collection={collection} />
      </Box>
      <SortByTitle fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
        {t('Sort By')}
      </SortByTitle>
      <SortByControls>
        <SortSelect collectionAddress={address} />
      </SortByControls>
    </GridContainer>
  )
}

export default Filters
