import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool, useCurrBribe } from 'state/wills/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import VotesCell from './Cells/VotesCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currState2 = useCurrBribe()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  const currToken = useMemo(() => pool?.tokens?.find((n) => n.id === currState2[pool?.id]), [pool, currState2])
  console.log('willpool1====>', pool, currAccount, currToken, currState, currState2, currState2[pool?.id])
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={pool?.protocols?.length} />
      <TotalValueCell
        labelText={parseInt(currToken?.tokenType) ? t('Token ID') : t('Total Liquidity')}
        amount={
          parseInt(currToken?.tokenType)
            ? currToken?.value
            : getBalanceNumber(currToken?.totalLiquidity ?? '0', currToken?.decimals ?? 18)
        }
        symbol={currToken?.symbol ?? ''}
      />
      <TotalValueCell labelText={t('Max. NFT Wthdrawable')} amount={pool?.minNFTWithdrawableNow} symbol=" NFT" />
      <TotalValueCell labelText={t('Max. FT Wthdrawable')} amount={pool?.minWithdrawableNow} symbol="%" />
    </>
  )
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} currToken={currToken} currAccount={currAccount} expanded />}
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
