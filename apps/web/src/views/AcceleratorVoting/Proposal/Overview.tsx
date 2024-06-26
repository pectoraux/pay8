import { ArrowBackIcon, Box, Button, Flex, Heading, ReactMarkdown, NotFound } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'
import { useWeb3React } from '@pancakeswap/wagmi'
import useSWRImmutable from 'swr/immutable'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import PageLoader from 'components/Loader/PageLoader'
import { FetchStatus } from 'config/constants/types'
import { getPitchSg } from 'state/acceleratorvoting/helpers'
import RichTextEditor from 'components/RichText'
import { Divider } from 'views/ARPs/components/styles'
import { ProposalTypeTag } from '../components/Proposals/tags'
import Layout from '../components/Layout'
import Details from './Details'
import Results from './Results'
import Vote from './Vote'
import Votes from './Votes'

const Overview = () => {
  const { query, isFallback } = useRouter()
  const id = query.id as string
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const {
    status: pitchLoadingStatus,
    data: pitch,
    error,
    mutate: refetch,
  } = useSWRImmutable(id ? ['accelerator-pitch1', id] : null, () => getPitchSg(id))

  console.log('getpitchsSg==============>', pitch)
  const accountVote = pitch?.votes?.find((vote) => vote.voter?.toLowerCase() === account?.toLowerCase())
  const hasAccountVoted = account && !!accountVote

  console.log('getpitchsSg==============>', pitch, hasAccountVoted)
  const isPageLoading = pitchLoadingStatus === FetchStatus.Fetching

  if (!pitch && error) {
    return <NotFound />
  }

  if (isFallback || !pitch) {
    return <PageLoader />
  }

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="40px">
        <Link href="/accelerator" passHref>
          <Button as="a" variant="text" startIcon={<ArrowBackIcon color="primary" width="24px" />} px="0">
            {t('Back to Accelerator')}
          </Button>
        </Link>
      </Box>
      <Layout>
        <Box>
          <Box mb="32px">
            <Flex alignItems="center" mb="8px">
              {/* <ProposalStateTag isCoreProposal={isCoreProposal(pitch)} /> */}
              <ProposalTypeTag isCoreProposal ml="8px" />
            </Flex>
            <Heading as="h1" scale="xl" mb="16px">
              {pitch?.title}
            </Heading>
            <Box>
              {pitch?.images?.length > 3 ? (
                <RichTextEditor
                  readOnly
                  value={`<iframe class="ql-video" frameborder="0" allowfullscreen="true" src="${pitch?.images[3]}" height="467" width="830"></iframe>`}
                  id="rte"
                />
              ) : null}
              <ReactMarkdown>{pitch.description}</ReactMarkdown>
            </Box>
            <Divider />
          </Box>
          {!isPageLoading && <Vote proposal={pitch} onSuccess={refetch} mb="16px" />}
          <Votes votes={pitch?.votes} totalVotes={pitch?.votes?.length} />
        </Box>
        <Box position="sticky" top="60px">
          <Details proposal={pitch} onSuccess={refetch} />
          <Results pitch={pitch} accountVote={accountVote} hasAccountVoted={hasAccountVoted} />
        </Box>
      </Layout>
    </Container>
  )
}

export default Overview
