import { memo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/valuepools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import NameCell from './Cells/NameCell'
import VaSpecsCell from './Cells/VaSpecsCell'
import VaSpecs2Cell from './Cells/VaSpecs2Cell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ id, account, initialActivity, expanded, setExpanded }) => {
  const { pool } = usePool(id)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const vpCurrencyInput = useCurrency(pool?.tokenAddress)
  console.log('PoolRow==============>', id, pool)
  const tabs = (
    <>
      <NameCell pool={pool} vpCurrencyInput={vpCurrencyInput} />
      <TotalUsersCell labelText={t('Total Users')} amount={pool?.tokens?.length} />
      <TotalValueCell pool={pool} vpCurrencyInput={vpCurrencyInput} />
      <VaSpecsCell pool={pool} vpCurrencyInput={vpCurrencyInput} />
      <VaSpecs2Cell pool={pool} />
    </>
  )
  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
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
