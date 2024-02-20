import { useAccount } from 'wagmi'
import styled from 'styled-components'
import { Heading, Flex, Text, PageHeader, Pool, ArrowForwardIcon, Button, useModal, Loading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/futureCollaterals/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { useCallback, useState } from 'react'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import CreateFutureCollateralModal from './components/CreateFutureCollateralModal'

import Steps from './Steps'
import Questions from './components/Questions'

const DesktopButton = styled(Button)`
  align-self: flex-end;
`

const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
  console.log('pools=============>', pools)
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const [onPresentCreateGauge] = useModal(<CreateFutureCollateralModal currency={currency} stageName="PICK_CHANNEL" />)
  const [onPresentCreateGauge2] = useModal(
    <CreateFutureCollateralModal currency={currency} stageName="MINT_COLLATERAL" />,
  )
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
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Future Collaterals')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Mint a collateral that appreciates in value')}
            </Heading>
            <Heading scale="md" color="text">
              {t(
                'Read the documentation to understand how future collaterals work, then pick and mint your collateral.',
              )}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentCreateGauge} bold fontSize="16px" mr="4px">
                  {t('Pick Channel')}{' '}
                </Text>
              </Button>
              <ArrowForwardIcon onClick={onPresentCreateGauge} color="primary" />
            </Flex>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentCreateGauge2} bold fontSize="16px" mr="4px">
                  {t('Mint Collateral')}{' '}
                </Text>
              </Button>
              <ArrowForwardIcon onClick={onPresentCreateGauge2} color="primary" />
            </Flex>
          </Flex>
          <DesktopButton onClick={handleClick} variant="subtle">
            {t('How does it work?')}
          </DesktopButton>
        </Flex>
      </PageHeader>
      <Page>
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
        <Steps title={t('How to mint a Future Collateral')} />
        <Questions />
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}

export default Pools
