import { memo } from 'react'
import { usePool } from 'state/arps/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import EndsInCell from './Cells/EndsInCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, currAccount, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const tabs = (
    <>
      <NameCell pool={pool} currAccount={currAccount} />
      <TotalValueCell
        labelText={t('Liquidity')}
        amount={getBalanceNumber(currAccount?.totalLiquidity, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
        decimals={5}
      />
      <TotalValueCell
        labelText={t('Amount Receivable')}
        amount={getBalanceNumber(currAccount?.amountReceivable, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
        decimals={5}
      />
      <TotalValueCell
        labelText={t('Amount Payable')}
        amount={getBalanceNumber(currAccount?.amountPayable, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
        decimals={5}
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
