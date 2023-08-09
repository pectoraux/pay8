import { memo, useMemo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool2 } from 'state/sponsors/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ id, protocolId, account, initialActivity }) => {
  const { pool } = usePool2(id)
  const { t } = useTranslation()
  const currAccount = useMemo(
    () => pool?.accounts?.find((acct) => acct.protocolId === protocolId),
    [id, pool, protocolId],
  )
  console.log('sponsorpool1===========>', id, protocolId, currAccount, pool)
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currAccount={currAccount} expanded />}
    >
      <NameCell currAccount={currAccount} />
      <TotalValueCell
        labelText={t('Liquidity')}
        amount={getBalanceNumber(currAccount?.totalLiquidity, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        labelText={t('Amount Due')}
        amount={getBalanceNumber(currAccount?.duePayable, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell labelText={t('Next Due')} currAccount={currAccount} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
