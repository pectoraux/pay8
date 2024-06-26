import BigNumber from 'bignumber.js'
import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Input,
  Modal,
  Button,
  AutoRenewIcon,
  ErrorIcon,
  useToast,
  useModal,
  HelpIcon,
  useTooltip,
  Balance,
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchFutureCollateralsAsync } from 'state/futureCollaterals'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useFutureCollateralContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useGetPrice } from 'state/futureCollaterals/hooks'
import { Divider, GreyedOutContainer } from './styles'
import CreateGaugeModal from './CreateGaugeModal'
import { chunk } from './PoolsTable/ActionPanel/Harvest'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateFutureCollateralModal: React.FC<any> = ({ stageName, currency, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const data = useGetPrice(account) as any
  const { chainId } = useActiveChainId()
  const futureCollateralContract = useFutureCollateralContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [stage, setStage] = useState(stageName)
  const { toastSuccess, toastError } = useToast()
  const [state, setState] = useState<any>(() => ({
    auditor: '',
    stakeId: '',
    userBountyId: '',
    auditorBountyId: '',
    channel: data?.channel ?? '',
    amountPayable: '',
    profileId: '',
  }))

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
  const [openPresentControlPanel] = useModal(<CreateGaugeModal variant="add" state2={state} currency={currency} />)

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log('receipt================>', futureCollateralContract, [state.profileId, state.channel])
      return callWithGasPrice(futureCollateralContract, 'addToChannel', [state.profileId, state.channel]).catch(
        (err) => {
          console.log('err================>', err)
          setPendingFb(false)
          toastError(
            t('Issue minting future collateral'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
          )
        },
      )
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Future collateral successfully minted'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing loans with your collateral.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchFutureCollateralsAsync({ fromFutureCollateral: true, chainId }))
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    futureCollateralContract,
    state.profileId,
    state.channel,
    callWithGasPrice,
    toastError,
    t,
    toastSuccess,
    dispatch,
    chainId,
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
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Pick the marketplace where the item is listed, pick Subscription if it is a subscription product, NFT if it is purchased from eCollectibles but not a subscription product and CanCan otherwise.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'Pick the marketplace where the item is listed, pick Subscription if it is a subscription product, NFT if it is purchased from eCollectibles but not a subscription product and CanCan otherwise.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'Pick the marketplace where the item is listed, pick Subscription if it is a subscription product, NFT if it is purchased from eCollectibles but not a subscription product and CanCan otherwise.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
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

  const table = chunk(data?.table, 4)
  return (
    <Modal title={t('Mint Future Collateral')} onDismiss={onDismiss}>
      {/* <Button variant="secondary" mb="8px" disabled={stage === 'PICK_CHANNEL'} onClick={() => setStage('PICK_CHANNEL')}>
        {t('1) PICK A CHANNEL')}
      </Button>
      <Button
        variant="secondary"
        mb="8px"
        disabled={stage === 'MINT_COLLATERAL'}
        onClick={() => setStage('MINT_COLLATERAL')}
      >
        {t('2) MINT COLLATERAL')}
      </Button> */}

      {stage === 'PICK_CHANNEL' ? (
        <GreyedOutContainer>
          {/* <Flex ref={targetRef}> */}
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Profile ID')}
          </Text>
          {/* {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex> */}
          <Input
            type="text"
            scale="sm"
            name="profileId"
            value={state.profileId}
            placeholder={t('input profile id')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
      ) : (
        <>
          <GreyedOutContainer>
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={18}
              value={getBalanceNumber(new BigNumber(data?.price?.toString()))}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Current Price')}
            </Text>
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
              {table?.length && table[0]?.map((val) => `${getBalanceNumber(val)?.toString()}  =>  `)}
            </Text>
            <br />
            <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
              {table?.length && table[1]?.map((val) => `${getBalanceNumber(val)?.toString()}  =>  `)}
            </Text>
            <br />
            <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
              {table?.length && table[2]?.map((val) => `${getBalanceNumber(val)?.toString()}  =>  `)}
            </Text>
            <br />
            <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
              {table?.length &&
                table[3]?.map((val, index) => {
                  if (index === table[3]?.length - 1) {
                    return getBalanceNumber(val)?.toString()
                  }
                  return `${getBalanceNumber(val)?.toString()}  =>  `
                })}
            </Text>
            <br />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Table')}
            </Text>
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef2}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Auditor')}
              </Text>
              {tooltipVisible2 && tooltip2}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="auditor"
              value={state.auditor}
              placeholder={t('input auditor address')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Amount To Borrow')}
            </Text>
            <Input
              type="text"
              scale="sm"
              name="amountPayable"
              value={state.amountPayable}
              placeholder={t('input amount you wish to borrow')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef4}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('User Bounty ID')}
              </Text>
              {tooltipVisible4 && tooltip4}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="userBountyId"
              value={state.userBountyId}
              placeholder={t('input user bounty id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef5}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Auditor Bounty ID')}
              </Text>
              {tooltipVisible5 && tooltip5}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="auditorBountyId"
              value={state.auditorBountyId}
              placeholder={t('input auditor bounty id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
        </>
      )}
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Channel Number')}
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="channel"
          value={state.channel}
          placeholder={t('input channel number')}
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
              'This will mint a new future collateral to your address. Please read the documentation to learn more about future collaterals.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? (
          <>
            <Button
              mb="8px"
              onClick={stage === 'PICK_CHANNEL' ? handleCreateGauge : openPresentControlPanel}
              endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
              isLoading={pendingTx || pendingFb}
            >
              {stage === 'PICK_CHANNEL' ? t('Pick Channel') : t('Mint Future Collateral')}
            </Button>
          </>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateFutureCollateralModal
