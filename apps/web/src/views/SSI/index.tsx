import { useState } from 'react'
import { Flex } from '@pancakeswap/uikit'
import { PageMeta } from 'components/Layout/Page'
import styled from 'styled-components'
import Footer from './components/Footer'
import Hero from './components/Hero'
import { Proposals } from './components/Proposals'

const Chrome = styled.div`
  flex: none;
`

const Content = styled.div`
  flex: 1;
  height: 100%;
`

const SSI = () => {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <>
      <PageMeta />
      <Flex flexDirection="column" minHeight="calc(100vh - 64px)">
        <Chrome>
          <Hero setSearchQuery={setSearchQuery} />
        </Chrome>
        <Content>
          <Proposals searchQuery={searchQuery} />
        </Content>
        <Chrome>
          <Footer />
        </Chrome>
      </Flex>
    </>
  )
}

export default SSI
