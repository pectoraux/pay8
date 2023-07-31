import { memo, useMemo } from 'react'
import { useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { usePool, useCurrPool } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'

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
  const rampAccount = useMemo(
    () => pool.accounts?.find((acct) => acct.token.address === currState[pool.rampAddress]),
    [pool, currState],
  )
  const currBribe = useMemo(() => {
    if (pool?.userDataLoaded) {
      return pool?.userData?.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
    }
    return pool.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
  }, [currState, tokenAddress, pool])
  console.log('ramppool=================>', pool)

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} />
      <BribesCell pool={pool} currBribe={currBribe} account={account} />
      <TotalValueCell labelText={t('To Distribute')} amount={pool?.claimable} symbol={pool?.vestingTokenSymbol || ''} />
      <TotalValueCell
        labelText={t('Rewards Claimed')}
        amount={pool?.gaugeEarned}
        symbol={pool?.vestingTokenSymbol || ''}
      />
      <TotalVotesCell pool={pool} />
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
