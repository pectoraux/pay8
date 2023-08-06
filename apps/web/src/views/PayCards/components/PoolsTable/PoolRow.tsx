import { memo, useMemo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/cards/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currAccount = useMemo(() => pool?.balances?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('cardpool1====>', pool, currAccount, currState)
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currAccount={currAccount} expanded />}
    >
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Balances')} amount={pool?.balances?.length} />
      <TotalValueCell
        labelText={t('Balance')}
        amount={currAccount?.balance}
        decimals={currAccount?.decimals ?? 18}
        symbol={currAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell labelText={t('Token ID')} amount={pool?.tokenId} decimals={0} symbol="" />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
