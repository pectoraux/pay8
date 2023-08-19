import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/sponsors/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, currAccount, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  console.log('sponsorpool1===========>', sousId, currAccount, pool)
  const tabs = (
    <>
      <NameCell currAccount={currAccount} />
      <TotalValueCell
        labelText={t('Liquidity')}
        amount={getBalanceNumber(currAccount?.totalLiquidity, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        labelText={t('Amount Due')}
        amount={getBalanceNumber(currAccount?.duePayable, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell labelText={t('Next Due')} currAccount={currAccount} />
    </>
  )
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currAccount={currAccount} expanded />}
    >
      {isMobile ? (
        <TabMenu>
          {tabs}
          <></>
        </TabMenu>
      ) : (
        tabs
      )}
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
