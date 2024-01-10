import BigNumber from 'bignumber.js'
import { memo, useEffect, useMemo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/contributors/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useGetTotalLiquidity } from 'state/arps/hooks'
import { getContributorsVoterAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import TotalValueCell2 from 'views/Businesses/components/PoolsTable/Cells/TotalValueCell2'

import NameCell from './Cells/NameCell'
import BribesCell from './Cells/BribesCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalVotesCell from './Cells/TotalVotesCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrPool()
  const tokenAddress = pool?.vestingTokenAddress || ''
  const { data: totalLiquidity, refetch } = useGetTotalLiquidity(tokenAddress, getContributorsVoterAddress())
  const { isMobile } = useMatchBreakpoints()
  const currBribe = useMemo(() => {
    if (pool?.userDataLoaded) {
      return pool?.userData?.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
    }
    return pool?.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
  }, [currState, tokenAddress, pool])
  console.log('contributorpool=================>', pool)

  useEffect(() => {
    refetch()
  }, [pool.claimable, refetch])

  const tabs = (
    <>
      <NameCell pool={pool} />
      <BribesCell pool={pool} currBribe={currBribe} account={account} />
      <TotalValueCell2
        totalLiquidity={getBalanceNumber(new BigNumber(totalLiquidity?.toString()))}
        symbol={pool?.vestingTokenSymbol ?? ''}
      />
      <TotalValueCell labelText={t('Claimable')} amount={pool?.claimable} symbol={pool?.vestingTokenSymbol || ''} />
      <TotalValueCell
        labelText={t('Rewards Claimed')}
        amount={getBalanceNumber(pool?.balanceOf)}
        symbol={pool?.vestingTokenSymbol || ''}
      />
      <TotalVotesCell pool={pool} />
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
