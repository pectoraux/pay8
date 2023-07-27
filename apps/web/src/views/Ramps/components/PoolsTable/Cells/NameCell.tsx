import { Text, TokenPairImage as UITokenPairImage, useMatchBreakpoints, Skeleton, Pool } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { TokenPairImage } from 'components/TokenImage'
import { vaultPoolConfig } from 'config/constants/pools'
import { useTranslation } from '@pancakeswap/localization'
import { memo, useMemo } from 'react'
import { useVaultPoolByKey } from 'state/ramps/hooks'
import { VaultKey, DeserializedLockedCakeVault } from 'state/types'
import styled from 'styled-components'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getVaultPosition, VaultPosition, VaultPositionParams } from 'utils/cakePool'
import { Token } from '@pancakeswap/sdk'

interface NameCellProps {
  pool: Pool.DeserializedPool<Token>
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<React.PropsWithChildren<NameCellProps>> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { sousId, stakingToken, earningToken, userData, isFinished, vaultKey, totalStaked } = pool

  const stakingTokenSymbol = stakingToken.symbol
  const earningTokenSymbol = earningToken.symbol

  let title: React.ReactNode = `${t('Earn')} ${earningTokenSymbol}`
  let subtitle: React.ReactNode = `${t('Stake')} ${stakingTokenSymbol}`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isMobile)

  return (
    <StyledCell role="cell">
      <TokenPairImage
        primaryToken={earningToken}
        secondaryToken={stakingToken}
        mr="8px"
        width={40}
        height={40}
        style={{ minWidth: 40 }}
      />
      <Pool.CellContent>
        <Text fontSize="12px" bold color={isFinished ? 'failure' : 'secondary'} textTransform="uppercase">
          {t('Staked')}
        </Text>
        <Text bold={!isMobile} small={isMobile}>
          {title}
        </Text>
        {showSubtitle && (
          <Text fontSize="12px" color="textSubtle">
            {subtitle}
          </Text>
        )}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell

const stakedStatus = {
  [VaultPosition.None]: { text: '', color: 'secondary' },
  [VaultPosition.Locked]: { text: 'Locked', color: 'secondary' },
  [VaultPosition.LockedEnd]: { text: 'Locked End', color: 'secondary' },
  [VaultPosition.AfterBurning]: { text: 'After Burning', color: 'failure' },
  [VaultPosition.Flexible]: { text: 'Flexible', color: 'success' },
}

export const StakedCakeStatus: React.FC<React.PropsWithChildren<VaultPositionParams>> = memo(
  ({ userShares, locked, lockEndTime }) => {
    const vaultPosition = getVaultPosition({ userShares, locked, lockEndTime })
    const { t } = useTranslation()
    return (
      <Text fontSize="12px" bold color={stakedStatus[vaultPosition].color} textTransform="uppercase">
        {t(stakedStatus[vaultPosition].text)}
      </Text>
    )
  },
)
