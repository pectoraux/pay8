import { useAccount } from 'wagmi'
import { Heading, Flex, Image, Text, PageHeader, Pool, ArrowForwardIcon, Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector, useGetTags, useFilters } from 'state/valuepools/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { useCallback, useState } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import CreateValuepoolModal from './components/CreateValuepoolModal'
import Filters from './Filters'
import Steps from './Steps'
import Questions from './components/Questions'
import { useGetCollection } from 'state/cancan/hooks'

const DesktopButton = styled(Button)`
  align-self: flex-end;
`
const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools } = usePoolsWithFilterSelector()
  console.log('pools=============>', pools)
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])
  const [onPresentCreateGauge] = useModal(<CreateValuepoolModal currency={currency} />)
  const nftFilters = useFilters()
  const tags = useGetTags()
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const { collection } = useGetCollection(collectionAddress)

  const handleClick = () => {
    const howToElem = document.getElementById('how-to')
    if (howToElem != null) {
      howToElem.scrollIntoView()
    } else {
    }
  }
  usePoolsPageFetch()
  const valuepools = collection?.valuepools?.map((vp) => vp.valuepool)
  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Value Pools')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Browse communities and open an account in one closest to your needs.')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Create an account or a new ValuePool for your own community.')}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentCreateGauge} bold fontSize="16px" mr="4px">
                  {t('Create contract ')}{' '}
                </Text>
                <CurrencyInputPanel
                  id="valuepool-currency"
                  showUSDPrice
                  showMaxButton
                  showCommonBases
                  showInput={false}
                  showQuickInputButton
                  currency={currency ?? inputCurency}
                  onCurrencySelect={handleInputSelect}
                />
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
        <PoolControls
          pools={pools?.filter((pool) => !collectionAddress || valuepools?.includes(pool?.id?.toLowerCase()))}
        >
          {({ chosenPools }) => (
            <>
              <Pool.PoolsTable>
                {chosenPools.map((pool) => (
                  <PoolRow initialActivity={false} key={pool.sousId} id={pool.id} account={account} />
                ))}
              </Pool.PoolsTable>
            </>
          )}
        </PoolControls>
        <Steps title={t('How does it work ?')} />
        <Questions />
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}

export default Pools
