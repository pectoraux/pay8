import { useRouter } from 'next/router'
import { differenceInSeconds } from 'date-fns'
import { useEffect, ChangeEvent, useRef, useState, useCallback } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Modal,
  Button,
  AutoRenewIcon,
  Input,
  ErrorIcon,
  useToast,
  ButtonMenu,
  ButtonMenuItem,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { FetchStatus } from 'config/constants/types'
import { fetchStakesAsync } from 'state/stakemarket'
import { useWeb3React } from '@pancakeswap/wagmi'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import {
  getMarketTradesAddress,
  getNftMarketTradesAddress,
  getPaywallMarketTradesAddress,
  getVeFromWorkspace,
} from 'utils/addressHelpers'
import { useERC20, useStakeMarketContract } from 'hooks/useContract'
import { DEFAULT_INPUT_CURRENCY } from 'config/constants/exchange'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useGetRequiresApproval } from 'state/stakemarket/hooks'
import BigNumber from 'bignumber.js'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'
import truncateHash from '@pancakeswap/utils/truncateHash'

import { useApprovePool } from '../hooks/useApprove'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateStakeModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const { reload, query } = useRouter()
  const collectionId = query.collectionAddress as string
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const titleName = 'Stake Market'
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const stakeMarketContract = useStakeMarketContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const currencyAddress = currency?.address ?? DEFAULT_INPUT_CURRENCY
  const { toastSuccess, toastError } = useToast()
  const [nftFilters, setNftFilters] = useState<any>({})
  const stakingTokenContract = useERC20(currencyAddress || '')
  const { status, needsApproval, refetch } = useGetRequiresApproval(
    stakingTokenContract,
    account,
    stakeMarketContract.address,
  )
  const { handleApprove: handlePoolApprove, pendingTx: allowing } = useApprovePool(
    stakingTokenContract,
    stakeMarketContract.address,
    currency?.symbol || '',
    refetch,
  )

  const [state, setState] = useState<any>({
    ve: '',
    source: account,
    token: '',
    tokenId: '',
    owner: '',
    amountPayable: '',
    amountReceivable: '',
    periodPayable: '',
    periodReceivable: '',
    waitingPeriod: '',
    startPayable: '',
    startReceivable: '',
    requireUpfrontPayment: 1,
    userTokenId: 0,
    identityTokenId: 0,
  })
  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase())
      const amountPayable = getDecimalAmount(new BigNumber(state.amountPayable ?? '0'), currency?.decimals)
      const amountReceivable = getDecimalAmount(new BigNumber(state.amountReceivable ?? '0'), currency?.decimals)
      const startPayable = Math.max(
        differenceInSeconds(new Date(state.startPayable || 0), new Date(), {
          roundingMethod: 'ceil',
        }),
        0,
      )
      const startReceivable = Math.max(
        differenceInSeconds(new Date(state.startReceivable || 0), new Date(), {
          roundingMethod: 'ceil',
        }),
        0,
      )
      const args = [
        [ve, currencyAddress, state.source, ADDRESS_ZERO, ADDRESS_ZERO, account],
        state.tokenId ?? '0',
        collectionId ?? 0,
        [],
        state.userTokenId,
        state.identityTokenId,
        [
          amountPayable.toString(),
          amountReceivable.toString(),
          parseInt(state.periodPayable) * 60,
          parseInt(state.periodReceivable) * 60,
          parseInt(state.waitingPeriod) * 60,
          startPayable,
          startReceivable,
        ],
        !!state.requireUpfrontPayment,
      ]
      console.log('createStake=================>', args)
      return callWithGasPrice(stakeMarketContract, 'createStake', args).catch((err) => {
        setPendingFb(false)
        console.log('err0=================>', err)
        toastError(
          t('Issue creating stake'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Stake successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing applications for your Stake.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchStakesAsync(collectionId, chainId))
      reload()
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    nftFilters?.workspace?.value,
    state.amountPayable,
    state.amountReceivable,
    state.startPayable,
    state.startReceivable,
    state.source,
    state.tokenId,
    state.userTokenId,
    state.identityTokenId,
    state.periodPayable,
    state.periodReceivable,
    state.waitingPeriod,
    state.requireUpfrontPayment,
    currency?.decimals,
    currencyAddress,
    account,
    collectionId,
    callWithGasPrice,
    stakeMarketContract,
    toastError,
    t,
    toastSuccess,
    dispatch,
    chainId,
    reload,
  ])

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
  const handleRawValueChange = (key: string) => (value: any) => {
    updateValue(key, value)
  }

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        'This sets the workspace of your stake or the workspace to which belongs the community that will vote on potential future litigations around this stake. If you pick Real Estate for instance, only users holding a Real Estate Leviathan token will be able to vote on any enventual litigations around your stake.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This sets the marketplace of your stake. If you are creating this stake to make a purchase in the marketplace, input the address of that marketplace right here. The addresses of the marketplaces for subscriptions, NFTs and products/services are listed below. If your stake is not meant to make purchases on any marketplace, you can input your wallet address here.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t('This sets the ID of your product in case you are using the stake to make a purchase on the marketplace.')}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        "This is only relevant in case you are using the stake to make a purchase in the marketplace. Every purchase in the marketplace generates a vote for the corresponding business. If you have a token from the purchased item's associated workspace, input its ID right here to vote for the business.",
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'This is mostly relevant in case your are using the stake to make a purchase in the marketplace. Identity tokens are used to confirm requirements customers of an item need to fulfill to purchase the item. If your item does not have any requirements, you can just input 0. If it does, make sure you get an auditor approved by the business to deliver you an identity token and input its ID in this field.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This sets the amount you will be receiving (periodically for periodic stakes and a one time payment for non periodic stakes) from the stake. In case you are making a purchase in the marketplace, that amount is 0. For other stakes that amount might not be depending on the purpose of the stake.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This sets the amount you will be paying (periodically for periodic stakes and a one time payment for non periodic stakes) to other parties in the stake. In case you are making a purchase in the marketplace, that amount is the price of the item you are buying.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        'This sets the duration in minutes of each cycle of payment from the stake to you. If you do not receive payment from the stake or the stake is non periodic, just input 0',
      )}
    </Text>
  )
  const TooltipComponent9 = () => (
    <Text>
      {t(
        'This sets the duration in minutes of each cycle of payment from you to the stake. If you do not issue payments to the stake or the stake is non periodic, just input 0',
      )}
    </Text>
  )
  const TooltipComponent10 = () => (
    <Text>
      {t(
        'This sets the wating period in minutes that separates a disagreement between parties on a stake and a litigation being created to resolve that disagreement. You should have at least 24 hours notice so set this parameter to at least 24 * 60 minutes unless you have strong reason to not want to.',
      )}
    </Text>
  )
  const TooltipComponent11 = () => (
    <Text>
      {t(
        'This sets the start date of the payment cycle from the contract to you. You should set this value even in the case of non periodic stakes. If this is not relevant to your stake, just leave this field empty.',
      )}
    </Text>
  )
  const TooltipComponent12 = () => (
    <Text>
      {t(
        'This sets the start date of the payment cycle from you to the contract. You should set this value even in the case of non periodic stakes. If this is not relevant to your stake, just leave this field empty.',
      )}
    </Text>
  )
  const TooltipComponent13 = () => (
    <Text>
      {t(
        'This sets whether you want the stake market to retreive funds (the amount receivable) from your wallet when creating this stake.',
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
  const {
    targetRef: targetRef6,
    tooltip: tooltip6,
    tooltipVisible: tooltipVisible6,
  } = useTooltip(<TooltipComponent6 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef7,
    tooltip: tooltip7,
    tooltipVisible: tooltipVisible7,
  } = useTooltip(<TooltipComponent7 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef8,
    tooltip: tooltip8,
    tooltipVisible: tooltipVisible8,
  } = useTooltip(<TooltipComponent8 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef9,
    tooltip: tooltip9,
    tooltipVisible: tooltipVisible9,
  } = useTooltip(<TooltipComponent9 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef10,
    tooltip: tooltip10,
    tooltipVisible: tooltipVisible10,
  } = useTooltip(<TooltipComponent10 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef11,
    tooltip: tooltip11,
    tooltipVisible: tooltipVisible11,
  } = useTooltip(<TooltipComponent11 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef12,
    tooltip: tooltip12,
    tooltipVisible: tooltipVisible12,
  } = useTooltip(<TooltipComponent12 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef13,
    tooltip: tooltip13,
    tooltipVisible: tooltipVisible13,
  } = useTooltip(<TooltipComponent13 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Modal title={t('%titleName%', { titleName: needsApproval ? 'Enable' : 'Create Stake' })} onDismiss={onDismiss}>
      {!needsApproval ? (
        <>
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
          <GreyedOutContainer>
            <Flex ref={targetRef2}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Source Address')}
              </Text>
              {tooltipVisible2 && tooltip2}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="source"
              value={state.source}
              placeholder={t('input source address')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef3}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Product ID')}
              </Text>
              {tooltipVisible3 && tooltip3}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="tokenId"
              value={state.tokenId}
              placeholder={t('input product id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef4}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('User Token ID')}
              </Text>
              {tooltipVisible4 && tooltip4}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="userTokenId"
              value={state.userTokenId}
              placeholder={t('input user token id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef5}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Identity Token ID')}
              </Text>
              {tooltipVisible5 && tooltip5}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="identityTokenId"
              value={state.identityTokenId}
              placeholder={t('input identity token id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef6}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Amount Payable')}
              </Text>
              {tooltipVisible6 && tooltip6}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="amountPayable"
              value={state.amountPayable}
              placeholder={t('input amount payable')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef7}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Amount Receivable')}
              </Text>
              {tooltipVisible7 && tooltip7}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="amountReceivable"
              value={state.amountReceivable}
              placeholder={t('input amount receivable')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef8}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Period Payable (in minutes)')}
              </Text>
              {tooltipVisible8 && tooltip8}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="periodPayable"
              value={state.periodPayable}
              placeholder={t('input period payable')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef9}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Period Receivable (in minutes)')}
              </Text>
              {tooltipVisible9 && tooltip9}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="periodReceivable"
              value={state.periodReceivable}
              placeholder={t('input period receivable')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef10}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Waiting Period (in minutes)')}
              </Text>
              {tooltipVisible10 && tooltip10}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="waitingPeriod"
              value={state.waitingPeriod}
              placeholder={t('input waiting period')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef11}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Start Payable')}
              </Text>
              {tooltipVisible11 && tooltip11}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <DatePicker
              selected={state.startPayable}
              placeholderText="YYYY/MM/DD"
              onChange={handleRawValueChange('startPayable')}
            />
            <DatePickerPortal />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef12}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Start Receivable')}
              </Text>
              {tooltipVisible12 && tooltip12}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <DatePicker
              selected={state.startReceivable}
              placeholderText="YYYY/MM/DD"
              onChange={handleRawValueChange('startReceivable')}
            />
            <DatePickerPortal />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <StyledItemRow>
              <Flex ref={targetRef13} paddingRight="50px">
                <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
                  {t('Require Upfront Payment')}
                </Text>
                {tooltipVisible13 && tooltip13}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <ButtonMenu
                scale="xs"
                variant="subtle"
                activeIndex={state.requireUpfrontPayment}
                onItemClick={handleRawValueChange('requireUpfrontPayment')}
              >
                <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
              </ButtonMenu>
            </StyledItemRow>
          </GreyedOutContainer>
        </>
      ) : null}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {needsApproval
              ? t('This will enable the stake market to withdraw from your wallet')
              : t(
                  'This will create a new stake in the market for you. Please read the documentation to learn more about the stake market.',
                )}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Product/Services Market Trades Contract Address')}
          </Text>
          <CopyAddress
            title={truncateHash(getPaywallMarketTradesAddress(), 15, 15)}
            account={getPaywallMarketTradesAddress()}
          />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Paywall/Subscriptions Market Trades Contract Address')}
          </Text>
          <CopyAddress
            title={truncateHash(getNftMarketTradesAddress(), 15, 15)}
            account={getNftMarketTradesAddress()}
          />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('NFT Market Trades Contract Address')}
          </Text>
          <CopyAddress title={truncateHash(getMarketTradesAddress(), 15, 15)} account={getMarketTradesAddress()} />
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {!account ? (
          <ConnectWalletButton />
        ) : needsApproval ? (
          <Button
            mb="8px"
            onClick={handlePoolApprove}
            endIcon={allowing || status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={allowing}
            disabled={allowing || status === FetchStatus.Fetching}
          >
            {t('%text% %symbol%', {
              text: status === FetchStatus.Fetching ? 'Enabling for' : 'Enable for',
              symbol: currency?.symbol ?? '',
              titleName,
            })}
          </Button>
        ) : (
          <Button
            mb="8px"
            onClick={handleCreateGauge}
            endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={pendingTx || pendingFb}
          >
            {t('%text% %symbol%', { text: 'Create a stake with', symbol: currency?.symbol ?? '', titleName })}
          </Button>
        )}
      </Flex>
    </Modal>
  )
}

export default CreateStakeModal
