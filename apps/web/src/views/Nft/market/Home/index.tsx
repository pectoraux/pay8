import styled from 'styled-components'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useState, useCallback, useMemo } from 'react'
import { Box, Button, Flex, Heading, PageHeader, NextLinkFromReactRouter, PageSection } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import SectionsWithFoldableText from 'components/FoldableSection/SectionsWithFoldableText'
import { PageMeta } from 'components/Layout/Page'
import { useGetCollections } from 'state/cancan/hooks'
import { FetchStatus } from 'config/constants/types'
import PageLoader from 'components/Loader/PageLoader'
import useTheme from 'hooks/useTheme'
import orderBy from 'lodash/orderBy'
import latinise from '@pancakeswap/utils/latinise'
import TagFilters from 'views/CanCan/market/Collection/Items/TagFilters'

import SearchBar from '../components/SearchBar'
import Collections from './Collections'
import Newest from './Newest'
import config from './config'

const Gradient = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
`

const StyledPageHeader = styled(PageHeader)`
  margin-bottom: -40px;
  padding-bottom: 40px;
`

const StyledHeaderInner = styled(Flex)`
  padding-bottom: 14px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  & div:nth-child(1) {
    order: 1;
  }
  & div:nth-child(2) {
    order: 0;
    margin-bottom: 32px;
    align-self: end;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    & div:nth-child(1) {
      order: 0;
    }
    & div:nth-child(2) {
      order: 1;
      margin-bottom: 0;
      align-self: auto;
    }
  }
`
const DesktopButton = styled(Button)`
  align-self: flex-end;
`

const Home = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const where1 = useMemo(() => (searchQuery ? { name_contains_nocase: searchQuery } : {}), [searchQuery])
  const where2 = useMemo(() => (searchQuery ? { description_contains_nocase: searchQuery } : {}), [searchQuery])
  const { data: data1, status: status1 } = useGetCollections(where1)
  const { data: data2, status: status2 } = useGetCollections(where2)
  const data = data1?.length ? data1 : data2
  const status = data1?.length ? status1 : status2
  const collections = data as any
  const handleClick = () => {
    const howToElem = document.getElementById('how-to')
    if (howToElem != null) {
      howToElem.scrollIntoView()
    }
  }
  const handleChangeSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value),
    [],
  )
  const searchedHotCollections = useMemo(() => {
    const hotCollections = orderBy(
      collections,
      (collection) => (collection.totalVolumeBNB ? parseFloat(collection.totalVolumeBNB) : 0),
      'desc',
    )
    const newData = hotCollections.filter((hotCollection) => {
      if (searchQuery) {
        const lowercaseQuery = latinise(searchQuery.toLowerCase())
        return latinise(hotCollection.name.toLowerCase()).includes(lowercaseQuery)
      }
      return hotCollection
    })
    return newData
  }, [status, collections, searchQuery])

  const searchedNewestCollections = useMemo(() => {
    const newestCollections = orderBy(
      collections,
      (collection) => (collection.createdAt ? Date.parse(collection.createdAt) : 0),
      'desc',
    )
    const newData = newestCollections.filter((newestCollection) => {
      if (searchQuery) {
        const lowercaseQuery = latinise(searchQuery.toLowerCase())
        return latinise(newestCollection.name.toLowerCase()).includes(lowercaseQuery)
      }
      return newestCollection
    })
    return newData
  }, [status, collections, searchQuery])

  return (
    <>
      <PageMeta />
      <StyledPageHeader>
        <StyledHeaderInner>
          <div>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              eCollectibles
            </Heading>
            <Heading scale="lg" color="text">
              {t('Buy and Sell digital collectibles.')}
            </Heading>
            {account && (
              <Button as={NextLinkFromReactRouter} to={`/profile/${account.toLowerCase()}`} mt="32px">
                {t('Manage Profile')}
              </Button>
            )}
          </div>
          <Flex justifyContent="flex-end" alignItems="flex-end">
            <SearchBar onChange={handleChangeSearchQuery} />
          </Flex>
        </StyledHeaderInner>
        <TagFilters address={ADDRESS_ZERO} />
        <DesktopButton mt="14px" onClick={handleClick} variant="subtle">
          {t('How does it work?')}
        </DesktopButton>
      </StyledPageHeader>
      {status !== FetchStatus.Fetched ? (
        <PageLoader />
      ) : (
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          background={theme.colors.background}
          index={1}
          concaveDivider
          dividerPosition="top"
        >
          <Collections
            key="newest-collections"
            title={t('Newest Collections')}
            testId="nfts-newest-collections"
            collections={searchedNewestCollections}
          />
          <Collections
            key="hot-collections"
            title={t('Hot Collections')}
            testId="nfts-hot-collections"
            collections={searchedHotCollections}
          />
          <Newest />
        </PageSection>
      )}
      <Gradient p="64px 0">
        <SectionsWithFoldableText id="how-to" header={t('FAQs')} config={config(t)} m="auto" />
      </Gradient>
    </>
  )
}

export default Home
