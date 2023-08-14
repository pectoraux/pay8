import { memo, useMemo } from 'react'
import { Pool, TabMenu } from '@pancakeswap/uikit'
import { usePool, useCurrBribe } from 'state/accelerator/hooks'
import { useTranslation } from '@pancakeswap/localization'

import NameCell from './Cells/NameCell'
import BribesCell from './Cells/BribesCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalVotesCell from './Cells/TotalVotesCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  console.log('chosenPools=====================>', sousId, pool)

  const { t } = useTranslation()
  const currState = useCurrBribe()
  const tokenAddress = pool?.vestingTokenAddress || ''
  const currBribe = useMemo(() => {
    if (pool?.userDataLoaded) {
      return pool?.userData?.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
    }
    return pool?.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
  }, [currState, tokenAddress, pool])

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <TabMenu>
        <NameCell pool={pool} />
        <BribesCell pool={pool} currBribe={currBribe} account={account} />
        <TotalValueCell
          labelText={t('To Distribute')}
          amount={pool?.claimable}
          symbol={pool?.vestingTokenSymbol || ''}
        />
        <TotalValueCell
          labelText={t('Rewards Claimed')}
          amount={pool?.gaugeEarned}
          symbol={pool?.vestingTokenSymbol || ''}
        />
        <TotalVotesCell pool={pool} account={account} />
      </TabMenu>
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
