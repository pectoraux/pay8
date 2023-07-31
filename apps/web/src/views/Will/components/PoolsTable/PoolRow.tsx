import { memo, useMemo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool, useCurrBribe } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ id, account, currAccount, initialActivity }) => {
  const { pool } = usePool(id)
  const { t } = useTranslation()
  const currState2 = useCurrBribe()
  const currToken = useMemo(
    () => pool?.tokens?.find((n) => n.tokenAddress === currState2[pool?.id]),
    [pool, currState2],
  )
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currToken={currToken} currAccount={currAccount} expanded />}
    >
      <NameCell currAccount={currAccount} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={pool?.protocols?.length} />
      <VotesCell pool={pool} />
      <TotalValueCell labelText={t('Min. NFT Wthdrawable')} amount={pool?.minNFTWithdrawableNow} symbol=" NFT" />
      <TotalValueCell labelText={t('Min. FT Wthdrawable')} amount={pool?.minWithdrawableNow / 100} symbol="%" />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
