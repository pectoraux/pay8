import { memo, useState } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'
// import ActionPanel as BountiesPanel from 'views/TrustBounties/components/PoolsTable/ActionPanel/ActionPanel'

import NameCell from './Cells/NameCell'
import DateInfoCell from './Cells/DateInfoCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, variant, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const token = useCurrency(pool.tokenAddress)
  const [currPool, setCurrPool] = useState(pool)
  return variant === 'stakemarket' ? (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currPool={currPool} setCurrPool={setCurrPool} expanded />}
    >
      <NameCell pool={pool} symbol={token?.symbol} />
      <TotalUsersCell labelText={t('Total Users')} amount={pool?.partnerStakeIds?.length} />
      <TotalValueCell labelText={t('Total Liquidity')} amount={pool.totalLiquidity} symbol={pool?.symbol ?? ''} />
      <DateInfoCell
        sousId={sousId}
        labelText={parseFloat(currPool?.waitingDuration) ? t('Countdown to litigations') : t('Next Payable/Receivable')}
      />
    </Pool.ExpandRow>
  ) : null
  // <Pool.ExpandRow
  //   initialActivity={initialActivity}
  //   panel={<BountiesPanel account={account} pool={pool} expanded />}
  // >
  //   <NameCell pool={pool} symbol='' />
  //   <TotalUsersCell labelText={t('Total Users')} amount={pool?.partnerStakeIds?.length} />
  //   <TotalValueCell
  //     labelText={t('Total Liquidity')}
  //     amount={pool.totalLiquidity}
  //     symbol=''
  //   />
  // </Pool.ExpandRow>
}

export default memo(PoolRow)
