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
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchContributorsGaugesAsync } from 'state/contributors'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useContributorsContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateAuditorModal: React.FC<any> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { reload } = useRouter()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const contributorsContract = useContributorsContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const [nftFilters, setNftFilters] = useState<any>({})
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase())
      return (
        callWithGasPrice(contributorsContract, 'createGauge', [ve])
          // .then(() => {
          //   return callWithGasPrice(contributorsContract, 'updateContent', [['', '', '', original, thumbnail], '', ''])
          // })
          .catch((err) => {
            console.log('rerr=====================>', err, [ve])
            setPendingFb(false)
            toastError(
              t('Issue deploying contributor'),
              <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
            )
          })
      )
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Contributor successfully deployed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start receiving support through your contributor.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchContributorsGaugesAsync({ chainId }))
      delay(5000).then(() => reload())
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    nftFilters?.workspace?.value,
    callWithGasPrice,
    contributorsContract,
    toastError,
    t,
    toastSuccess,
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
        'Pick the marketplace where the item is listed, pick Subscription if it is a subscription product, NFT if it is purchased from eCollectibles but not a subscription product and CanCan otherwise.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
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

  return (
    <Modal title={t('Deploy Contributor')} onDismiss={onDismiss}>
      <Flex alignSelf="center" mt={20}>
        <Filters
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          showCountry={false}
          showCity={false}
          showProduct={false}
        />
      </Flex>
      {/* <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Media Link')}
          </Text>
          {tooltipVisible && tooltip}
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
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Thumbnail')}
          </Text>
          {tooltipVisible2 && tooltip2}
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
              'This will deploy a new contributor in the voter and enable you to get support for your work. Please read the documentation to learn more about contribution teams.',
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
            {t('Deploy')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateAuditorModal
