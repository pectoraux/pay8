// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
// import { getLitigationSg } from 'state/trustbountiesvoting/helpers'
// import Overview from 'views/TrustBountiesVoting/Proposal/Overview'

const ProposalPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      {/* <Overview /> */}
    </SWRConfig>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: true,
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params
  if (typeof id !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const fetchedProposal = {} // await getLitigationSg(id)
    if (!fetchedProposal) {
      return {
        notFound: true,
        revalidate: 1,
      }
    }
    return {
      props: {
        fallback: {
          [unstable_serialize(['litigation-trustbounties', id])]: fetchedProposal,
        },
      },
      revalidate: 3,
      // fetchedProposal?.active === false
      //   ? 60 * 60 * 12 // 12 hour
      //   : 3,
    }
  } catch (error) {
    return {
      props: {
        fallback: {},
      },
      revalidate: 60,
    }
  }
}

export default ProposalPage