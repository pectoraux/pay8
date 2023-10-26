import { memo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool } from 'state/trustbounties/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalValueCell from './Cells/TotalValueCell'
import DateInfoCell from './Cells/DateInfoCell'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const token = useCurrency(pool?.tokenAddress)
  console.log('bountiespool=================>', pool)
  const tabs = (
    <>
      <NameCell pool={pool} symbol={pool?.token?.symbol} />
      <TotalUsersCell labelText={t('Total Users')} amount={parseInt(pool?.partnerStakeId) ? 2 : 1} />
      <TotalValueCell
        labelText={parseInt(pool?.isNFT) ? t('Locked Collateral ID') : t('Total Liquidity')}
        pool={pool}
        amount={getBalanceNumber(pool?.totalLiquidity, parseInt(pool?.isNFT) ? 0 : token?.decimals)}
        symbol={token?.symbol ?? ''}
      />
      <DateInfoCell t={t} pool={pool} />
    </>
  )
  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
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
