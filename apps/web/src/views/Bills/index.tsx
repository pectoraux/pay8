import { useAccount } from 'wagmi'
import { Heading, Flex, Image, Text, PageHeader, Pool, ArrowForwardIcon, Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector, useGetTags, useFilters } from 'state/bills/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import CreateBillModal from './components/CreateBillModal'
import Filters from './Filters'
import Steps from './Steps'
import Questions from './components/Questions'
import styled from 'styled-components'
import { useRouter } from 'next/router'

const DesktopButton = styled(Button)`
  align-self: flex-end;
`
const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { address: account } = useAccount()
  const { pools } = usePoolsWithFilterSelector()
  console.log('pools=============>', pools)
  const [onPresentCreateGauge] = useModal(<CreateBillModal />)
  const nftFilters = useFilters()
  const tags = useGetTags()
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
              {t('Bill Contracts')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Create a contract and start managing your receivables & payables')}
            </Heading>
            <Heading scale="md" color="text">
              {t(
                'Browse between different bills and apply for an account in one offering the services you are looking for.',
              )}
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
        <Steps title={t('How does it work ?')} onPresentCreateGauge={onPresentCreateGauge} />
        <Questions />
        <V3SubgraphHealthIndicator />
      </Page>
    </>
  )
}

export default Pools
