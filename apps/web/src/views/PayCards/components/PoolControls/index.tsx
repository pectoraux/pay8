import { useAccount } from 'wagmi'
import { PayCards } from '@pancakeswap/uikit'
import { useUserPoolStakedOnly, useUserPoolsViewMode } from 'state/user/hooks'
import { useInitialBlockTimestamp } from 'state/block/hooks'
import { Token } from '@pancakeswap/sdk'
import NodeRSA from 'encrypt-rsa'

const POOL_START_THRESHOLD = 60 * 4

export default function PoolControlsContainer(props) {
  const [stakedOnly, setStakedOnly] = useUserPoolStakedOnly()
  const [viewMode, setViewMode] = useUserPoolsViewMode()
  const { address: account } = useAccount()
  const initialBlockTimestamp = useInitialBlockTimestamp()
  const threshHold = Number(initialBlockTimestamp) > 0 ? Number(initialBlockTimestamp) + POOL_START_THRESHOLD : 0
  const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)

  return (
    <PayCards.PoolControls<Token>
      {...props}
      nodeRSA={nodeRSA}
      stakedOnly={stakedOnly}
      setStakedOnly={setStakedOnly}
      viewMode={viewMode}
      setViewMode={setViewMode}
      account={account}
      threshHold={threshHold}
    />
  )
}
