import { useAccount } from 'wagmi'
import { Heading, Flex, Image, Text, PageHeader, Pool, ArrowForwardIcon, Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/arps/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { useCallback, useState } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import CreateRampModal from './components/CreateRampModal'

const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools } = usePoolsWithFilterSelector()
  console.log('pools=============>', pools)
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])
  const [onPresentCreateGauge] = useModal(<CreateRampModal />)

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('ARP Contracts')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Create a contract and start managing your receivables & payables')}
            </Heading>
            <Heading scale="md" color="text">
              {t(
                'Browse between different arps and apply for an account in one offering the services you are looking for.',
              )}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentCreateGauge} bold fontSize="16px" mr="4px">
                  {t('Create contract ')}{' '}
                </Text>
                {/* {(
                  <CurrencyInputPanel
                    id="ramps-currency"
                    showUSDPrice
                    showMaxButton
                    showCommonBases
                    showInput={false}
                    showQuickInputButton
                    currency={currency ?? inputCurency}
                    onCurrencySelect={handleInputSelect}
                  />
                )} */}
              </Button>
              <ArrowForwardIcon onClick={onPresentCreateGauge} color="primary" />
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls pools={pools}>
          {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch, showFinishedPools }) => (
            <>
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
              <Image
                mx="auto"
                mt="12px"
                src="/images/decorations/3d-syrup-bunnies.png"
                alt="Payswap illustration"
                width={192}
                height={184.5}
              />
            </>
          )}
        </PoolControls>
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}

export default Pools
