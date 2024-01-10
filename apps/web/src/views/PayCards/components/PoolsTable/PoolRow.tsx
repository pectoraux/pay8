import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/cards/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(() => pool?.balances?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('cardpool1====>', pool, currAccount, currState)
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Balances')} amount={pool?.balances?.length} />
      <TotalValueCell
        labelText={t('Balance')}
        amount={getBalanceNumber(currAccount?.balance, currAccount?.decimals ?? 18)}
        decimals={3}
        symbol={currAccount?.symbol ?? ''}
      />
    </>
  )
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currAccount={currAccount} expanded />}
    >
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
