import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Flex, Card, Text, Table, Th, ArrowBackIcon, ArrowForwardIcon, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { Activity, NftToken } from 'state/nftMarket/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { useAppDispatch } from '../../../../../../state'
import NoNftsImage from '../../../components/Activity/NoNftsImage'
import TableLoader from '../../../../../../components/TableLoader'
import { Arrow, PageButtons } from '../../../components/PaginationButtons'
import { getTokenActivity } from '../../../../../../state/cancan/helpers'
import { sortActivity } from '../../../ActivityHistory/utils/sortActivity'
import ActivityRow from '../../../components/Activity/ActivityRow'

interface ActivityCardProps {
  nft: NftToken
}

const MAX_PER_PAGE = 5

const ActivityCard: React.FC<any> = ({ nft }) => {
  const dispatch = useAppDispatch()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [activitiesSlice, setActivitiesSlice] = useState<any>([])
  const [sortedTokenActivities, setSortedTokenActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const bnbBusdPrice = useBNBBusdPrice()
  const { isXs, isSm } = useMatchBreakpoints()
  const collectionId = useRouter().query.collectionAddress as string
  const { chainId } = useActiveChainId()

  useEffect(() => {
    const fetchTokenActivity = async () => {
      try {
        const tokenActivity = await getTokenActivity(chainId, nft.tokenId, collectionId)
        console.log('tokenActivity============>', tokenActivity)
        setSortedTokenActivities(sortActivity(tokenActivity))
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch address activity', error)
      }
    }

    fetchTokenActivity()
  }, [nft, dispatch, chainId, collectionId])

  useEffect(() => {
    const getMaxPages = () => {
      const max = Math.ceil(sortedTokenActivities.length / MAX_PER_PAGE)
      setMaxPages(max)
    }

    if (sortedTokenActivities.length > 0) {
      getMaxPages()
    }

    return () => {
      setActivitiesSlice([])
      setMaxPages(1)
      setCurrentPage(1)
    }
  }, [sortedTokenActivities])

  useEffect(() => {
    const getActivitySlice = () => {
      const slice = sortedTokenActivities.slice(MAX_PER_PAGE * (currentPage - 1), MAX_PER_PAGE * currentPage)
      setActivitiesSlice(slice)
    }
    if (sortedTokenActivities.length > 0) {
      getActivitySlice()
    }
  }, [sortedTokenActivities, currentPage])

  return (
    <Card>
      {sortedTokenActivities.length === 0 && activitiesSlice.length === 0 && !isLoading ? (
        <Flex p="24px" flexDirection="column" alignItems="center">
          <NoNftsImage />
          <Text pt="8px" bold>
            {t('No market history found for this item')}
          </Text>
        </Flex>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th textAlign="center"> {t('Event')}</Th>
                {isXs || isSm ? null : (
                  <>
                    <Th textAlign="right"> {t('Price')}</Th>
                    <Th textAlign="center"> {t('From/By')}</Th>
                    <Th textAlign="center"> {t('To')}</Th>
                  </>
                )}
                <Th textAlign="center"> {t('Date')}</Th>
                {isXs || isSm ? null : <Th />}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <TableLoader />
              ) : (
                activitiesSlice.map((activity) => {
                  return (
                    <ActivityRow
                      key={`${activity?.nft?.tokenId}${activity.timestamp}`}
                      activity={activity}
                      nft={nft}
                      bnbBusdPrice={bnbBusdPrice}
                      isNftActivity
                    />
                  )
                })
              )}
            </tbody>
          </Table>
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
                  setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1)
                }}
              >
                <ArrowBackIcon color={currentPage === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
              <Text>{t('Page %page% of %maxPage%', { page: currentPage, maxPage })}</Text>
              <Arrow
                onClick={() => {
                  setCurrentPage(currentPage === maxPage ? currentPage : currentPage + 1)
                }}
              >
                <ArrowForwardIcon color={currentPage === maxPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </PageButtons>
          </Flex>
        </>
      )}
    </Card>
  )
}

export default ActivityCard
