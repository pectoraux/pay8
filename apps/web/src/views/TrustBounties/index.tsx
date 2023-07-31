import styled from 'styled-components'

import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import {
  Heading,
  Flex,
  Image,
  Text,
  Link,
  FlexLayout,
  PageHeader,
  Loading,
  Pool,
  ArrowForwardIcon,
  Button,
  useModal,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/trustbounties/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { useCallback, useState } from 'react'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import CreateBountyModal from './components/CreateBountyModal'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  console.log('pools=============>', pools)
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])
  const [onPresentTrustBounties] = useModal(<CreateBountyModal currency={currency ?? inputCurency} />)

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Trust Bounties')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Have a business in the marketplace?')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Create a trust bounty so your customers are more confident when purchasing your products..')}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentTrustBounties} bold fontSize="16px" mr="4px">
                  {t('Create an Bounty in ')}{' '}
                </Text>
                <CurrencyInputPanel
                  id="bounties-currency"
                  showUSDPrice
                  showMaxButton
                  showCommonBases
                  showInput={false}
                  showQuickInputButton
                  currency={currency ?? inputCurency}
                  onCurrencySelect={handleInputSelect}
                />
              </Button>
              <ArrowForwardIcon onClick={onPresentTrustBounties} color="primary" />
            </Flex>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls pools={pools}>
          {({ chosenPools, normalizedUrlSearch }) => (
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
