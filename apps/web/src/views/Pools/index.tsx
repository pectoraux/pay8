import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { useWeb3React } from '@pancakeswap/wagmi'
import Image from 'next/image'
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
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithFilterSelector } from 'state/pools/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@pancakeswap/sdk'
import { TokenPairImage } from 'components/TokenImage'

import CardActions from './components/PoolCard/CardActions'
import AprRow from './components/PoolCard/AprRow'
import CardFooter from './components/PoolCard/CardFooter'
import PoolsTable from './components/PoolsTable/PoolsTable'
import PoolControls from './components/PoolControls'
import CreatePoolModal from './components/CreatePoolModal'
import Steps from './Steps'
import Questions from './components/Questions'
import { useRouter } from 'next/router'

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
  const router = useRouter()
  const { account } = useWeb3React()
  const { pools, userDataLoaded } = usePoolsWithFilterSelector()
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
          {/* <Box>
          <CardWrapper>
            <Card p="0px" style={{ zIndex: 1 }}>
              <StyledCardBody style={{ padding: '15px 24px' }}>
                <RocketIcon />
                <Text fontSize={22} bold color="text" marginBottom="-12px" display="inline-block" ml="7px">
                  {t('Distributor')}
                </Text>
                {tooltipVisible && tooltip}
                <Box ref={targetRef} style={{ float: 'right', position: 'relative', top: '6px' }}>
                  <HelpIcon color={theme.colors.textSubtle} />
                </Box>
              </StyledCardBody>
              <Box ml="10px">
              <Text color="textSubtle" fontSize={12} bold>
                {t('Click to distribute rewards to the pools')}
              </Text>
              <Text color="textSubtle" fontSize={12} mb="16px">
                {t('This will distribute the trading fees from the liquidity pools to the different pools below.')}
              </Text>
              <Button width="100%" style={{ backgroundColor: theme.colors.textSubtle }}>
                {t('Distribute Earnings')}
              </Button>
              </Box>
            </Card>
          </CardWrapper>
        </Box> */}
        </FarmFlexWrapper>
      </PageHeader>
      <Page>
        <PoolControls pools={pools}>
          {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch }) => (
            <>
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )}
              {viewMode === ViewMode.CARD ? (
                <CardLayout>
                  {chosenPools.map((pool) => (
                    <Pool.PoolCard<Token>
                      key={pool.sousId}
                      pool={pool}
                      isStaked={Boolean(pool?.userData?.stakedBalance?.gt(0))}
                      cardContent={
                        account ? (
                          <CardActions pool={pool} stakedBalance={pool?.userData?.stakedBalance} />
                        ) : (
                          <>
                            <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                              {t('Start earning')}
                            </Text>
                            <ConnectWalletButton />
                          </>
                        )
                      }
                      tokenPairImage={
                        <TokenPairImage
                          primaryToken={pool.earningToken}
                          secondaryToken={pool.stakingToken}
                          width={64}
                          height={64}
                        />
                      }
                      cardFooter={<CardFooter pool={pool} account={account} />}
                      aprRow={<AprRow pool={pool} stakedBalance={pool?.userData?.stakedBalance} />}
                    />
                  ))}
                </CardLayout>
              ) : (
                <PoolsTable urlSearch={normalizedUrlSearch} pools={chosenPools} account={account} />
              )}
            </>
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
