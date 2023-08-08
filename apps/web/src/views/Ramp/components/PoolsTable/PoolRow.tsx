import { memo, useMemo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool2 } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, rampAddress, initialActivity }) => {
  const { pool } = usePool2(rampAddress)
  const { t } = useTranslation()
  const rampAccount = pool?.accounts?.find((acct) => acct.sousId === sousId)
  console.log('rampAccount============>', rampAccount, pool)
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} rampAccount={rampAccount} expanded />}
    >
      <NameCell pool={pool} rampAccount={rampAccount} />
      <TotalValueCell
        labelText={t('Mintable')}
        amount={rampAccount?.mintable}
        symbol={rampAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        labelText={t('Minted Liquidity')}
        amount={rampAccount?.minted}
        symbol={rampAccount?.token?.symbol ?? ''}
      />
      <TotalValueCell
        labelText={t('Burnt Liquidity')}
        amount={rampAccount?.burnt}
        symbol={rampAccount?.token?.symbol ?? ''}
      />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
