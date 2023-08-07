import { memo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool } from 'state/valuepools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import NameCell from './Cells/NameCell'
import VaSpecsCell from './Cells/VaSpecsCell'
import VaSpecs2Cell from './Cells/VaSpecs2Cell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ id, account, initialActivity }) => {
  const { pool } = usePool(id)
  const { t } = useTranslation()
  const vpCurrencyInput = useCurrency(pool?.tokenAddress)
  console.log('PoolRow==============>', id, pool)
  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} vpCurrencyInput={vpCurrencyInput} />
      <TotalUsersCell labelText={t('Total Users')} amount={pool?.tokens?.length} />
      <TotalValueCell pool={pool} vpCurrencyInput={vpCurrencyInput} />
      <VaSpecsCell pool={pool} vpCurrencyInput={vpCurrencyInput} />
      <VaSpecs2Cell pool={pool} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
