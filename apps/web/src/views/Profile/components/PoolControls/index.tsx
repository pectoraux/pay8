import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Token } from '@pancakeswap/sdk'
import { Profile } from '@pancakeswap/uikit'
import { useUserPoolsViewMode } from 'state/user/hooks'
import { useInitialBlockTimestamp } from 'state/block/hooks'

const POOL_START_THRESHOLD = 60 * 4

export default function PoolControlsContainer(props) {
  const [stakedOnly, setStakedOnly] = useState(false)
  const [followingOnly, setFollowingOnly] = useState(false)
  const [followersOnly, setFollowersOnly] = useState(false)
  const [viewMode, setViewMode] = useUserPoolsViewMode()
  const { address: account } = useAccount()
  const initialBlockTimestamp = useInitialBlockTimestamp()
  const threshHold = Number(initialBlockTimestamp) > 0 ? Number(initialBlockTimestamp) + POOL_START_THRESHOLD : 0

  return (
    <Profile.PoolControls<Token>
      {...props}
      stakedOnly={stakedOnly}
      setStakedOnly={setStakedOnly}
      followingOnly={followingOnly}
      followersOnly={followersOnly}
      setFollowersOnly={setFollowersOnly}
      setFollowingOnly={setFollowingOnly}
      viewMode={viewMode}
      setViewMode={setViewMode}
      account={account}
      threshHold={threshHold}
    />
  )
}
