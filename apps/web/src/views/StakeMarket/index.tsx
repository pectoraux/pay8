import { useAccount } from 'wagmi'
import { Heading, Flex, Text, PageHeader, Pool, ArrowForwardIcon, Button, useModal, Loading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector, useGetTags, useFilters } from 'state/stakemarket/hooks'
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
import CreateStakeModal from './components/CreateStakeModal'
import Filters from './Filters'
import Steps from './Steps'
import Questions from './components/Questions'

const DesktopButton = styled(Button)`
  align-self: flex-end;
`
const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { address: account } = useAccount()
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])
  const [onPresentCreateGauge] = useModal(<CreateStakeModal currency={currency} />)
  const nftFilters = useFilters()
  const tags = useGetTags()
  const collectionAddress = router.query.collectionAddress as string

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
          <Flex flex="1" className="tour-logo" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" className="tour-post" scale="xxl" color="secondary" mb="24px">
              {t('Stake Market')}
            </Heading>
            <Heading scale="md" className="tour-login" color="text">
              {t(
                "Browse this channel's StakeMarket, Valuepools, ARPs, Trustbounties, Lotteries, Catalogs, Bettings...",
              )}
            </Heading>
            <Heading scale="md" className="tour-post" color="text">
              {t('Buy products and services from eCommerce stores, Delivery/Telehealth... channels')}
            </Heading>
            <Flex>
              <Button p="0" className="tour-contact" variant="text">
                <Text
                  color="primary"
                  className="tour-footer"
                  onClick={onPresentCreateGauge}
                  bold
                  fontSize="16px"
                  mr="4px"
                >
                  {t('Create a Stake in ')}{' '}
                </Text>
                <CurrencyInputPanel
                  id="stakes-currency"
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
        <PoolControls pools={pools?.filter((pool) => !collectionAddress || pool?.stakeSource === collectionAddress)}>
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
        <Steps title={t('How does it work?')} onPresentCreateGauge={onPresentCreateGauge} />
        <Questions />
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}

export default Pools
