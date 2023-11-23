import { memo, useMemo, useState } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/bills/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import TotalValueCell2 from './Cells/TotalValueCell2'
import { useCurrency } from 'hooks/Tokens'
import { useGetTotalLiquidity } from 'state/arps/hooks'
import BigNumber from 'bignumber.js'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  const currencyId = useMemo(() => currAccount?.token?.address, [currAccount])
  const inputCurrency = useCurrency(currencyId)
  const [currency, setCurrency] = useState(inputCurrency ?? currAccount?.token?.address) as any
  const { data: totalLiquidity } = useGetTotalLiquidity(currency?.address, pool?.id)
  console.log('billpool1====>', pool, currAccount)
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={pool?.protocols?.length ?? 0} />
      <TotalValueCell2
        totalLiquidity={getBalanceNumber(
          new BigNumber(currAccount?.totalLiquidity?.toString() ?? totalLiquidity?.toString()),
          currency?.decimals,
        )}
        symbol={currAccount?.token?.symbol ?? currency?.symbol ?? ''}
      />
      <TotalValueCell
        amountDueReceivable={getBalanceNumber(currAccount?.dueReceivable, currAccount?.token?.decimals)}
        amountDuePayable={getBalanceNumber(currAccount?.duePayable, currAccount?.token?.decimals)}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <EndsInCell currAccount={currAccount} />
      <VotesCell pool={pool} />
    </>
  )
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel
          account={account}
          pool={pool}
          currAccount={currAccount}
          currency={currency ?? inputCurrency}
          setCurrency={setCurrency}
          expanded
        />
      }
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
