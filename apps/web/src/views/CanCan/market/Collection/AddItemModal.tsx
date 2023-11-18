import NodeRSA from 'encrypt-rsa'
import EncryptRsa from 'encrypt-rsa'
import BigNumber from 'bignumber.js'
import { ChangeEvent, useState, useMemo, useCallback } from 'react'
import {
  Flex,
  Text,
  Button,
  Modal,
  Input,
  useToast,
  AutoRenewIcon,
  Box,
  Grid,
  ErrorIcon,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Auditors/components/styles'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketEventsContract, usePaywallMarketOrdersContract } from 'hooks/useContract'
import { encryptArticle } from 'utils/cancan'

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
  partner: boolean
}

const AddItemModal: React.FC<any> = ({ collection, paywall, partner, onDismiss }) => {
  const [state, setState] = useState<any>(() => ({
    productId: '',
    bountyId: '',
    referrerFee: '',
    partnerCollectionId: '',
  }))
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const marketEventsContract = useMarketEventsContract()
  const paywallMarketOrdersContract = usePaywallMarketOrdersContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const item = useMemo(
    () => collection?.items?.find((it) => it.tokenId?.toLowerCase() === state.productId?.toLowerCase()),
    [collection, state],
  )
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

  const handleAddItem = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const encryptRsa = new EncryptRsa()
      const chunks = item?.images && item?.images?.split(',')
      const thumb = chunks?.length > 0 && item?.images?.split(',')[0]
      const mp4 = chunks?.length > 1 && item?.images?.split(',').slice(1).join(',')
      let [img0, img1] = [thumb, mp4]
      const isArticle = img0 !== img1
      try {
        if (isArticle) {
          img1 = mp4 // encryptArticle(encryptRsa, mp4)
        } else {
          img0 = thumb
            ? encryptRsa.encryptStringWithRsaPublicKey({
                text: thumb,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY_4096,
              })
            : ''
          img1 = mp4
            ? encryptRsa.encryptStringWithRsaPublicKey({
                text: mp4,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY_4096,
              })
            : ''
        }
      } catch (err) {
        console.log('1handleAddItem============>', err, process.env.NEXT_PUBLIC_PUBLIC_KEY_4096)
      }
      const contract = partner ? paywallMarketOrdersContract : marketEventsContract
      const method = partner ? 'addReferral' : 'updatePaywall'
      const args = partner
        ? [
            paywall?.currentSeller,
            account,
            paywall?.tokenId,
            state.productId,
            `${img0},${img1}`,
            [state.referrerFee, state.bountyId, 2],
          ]
        : [state.productId, paywall?.id, true, false, `${img0},${img1}`]
      console.log('handleAddItem================>', method, args)
      return callWithGasPrice(contract, method, args).catch((err) => {
        console.log('2handleAddItem====================>', err)
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Item Successfully Added'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Subscribers of this paywall will now have access to this item.')}
        </ToastDescriptionWithTx>,
      )
      setIsDone(true)
    }
  }, [
    t,
    item,
    state,
    account,
    paywall,
    partner,
    toastSuccess,
    callWithGasPrice,
    marketEventsContract,
    fetchWithCatchTxError,
    paywallMarketOrdersContract,
  ])

  const TooltipComponent = () => (
    <Text>
      {t(
        'Some channels require their members to have a bounty with a certain minimum balance setup. If that is the case for this channel, make sure to setup your bounty an input its id right here.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'In order to register to this channel, you need to have your own channel. This is where you input the id of your channel',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Identity requirements are used to check some information about members before they can register to the channel. If this channel does not have any identity requirements for its members, just input 0. If it does, make sure to get an auditor (approved by the channel) to deliver you with the right identity token and input your identity token id right here. To learn more about identity tokens, read the PaySwap documentation',
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
    <Modal title={t('Add Item to Wall')} onDismiss={onDismiss}>
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
      {partner ? (
        <>
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Referrer Fee')}
            </Text>
            <Input
              type="text"
              scale="sm"
              name="referrerFee"
              value={state.referrerFee}
              placeholder={t('input referrer fee')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Bounty ID')}
            </Text>
            <Input
              type="text"
              scale="sm"
              name="bountyId"
              value={state.bountyId}
              placeholder={t('input bounty id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
        </>
      ) : null}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              "This will add the specified item behind your paywall so that only subscribers to the paywall can view it. You have to first deploy the item before you can add it behind a paywall. Once you've deployed the item, get its product id and paste it right here",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? (
          <Button
            mb="8px"
            disabled={isDone}
            onClick={handleAddItem}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
            {t('Add')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default AddItemModal
