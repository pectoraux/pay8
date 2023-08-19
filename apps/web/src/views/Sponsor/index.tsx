import styled from 'styled-components'

import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import {
  Heading,
  Flex,
  Image,
  Text,
  Link,
  PageHeader,
  Box,
  Pool,
  ArrowForwardIcon,
  Button,
  useModal,
  Breadcrumbs,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/sponsors/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { useCurrency } from 'hooks/Tokens'
import { useCallback, useState } from 'react'
import CreateGaugeModal from 'views/Sponsors/components/CreateGaugeModal'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import CurrencyInputPanel from 'components/CurrencyInputPanel'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'

const Pools: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const sponsor = router.query.sponsor as string
  const { pools } = usePoolsWithFilterSelector()
  const ogSponsor = pools?.find((pool) => pool?.id?.toLowerCase() === sponsor?.toLowerCase())
  const inputCurency = useCurrency(DEFAULT_TFIAT ?? undefined)
  const [currency, setCurrency] = useState(inputCurency)
  const [onPresentAdminSettings] = useModal(
    <CreateGaugeModal variant="admin" location="fromSponsor" currency={currency} pool={ogSponsor} />,
  )
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])
  console.log('pools========>', pools)

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Sponsor')}
            </Heading>
            <Heading scale="md" color="text">
              {t('%a%', { a: (sponsor ?? '')?.toString() })}
            </Heading>
            <Heading scale="md" color="text">
              {t(ogSponsor?.collection?.description ?? '')}
            </Heading>
            {ogSponsor?.devaddr_?.toLowerCase() === account?.toLowerCase() ? (
              <Flex>
                <Button p="0" variant="text">
                  <Text color="primary" onClick={onPresentAdminSettings} bold fontSize="16px" mr="4px">
                    {t('Admin Settings')}{' '}
                  </Text>
                  <CurrencyInputPanel
                    id="sponsor-currency"
                    showUSDPrice
                    showMaxButton
                    showCommonBases
                    showInput={false}
                    showQuickInputButton
                    currency={currency ?? inputCurency}
                    onCurrencySelect={handleInputSelect}
                  />
                </Button>
                <ArrowForwardIcon onClick={onPresentAdminSettings} color="primary" />
              </Flex>
            ) : null}
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Box mb="48px">
          <Breadcrumbs>
            <Link href="/sponsors">{t('Sponsors')}</Link>
            <Text>{sponsor}</Text>
          </Breadcrumbs>
        </Box>
        <PoolControls pools={ogSponsor?.accounts?.length && ogSponsor?.accounts}>
          {({ chosenPools, normalizedUrlSearch }) => (
            <>
              <Pool.PoolsTable>
                {chosenPools.map((pool) => (
                  <PoolRow
                    initialActivity={normalizedUrlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
                    key={pool.sousId}
                    account={account}
                    sousId={ogSponsor.sousId}
                    currAccount={pool}
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
