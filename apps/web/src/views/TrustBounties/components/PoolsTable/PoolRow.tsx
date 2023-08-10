import { memo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool } from 'state/trustbounties/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import DateInfoCell from './Cells/DateInfoCell'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const token = useCurrency(pool?.tokenAddress)

  console.log('bountiespool=================>', pool)

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} symbol={pool?.token?.symbol} />
      <TotalUsersCell labelText={t('Total Users')} amount={parseInt(pool?.partnerStakeId) ? 2 : 1} />
      <TotalValueCell
        labelText={t('Total Liquidity')}
        amount={getBalanceNumber(pool?.totalLiquidity, token?.decimals)}
        symbol={token?.symbol ?? ''}
      />
      <DateInfoCell labelText={t('Next Payable/Receivable')} pool={pool} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
