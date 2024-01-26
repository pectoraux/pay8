import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool, useGetPrice } from 'state/futureCollaterals/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const { isMobile } = useMatchBreakpoints()
  const data = useGetPrice(account) as any
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('futureCollateralpool1====>', pool, currAccount, currState, data)
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalValueCell labelText={t('Auditor Bounty ID')} amount={pool?.auditorBountyId} />
      <TotalValueCell labelText={t('User Bounty ID')} amount={pool?.bountyId} />
      <TotalValueCell labelText={t('Channel')} amount={pool?.channel} />
      <TotalValueCell labelText={t('Token ID')} amount={data?.tokenId} />
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
