import NodeRSA from 'encrypt-rsa'
import BigNumber from 'bignumber.js'
import { ChangeEvent, useState, useMemo, useCallback } from 'react'
import { Flex, Text, Button, Modal, Input, useToast, AutoRenewIcon, Box, Grid, ErrorIcon } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Auditors/components/styles'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketEventsContract } from 'hooks/useContract'
import { useDecryptAllArticle } from 'state/cancan/hooks'
import { FetchStatus } from 'config/constants/types'

interface DepositModalProps {
  max: BigNumber
  stakedBalance: BigNumber
  multiplier?: string
  lpPrice: BigNumber
  lpLabel?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
}

interface FormState {
  tokenAddress: any
  poolAddress: any
  pricePerMinute: number
  creatorShare: number
  gameName: string
}

const PartnerModal: React.FC<any> = ({ collection, paywall, onConfirm, onDismiss }) => {
  const [state, setState] = useState<any>(() => ({
    productId: '',
    partnerCollectionId: '',
  }))
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const marketEventsContract = useMarketEventsContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const item = useMemo(
    () => collection?.items?.find((it) => it.tokenId?.toLowerCase() === state.productId?.toLowerCase()),
    [collection, state],
  )
  const chks = item?.images?.split(',')?.slice(1)
  const { data: article } = useDecryptAllArticle(chks)

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleRemoveItem = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)
      let format = ''
      const chunks = item?.images && item?.images?.split(',')
      let thumb = chunks?.length > 0 && item?.images?.split(',')[0]
      let mp4 = chunks?.length > 1 && item?.images?.split(',').slice(1).join(',')
      let [img0, img1] = [thumb, mp4]
      let isArticle = img0 !== img1
      if (chunks?.length && chunks[0] === 'img') {
        thumb = chunks[2]
          ? nodeRSA.decryptStringWithRsaPrivateKey({
              text: chunks[2],
              privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
            })
          : ''
        isArticle = false
        mp4 = chunks[2]
        format = 'img'
      } else if (chunks?.length && chunks[0] === 'video') {
        thumb = chunks[1]
        isArticle = false
        mp4 = chunks[2]
        format = 'video'
      } else if (chunks?.length && chunks[0] === 'form') {
        thumb = chunks[1]
        isArticle = false
        mp4 = chunks[2]
        format = 'form'
      }
      try {
        if (isArticle) {
          img1 = article
        } else {
          img0 = thumb
          // ? nodeRSA.decryptStringWithRsaPrivateKey({
          //     text: thumb,
          //     privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
          //   })
          // : ''
          img1 = mp4
            ? nodeRSA.decryptStringWithRsaPrivateKey({
                text: mp4,
                privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
              })
            : ''
        }
      } catch (err) {
        console.log('errhandleRemoveItem============>', err)
      }
      const args = [state.productId, paywall?.id, false, false, `${format},${img0},${img1}`]
      console.log('handleRemoveItem====================>', args)
      return callWithGasPrice(marketEventsContract, 'updatePaywall', args).catch((err) => {
        console.log('handleRemoveItem====================>', err)
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Item Successfully Removed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Subscribers of this paywall will no longer have access to this item.')}
        </ToastDescriptionWithTx>,
      )
      setIsDone(true)
    }
  }, [
    fetchWithCatchTxError,
    item?.images,
    state.productId,
    paywall?.id,
    callWithGasPrice,
    marketEventsContract,
    article,
    toastSuccess,
    t,
  ])

  return (
    <Modal title={t('Remove Item from Wall')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Product ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="productId"
          value={state.productId}
          placeholder={t('input your product id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will remove the specified item from your paywall. Please read the documentation for more details.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? (
          <Button
            mb="8px"
            variant="danger"
            disabled={isDone || chks?.toString() === article}
            onClick={handleRemoveItem}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
            {t('Remove')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default PartnerModal
