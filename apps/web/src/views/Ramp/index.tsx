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
import { usePoolsPageFetch, usePoolsWithFilterSelector, fetchPoolsDataWithFarms } from 'state/ramps/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { useCurrency } from 'hooks/Tokens'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'

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
  const { pools } = usePoolsWithFilterSelector()
  const { ramp, session_id: sessionId, state: status, userCurrency } = router.query
  const rampAddress = ramp as String
  const ogRamp = useMemo(
    () => pools?.find((pool) => pool?.rampAddress?.toLowerCase() === rampAddress?.toLowerCase()),
    [pools],
  )
  const isOwner = ogRamp?.devaddr_ === account
  const dispatch = useAppDispatch()
  const [openedAlready, setOpenedAlready] = useState(false)
  const currency = useCurrency((userCurrency ?? undefined)?.toString())
  const [onPresentCreateGauge] = useModal(
    <CreateGaugeModal variant="buy" pool={ogRamp} currency={currency ?? userCurrency} />,
  )
  const [onPresentAdminSettings] = useModal(
    <CreateGaugeModal variant="admin" currency={currency ?? userCurrency} location="header" pool={ogRamp} />,
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

  useEffect(() => {
    if (sessionId && status === 'success' && !openedAlready) {
      openPresentControlPanel()
      setOpenedAlready(true)
    }
  }, [status, sessionId, router.query, openedAlready, openPresentControlPanel])

  usePoolsPageFetch()

  useEffect(() => {
    fetchPoolsDataWithFarms(router.query.ramp, dispatch)
  }, [router.query, dispatch])

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
