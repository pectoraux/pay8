import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'state'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Box,
  Button,
  Flex,
  Table,
  Text,
  Th,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { getCollectionActivity } from 'state/cancan/helpers'
import Container from 'components/Layout/Container'
import TableLoader from 'components/TableLoader'
import { Collection } from 'state/cancan/types'
import { useTranslation } from '@pancakeswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import useTheme from 'hooks/useTheme'
import { useLastUpdated } from '@pancakeswap/hooks'
import { useGetNftActivityFilters } from 'state/cancan/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { Arrow, PageButtons } from '../components/PaginationButtons'
import NoNftsImage from '../components/Activity/NoNftsImage'
import ActivityFilters from './ActivityFilters'
import ActivityRow from '../components/Activity/ActivityRow'
import { sortActivity } from './utils/sortActivity'
import MintExternalModal from '../Collection/MintExternalModal'

const MAX_PER_PAGE = 8

const MAX_PER_QUERY = 100

interface ActivityHistoryProps {
  collection?: Collection
}

const ActivityHistory: React.FC<any> = ({ collection }) => {
  const dispatch = useAppDispatch()
  const { id: collectionAddress } = collection || { address: '' }
  const collectionId = useRouter().query.collectionAddress as string
  const nftActivityFilters = useGetNftActivityFilters(collectionAddress)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [paginationData, setPaginationData] = useState<any>({
    activity: [],
    currentPage: 1,
    maxPage: 1,
  })
  const [activitiesSlice, setActivitiesSlice] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [queryPage, setQueryPage] = useState(1)
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
  const bnbBusdPrice = useBNBBusdPrice()
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const { chainId } = useActiveChainId()

  const nftActivityFiltersString = JSON.stringify(nftActivityFilters)
  useEffect(() => {
    const fetchCollectionActivity = async () => {
      try {
        setIsLoading(true)
        const nftActivityFiltersParsed = JSON.parse(nftActivityFiltersString)
        const collectionActivity = await getCollectionActivity(
          chainId,
          collectionId,
          nftActivityFiltersParsed,
          MAX_PER_QUERY,
        )
        const activity = sortActivity(collectionActivity)?.filter((_activity) => _activity?.item ?? _activity?.paywall)
        setPaginationData({
          activity,
          currentPage: 1,
          maxPage: Math.ceil(activity.length / MAX_PER_PAGE) || 1,
        })
        setIsLoading(false)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to fetch collection activity============>', error)
      }
    }

    // if ((collectionAddress && isAddress(collectionAddress)) || collectionAddress === '') {
    fetchCollectionActivity()
    // }
  }, [dispatch, collectionId, collectionAddress, nftActivityFiltersString, lastUpdated, chainId])

  useEffect(() => {
    const slice = paginationData.activity?.slice(
      MAX_PER_PAGE * (paginationData.currentPage - 1),
      MAX_PER_PAGE * paginationData.currentPage,
    )
    setActivitiesSlice(slice)
  }, [paginationData])

  const marketHistoryNotFound = paginationData.activity.length === 0 && activitiesSlice.length === 0 && !isLoading

  const pagination = marketHistoryNotFound ? null : (
    <Container>
      <Flex
        borderTop={`1px ${theme.colors.cardBorder} solid`}
        pt="24px"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <PageButtons>
          <Arrow
            onClick={() => {
              if (paginationData.currentPage !== 1) {
                setPaginationData((prevState) => ({
                  ...prevState,
                  currentPage: prevState.currentPage - 1,
                }))
              }
            }}
          >
            <ArrowBackIcon color={paginationData.currentPage === 1 ? 'textDisabled' : 'primary'} />
          </Arrow>
          <Text>
            {t('Page %page% of %maxPage%', {
              page: paginationData.currentPage,
              maxPage: paginationData.maxPage,
            })}
          </Text>
          <Arrow
            onClick={async () => {
              if (paginationData.currentPage !== paginationData.maxPage) {
                setPaginationData((prevState) => ({
                  ...prevState,
                  currentPage: prevState.currentPage + 1,
                }))

                if (
                  paginationData.maxPage - paginationData.currentPage === 1 &&
                  paginationData.activity.length === MAX_PER_QUERY * queryPage
                ) {
                  try {
                    setIsLoading(true)
                    const nftActivityFiltersParsed = JSON.parse(nftActivityFiltersString)
                    const collectionActivity = await getCollectionActivity(
                      chainId,
                      collectionAddress.toLowerCase(),
                      nftActivityFiltersParsed,
                      MAX_PER_QUERY * (queryPage + 1),
                    )
                    const activity = sortActivity(collectionActivity)
                    setPaginationData((prevState) => {
                      return {
                        ...prevState,
                        activity,
                        maxPage: Math.ceil(activity.length / MAX_PER_PAGE) || 1,
                      }
                    })
                    setIsLoading(false)
                    setQueryPage((prevState) => prevState + 1)
                  } catch (error) {
                    console.error('Failed to fetch collection activity=======>', error)
                  }
                }
              }
            }}
          >
            <ArrowForwardIcon
              color={paginationData.currentPage === paginationData.maxPage ? 'textDisabled' : 'primary'}
            />
          </Arrow>
        </PageButtons>
      </Flex>
    </Container>
  )
  return (
    <Box py="32px">
      <Container px={[0, null, '94px']}>{show && <MintExternalModal collection={collection} />}</Container>
      <Container px={[0, null, '24px']}>
        <Flex
          style={{ gap: '16px', padding: '0 16px' }}
          alignItems={[null, null, 'center']}
          flexDirection={['column', 'column', 'row']}
          flexWrap={isMd ? 'wrap' : 'nowrap'}
        >
          <ActivityFilters collection={collection} isMd={isMd} nftActivityFilters={nftActivityFilters} />
          <Button
            scale="sm"
            variant={show ? 'danger' : 'primary'}
            onClick={() => {
              setShow(!show)
            }}
            {...(isMd && { width: '100%' })}
          >
            {!show ? t('Record External Sale') : t('Close')}
          </Button>
          <Button
            scale="sm"
            disabled={isLoading}
            onClick={() => {
              refresh()
            }}
            {...(isMd && { width: '100%' })}
          >
            {t('Refresh')}
          </Button>
        </Flex>
      </Container>
      <Container style={{ overflowX: 'auto' }}>
        {marketHistoryNotFound ? (
          <Flex p="24px" flexDirection="column" alignItems="center">
            <NoNftsImage />
            <Text pt="8px" bold>
              {t('No Item market history found')}
            </Text>
          </Flex>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <Th textAlign={['center', null, 'left']}> {t('Item')}</Th>
                  <Th textAlign="right"> {t('Event')}</Th>
                  {isXs || isSm ? null : (
                    <>
                      <Th textAlign="right"> {t('Price')}</Th>
                      <Th textAlign="center"> {t('From')}</Th>
                      <Th textAlign="center"> {t('To')}</Th>
                    </>
                  )}
                  <Th textAlign="center"> {t('Date')}</Th>
                  {isXs || isSm ? null : <Th />}
                </tr>
              </thead>

              <tbody>
                {!isInitialized ? (
                  <TableLoader />
                ) : (
                  activitiesSlice?.map((activity) => {
                    const nft = activity?.item ?? activity?.paywall
                    return (
                      <ActivityRow
                        key={`${activity.marketEvent}#${nft?.tokenId}#${activity.timestamp}#${activity.tx}`}
                        activity={activity}
                        nft={nft}
                        collection={collection}
                        bnbBusdPrice={bnbBusdPrice}
                      />
                    )
                  })
                )}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      {pagination}
    </Box>
  )
}

export default ActivityHistory
