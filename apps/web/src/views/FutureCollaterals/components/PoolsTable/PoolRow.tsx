import { memo, useMemo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/futureCollaterals/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('futureCollateralpool1====>', pool, currAccount, currState)
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currAccount={currAccount} expanded />}
    >
      <NameCell pool={pool} />
      <TotalValueCell labelText={t('Auditor Bounty ID')} amount={pool?.auditorBountyId} />
      <TotalValueCell labelText={t('User Bounty ID')} amount={pool?.bountyId} />
      <TotalValueCell labelText={t('Channel')} amount={pool?.Channel} />
      <TotalValueCell labelText={t('Stake ID')} amount={pool?.stakeId} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
