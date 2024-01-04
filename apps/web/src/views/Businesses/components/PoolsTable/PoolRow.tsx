import { memo, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrBribe } from 'state/businesses/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useGetTotalLiquidity } from 'state/arps/hooks'
import { getBusinessVoterAddress } from 'utils/addressHelpers'

import NameCell from './Cells/NameCell'
import BribesCell from './Cells/BribesCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'
import TotalVotesCell from './Cells/TotalVotesCell'
import TotalValueCell2 from './Cells/TotalValueCell2'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrBribe()
  const { isMobile } = useMatchBreakpoints()
  const tokenAddress = pool?.vestingTokenAddress || ''
  const { data: totalLiquidity } = useGetTotalLiquidity(tokenAddress, getBusinessVoterAddress())

  const currBribe = useMemo(() => {
    if (pool?.userDataLoaded) {
      return pool?.userData?.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
    }
    return pool.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
  }, [currState, tokenAddress, pool])
  console.log('currBribe====================>', currBribe, tokenAddress, currState)
  const tabs = (
    <>
      <NameCell pool={pool} />
      <BribesCell pool={pool} currBribe={currBribe} account={account} />
      <TotalValueCell2
        totalLiquidity={getBalanceNumber(new BigNumber(totalLiquidity?.toString()))}
        symbol={pool?.vestingTokenSymbol ?? ''}
      />
      <TotalValueCell labelText={t('Claimable')} amount={pool?.claimable} symbol={pool?.vestingTokenSymbol ?? ''} />
      <TotalValueCell
        labelText={t('Rewards Claimed')}
        amount={getBalanceNumber(pool?.gaugeEarned)}
        symbol={pool?.vestingTokenSymbol ?? ''}
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
