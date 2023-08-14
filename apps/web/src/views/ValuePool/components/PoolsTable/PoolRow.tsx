import { memo } from 'react'
import { Pool, TabMenu } from '@pancakeswap/uikit'
import { usePool2 } from 'state/valuepools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import NameCell from './Cells/NameCell'
import AccountID from './Cells/AccountID'
import ActionPanel from './ActionPanel/ActionPanel'
import VaSpecsCell from './Cells/VaSpecsCell'
import VaSpecs2Cell from './Cells/VaSpecs2Cell'

const PoolRow: React.FC<any> = ({ id, account, vpAccount, initialActivity }) => {
  const { pool } = usePool2(id)
  const { t } = useTranslation()
  const vpCurrencyInput = useCurrency(pool?.tokenAddress)

  console.log('valuepool====>', vpAccount, pool, id)
  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <TabMenu>
        <NameCell pool={pool} vpCurrencyInput={vpCurrencyInput} vpAccount={vpAccount} />
        <AccountID labelText={t('Token ID')} vpAccount={vpAccount} />
        <VaSpecsCell pool={pool} nft={vpAccount} vpCurrencyInput={vpCurrencyInput} />
        <VaSpecs2Cell nft={vpAccount} />
      </TabMenu>
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
