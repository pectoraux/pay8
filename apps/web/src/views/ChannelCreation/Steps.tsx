import { useContext, useEffect } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetSharedEmail } from 'state/profile/hooks'

import NoWalletConnected from './WalletNotConnected'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'
import CreateCollection from './CreateCollection'
import EmailVerify from './EmailVerify'

const Steps = () => {
  const { currentStep } = useContext(ProfileCreationContext)
  const { account } = useWeb3React()
  // if (sharedEmail) currentStep == 1
  // useEffect(() => {

  // }, [sharedEmail])

  if (!account) {
    return <NoWalletConnected />
  }

  if (currentStep === 0) {
    return <EmailVerify />
  }

  if (currentStep === 1) {
    return <CreateCollection />
  }

  return null
}

export default Steps
