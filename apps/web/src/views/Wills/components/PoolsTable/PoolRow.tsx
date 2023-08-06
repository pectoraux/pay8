import { memo, useMemo } from 'react'
import { Pool } from '@pancakeswap/uikit'
import { usePool, useCurrPool, useCurrBribe } from 'state/wills/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currState2 = useCurrBribe()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  const currToken = useMemo(
    () => pool?.tokens?.find((n) => n.tokenAddress === currState2[pool?.id]),
    [pool, currState2],
  )
  console.log('willpool1====>', pool, currAccount, currToken, currState, currState2, currState2[pool?.id])
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currToken={currToken} currAccount={currAccount} expanded />}
    >
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={pool?.protocols?.length} />
      <VotesCell pool={pool} />
      <TotalValueCell labelText={t('Min. NFT Wthdrawable')} amount={pool?.minNFTWithdrawableNow} symbol=" NFT" />
      <TotalValueCell labelText={t('Min. FT Wthdrawable')} amount={pool?.minWithdrawableNow} symbol="%" />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
