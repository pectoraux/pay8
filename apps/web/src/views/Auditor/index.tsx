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
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/auditors/hooks'
import Page from 'components/Layout/Page'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { useCurrency } from 'hooks/Tokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import CreateGaugeModal from 'views/Auditors/components/CreateGaugeModal'

import PoolControls from './components/PoolControls'
import PoolRow from './components/PoolsTable/PoolRow'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import CurrencyInputPanel from 'components/CurrencyInputPanel'

const FinishedTextButton = styled(Button)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
  cursor: pointer;
`

const Pools: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { auditor } = router.query as any
  const { pools } = usePoolsWithFilterSelector()
  const ogAuditor = pools?.find((pool) => pool?.id?.toLowerCase() === auditor?.toLowerCase())
  const isOwner = ogAuditor?.devaddr_ === account
  const inputCurency = useCurrency(DEFAULT_TFIAT ?? undefined)
  const [currency, setCurrency] = useState(inputCurency)
  const [onPresentAdminSettings] = useModal(
    <CreateGaugeModal variant="admin" location="fromAuditor" currency={currency} pool={ogAuditor} />,
  )
  const [onPresentDeleteContract] = useModal(<CreateGaugeModal variant="delete" currency={currency ?? inputCurency} />)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])

  usePoolsPageFetch()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Auditor')}
            </Heading>
            <Heading scale="md" color="text">
              {t('%a%', { a: auditor ?? '' })}
            </Heading>
            <Heading scale="md" color="text">
              {t(ogAuditor?.collection?.description ?? '')}
            </Heading>
            {ogAuditor?.devaddr_?.toLowerCase() === account?.toLowerCase() ? (
              <Flex>
                <Button p="0" variant="text">
                  <Text color="primary" onClick={onPresentAdminSettings} bold fontSize="16px" mr="4px">
                    {t('Admin Settings')}{' '}
                  </Text>
                  <CurrencyInputPanel
                    id="auditor-currency"
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
            <Link href="/auditors">{t('Auditors')}</Link>
            <Text>{auditor}</Text>
          </Breadcrumbs>
        </Box>
        <PoolControls pools={pools}>
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
                  {t('Delete Auditor!')}
                </FinishedTextButton>
              ) : null}
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
