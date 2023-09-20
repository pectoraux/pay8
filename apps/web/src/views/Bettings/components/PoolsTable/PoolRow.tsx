import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool, useCurrBribe } from 'state/bettings/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import TicketCell from './Cells/TicketCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, pool, account, initialActivity }) => {
  // const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currState2 = useCurrBribe()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(() => pool?.bettingEvents?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  const currTicket = useMemo(
    () => currAccount?.tickets?.find((n) => n.id === currState2[pool?.id]),
    [currAccount, currState2],
  )
  console.log('bettingpool1====>', pool, currAccount, currTicket)
  const tabs = (
    <>
      <NameCell pool={pool} currAccount={currAccount} />
      <TotalUsersCell labelText={t('Total Events')} amount={pool?.bettingEvents?.length} />
      <VotesCell pool={currAccount} />
      <TicketCell
        pool={pool}
        currAccount={currAccount}
        currTicket={currTicket}
        decimals={currAccount?.token?.decimals}
      />
      <TotalValueCell labelText={t('Ticket Size')} amount={currAccount?.ticketSize} />
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
