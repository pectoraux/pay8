import { useAccount } from 'wagmi'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import { Heading, Flex, Image, Text, PageHeader, Pool, ArrowForwardIcon, Button, useModal } from '@pancakeswap/uikit'
import { useFilters, useGetTags, usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/ramps/hooks'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import CreateRampModal from './components/CreateRampModal'

import Filters from './Filters'
import Steps from './Steps'
import Questions from './components/Questions'
import { useRouter } from 'next/router'

const DesktopButton = styled(Button)`
  align-self: flex-end;
`

const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { address: account } = useAccount()
  const { pools } = usePoolsWithFilterSelector()
  const [onPresentCreateGauge] = useModal(<CreateRampModal />)
  const nftFilters = useFilters()
  const tags = useGetTags()
  console.log('pools=============>', pools, tags)
  const handleClick = () => {
    const howToElem = document.getElementById('ifo-how-to')
    if (howToElem != null) {
      howToElem.scrollIntoView()
    } else {
      router.push('/ifo#ifo-how-to')
    }
  }
  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Decentralized Ramp Pools')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Transfer value on and off the platform')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Make money helping people transfer value on and off the platform')}
            </Heading>
            <Flex>
              <Button p="0" variant="text">
                <Text color="primary" onClick={onPresentCreateGauge} bold fontSize="16px" mr="4px">
                  {t('Create contract ')}{' '}
                </Text>
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
        <Steps title={t('How to create my own ramp ?')} onPresentCreateGauge={onPresentCreateGauge} />
        <Questions />
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}

export default Pools
