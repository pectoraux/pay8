import { memo } from 'react'
import { Pool, TabMenu, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePool2 } from 'state/ramps/hooks'
import { useNativeBalances } from 'state/wallet/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { getRampHelperAddress } from 'utils/addressHelpers'

import NameCell from './Cells/NameCell'
import ActionPanel from './ActionPanel/ActionPanel'
import TotalValueCell from './Cells/TotalValueCell'

const PoolRow: React.FC<any> = ({ sousId, account, rampAddress, initialActivity }) => {
  const { pool } = usePool2(rampAddress)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const rampAccount = pool?.accounts?.find((acct) => acct.sousId === sousId)

  const nb = useNativeBalances([pool?.id])
  const nativeBalances = Object.values(nb) as any
  const nativeBalance = nativeBalances?.length && nativeBalances[0]?.toFixed()

  const tabs = (
    <>
      <NameCell pool={pool} rampAccount={rampAccount} />
      {rampAccount?.token?.address?.toLowerCase() === getRampHelperAddress()?.toLowerCase() ? (
        <TotalValueCell
          labelText={t('Total Liquidity')}
          amount={nativeBalance}
          symbol={rampAccount?.token?.symbol ?? ''}
        />
      ) : (
        <>
          <TotalValueCell
            labelText={t('Mintable')}
            amount={getBalanceNumber(rampAccount?.mintable, rampAccount?.token?.decimals)}
            symbol={rampAccount?.token?.symbol ?? ''}
          />
          <TotalValueCell
            labelText={t('Minted Liquidity')}
            amount={getBalanceNumber(rampAccount?.minted, rampAccount?.token?.decimals)}
            symbol={rampAccount?.token?.symbol ?? ''}
          />
          <TotalValueCell
            labelText={t('Burnt Liquidity')}
            amount={getBalanceNumber(rampAccount?.burnt, rampAccount?.token?.decimals)}
            symbol={rampAccount?.token?.symbol ?? ''}
          />
        </>
      )}
    </>
  )
  return (
    <Pool.ExpandRow
      initialActivity={initialActivity}
      panel={<ActionPanel account={account} pool={pool} rampAccount={rampAccount} expanded />}
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
