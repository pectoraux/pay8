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
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/arps/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { useCurrency } from 'hooks/Tokens'
import { useEffect, useMemo, useState } from 'react'
import CreateGaugeModal from 'views/ARPs/components/CreateGaugeModal'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'

const FinishedTextButton = styled(Button)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
  cursor: pointer;
`

const Pools: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools } = usePoolsWithFilterSelector()
  const { arp, session_id: sessionId, state: status, userCurrency } = router.query
  const ogARP = useMemo(() => pools?.length && pools[0], [pools])
  const isOwner = ogARP?.devaddr_?.toLowerCase() === account?.toLowerCase()
  const [openedAlready, setOpenedAlready] = useState(false)
  const currency = useCurrency((userCurrency ?? undefined)?.toString())
  const [onPresentCreateGauge] = useModal(
    <CreateGaugeModal variant="buy" pool={ogARP} currency={currency ?? userCurrency} />,
  )
  const [onPresentAdminSettings] = useModal(
    <CreateGaugeModal variant="admin" currency={currency ?? userCurrency} location="header" pool={ogARP} />,
  )
  const [onPresentDeleteContract] = useModal(<CreateGaugeModal variant="delete" currency={currency ?? userCurrency} />)
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal
      location="home"
      pool={pools?.length && pools[0]}
      currency={currency ?? userCurrency}
      status={status}
      sessionId={sessionId}
    />,
  )
  console.log('ogARP=======================>', ogARP)
  useEffect(() => {
    if (sessionId && status === 'success' && !openedAlready) {
      openPresentControlPanel()
      setOpenedAlready(true)
    }
  }, [status, sessionId, router.query, openedAlready, openPresentControlPanel])

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('ARP')}
            </Heading>
            <Heading scale="md" color="text">
              {t('%arp%', { arp: (arp ?? '')?.toString() })}
            </Heading>
            <Heading scale="md" color="text">
              {t(ogARP?.collection?.description ?? '')}
            </Heading>
            {isOwner ? (
              <Flex pt="17px">
                <Button p="0" onClick={onPresentAdminSettings} variant="text">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Admin Settings')}
                  </Text>
                  <ArrowForwardIcon color="primary" />
                </Button>
              </Flex>
            ) : (
              <Flex>
                <Button p="0" onClick={onPresentCreateGauge} variant="text">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Buy ARP')}
                  </Text>
                  <ArrowForwardIcon color="primary" />
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <Box mb="48px">
          <Breadcrumbs>
            <Link href="/arps">{t('ARPs')}</Link>
            <Text>{arp}</Text>
          </Breadcrumbs>
        </Box>
        <PoolControls pools={ogARP?.accounts?.length && ogARP?.accounts}>
          {({ chosenPools, normalizedUrlSearch }) => (
            <>
              {isOwner ? (
                <FinishedTextButton
                  as={Link}
                  onClick={onPresentDeleteContract}
                  fontSize={['16px', null, '20px']}
                  color="failure"
                  pl={17}
                >
                  {t('Delete ARP!')}
                </FinishedTextButton>
              ) : null}
              <Pool.PoolsTable>
                {chosenPools.map((pool) => (
                  <PoolRow
                    initialActivity={normalizedUrlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
                    key={pool.sousId}
                    sousId={ogARP.sousId}
                    account={account}
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
