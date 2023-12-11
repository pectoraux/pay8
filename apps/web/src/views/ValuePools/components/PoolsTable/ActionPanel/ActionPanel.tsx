import styled, { keyframes, css } from 'styled-components'
import { Box, Flex, Text, useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { useState } from 'react'
import Harvest from './Harvest'
import Stake from './Stake'
import PoolStatsInfo from '../../PoolStatsInfo'
import Purchases from './Purchases'
import Sponsors from './Sponsors'
import Loans from './Loans'

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

const ActionPanel: React.FC<any> = ({ account, pool, expanded }) => {
  const { isMobile } = useMatchBreakpoints()
  const [showSponsors, setShowSponsors] = useState(false)
  const toggleSponsors = () => setShowSponsors(!showSponsors)

  const [showLoans, setShowLoans] = useState(false)
  const toggleLoans = () => setShowLoans(!showLoans)

  const [showScheduledPurchases, setShowScheduledPurchases] = useState(false)
  const toggleScheduledPurchases = () => setShowScheduledPurchases(!showScheduledPurchases)
  console.log('ActionPanel===========>', pool)
  return (
    <>
      <StyledActionPanel expanded={expanded}>
        <InfoSection>
          <Flex flexDirection="column" mb="8px">
            <PoolStatsInfo pool={pool} account={account} alignLinksToRight={isMobile} />
          </Flex>
        </InfoSection>
        <ActionContainer>
          <Box width="100%">
            <ActionContainer hasBalance>
              <Harvest pool={pool} />
              <Stake
                sousId={pool?.sousId}
                id={pool?.id}
                toggleLoans={toggleLoans}
                toggleSponsors={toggleSponsors}
                toggleScheduledPurchases={toggleScheduledPurchases}
              />
            </ActionContainer>
          </Box>
        </ActionContainer>
      </StyledActionPanel>
      {showSponsors && <Sponsors pool={pool} sponsors={pool?.sponsors ?? []} />}
      {showLoans && <Loans pool={pool} loans={pool?.loans ?? []} />}
      {showScheduledPurchases && (
        <Purchases queue={pool?.purchaseHistory?.filter((ph) => ph.active)} valuepoolAddress={pool?.id} />
      )}
    </>
  )
}

export default ActionPanel
