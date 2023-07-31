import { memo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ id, account, currAccount, initialActivity }) => {
  const { pool } = usePool(id)
  const { t } = useTranslation()

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell currAccount={currAccount} />
      <TotalValueCell
        labelText={t('Liquidity')}
        amount={currAccount?.totalLiquidity}
        decimals={currAccount?.token?.decimals}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        labelText={t('Amount Due')}
        amount={currAccount?.amountPayable}
        decimals={currAccount?.token?.decimals}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell labelText={t('Next Due')} currAccount={currAccount} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
