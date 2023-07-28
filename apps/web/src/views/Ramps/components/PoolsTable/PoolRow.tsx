import { memo, useMemo } from 'react'
import { useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { isLg, isXl, isXxl, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const rampAccount = useMemo(
    () => pool.accounts?.find((acct) => acct.token.address === currState[pool.rampAddress]),
    [pool, currState],
  )
  console.log('ramppool=================>', pool)

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} rampAccount={rampAccount} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={0} />
      <TotalValueCell labelText={t('Minted Liquidity')} amount={0} symbol="" />
      <TotalValueCell labelText={t('Burnt Liquidity')} amount={0} symbol="" />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
