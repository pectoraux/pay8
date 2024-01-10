import { memo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/auditors/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

const PoolRow: React.FC<any> = ({ sousId, account, currAccount, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  console.log('auditorpool1===============>', pool, sousId)
  const tabs = (
    <>
      <NameCell pool={pool} currAccount={currAccount} />
      <TotalUsersCell labelText={t('ESG Rating')} amount={currAccount?.esgRating ?? 0} />
      <TotalValueCell
        labelText={t('Amount Due')}
        amount={getBalanceNumber(currAccount?.amountReceivable, currAccount?.token?.decimals)}
        decimals={3}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        labelText={t('Liquidity')}
        amount={getBalanceNumber(currAccount?.totalLiquidity, currAccount?.token?.decimals)}
        decimals={3}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell currAccount={currAccount} labelText={t('Next Due')} />
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
