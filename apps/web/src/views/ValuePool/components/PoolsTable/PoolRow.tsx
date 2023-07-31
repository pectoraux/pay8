import { memo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool } from 'state/valuepools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import NameCell from './Cells/NameCell'
import AccountID from './Cells/AccountID'
import ActionPanel from './ActionPanel/ActionPanel'
import VaSpecsCell from './Cells/VaSpecsCell'
import VaSpecs2Cell from './Cells/VaSpecs2Cell'

const PoolRow: React.FC<any> = ({ id, account, vpAccount, initialActivity }) => {
  const { pool } = usePool(id)
  const { t } = useTranslation()
  const vpCurrencyInput = useCurrency(pool?.tokenAddress)

  console.log('valuepool====>', vpAccount, pool)
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} vpAccount={vpAccount} expanded />}
    >
      <NameCell pool={pool} vpCurrencyInput={vpCurrencyInput} vpAccount={vpAccount} />
      <AccountID labelText={t('Token ID')} vpAccount={vpAccount} />
      <VaSpecsCell pool={pool} nft={vpAccount} vpCurrencyInput={vpCurrencyInput} />
      <VaSpecs2Cell nft={vpAccount} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
