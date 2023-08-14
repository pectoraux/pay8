import { memo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/worlds/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import RatingCell from './Cells/RatingCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

const PoolRow: React.FC<any> = ({ sousId, account, currAccount, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  console.log('worldpool====>', pool, currAccount)
  const tabs = (
    <>
      <NameCell pool={pool} currAccount={currAccount} />
      <RatingCell labelText={t('Rating')} amount={currAccount?.rating} />
      <TotalValueCell
        labelText={t('Amount Due')}
        amount={getBalanceNumber(currAccount?.dueReceivable, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell labelText={t('Next Due')} currAccount={currAccount} />
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
