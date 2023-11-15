import { CloseIcon, Flex, IconButton, PageSection } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'
import styled from 'styled-components'
import Footer from './components/Footer'
import Hero from './components/Hero'
import { Proposals } from './components/Proposals'
import { useState } from 'react'
import { FINISHED_ROUNDS_BG_DARK } from 'views/Lottery/pageSectionStyles'
import CheckEarnings from 'views/TrustBountiesVoting/components/CheckEarnings'

const Chrome = styled.div`
  flex: none;
`

const Content = styled.div`
  flex: 1;
  height: 100%;
`

const Voting = () => {
  const [hide, setHide] = useState(false)
  return (
    <>
      <PageMeta />
      <Flex flexDirection="column" minHeight="calc(100vh - 64px)">
        <Chrome>
          <Hero />
        </Chrome>
        <Content>
          {!hide && (
            <PageSection background={FINISHED_ROUNDS_BG_DARK} hasCurvedDivider={false} index={2}>
              <IconButton onClick={() => setHide(true)} variant="text">
                <CloseIcon color="#FFFFFF" />
              </IconButton>
              <CheckEarnings fromStake />
            </PageSection>
          )}
          <Proposals />
        </Content>
        <Chrome>
          <Footer />
        </Chrome>
      </Flex>
    </>
  )
}

export default Voting
