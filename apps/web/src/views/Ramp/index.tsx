import styled from 'styled-components'

import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import {
  Heading,
  Flex,
  Text,
  Link,
  PageHeader,
  Box,
  Pool,
  ArrowForwardIcon,
  Button,
  useModal,
  Breadcrumbs,
  Loading,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector, fetchPoolsDataWithFarms2 } from 'state/ramps/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { useCurrency } from 'hooks/Tokens'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { useActiveChainId } from 'hooks/useActiveChainId'
import CreateGaugeModal2 from 'views/Ramps/components/CreateGaugeModal'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import CreateGaugeModal from './components/CreateGaugeModal'

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
  const { chainId } = useActiveChainId()
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  const { ramp, session_id: sessionId, state: status, userCurrency } = router.query
  const rampAddress = ramp as any
  const ogRamp = useMemo(
    () => pools?.find((pool) => pool?.rampAddress?.toLowerCase() === rampAddress?.toLowerCase()),
    [pools, rampAddress],
  )
  const isOwner = ogRamp?.devaddr_?.toLowerCase() === account?.toLowerCase()
  const dispatch = useAppDispatch()
  const [openedAlready, setOpenedAlready] = useState(false)
  const currency = useCurrency((userCurrency ?? undefined)?.toString())
  console.log('ogRamp=====================>', ogRamp, pools)
  const [onPresentCreateGauge] = useModal(
    <CreateGaugeModal variant="buy" pool={ogRamp} currency={currency ?? userCurrency} />,
  )
  const [onPresentAdminSettings] = useModal(
    <CreateGaugeModal2 variant="admin" currency={currency ?? userCurrency} location="header" pool={ogRamp} />,
  )
  const [onPresentDeleteContract] = useModal(<CreateGaugeModal variant="delete" currency={currency ?? userCurrency} />)
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal
      location="home"
      pool={ogRamp}
      currency={currency ?? userCurrency}
      status={status}
      sessionId={sessionId}
    />,
  )

  usePoolsPageFetch()

  useEffect(() => {
    if (sessionId && status === 'success' && !openedAlready) {
      openPresentControlPanel()
      setOpenedAlready(true)
    }
  }, [status, sessionId, router.query, openedAlready, openPresentControlPanel])

  useEffect(() => {
    fetchPoolsDataWithFarms2(router.query.ramp, chainId, dispatch)
  }, [router.query, chainId, dispatch])

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Decentralized Ramp')}
            </Heading>
            <Heading scale="md" color="text">
              {t('%ramp%', { ramp: (ramp ?? '')?.toString() })}
            </Heading>
            <Heading scale="md" color="text">
              {t(ogRamp?.description ?? '')}
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
                    {t('Buy Ramp')}
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
            <Link href="/ramps">{t('Ramps')}</Link>
            <Text>{ramp}</Text>
          </Breadcrumbs>
        </Box>
        <PoolControls pools={ogRamp?.accounts}>
          {({ chosenPools, normalizedUrlSearch }) => (
            <>
              {!userDataLoaded && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )}
              {isOwner ? (
                <FinishedTextButton
                  as={Link}
                  onClick={onPresentDeleteContract}
                  fontSize={['16px', null, '20px']}
                  color="failure"
                  pl={17}
                >
                  {t('Delete Ramp!')}
                </FinishedTextButton>
              ) : null}
              <Pool.PoolsTable>
                {chosenPools.map((pool) => (
                  <PoolRow
                    initialActivity={normalizedUrlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
                    key={pool.sousId}
                    sousId={pool.sousId}
                    account={account}
                    rampAddress={ogRamp?.id}
                  />
                ))}
              </Pool.PoolsTable>
            </>
          )}
        </PoolControls>
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}

export default Pools
