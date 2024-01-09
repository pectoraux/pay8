import { useContext } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'

import SSIKeys from './SSIKeys'
import NoWalletConnected from './WalletNotConnected'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'
import CreateCollection from './CreateCollection'
import EmailVerify from './EmailVerify'
import CreateProfile from './CreateProfile'

const Steps = () => {
  const { currentStep } = useContext(ProfileCreationContext)
  const { account } = useWeb3React()

  if (!account) {
    return <NoWalletConnected />
  }

  if (currentStep === 0) {
    return <EmailVerify />
  }

  if (currentStep === 1) {
    return <CreateProfile />
  }

  if (currentStep === 2) {
    return <SSIKeys />
  }

  if (currentStep === 3) {
    return <CreateCollection />
  }

  return null
}

export default Steps
