import { memo, useState } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/stakemarket/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import NameCell from './Cells/NameCell'
import DateInfoCell from './Cells/DateInfoCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [currPool, setCurrPool] = useState(pool)
  console.log('stakepool=================>', pool)
  const tabs = (
    <>
      <NameCell pool={pool} symbol={pool?.tokenSymbol} />
      <TotalUsersCell labelText={t('Total Users')} amount={pool?.partnerStakeIds?.length + 1} />
      <TotalValueCell
        labelText={t('Total Liquidity')}
        amount={getBalanceNumber(pool.totalLiquidity, pool.tokenDecimals)}
        symbol={pool?.tokenSymbol ?? ''}
      />
      <DateInfoCell
        t={t}
        sousId={sousId}
        labelText={parseFloat(currPool?.waitingDuration) ? t('Countdown to litigations') : t('Next Payable/Receivable')}
      />
    </>
  )
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currPool={currPool} setCurrPool={setCurrPool} expanded />}
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
