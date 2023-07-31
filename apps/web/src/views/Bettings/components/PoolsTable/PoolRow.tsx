import { memo, useMemo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currAccount = useMemo(() => pool?.bettingEvents?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('bettingpool1====>', pool, currAccount)

  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currAccount={currAccount} expanded />}
    >
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Events')} amount={pool?.bettingEvents?.length} />
      <VotesCell pool={currAccount} />
      <TotalValueCell labelText={t('Ticket Size')} amount={currAccount?.ticketSize} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
