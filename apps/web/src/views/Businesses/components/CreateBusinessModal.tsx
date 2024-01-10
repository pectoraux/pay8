import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Modal, Button, ErrorIcon, useToast, AutoRenewIcon } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchBusinessGaugesAsync } from 'state/businesses'
import { useTranslation } from '@pancakeswap/localization'
import { useBusinessVoter } from 'hooks/useContract'
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
const CreateBusinessStage: React.FC<SetPriceStageProps> = ({ onDismiss }) => {
  const { reload } = useRouter()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const [pendingFb, setPendingFb] = useState(false)
  const businessVoterContract = useBusinessVoter()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const [nftFilters, setNftFilters] = useState<any>({})
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const { toastSuccess, toastError } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase())
      console.log('createGauge==========>', [ve])
      return callWithGasPrice(businessVoterContract, 'createGauge', [ve]).catch((err) => {
        setPendingFb(false)
        console.log('createGauge==========>', err, [ve])
        toastError(
          t('Issue deploying business'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Business successfully deployed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start earning token rewards each sale you make.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchBusinessGaugesAsync({ chainId }))
      delay(6000)
      reload()
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    nftFilters?.workspace?.value,
    callWithGasPrice,
    businessVoterContract,
    toastError,
    t,
    toastSuccess,
    dispatch,
    chainId,
    reload,
  ])

  return (
    <Modal title={t('Deploy Your Business')} onDismiss={onDismiss}>
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
              "This will deploy a your business in the businesses' voter. Please read the documentation to learn more about business gauges.",
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
          {t('Deploy Business')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default CreateBusinessStage
