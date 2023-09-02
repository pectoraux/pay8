import { memo, useMemo } from 'react'
import { useCurrPool, usePool } from 'state/pools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'

import NameCell from './Cells/NameCell'
import TotalValueCell from './Cells/TotalValueCell'
import ActionPanel from './ActionPanel/ActionPanel'
import ExpandRow from './ExpandRow'
import EndsInCell from './Cells/EndsInCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isMobile } = useMatchBreakpoints()
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currAccount = useMemo(() => pool?.accounts?.find((bal) => bal.id === currState[pool?.id]), [currState])
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalValueCell
        symbol={pool?.symbol}
        decimals={pool?.decimals}
        value={pool?.totalLiquidity}
        labelText={t('Total Liquidity')}
      />
      <TotalValueCell
        symbol={pool?.symbol}
        decimals={pool?.decimals}
        value={pool?.toDistribute}
        labelText={t('To Distribute')}
      />
      <TotalValueCell
        symbol={pool?.symbol}
        decimals={pool?.decimals}
        value={currAccount?.earned}
        labelText={t('Earned')}
      />
      <EndsInCell pool={pool} />
    </>
  )
  return (
    <ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel
          account={account}
          pool={pool}
          expanded
          currAccount={currAccount}
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
