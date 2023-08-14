import { memo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/arps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import EndsInCell from './Cells/EndsInCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ id, account, currAccount, initialActivity }) => {
  const { pool } = usePool(id)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const tabs = (
    <>
      <NameCell pool={pool} currAccount={currAccount} />
      <TotalValueCell
        labelText={t('Liquidity')}
        amount={currAccount?.totalLiquidity}
        symbol={currAccount?.token?.symbol ?? ''}
        decimals={currAccount?.token?.decimals}
      />
      <TotalValueCell
        labelText={t('Amount Due')}
        amount={currAccount?.amountReceivable}
        symbol={currAccount?.token?.symbol ?? ''}
        decimals={currAccount?.token?.decimals}
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
