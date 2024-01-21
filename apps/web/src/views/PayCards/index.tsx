import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { Heading, Flex, Text, PageHeader, Pool, Button, useModal, Loading, ScanLink } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useCurrency } from 'hooks/Tokens'
import { getBlockExploreLink } from 'utils'
import { getCardAddress } from 'utils/addressHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useTranslation } from '@pancakeswap/localization'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/cards/hooks'

import Steps from './Steps'
import Questions from './components/Questions'
import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import CreateCardModal from './components/CreateCardModal'
import CreateGaugeModal from './components/CreateGaugeModal'

const DesktopButton = styled(Button)`
  align-self: flex-end;
`
const Pools: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  console.log('pools=============>', pools)
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const { username, session_id: sessionId, state: status, userCurrency } = router.query
  const [openedAlready, setOpenedAlready] = useState(false)
  const { chainId } = useActiveChainId()
  const [onPresentCreateGauge] = useModal(<CreateCardModal currency={currency} />)
  const handleClick = () => {
    const howToElem = document.getElementById('how-to')
    if (howToElem != null) {
      howToElem.scrollIntoView()
    }
  }
  const ogPool = useMemo(
    () => pools?.find((pool) => pool?.username?.toLowerCase() === username?.toString()?.toLowerCase()),
    [pools, username],
  )
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal
      variant={ogPool?.owner?.toLowerCase() === account?.toLowerCase() ? 'admin' : 'user'}
      pool={ogPool}
      currency={currency ?? userCurrency}
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

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('PayCard Accounts')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Create a PayCard account, add funds to it and use it to transact without a crypto wallet')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Use just your account id and password for transactions')}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentCreateGauge} bold fontSize="16px" mr="4px">
                  {t('Create a PayCard Account')}{' '}
                </Text>
              </Button>
            </Flex>
          </Flex>
          <DesktopButton onClick={handleClick} variant="subtle">
            {t('How does it work?')}
          </DesktopButton>
        </Flex>
      </PageHeader>
      <Page>
        <Flex mb="2px" justifyContent="flex-start">
          <ScanLink href={getBlockExploreLink(getCardAddress(), 'address', chainId)} bold>
            {t('View PayCard Contract')}
          </ScanLink>
        </Flex>
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
        <Steps title={t('How does it work ?')} onPresentCreateGauge={onPresentCreateGauge} />
        <Questions />
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}

export default Pools
