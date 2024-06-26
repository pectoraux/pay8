import BigNumber from 'bignumber.js'
import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/sponsors/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { useGetTotalLiquidity } from 'state/arps/hooks'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import TotalValueCell2 from './Cells/TotalValueCell2'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  const { data: totalLiquidity } = useGetTotalLiquidity(currAccount?.token?.address, pool?.id)
  console.log('sponsorpool====>', pool, currAccount, currState)
  const tabs = (
    <>
      <NameCell mr="100px" pool={pool} />
      <TotalUsersCell
        pr="200px"
        labelText={t('Total Accounts')}
        amount={pool?.accounts?.filter((protocol) => protocol?.active)?.length}
      />
      <TotalValueCell2
        totalLiquidity={getBalanceNumber(
          new BigNumber(currAccount?.totalLiquidity?.toString() ?? totalLiquidity?.toString()),
          currAccount?.token?.decimals,
        )}
        symbol={currAccount?.token?.symbol ?? currAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        pr="200px"
        labelText={t('Amount Due')}
        amount={getBalanceNumber(currAccount?.duePayable, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <VotesCell pr="200px" pool={pool} />
      <EndsInCell pr="200px" labelText={t('Due Date')} currAccount={currAccount} />
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
