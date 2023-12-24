import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/games/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, pool, account, initialActivity }) => {
  // const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('gamepool11====>', pool, currAccount)
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={Number(pool?.numPlayers)} />
      <TotalValueCell pool={pool} currAccount={currAccount} symbol={pool?.token?.symbol?.toUpperCase() ?? ''} />
      <TotalValueCell symbol="" decimals={0} labelText={t('Total Score')} amount={pool?.totalScore} />
      <TotalValueCell
        decimals={5}
        labelText={t('Price Per Minute')}
        amount={getBalanceNumber(pool?.pricePerMinutes, pool?.token?.decimals)}
        symbol={pool?.token?.symbol?.toUpperCase() ?? ''}
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
