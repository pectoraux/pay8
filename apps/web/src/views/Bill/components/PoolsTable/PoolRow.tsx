import { memo } from 'react'
import { usePool } from 'state/bills/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'

import NameCell from './Cells/NameCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import CreditCell from './Cells/CreditCell'
import DebitCell from './Cells/DebitCell'
import TotalValueCell from './Cells/TotalValueCell'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

const PoolRow: React.FC<any> = ({ sousId, account, currAccount, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  console.log('billpool1==========>', pool, currAccount)
  const tabs = (
    <>
      <NameCell pool={pool} currAccount={currAccount} />
      <CreditCell currAccount={currAccount} />
      <DebitCell currAccount={currAccount} />
      <TotalValueCell
        labelText={t('Due Payable')}
        amount={getBalanceNumber(currAccount?.duePayable, currAccount?.token?.decimals)}
        decimals={3}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        labelText={t('Due Receivable')}
        amount={getBalanceNumber(currAccount?.dueReceivable, currAccount?.token?.decimals)}
        decimals={3}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell currAccount={currAccount} t={t} />
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
