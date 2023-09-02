import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { useWeb3React } from '@pancakeswap/wagmi'
import {
  Heading,
  Flex,
  Text,
  FlexLayout,
  PageHeader,
  Loading,
  ScrollToTopButtonV2,
  Pool,
  ViewMode,
  Button,
  useModal,
  ArrowForwardIcon,
} from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import Page from 'components/Layout/Page'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/pools/hooks'

import Steps from './Steps'
import Questions from './components/Questions'
import AprRow from './components/PoolCard/AprRow'
import PoolControls from './components/PoolControls'
import CardFooter from './components/PoolCard/CardFooter'
import CreatePoolModal from './components/CreatePoolModal'
import CardActions from './components/PoolCard/CardActions'
import PoolsTable from './components/PoolsTable/PoolsTable'

const DesktopButton = styled(Button)`
  align-self: flex-end;
`
const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

export const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 296px;
    margin-left: 50px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
  }
`
export const ImageWrapper = styled.div`
  position: absolute;
  top: -50px;
  transform: translateY(-50%) scale(75%);
  right: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: auto;
    top: 50%;
    left: -70px;
    transform: translateY(-50%);
  }
  z-index: 2;
`
const FarmFlexWrapper = styled(Flex)`
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: nowrap;
  }
`

const Pools: React.FC<any> = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools } = usePoolsWithFilterSelector()
  const [onPresentCreateGauge] = useModal(<CreatePoolModal />)
  console.log('pools===================>', pools)

  usePoolsPageFetch()

  const handleClick = () => {
    const howToElem = document.getElementById('how-to')
    if (howToElem != null) {
      howToElem.scrollIntoView()
    } else {
    }
  }

  return (
    <>
      <PageHeader>
        <FarmFlexWrapper justifyContent="space-between">
          <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
            <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
              <Heading as="h1" scale="xxl" color="secondary" mb="24px">
                {t('Pools')}
              </Heading>
              <Heading scale="md" color="text">
                {t('Create a pool and start earning fees from the liquidity pools.')}
              </Heading>
              <Heading scale="md" color="text">
                {t('The more activity on your pair, the more fees you earn.')}
              </Heading>
              <Flex>
                <Button p="0" variant="text">
                  <Text color="primary" onClick={onPresentCreateGauge} bold fontSize="16px" mr="4px">
                    {t('Deposit LP')}{' '}
                  </Text>
                </Button>
                <ArrowForwardIcon onClick={onPresentCreateGauge} color="primary" />
              </Flex>
            </Flex>
            <DesktopButton onClick={handleClick} variant="subtle">
              {t('How does it work?')}
            </DesktopButton>
          </Flex>
        </FarmFlexWrapper>
      </PageHeader>
      <Page>
        <PoolControls pools={pools}>
          {({ chosenPools, normalizedUrlSearch }) => (
            <PoolsTable urlSearch={normalizedUrlSearch} pools={chosenPools} account={account} />
          )}
        </PoolControls>
        <Steps title={t('How does it work ?')} onPresentCreateGauge={onPresentCreateGauge} />
        <Questions />
      </Page>
      {createPortal(<ScrollToTopButtonV2 />, document.body)}
    </>
  )
}

export default Pools
