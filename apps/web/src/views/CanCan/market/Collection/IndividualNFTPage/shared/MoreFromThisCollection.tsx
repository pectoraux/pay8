import { useGetCollection } from 'state/cancan/hooks'
import { useState, useMemo, ReactNode } from 'react'
import shuffle from 'lodash/shuffle'
import styled from 'styled-components'
import { useRouter } from 'next/router'
// eslint-disable-next-line import/no-unresolved
import { Swiper, SwiperSlide } from 'swiper/react'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/bundle'
import SwiperCore from 'swiper'
import { ArrowBackIcon, ArrowForwardIcon, Box, IconButton, Text, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import Trans from 'components/Trans'
// eslint-disable-next-line lodash/import-scope
import { orderBy } from 'lodash'
import { CollectibleLinkCard } from '../../../components/CollectibleCard'

const INITIAL_SLIDE = 4

const SwiperCircle = styled.div<{ isActive }>`
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.textDisabled)};
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 50%;
  cursor: pointer;
`

const StyledSwiper = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    .swiper-wrapper {
      max-height: 750px;
    }
  }
`

interface MoreFromThisCollectionProps {
  collectionAddress: string
  nft?: any
  title?: ReactNode
}

const MoreFromThisCollection: React.FC<React.PropsWithChildren<MoreFromThisCollectionProps>> = ({
  collectionAddress,
  nft,
  title = <Trans>More from this collection</Trans>,
}) => {
  const { paywallId } = useRouter().query as any
  const { collection } = useGetCollection(collectionAddress)
  const [swiperRef, setSwiperRef] = useState<SwiperCore>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const { isMobile, isMd, isLg } = useMatchBreakpoints()

  let nftsToShow = useMemo(() => {
    const paywall = collection?.paywalls?.find((p) => p.tokenId?.toLowerCase() === paywallId?.toLowerCase())
    const paywallItems = orderBy(paywall?.mirrors, 'createdAt', 'asc')?.map((mirror) => mirror.item)
    if (paywallItems?.length) {
      return paywallItems
    }
    const fromWorkspace = collection?.items?.filter(
      (thisNft) => thisNft.tokenId !== nft.tokenId && thisNft.workspace === nft.workspace,
    )
    const res =
      shuffle(
        fromWorkspace?.length ? fromWorkspace : collection?.items?.filter((thisNft) => thisNft.tokenId !== nft.tokenId),
      ) ?? []
    if (!collection?.paywalls) return [...res]
    return [...res, ...collection?.paywalls]
    return []
  }, [collection?.items, collection?.paywalls, nft.tokenId, nft.workspace, paywallId])

  if (!nftsToShow || nftsToShow.length === 0) {
    return null
  }

  let slidesPerView = 4
  let maxPageIndex = 3

  if (isMd) {
    slidesPerView = 2
    maxPageIndex = 6
  }

  if (isLg) {
    slidesPerView = 3
    maxPageIndex = 4
  }

  nftsToShow = nftsToShow.slice(0, 12)

  const nextSlide = () => {
    if (activeIndex < maxPageIndex - 1) {
      setActiveIndex((index) => index + 1)
      swiperRef.slideNext()
    }
  }

  const previousSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((index) => index - 1)
      swiperRef.slidePrev()
    }
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index / slidesPerView)
    swiperRef.slideTo(index)
  }

  const updateActiveIndex = ({ activeIndex: newActiveIndex }) => {
    if (newActiveIndex !== undefined) setActiveIndex(Math.ceil(newActiveIndex / slidesPerView))
  }

  return (
    <Box pt="56px" mb="52px">
      {title && (
        <Text bold mb="24px">
          {title}
        </Text>
      )}
      {isMobile ? (
        <StyledSwiper>
          <Swiper spaceBetween={16} slidesPerView={1.5}>
            {nftsToShow?.map((_nft) => (
              <SwiperSlide key={_nft.tokenId}>
                <CollectibleLinkCard nft={_nft} />
              </SwiperSlide>
            ))}
          </Swiper>
        </StyledSwiper>
      ) : (
        <StyledSwiper>
          <Swiper
            onSwiper={setSwiperRef}
            onActiveIndexChange={updateActiveIndex}
            spaceBetween={16}
            slidesPerView={slidesPerView}
            slidesPerGroup={slidesPerView}
            initialSlide={INITIAL_SLIDE}
          >
            {nftsToShow?.map((_nft) => {
              const currentAskPriceAsNumber = _nft && parseFloat(_nft?.currentAskPrice)
              return (
                <SwiperSlide key={_nft.tokenId}>
                  <CollectibleLinkCard
                    key={_nft?.tokenId}
                    nft={_nft}
                    paywallId={paywallId}
                    // referrer={owner?.toLowerCase() !== nft?.currentSeller?.toLowerCase() && nft?.currentSeller}
                    currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
                  />
                </SwiperSlide>
              )
            })}
          </Swiper>
          <Flex mt="16px" alignItems="center" justifyContent="center">
            <IconButton variant="text" onClick={previousSlide}>
              <ArrowBackIcon />
            </IconButton>
            {[...Array(maxPageIndex).keys()].map((index) => (
              <SwiperCircle
                key={index}
                onClick={() => goToSlide(index * slidesPerView)}
                isActive={activeIndex === index}
              />
            ))}
            <IconButton variant="text" onClick={nextSlide}>
              <ArrowForwardIcon />
            </IconButton>
          </Flex>
        </StyledSwiper>
      )}
    </Box>
  )
}

export default MoreFromThisCollection
