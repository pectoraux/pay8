import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter } from 'next/router'
import { useSSIForAddress } from 'state/profile/hooks'
import { NftProfileLayout } from 'views/Profile'
import SubMenu from 'views/Profile/components/SubMenu'
import UserNfts from 'views/Profile/components/UserNfts'

const NftProfilePage = () => {
  const { account } = useWeb3React()
  const accountAddress = useRouter().query.accountAddress as string
  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()

  const {
    nfts,
    isValidating: isProfileFetching,
    refresh: refreshProfile,
  } = useSSIForAddress(accountAddress, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })
  return (
    <>
      <SubMenu />
      <UserNfts
        nfts={nfts?.map((nft) => nft.metadataUrl) || []}
        isLoading={isProfileFetching}
        onSuccessSale={refreshProfile}
        onSuccessEditProfile={async () => {
          await refreshProfile()
        }}
      />
    </>
  )
}

NftProfilePage.Layout = NftProfileLayout

export default NftProfilePage
