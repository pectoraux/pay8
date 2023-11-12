import { useRef, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Card, NextLinkFromReactRouter, SearchInput } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import PreviewImage from 'views/Nft/market/components/CollectibleCard/PreviewImage'
import { RoundedImage } from 'views/Nft/market/Collection/IndividualNFTPage/shared/styles'
import { useFilters2 as useFilters } from 'state/valuepools/hooks'
import Filters2 from 'views/ValuePools/Filters2'

const CardWrapper = styled(NextLinkFromReactRouter)`
  display: inline-block;
  min-width: 190px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const TopMoverCard = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 16px;
`

export const ScrollableRow = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px 0;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`
const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const DataCard: React.FC<any> = ({ sponsor }) => {
  return (
    <CardWrapper to={`/cancan/collections/${sponsor.collection?.id}`}>
      <Flex flexDirection="column" justifyContent="center" alignSelf="center">
        <RoundedImage
          width={200}
          height={200}
          src={sponsor?.collection?.avatar}
          // alt={sponsor?.collection?.name}
          as={PreviewImage}
        />
        <Text fontSize={10} width="200px" style={{ whiteSpace: 'break-spaces' }}>
          {sponsor?.collection?.description}
        </Text>
      </Flex>
    </CardWrapper>
  )
}

const Cart: React.FC<any> = ({ pool, sponsors }) => {
  const { t } = useTranslation()

  const nftFilters = useFilters()
  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)
  console.log('DataCard==============+>', nftFilters, sponsors)

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (increaseRef.current) {
        if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
          moveLeftRef.current = false
        } else if (increaseRef.current.scrollLeft === 0) {
          moveLeftRef.current = true
        }
        increaseRef.current.scrollTo(
          moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1,
          0,
        )
      }
    }, 30)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index
  }

  function treatTag(tag) {
    return tag
      ?.split(' ')
      ?.filter((tg) => !!tg)
      ?.map((tg) => tg?.split(','))
      ?.flat()
  }
  function filterSponsors(sponsor) {
    return (
      (!nftFilters?.country ||
        nftFilters?.country.includes('All') ||
        nftFilters?.country.filter((value) =>
          sponsor?.collection?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length) &&
      (!nftFilters?.city ||
        nftFilters?.city.includes('All') ||
        nftFilters?.city.filter((value) =>
          sponsor?.collection?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length > 0) &&
      (!nftFilters?.product ||
        nftFilters?.product.filter((value) =>
          treatTag(sponsor?.collection?.products?.toLowerCase())?.filter(onlyUnique)?.includes(value?.toLowerCase()),
        )?.length > 0)
    )
  }

  let tags = []
  sponsors?.map((sponsor) => {
    tags = [...sponsor?.collection?.products?.split(','), ...tags]
  })
  tags = [...tags?.map((tag) => tag?.split(' ')?.filter((tg) => !!tg))?.filter((tg) => tg?.length)]?.flat()
  tags = tags?.filter(onlyUnique)
  console.log('useFilters=================>', nftFilters, tags)
  return (
    <Card my="6px" style={{ width: '100%' }}>
      <Text ml="16px" mt="8px" color="primary">
        {t('Valuepool Sponsors')}
      </Text>
      <Flex justifyContent="flex-end" alignItems="flex-end">
        <Filters2 tags={tags?.toString()} workspace={false} nftFilters={nftFilters} />
      </Flex>
      <ScrollableRow ref={increaseRef}>
        {sponsors.filter(filterSponsors).map((sponsor) => (
          <DataCard sponsor={sponsor} />
        ))}
      </ScrollableRow>
    </Card>
  )
}

export default Cart
