import { useAccount } from 'wagmi'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import { Heading, Flex, Text, PageHeader, Pool, ArrowForwardIcon, Button, useModal, Loading } from '@pancakeswap/uikit'
import {
  useFilters,
  useGetFiatPrice,
  useGetNativePrice,
  useGetTags,
  usePoolsPageFetch,
  usePoolsWithFilterSelector,
} from 'state/ramps/hooks'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import CreateRampModal from './components/CreateRampModal'

import Filters from './Filters'
import Steps from './Steps'
import Questions from './components/Questions'

const DesktopButton = styled(Button)`
  align-self: flex-end;
`
// factor1 * native_price => usd_price
// factor2 * usd_price => euro_price
// factor2 * factor1 * native_price => euro_price
// factor = factor2 * factor1
//  factor * native_price => euro_price
const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  const [onPresentCreateGauge] = useModal(<CreateRampModal />)
  const nftFilters = useFilters()
  const tags = useGetTags()
  const { data: priceInfo } = useGetFiatPrice('EUR', '2601b11ce6msha2179cbbc81731ep1412dbjsn65af7e46f8cd')
  const { data: priceInfo2 } = useGetNativePrice('BTC', '2601b11ce6msha2179cbbc81731ep1412dbjsn65af7e46f8cd')
  console.log('pools=============>', pools, tags, priceInfo, priceInfo2)
  console.log(
    '2pools=============>',
    priceInfo['Realtime Currency Exchange Rate'],
    priceInfo2['Realtime Currency Exchange Rate'],
  )
  console.log(
    '3pools=============>',
    priceInfo['Realtime Currency Exchange Rate']['Exchange Rate'],
    priceInfo2['Realtime Currency Exchange Rate']['Exchange Rate'],
  )
  const handleClick = () => {
    const howToElem = document.getElementById('how-to')
    if (howToElem != null) {
      howToElem.scrollIntoView()
    }
  }
  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Decentralized Ramp Contracts')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Transfer value on and off the platform')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Make money helping people transfer value on and off the platform')}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentCreateGauge} bold fontSize="16px" mr="4px">
                  {t('Deploy Ramp')}{' '}
                </Text>
              </Button>
              <ArrowForwardIcon onClick={onPresentCreateGauge} color="primary" />
            </Flex>
          </Flex>
          <Flex justifyContent="flex-end" alignItems="flex-end">
            <Filters tags={tags} workspace={false} nftFilters={nftFilters} />
          </Flex>
          <DesktopButton onClick={handleClick} variant="subtle">
            {t('How does it work?')}
          </DesktopButton>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls pools={pools}>
          {({ chosenPools, normalizedUrlSearch }) => (
            <>
              {!userDataLoaded && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )}
              <Pool.PoolsTable>
                {chosenPools.map((pool) => (
                  <PoolRow
                    initialActivity={normalizedUrlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
                    key={pool.sousId}
                    sousId={pool.sousId}
                    account={account}
                  />
                ))}
              </Pool.PoolsTable>
            </>
          )}
        </PoolControls>
        <Steps title={t('How to create my own ramp ?')} onPresentCreateGauge={onPresentCreateGauge} />
        <Questions />
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}

export default Pools
