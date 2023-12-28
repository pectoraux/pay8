import { useRouter } from 'next/router'
import { Button, useModal } from '@pancakeswap/uikit'

import { useTranslation } from '@pancakeswap/localization'
import BidModal from './BidModal'

const StakeVaultButton: React.FC<any> = ({
  refetch,
  profileId,
  processAuction = false,
  updateBid = false,
  create = false,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isFinishedPage = router.pathname.includes('history')

  const [openPresentBidPanel] = useModal(<BidModal refetch={refetch} />)
  const [openPresentBidPanel2] = useModal(<BidModal refetch={refetch} profileId={profileId} takeOver />)
  const [openPresentBidPanel3] = useModal(<BidModal refetch={refetch} profileId={profileId} updateBid />)
  const [openPresentBidPanel4] = useModal(<BidModal refetch={refetch} profileId={profileId} processAuction />)
  const [openPresentBidPanel5] = useModal(<BidModal refetch={refetch} profileId={profileId} processAuction takeOver />)
  const [openPresentBidPanel6] = useModal(<BidModal refetch={refetch} profileId={profileId} create />)

  return (
    <Button
      onClick={
        create
          ? openPresentBidPanel6
          : processAuction && isFinishedPage
          ? openPresentBidPanel5
          : processAuction
          ? openPresentBidPanel4
          : updateBid
          ? openPresentBidPanel3
          : isFinishedPage
          ? openPresentBidPanel2
          : openPresentBidPanel
      }
    >
      {t('%txt% Now', {
        txt: create
          ? 'Create Profile'
          : processAuction
          ? 'Process Auction'
          : updateBid
          ? 'Renew ID'
          : isFinishedPage
          ? 'Take Over'
          : 'Bid',
      })}
    </Button>
  )
}

export default StakeVaultButton
