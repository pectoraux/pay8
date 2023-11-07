import BigNumber from 'bignumber.js'
import { ChangeEvent, useState, useCallback } from 'react'
import {
  Flex,
  Text,
  Button,
  Modal,
  Input,
  useToast,
  AutoRenewIcon,
  Box,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Auditors/components/styles'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketOrdersContract, usePaywallMarketOrdersContract } from 'hooks/useContract'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'

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

const PartnerModal: React.FC<any> = ({ registration, onConfirm, onDismiss }) => {
  const [state, setState] = useState<any>(() => ({
    bountyId: registration?.bountyId ?? '0',
    productId: '',
    referrerFee: '',
    paywall: 0,
    identityProofId: registration?.identityProofId ?? '0',
    partnerCollectionId: '',
  }))
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const marketOrdersContract = useMarketOrdersContract()
  const paywallMarketOrdersContract = usePaywallMarketOrdersContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
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

  const handleRawValueChange = (key: string) => (value: Date | number | boolean | string) => {
    updateValue(key, value)
  }

  const handleCreatePartnerShip = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = !state.paywall
        ? [
            registration?.collection?.owner,
            account,
            state.productId,
            [state.referrerFee, state.bountyId, state.identityProofId],
          ]
        : [registration?.collection?.owner, account, state.productId, '', '', [state.referrerFee, state.bountyId, 5]]
      const contract = !state.paywall ? marketOrdersContract : paywallMarketOrdersContract
      return callWithGasPrice(contract, 'addReferral', args).catch((err) => {
        console.log('partner====================>', err)
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Item Successfully Added'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Users of this channel will now have access to this item.')}
        </ToastDescriptionWithTx>,
      )
      setIsDone(true)
    }
  }, [
    state,
    t,
    account,
    registration,
    toastSuccess,
    callWithGasPrice,
    marketOrdersContract,
    paywallMarketOrdersContract,
    fetchWithCatchTxError,
  ])

  const TooltipComponent = () => (
    <Text>
      {t(
        "This is the percentage of each sale you make through this channel that you are willing to share with the owner of the channel. It has to be higher than the channel's minimum referrer fee or you risk being delisted as a partner by a channel admin.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'Some channels require their members to have a bounty with a certain minimum balance setup. If that is the case for this channel, make sure to setup your bounty an input its id right here.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Identity requirements are used to check some information about partners before they can add items to their partner walls. If this channel does not have any identity requirements for its partners, just input 0. If it does, make sure to get an auditor (approved by the channel) to deliver you with the right identity token and input your identity token id right here. To learn more about identity tokens, read the PaySwap documentation',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This is where you add the id of the item you want to add. The id is basically the name of the item with the spaces replaced by dashes',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'Pick the option Yes if the product you are adding is a paywall and No otherwise. This is so the patform knows how to add the product to your partner wall.',
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
  const {
    targetRef: targetRef4,
    tooltip: tooltip4,
    tooltipVisible: tooltipVisible4,
  } = useTooltip(<TooltipComponent4 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef5,
    tooltip: tooltip5,
    tooltipVisible: tooltipVisible5,
  } = useTooltip(<TooltipComponent5 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Modal title={t('Add Item to Wall')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Product ID')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="productId"
          value={state.productId}
          placeholder={t('input your product id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Referrer Fee')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="referrerFee"
          value={state.referrerFee}
          placeholder={t('input your referrer fee')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Bounty ID')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="bountyId"
          value={state.bountyId}
          placeholder={t('input your bounty id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Identity Proof ID')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="identityProofId"
          value={state.identityProofId}
          placeholder={t('input your identity proof id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef5}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
              {t('Is this a Paywall?')}
            </Text>
            {tooltipVisible5 && tooltip5}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.paywall}
            onItemClick={handleRawValueChange('paywall')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <Box>
        <Text small color="textSubtle">
          {t('This will add the specified item to your wall. Please read the documentation for more details.')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? (
          <Button
            mb="8px"
            disabled={isDone}
            onClick={handleCreatePartnerShip}
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
