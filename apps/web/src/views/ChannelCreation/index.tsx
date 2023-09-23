import Page from 'components/Layout/Page'
import { useWeb3React } from '@pancakeswap/wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'

import ProfileCreationProvider from './contexts/ProfileCreationProvider'
import Header from './Header'
import Steps from './Steps'

const ProfileCreation = () => {
  const { account } = useWeb3React()

  return (
    <>
      <ProfileCreationProvider>
        <Page>
          <Header />
          {!account ? <ConnectWalletButton width="100%" /> : <Steps />}
        </Page>
      </ProfileCreationProvider>
    </>
  )
}

export default ProfileCreation
