import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Modal, Button, ErrorIcon, useToast, Input } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useERC20, useNFTicketHelper } from 'hooks/useContract'
import { Divider } from 'views/ARPs/components/styles'
import { GreyedOutContainer } from 'views/Nft/market/components/BuySellModals/SellModal/styles'
import { useGetPricePerMinute } from 'state/cancan/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { DEFAULT_SYMBOL, DEFAULT_TFIAT } from 'config/constants/exchange'
import { useGetRequiresApproval } from 'state/valuepools/hooks'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getNFTicketHelperAddress } from 'utils/addressHelpers'
import { useApprovePool } from 'views/ValuePools/hooks/useApprove'

// interface SetPriceStageProps {
//   entry: Entry
// }

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SponsorTagModal: React.FC<any> = ({ tag, merchantId, referrerId = 0, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const inputRef = useRef<HTMLInputElement>()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess } = useToast()
  const [sponsorAddress, setSponsorAddress] = useState<any>('')
  const [minutes, setMinutes] = useState<any>(0)
  const [media, setMedia] = useState<any>('')
  const nfticketHelper = useNFTicketHelper()
  const price = useGetPricePerMinute(merchantId) as any
  const stakingTokenContract = useERC20(DEFAULT_TFIAT)
  const { isRequired: needsApproval, refetch } = useGetRequiresApproval(
    stakingTokenContract,
    account,
    getNFTicketHelperAddress(),
  )
  const { handleApprove, pendingTx: pendingTFIATx } = useApprovePool(
    stakingTokenContract,
    getNFTicketHelperAddress(),
    'USD',
    refetch,
  )
  const handleSponsorTag = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [sponsorAddress, merchantId, referrerId, parseInt(minutes) * 60, tag ?? '', media]
      console.log('sponsorTag================>', args)
      return callWithGasPrice(nfticketHelper, 'sponsorTag', args).catch((err) =>
        console.log('sponsorTag=============>', err),
      )
    })
    if (receipt?.status) {
      toastSuccess(
        t('Sponsoring successfully'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your ad has been scheduled to appear of the NFTickets that have the correct tag.')}
        </ToastDescriptionWithTx>,
      )
    }
    onDismiss()
  }, [
    t,
    tag,
    media,
    minutes,
    onDismiss,
    merchantId,
    toastSuccess,
    nfticketHelper,
    sponsorAddress,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal
      title={t('Sponsor Tag: [%tag%] (%price% %symb% per minute)', {
        tag: tag ?? 'All Products',
        price: getBalanceNumber(price),
        symb: DEFAULT_SYMBOL,
      })}
      onDismiss={onDismiss}
    >
      {needsApproval ? null : (
        <>
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Sponsor Card Address')}
            </Text>
            <Input
              type="text"
              scale="sm"
              name="sponsor"
              value={sponsorAddress}
              placeholder={t('input address of sponsor card')}
              onChange={(e) => setSponsorAddress(e.target.value)}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Number of minutes')}
            </Text>
            <Input
              type="number"
              scale="sm"
              name="sponsor"
              value={minutes}
              placeholder={t('number of minutes to buy')}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Media Link')}
            </Text>
            <Input
              type="text"
              scale="sm"
              value={media}
              placeholder={t('link to sponsored content')}
              onChange={(e) => setMedia(e.target.value)}
            />
          </GreyedOutContainer>
          <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
            <Flex alignSelf="flex-start">
              <ErrorIcon width={24} height={24} color="textSubtle" />
            </Flex>
            <Box>
              <Text small color="textSubtle">
                {parseInt(referrerId)
                  ? t('This will display your ad on NFTickets of users who purchased items from all sellers on PaySwap')
                  : t(
                      'This will display your ad on NFTickets of users who purchased items under this tag from this seller.',
                    )}
              </Text>
            </Box>
          </Grid>
        </>
      )}
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" disabled={pendingTFIATx} onClick={needsApproval ? handleApprove : handleSponsorTag}>
          {needsApproval ? t('Enable Contract') : t('Confirm Sponsorship')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default SponsorTagModal
