import EncryptRsa from 'encrypt-rsa'
import BigNumber from 'bignumber.js'
import { differenceInSeconds } from 'date-fns'
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
import { useMarketEventsContract, usePaywallContract } from 'hooks/useContract'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { useGetPaywallPricePerMinute } from 'state/cancan/hooks'

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

const PartnerModal: React.FC<any> = ({ collection, paywall, paywallARP, partner, onDismiss }) => {
  const [state, setState] = useState<any>(() => ({
    productId: '',
    partnerCollectionId: '',
    numOfSeconds: '',
  }))
  console.log('PartnerModalPartnerModal=====================>', paywallARP)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const marketEventsContract = useMarketEventsContract()
  const pricePerMinute = useGetPaywallPricePerMinute(paywallARP?.paywallAddress ?? '')
  const paywallContract = usePaywallContract(paywallARP?.paywallAddress ?? '')
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

  const handleRawValueChange = (key: any) => (value: any) => {
    updateValue(key, value)
  }

  const handleAddPartner = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const encryptRsa = new EncryptRsa()
      const chunks = item?.images && item?.images?.split(',')
      const thumb = chunks?.length > 0 && item?.images?.split(',')[0]
      const mp4 = chunks?.length > 1 && item?.images?.split(',').slice(1).join(',')
      let [img0, img1] = [thumb, mp4]
      try {
        img0 = thumb
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: thumb,
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        img1 = mp4
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: mp4,
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
      } catch (err) {
        console.log('handleAddPartner err============>', err)
      }
      const contract = partner ? paywallContract : marketEventsContract
      const method = partner ? 'partner' : 'updatePaywall'
      const numOfSeconds = Math.max(
        differenceInSeconds(new Date(state.numOfSeconds || 0), new Date(), {
          roundingMethod: 'ceil',
        }),
        0,
      )
      const args = partner
        ? [state.partnerCollectionId, paywall?.tokenId, state.productId, numOfSeconds, false]
        : [state.productId, paywall?.id, true, false, `${img0},${img1}`]
      return callWithGasPrice(contract, method, args).catch((err) => {
        console.log('handleAddPartner====================>', err, method, args)
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Partner Successfully Added'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Subscribers of this paywall will now have access to items from this partner paywall.')}
        </ToastDescriptionWithTx>,
      )
      setIsDone(true)
    }
  }, [
    t,
    item,
    state,
    partner,
    paywall,
    toastSuccess,
    paywallContract,
    callWithGasPrice,
    marketEventsContract,
    fetchWithCatchTxError,
  ])

  const TooltipComponent = () => (
    <Text>
      {t('Input the id of your paywall here, which is its entire name with the spaces replaced with dashes (-)')}
    </Text>
  )
  const TooltipComponent2 = () => <Text>{t('Input your channel id here')}</Text>
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Input the end date of your partnership. The cost of partnership is the number of minutes between now and the end date of your partnership multiplied by the price per minute. The price per minute is displayed below.',
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
    <Modal title={t('Add Partner to Wall')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Paywall ID')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="productId"
          value={state.productId}
          placeholder={t('input your paywall id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      {partner ? (
        <>
          <GreyedOutContainer>
            <Flex ref={targetRef2}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Collection ID')}
              </Text>
              {tooltipVisible2 && tooltip2}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="partnerCollectionId"
              value={state.partnerCollectionId}
              placeholder={t('input your collection id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef3}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('End Date')}
              </Text>
              {tooltipVisible3 && tooltip3}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <DatePicker
              onChange={handleRawValueChange('numOfSeconds')}
              selected={state.numOfSeconds}
              placeholderText="YYYY/MM/DD"
            />
            <DatePickerPortal />
          </GreyedOutContainer>
        </>
      ) : null}
      <Box>
        <Text bold color="textSubtle">
          {t('Price Per Minute: %val%', { val: pricePerMinute?.toString() })}
        </Text>
      </Box>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will add the specified partner to your paywall. When a paywall partners with another one, all its content become available to subscribers of that paywall and vice versa. Check the price per minute listed above to compute the price of your partnership. Multiply the price per minute with the amount of minutes between now and the end date of your partnership.',
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
            onClick={handleAddPartner}
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

export default PartnerModal
