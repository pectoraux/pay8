import { Box, Breadcrumbs, Card, Flex, Heading, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { EntryState, EntryType } from 'state/types'
import { getProfileData, getSSIData, getUserData2 } from 'state/ssi/helpers'
import { FetchStatus } from 'config/constants/types'
import { useSessionStorage } from 'hooks/useSessionStorage'
import { useWeb3React } from '@pancakeswap/wagmi'
import { filterProposalsByQuery, filterProposalsByState, filterProposalsByType } from '../../helpers'
import ProposalsLoading from './ProposalsLoading'
import TabMenu from './TabMenu'
import ProposalRow from './ProposalRow'
import Filters from './Filters'

interface State {
  proposalType: EntryType
  filterState: EntryState
}

const Proposals = ({ searchQuery }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const [state, setState] = useSessionStorage<State>('proposals-filter', {
    proposalType: EntryType.SHARED,
    filterState: EntryState.ACTIVE,
  })

  const { proposalType, filterState } = state
  const {
    status,
    data,
    mutate: refetch,
  } = useSWR(['data9', filterState], async () => getSSIData(1000, 0, account?.toLowerCase() ?? ''))
  const {
    status: status2,
    data: profile,
    mutate: refetch2,
  } = useSWR(['data', filterState], async () => getProfileData(1000, 0, account?.toLowerCase() ?? ''))
  const where = useMemo(
    () => (searchQuery ? { question_contains_nocase: searchQuery, searchable: true } : {}),
    [searchQuery],
  )
  const { status: status3, data: userDatas } = useSWR(['userDatas', where], async () => getUserData2(1000, 0, where))
  console.log('getSSIData================>', data, profile)
  const handleProposalTypeChange = (newProposalType: EntryType) => {
    setState((prevState) => ({
      ...prevState,
      proposalType: newProposalType,
    }))
  }

  useEffect(() => {
    refetch()
    refetch2()
  }, [account, status, status2])

  const handleFilterChange = (newFilterState: EntryState) => {
    setState((prevState) => ({
      ...prevState,
      filterState: newFilterState,
    }))
  }
  const filteredProposals = filterProposalsByQuery(
    filterProposalsByState(filterProposalsByType(data, profile, proposalType), filterState),
    searchQuery,
    userDatas,
    proposalType,
  )
  console.log('filteredProposals==================>', filteredProposals)
  return (
    <Container py="40px">
      <Box mb="48px">
        <Breadcrumbs>
          <Link href="/">{t('Home')}</Link>
          <Text>{t('SSI')}</Text>
        </Breadcrumbs>
      </Box>
      <Heading as="h2" scale="xl" mb="32px" id="ssi-proposals">
        {t('Entries')}
      </Heading>
      <Card>
        <TabMenu proposalType={proposalType} onTypeChange={handleProposalTypeChange} />
        <Filters
          filterState={filterState}
          onFilterChange={handleFilterChange}
          isLoading={status !== FetchStatus.Fetched}
        />
        {status !== FetchStatus.Fetched && <ProposalsLoading />}
        {status === FetchStatus.Fetched &&
          filteredProposals?.length > 0 &&
          filteredProposals?.map((proposal) => {
            return <ProposalRow key={proposal.id} account={account} entry={proposal} />
          })}
        {status === FetchStatus.Fetched && filteredProposals?.length === 0 && (
          <Flex alignItems="center" justifyContent="center" p="32px">
            <Heading as="h5">{t('No entry found')}</Heading>
          </Flex>
        )}
      </Card>
    </Container>
  )
}

export default Proposals
