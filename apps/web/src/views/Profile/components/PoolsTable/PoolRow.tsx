import { memo } from 'react'
import { TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/profile/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import TotalValueCell from './Cells/TotalValueCell'
import TotalValueCell2 from './Cells/TotalValueCell2'
import TotalUsersCell from './Cells/TotalUsersCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'

const PoolRow: React.FC<any> = ({ sousId, account }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl } = useMatchBreakpoints()
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const currState = useCurrPool()
  const token = pool?.tokens?.find((tk) => tk.tokenAddress?.toLowerCase() === currState[pool?.id]?.toLowerCase())
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Followers')} numCount={pool?.followers?.length} />
      <TotalUsersCell labelText={t('Following')} numCount={pool?.following?.length} />
      <TotalValueCell2 t={t} pool={pool} value={token?.amount} symbol={token?.symbol} decimals={token?.decimals} />
      <TotalValueCell
        labelText={t('Total Bounty')}
        value={token?.bountyBalance}
        symbol={token?.symbol}
        decimals={token?.decimals}
      />
    </>
  )
  return (
    <ExpandRow
      panel={
        <ActionPanel
          account={account}
          pool={pool}
          token={token}
          expanded
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
        />
      }
    >
      {isMobile ? (
        <TabMenu>
          {tabs}
          <></>
        </TabMenu>
      ) : (
        tabs
      )}
    </ExpandRow>
  )
}

export default memo(PoolRow)
