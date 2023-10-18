import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Card, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { CollectionCard } from '../../components/CollectibleCard'
import { cancanBaseUrl } from '../../constants'

const CardWrapper = styled(Flex)`
  display: inline-block;
  align-iterms: center;
  justify-content: center;
  min-width: 390px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`
const Wrapper = styled(Flex)`
  padding: 16px;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
  width: 400%;
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

const DataCard = ({ wallName, paywall }) => {
  const { t } = useTranslation()
  return (
    <CardWrapper>
      <TopMoverCard>
        <CollectionCard
          key={paywall?.id}
          bgSrc={paywall?.collection?.small}
          avatarSrc={paywall?.collection?.avatar}
          collectionName={paywall?.collection?.name}
        >
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle">
              {t('Wall Name: %wallName%', { wallName: wallName ?? '' })}
            </Text>
          </Flex>
          <Flex mb="2px" justifyContent="flex-end">
            <LinkExternal href={`${cancanBaseUrl}/collections/${paywall?.collection?.id}`} bold={false} small>
              {t('See Channel')}
            </LinkExternal>
          </Flex>
        </CollectionCard>
      </TopMoverCard>
    </CardWrapper>
  )
}

const Cart: React.FC<any> = ({ mirrors }) => {
  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)
  const { t } = useTranslation()
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
  return (
    <Card my="6px" style={{ width: '100%' }}>
      <Wrapper>
        <Text>{t('Partner Paywalls')}</Text>
      </Wrapper>
      <ScrollableRow ref={increaseRef}>
        {mirrors?.map((mirror) => (
          <DataCard
            key={`partner-wall-${mirror?.id}`}
            wallName={mirror?.id?.split('-')?.length ? mirror?.id?.split('-')[2] : ''}
            paywall={mirror.sharedPaywall}
          />
        ))}
      </ScrollableRow>
    </Card>
  )
}

export default Cart
