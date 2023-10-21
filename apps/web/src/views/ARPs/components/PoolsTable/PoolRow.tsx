import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/arps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import TotalValueCell2 from './Cells/TotalValueCell2'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('arppool1====>', pool, currAccount)
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={pool?.protocols?.length} />
      <TotalValueCell2
        totalLiquidity={getBalanceNumber(currAccount?.totalLiquidity, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        amountDueReceivable={getBalanceNumber(currAccount?.amountDueReceivable, currAccount?.token?.decimals)}
        amountDuePayable={getBalanceNumber(currAccount?.amountDuePayable, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell currAccount={currAccount} />
      <VotesCell pool={pool} />
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
