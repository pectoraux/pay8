import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/bills/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('billpool1====>', pool, currAccount)
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={pool?.protocols?.length ?? 0} />
      <VotesCell pool={pool} />
      {Number(currAccount?.dueReceivable) ? (
        <TotalValueCell
          labelText={t('Amount Due')}
          amount={currAccount?.dueReceivable}
          decimals={currAccount?.token?.decimals}
          symbol={currAccount?.token?.symbol ?? ''}
        />
      ) : null}
      {Number(currAccount?.duePayable) ? (
        <TotalValueCell
          labelText={t('Amount Payable')}
          amount={currAccount?.duePayable}
          decimals={currAccount?.token?.decimals}
          symbol={currAccount?.token?.symbol ?? ''}
        />
      ) : null}
      <EndsInCell value={currAccount?.nextDueReceivable} labelText={t('Next Due')} />
      <EndsInCell value={currAccount?.nextPayable} labelText={t('Next Payable')} />
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
