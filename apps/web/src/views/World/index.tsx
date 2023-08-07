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
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/worlds/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { useCurrency } from 'hooks/Tokens'
import { useMemo } from 'react'
import CreateGaugeModal from 'views/Worlds/components/CreateGaugeModal'
import { DEFAULT_TFIAT } from 'config/constants/exchange'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'

const Pools: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const world = router.query.world as string
  const { pools } = usePoolsWithFilterSelector()
  const ogWorld = useMemo(() => pools?.length && pools[0], [pools])
  const currency = useCurrency(DEFAULT_TFIAT ?? undefined)
  const [onPresentAdminSettings] = useModal(
    <CreateGaugeModal variant="admin" location="fromWorld" currency={currency} pool={ogWorld} />,
  )

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('World')}
            </Heading>
            <Heading scale="md" color="text">
              {t('%a%', { a: world ?? '' })}
            </Heading>
            <Heading scale="md" color="text">
              {t(ogWorld?.collection?.description ?? '')}
            </Heading>
            {ogWorld?.devaddr_ === account ? (
              <Flex>
                <Button p="0" variant="text">
                  <Text color="primary" onClick={onPresentAdminSettings} bold fontSize="16px" mr="4px">
                    {t('Admin Settings')}{' '}
                  </Text>
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
            <Link href="/worlds">{t('Worlds')}</Link>
            <Text>{world}</Text>
          </Breadcrumbs>
        </Box>
        <PoolControls pools={pools?.length ? pools.accounts : []}>
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
