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
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/valuepools/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { useCurrency } from 'hooks/Tokens'
import CreateGaugeModal from 'views/ValuePools/components/CreateGaugeModal'

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
  const valuepool = router.query.valuepool as string
  const ogValuepool = pools.find((pool) => pool?.id?.toLowerCase() === valuepool?.toLowerCase())
  const isOwner = ogValuepool?.devaddr_?.toLowerCase() === account?.toLowerCase()
  const currency = useCurrency(ogValuepool?.tokenAddress)
  const [onPresentAdminSettings] = useModal(
    <CreateGaugeModal variant="admin" currency={currency} location="header" pool={ogValuepool} />,
  )
  const [onPresentUserSettings] = useModal(
    <CreateGaugeModal variant="user" currency={currency} location="header" pool={ogValuepool} />,
  )
  const [onPresentDeleteVP] = useModal(<CreateGaugeModal variant="delete" currency={currency} />)
  console.log('ogValuepool======================>', ogValuepool, pools, currency)

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {ogValuepool?.name ?? ''}
            </Heading>
            <Heading scale="md" color="text">
              {t('%vp%', { vp: valuepool ?? '' })}
            </Heading>
            <Heading scale="md" color="text">
              {ogValuepool?.description}
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
                <Button p="0" onClick={onPresentUserSettings} variant="text">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Settings')}
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
            <Link href="/valuepools">{t('Valuepools')}</Link>
            <Text>{valuepool}</Text>
          </Breadcrumbs>
        </Box>
        <PoolControls pools={pools?.length && pools[0]?.tokens}>
          {({ chosenPools, normalizedUrlSearch }) => (
            <>
              {isOwner ? (
                <FinishedTextButton
                  as={Link}
                  onClick={onPresentDeleteVP}
                  fontSize={['16px', null, '20px']}
                  color="failure"
                  pl={17}
                >
                  {t('Delete Valuepool!')}
                </FinishedTextButton>
              ) : null}
              <Pool.PoolsTable>
                {chosenPools.map((pool) => (
                  <PoolRow
                    initialActivity={normalizedUrlSearch.toLowerCase() === pool?.earningToken?.symbol?.toLowerCase()}
                    id={pool?.id}
                    key={pool.tokenId}
                    account={account}
                    vpAccount={pool}
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
