import { memo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool } from 'state/auditors/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ id, account, currAccount, initialActivity }) => {
  const { pool } = usePool(id)
  const { t } = useTranslation()
  console.log('billpool==========>', pool)
  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} currAccount={currAccount} />
      <TotalUsersCell labelText={t('ESG Rating')} amount={currAccount?.esgRating ?? 0} />
      <TotalValueCell
        labelText={t('Amount Due')}
        amount={currAccount?.amountReceivable}
        decimals={currAccount?.token?.decimals}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        labelText={t('Liquidity')}
        amount={currAccount?.totalLiquidity}
        decimals={currAccount?.token?.decimals}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell currAccount={currAccount} labelText={t('Next Due')} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
