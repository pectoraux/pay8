import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Modal,
  Button,
  AutoRenewIcon,
  ErrorIcon,
  useToast,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchAcceleratorGaugesAsync } from 'state/accelerator'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useAcceleratorContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { Divider } from './styles'

interface SetPriceStageProps {
  onDismiss?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateAuditorModal: React.FC<any> = ({ onDismiss }) => {
  const { reload } = useRouter()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const acceleratorContract = useAcceleratorContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [thumbnail, setThumbnail] = useState('')
  const [original, setOriginal] = useState('')
  const { toastSuccess, toastError } = useToast()
  const [nftFilters, setNftFilters] = useState({} as any)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase())
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      try {
        const args = [ve]
        const args2 = [['', '', '', original, thumbnail], '', '']
        console.log('createGauge=====================>', args, args2)
        return (
          callWithGasPrice(acceleratorContract, 'createGauge', args)
            // .then(() => callWithGasPrice(acceleratorContract, 'updateContent', args2))
            .catch((err) => console.log('rerr=====================>', err))
        )
      } catch (err) {
        setPendingFb(false)
        // toastError(
        //   t('Issue creating accelerator pitch'),
        //   <ToastDescriptionWithTx txHash={receipt.transactionHash}>
        //     {err}
        //   </ToastDescriptionWithTx>)
      }
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Accelerator pitch successfully deployed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start receiving funding through your accelerator pitch.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchAcceleratorGaugesAsync({ chainId }))
      delay(5000).then(() => reload())
    }
    onDismiss()
  }, [
    nftFilters?.workspace?.value,
    fetchWithCatchTxError,
    onDismiss,
    original,
    thumbnail,
    callWithGasPrice,
    acceleratorContract,
    toastSuccess,
    t,
    dispatch,
    chainId,
    reload,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        "Every purchase in the marketplace generates a vote for the corresponding business. If you have a token from the purchased item's associated workspace, input its ID right here to vote for the business.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'Identity tokens are used to confirm requirements customers of an item need to fulfill to purchase the item. If your item does not have any requirements, you can just input 0. If it does, make sure you get an auditor approved by the business to deliver you an identity token and input its ID in this field.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Pick the marketplace where the item is listed, pick Subscription if it is a subscription product, NFT if it is purchased from eCollectibles but not a subscription product and CanCan otherwise.',
      )}
    </Text>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef2,
    tooltip: tooltip2,
    tooltipVisible: tooltipVisible2,
  } = useTooltip(<TooltipComponent2 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef3,
    tooltip: tooltip3,
    tooltipVisible: tooltipVisible3,
  } = useTooltip(<TooltipComponent3 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Modal title={t('Deploy Accelerator Pitch')} onDismiss={onDismiss}>
      <Flex alignSelf="center" mt={20}>
        <Flex ref={targetRef}>
          <Filters
            nftFilters={nftFilters}
            setNftFilters={setNftFilters}
            showCountry={false}
            showCity={false}
            showProduct={false}
          />
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
      </Flex>
      {/* <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Media Link')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={original}
          placeholder={t('input your media link')}
          onChange={(e) => setOriginal(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Thumbnail')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={thumbnail}
          placeholder={t('input link to thumbnail')}
          onChange={(e) => setThumbnail(e.target.value)}
        />
      </GreyedOutContainer> */}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will deploy a new pitch in the voter and enable you to raise funds. Please read the documentation to learn more about the Accelerator.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? (
          <Button
            mb="8px"
            onClick={handleCreateGauge}
            endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={pendingTx || pendingFb}
          >
            {t('Deploy Pitch')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateAuditorModal
