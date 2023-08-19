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
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

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
          amount={getBalanceNumber(currAccount?.dueReceivable, currAccount?.token?.decimals)}
          decimals={5}
          symbol={currAccount?.token?.symbol ?? ''}
        />
      ) : null}
      {Number(currAccount?.duePayable) ? (
        <TotalValueCell
          labelText={t('Amount Payable')}
          amount={getBalanceNumber(currAccount?.duePayable, currAccount?.token?.decimals)}
          decimals={5}
          symbol={currAccount?.token?.symbol ?? ''}
        />
      ) : null}
      <EndsInCell currAccount={currAccount} t={t} />
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
