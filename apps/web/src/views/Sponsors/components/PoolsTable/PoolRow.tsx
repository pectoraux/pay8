import { memo, useMemo } from 'react'
import { Flex, Pool, TabMenu, Card, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/sponsors/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(
    () => pool?.accounts?.find((n) => n.protocolId === currState[pool?.id]),
    [pool, currState],
  )
  console.log('sponsorpool====>', pool, currAccount, currState)
  const tabs = (
    <>
      <NameCell mr="100px" pool={pool} />
      <TotalUsersCell pr="200px" labelText={t('Total Accounts')} amount={pool?.accounts?.length} />
      <TotalValueCell
        pr="200px"
        labelText={t('Due Now')}
        amount={getBalanceNumber(currAccount?.duePayable, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <VotesCell pr="200px" pool={pool} />
      <EndsInCell pr="200px" currAccount={currAccount} />
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
