import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool, useCurrBribe } from 'state/lotteries/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import TicketCell from './Cells/TicketCell'

const PoolRow: React.FC<any> = ({ pool, account, initialActivity }) => {
  // const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currState2 = useCurrBribe()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(
    () => pool?.tokenData?.find((n) => n.token.address === currState[pool?.id]),
    [pool, currState],
  )
  const currUser = useMemo(() => pool?.users?.find((n) => n.id === currState2[pool?.id]), [currAccount, currState2])
  console.log('lotterypool1====>', pool, currAccount)
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Users')} amount={pool?.users?.length} />
      <TotalValueCell pool={pool} labelText={t('End Amount')} />
      <TicketCell currUser={currUser} pool={pool} currAccount={currAccount} decimals={currAccount?.token?.decimals} />
      <EndsInCell labelText={t('Start Time')} amount={pool?.startTime} />
      <EndsInCell labelText={t('End Time')} amount={pool?.endTime} />
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
