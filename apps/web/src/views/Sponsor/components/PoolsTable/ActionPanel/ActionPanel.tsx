import { Token } from '@pancakeswap/sdk'
import styled, { keyframes, css } from 'styled-components'
import PoolStatsInfo from 'views/Sponsors/components/PoolStatsInfo'
import Harvest from 'views/Sponsors/components/PoolsTable/ActionPanel/Harvest'
import { Box, Flex, Text, useMatchBreakpoints, Pool } from '@pancakeswap/uikit'

import Stake from './Stake'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 1000px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 1000px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const ActionContainer = styled.div<{ isAutoVault?: boolean; hasBalance?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: ${({ isAutoVault }) => (isAutoVault ? 'row' : null)};
    align-items: ${({ isAutoVault, hasBalance }) => (isAutoVault ? (hasBalance ? 'flex-start' : 'stretch') : 'center')};
  }
`

interface ActionPanelProps {
  account: string
  pool: Pool.DeserializedPool<Token>
  expanded: boolean
}

const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;

  padding: 8px 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
    flex-basis: 230px;
    ${Text} {
      font-size: 14px;
    }
  }
`

const ActionPanel: React.FC<any> = ({ account, pool, currAccount, expanded }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        <Flex flexDirection="column" mb="8px">
          <PoolStatsInfo
            hideAccounts
            pool={pool}
            account={account}
            currAccount={currAccount}
            alignLinksToRight={isMobile}
          />
        </Flex>
      </InfoSection>
      <ActionContainer>
        <Box width="100%">
          <ActionContainer hasBalance>
            <Harvest pool={pool} currAccount={currAccount} />
            <Stake pool={pool} currAccount={currAccount} />
          </ActionContainer>
        </Box>
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
