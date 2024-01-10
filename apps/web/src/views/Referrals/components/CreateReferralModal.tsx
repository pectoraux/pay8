import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Modal, Button, ErrorIcon, useToast, AutoRenewIcon } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchReferralGaugesAsync } from 'state/referrals'
import { useTranslation } from '@pancakeswap/localization'
import { useReferralVoter } from 'hooks/useContract'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
  onDismiss?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateReferralStage: React.FC<SetPriceStageProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { reload } = useRouter()
  const { chainId } = useActiveChainId()
  const inputRef = useRef<HTMLInputElement>()
  const [pendingFb, setPendingFb] = useState(false)
  const referralVoterContract = useReferralVoter()
  const dispatch = useAppDispatch()
  const [nftFilters, setNftFilters] = useState<any>({})

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const { toastSuccess, toastError } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase())
      console.log('createGauge==========>', [ve])
      return callWithGasPrice(referralVoterContract, 'createGauge', [ve]).catch((err) => {
        setPendingFb(false)
        console.log('createGauge==========>', err, ve)
        toastError(
          t('Issue launching referrer'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Referrer successfully launched'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start earning token rewards each purchase your referrees make.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchReferralGaugesAsync({ chainId }))
      delay(3000).then(() => reload())
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    nftFilters?.workspace?.value,
    callWithGasPrice,
    referralVoterContract,
    toastError,
    t,
    toastSuccess,
    dispatch,
    chainId,
    reload,
    onDismiss,
  ])

  return (
    <Modal title={t('Launch Referrer')} onDismiss={onDismiss}>
      <Flex alignSelf="center" mt={20}>
        <Filters
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          showCountry={false}
          showCity={false}
          showProduct={false}
        />
      </Flex>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will launch your referrer so you can start receiving votes as a referrer on purchases made by your referrees. Please read the documentation to learn more about referral gauges.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={handleCreateGauge}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
          disabled={pendingTx || pendingFb}
        >
          {t('Launch')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default CreateReferralStage
