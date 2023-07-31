import { memo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool } from 'state/worlds/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import RatingCell from './Cells/RatingCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ id, account, currAccount, initialActivity }) => {
  const { pool } = usePool(id)
  const { t } = useTranslation()
  console.log('ramp====>', pool, currAccount)
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currAccount={currAccount} expanded />}
    >
      <NameCell pool={pool} currAccount={currAccount} />
      <RatingCell labelText={t('Rating')} amount={currAccount?.rating} />
      <TotalValueCell
        labelText={t('Amount Due')}
        amount={currAccount?.amountReceivable}
        decimals={currAccount?.token?.decimals}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell labelText={t('Next Due')} currAccount={currAccount} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
