import { useRouter } from 'next/router'
import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import {
  Flex,
  Grid,
  Box,
  Input,
  Text,
  Modal,
  Button,
  AutoRenewIcon,
  ButtonMenu,
  ButtonMenuItem,
  ErrorIcon,
  useToast,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { fetchValuepoolSgAsync } from 'state/valuepools'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useValuepoolFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'

import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateValuepoolModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const titleName = 'Value Pool'
  const { reload, query } = useRouter()
  const fromValuepool = query.valuepool
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const currencyAddress = currency?.address ?? ''
  const valuepoolFactoryContract = useValuepoolFactory()
  const [nftFilters] = useState({})
  const [state, setState] = useState<any>(() => ({
    marketplace: '',
    onePersonOneVote: 0,
    adminBountyRequired: false,
    autoDataSource: ADDRESS_ZERO,
    riskpool: 0,
    workspace: '',
    country: '',
    city: '',
    product: '',
  }))

  useEffect(() => {
    Object.entries(nftFilters).map((entry) =>
      setState((prevState) => ({
        ...prevState,
        [entry[0]]: entry[1],
      })),
    )
  }, [nftFilters])

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }
  const handleRawValueChange = (key: string) => (value: string | number) => {
    updateValue(key, !!value)
  }
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [
        currencyAddress,
        account,
        state.marketplace || ADDRESS_ZERO,
        !!state.onePersonOneVote,
        !!state.riskpool,
      ]
      return callWithGasPrice(valuepoolFactoryContract, 'createValuePool' as const, args).catch((err) => {
        setPendingFb(false)
        console.log('rerr1===============>', args, err)
        toastError(
          t('Issue creating valuepool'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Valuepool successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing account requests for your Valuepool.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(
        fetchValuepoolSgAsync({
          fromVesting: false,
          fromValuepool,
        }),
      )
      delay(3000)
      reload()
    }
    onDismiss()
  }, [
    onDismiss,
    dispatch,
    account,
    reload,
    fromValuepool,
    valuepoolFactoryContract,
    state,
    currencyAddress,
    t,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        'Input the marketplace of your Valuepool. The marketplace of a Valuepool is the contract it interacts with to make purchases. If you want your users to use your Valuepool to make purchases of subscriptions, input the subscription market trades contract address, if you want them to purchase NFTs on the eCollectibles marketplace, input the NFT market trades contract, in case of regular products/services on Cancan, use the market trades contract. If you want your users to purchase lottery tickets, use the lottery contract address. For purchases of gaming minutes, use the game factory contract address. For purchases of betting tickets, use the betting contract address, etc. All those contract addresses are available in the documentation.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'The main difference between a Valuepool and a Riskpool is that memebers of a Riskpool cannot withdraw tokens from. They work more like insurances whereas Valuepools work like banks from which you can withdraw funds..',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'By setting this parameter to Yes, each member of your Valuepool will be identified by a unique profile id during votes in the Valuepool.',
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
    <Modal title={t('Create Value Pool')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('%titleName% marketplace', { titleName })}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="marketplace"
          value={state.marketplace}
          placeholder={t('input your marketplace')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef2} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Is Riskpool ?')}
            </Text>
            {tooltipVisible2 && tooltip2}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.riskpool ? 1 : 0}
            onItemClick={handleRawValueChange('riskpool')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef3} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('One person one vote?')}
            </Text>
            {tooltipVisible3 && tooltip3}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.onePersonOneVote ? 1 : 0}
            onItemClick={handleRawValueChange('onePersonOneVote')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will create a new %titleName% with you as its Admin. Please read the documentation to learn more about %titleName%s.',
              { titleName },
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
            disabled={!currency}
          >
            {currency
              ? t('Create %titleName% in %symbol%', { symbol: currency?.symbol ?? '', titleName })
              : t('Select a currency')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateValuepoolModal
