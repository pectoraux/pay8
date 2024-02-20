import { memo, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool, useCurrBribe } from 'state/wills/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useNativeBalances } from 'state/wallet/hooks'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const currState2 = useCurrBribe()
  const { isMobile } = useMatchBreakpoints()
  const currAccount = useMemo(() => pool?.accounts?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  const currToken = useMemo(() => pool?.tokens?.find((n) => n.id === currState2[pool?.id]), [pool, currState2])
  const nb = useNativeBalances([pool?.id])
  const nativeBalances = Object.values(nb) as any
  const nativeBalance = nativeBalances?.length && nativeBalances[0]?.toFixed()
  console.log(
    'willpool1====>',
    nativeBalance,
    pool,
    currAccount,
    currToken,
    currState,
    currState2,
    currState2[pool?.id],
  )
  const tabs = (
    <>
      <NameCell pool={pool} />
      <TotalUsersCell
        decimals={0}
        labelText={t('Total Accounts')}
        amount={pool?.protocols?.filter((protocol) => protocol?.active)?.length}
      />
      <TotalValueCell
        labelText={parseInt(currToken?.tokenType) ? t('Token ID') : t('Total Liquidity')}
        amount={
          parseInt(currToken?.tokenType)
            ? currToken?.value
            : currToken?.isNative
            ? nativeBalance
            : getBalanceNumber(currToken?.totalLiquidity ?? '0', currToken?.decimals ?? 18)
        }
        decimals={parseInt(currToken?.tokenType) ? 0 : 3}
        symbol={currToken?.symbol ?? ''}
        prefix={parseInt(currToken?.tokenType)}
      />
      <TotalValueCell
        labelText={t('Max. NFT Wthdrawable')}
        amount={pool?.minNFTWithdrawableNow}
        decimals={0}
        symbol=" NFT"
      />
      <TotalValueCell labelText={t('Max. FT Wthdrawable')} amount={pool?.minWithdrawableNow} decimals={0} symbol="%" />
    </>
  )
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={
        <ActionPanel
          account={account}
          nativeBalance={nativeBalance}
          pool={pool}
          currToken={currToken}
          currAccount={currAccount}
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
