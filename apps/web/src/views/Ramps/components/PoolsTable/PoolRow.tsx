import { memo, useMemo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const rampAccount = useMemo(
    () => pool.accounts?.find((acct) => acct.token.address === currState[pool.rampAddress]),
    [pool, currState],
  )
  console.log('ramppool=================>', pool)

  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} rampAccount={rampAccount} expanded />}
    >
      <NameCell pool={pool} rampAccount={rampAccount} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={pool?.accounts?.length} />
      <TotalValueCell
        labelText={t('Minted Liquidity')}
        amount={getBalanceNumber(rampAccount?.minted, rampAccount?.token?.decimals)}
        symbol={rampAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        labelText={t('Burnt Liquidity')}
        amount={getBalanceNumber(rampAccount?.burnt, rampAccount?.token?.decimals)}
        symbol={rampAccount?.token?.symbol ?? ''}
      />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
