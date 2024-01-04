import { memo, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool, useCurrBribe } from 'state/referrals/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useGetTotalLiquidity } from 'state/arps/hooks'
import { getReferralVoterAddress } from 'utils/addressHelpers'
import TotalValueCell2 from 'views/Businesses/components/PoolsTable/Cells/TotalValueCell2'

import NameCell from './Cells/NameCell'
import BribesCell from './Cells/BribesCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalUsersCell from './Cells/TotalUsersCell'
import TotalVotesCell from './Cells/TotalVotesCell'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, initialActivity }) => {
  const { pool } = usePool(sousId)
  const { t } = useTranslation()
  const currState = useCurrBribe()
  const { isMobile } = useMatchBreakpoints()
  const tokenAddress = pool?.vestingTokenAddress || ''
  const { data: totalLiquidity } = useGetTotalLiquidity(tokenAddress, getReferralVoterAddress())
  const currBribe = useMemo(() => {
    if (pool?.userDataLoaded) {
      return pool?.userData?.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
    }
    return pool?.bribes?.find((bribe) => bribe.tokenAddress === currState[tokenAddress])
  }, [currState, tokenAddress, pool])
  console.log('currBribe====================>', currBribe, tokenAddress, currState)
  console.log('referralpool1================>', pool)
  const tabs = (
    <>
      <NameCell pool={pool} />
      <BribesCell currBribe={currBribe} />
      <TotalUsersCell labelText={t('Total Accounts')} amount={pool?.accounts?.length} />
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
      <TotalVotesCell pool={pool} account={account} />
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
