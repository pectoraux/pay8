import { memo, useMemo } from 'react'
import { Pool, TabMenu } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/lotteries/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currAccount = useMemo(
    () => pool?.tokenData?.find((n) => n.token.address === currState[pool?.id]),
    [pool, currState],
  )
  console.log('lotterypool1====>', pool, currAccount)
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currAccount={currAccount} expanded />}
    >
      <TabMenu>
        <NameCell pool={pool} />
        <TotalUsersCell labelText={t('Total Users')} amount={pool?.users?.length} />
        <TotalValueCell pool={pool} labelText={t('End Amount')} />
        <EndsInCell labelText={t('Start Time')} amount={pool?.startTime} />
        <EndsInCell labelText={t('End Time')} amount={pool?.endTime} />
      </TabMenu>
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
