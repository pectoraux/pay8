import { memo, useMemo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/ramps/hooks'
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
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('auditorpool1====>', pool, currAccount, currState)
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currAccount={currAccount} expanded />}
    >
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={pool?.protocols?.length ?? 0} />
      <VotesCell pool={pool} />
      <TotalValueCell
        labelText={t('Amount Due')}
        amount={currAccount?.amountReceivable}
        decimals={currAccount?.token?.decimals}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell currAccount={currAccount} labelText={t('Next Due')} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
