import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import { useGetTokenData } from 'state/ramps/hooks'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
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
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchAuditorsAsync } from 'state/auditors'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useERC20, usePoolGaugeContract } from 'hooks/useContract'
import { useGetRequiresApproval } from 'state/pools/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'

import { Divider, GreyedOutContainer } from './styles'
import BribeField from './LockedPool/Common/BribeField'
import { useApprovePool } from '../hooks/useApprove'
import { useActiveChainId } from 'hooks/useActiveChainId'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreatePoolModal: React.FC<any> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const poolGaugeContract = usePoolGaugeContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [_ve, setVe] = useState('')
  const { chainId } = useActiveChainId()
  const [pairAddress, setPairAddress] = useState<any>('')
  const [allowing, setAllowing] = useState(false)
  const [tokenId, setTokenId] = useState('')
  const [amount, setAmount] = useState('')
  const { toastSuccess, toastError } = useToast()
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const pair = useMemo(
    () => liquidityTokens.find((p) => p.address?.toLowerCase() === pairAddress?.toLowerCase()),
    [liquidityTokens, pairAddress],
  )

  const balance = useCurrencyBalance(account ?? undefined, pair ?? undefined)
  const stakingTokenBalance = balance ? getDecimalAmount(new BigNumber(balance?.toExact()), pair?.decimals) : BIG_ZERO
  const stakingTokenContract = useERC20(pairAddress || '')
  const { data } = useGetTokenData(pairAddress || '')
  const { handleApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    poolGaugeContract.address,
    pair?.symbol,
  )
  const { needsApproval, refetch } = useGetRequiresApproval(stakingTokenContract, account, poolGaugeContract.address)
  console.log('tokenData================>', data, needsApproval, pair, liquidityTokens)
  useEffect(() => {
    if (pendingPoolTx) {
      setAllowing(true)
    } else {
      refetch()
      // onDismiss()
    }
  }, [pendingPoolTx, pairAddress, setPairAddress, refetch])

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    const decimals = data.decimals
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const amountDecimals = getDecimalAmount(new BigNumber(amount), decimals)
      console.log('receipt================>', poolGaugeContract, [pairAddress, _ve, tokenId, amountDecimals.toString()])
      return callWithGasPrice(poolGaugeContract, 'deposit', [
        pairAddress,
        _ve,
        tokenId,
        amountDecimals.toString(),
      ]).catch((err) => {
        setPendingFb(false)
        console.log('rerr==================>', err)
        toastError(
          t('Issue depositing LPs'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('LP successfully deposited'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start earning trading fees from the liquidity pool.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchAuditorsAsync({ fromAuditor: true, chainId }))
    }
    onDismiss()
  }, [
    t,
    _ve,
    data,
    amount,
    chainId,
    tokenId,
    dispatch,
    onDismiss,
    toastError,
    pairAddress,
    toastSuccess,
    callWithGasPrice,
    poolGaugeContract,
    fetchWithCatchTxError,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>{t('Your pair address is the address of the LP token you get after providing liquidity in the AMM')}</Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'Pick anyone of the Leviathans from which you have minted a token. In case you have not, go to Mint > Leviathans and mint one then come back here. Input the address of your Leviathan token here',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Input the ID of your Leviathan token here. All rewards maded from staking you LP in this contract will be associated to this token ID and whomever owns it can withdraw all of its pending rewards.',
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
    <Modal title={t('Deposit LP')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Address of Pair')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={pairAddress}
          placeholder={t('input your pair address')}
          onChange={(e) => setPairAddress(e.target.value)}
        />
      </GreyedOutContainer>
      {!needsApproval ? (
        <>
          <GreyedOutContainer>
            <Flex ref={targetRef2}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Address of Leviathan Token')}
              </Text>
              {tooltipVisible2 && tooltip2}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              value={_ve}
              placeholder={t('input Leviathan token address')}
              onChange={(e) => setVe(e.target.value)}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef3}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Leviathan Token ID')}
              </Text>
              {tooltipVisible3 && tooltip3}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              value={tokenId}
              placeholder={t('input Leviathan token id')}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <BribeField
              stakingAddress={pair?.address}
              stakingSymbol={pair?.symbol ?? 'Pair'}
              stakingDecimals={pair?.decimals}
              lockedAmount={amount}
              stakingMax={stakingTokenBalance}
              setLockedAmount={setAmount}
              stakingTokenBalance={stakingTokenBalance}
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
            {needsApproval
              ? t('The will enable the pool contract to withdraw from your wallet')
              : t(
                  'The will deposit LPs and make you elligible to earn trading fees from the liquidity pool. Please read the documentation to learn more about Pools.',
                )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {!account ? (
          <ConnectWalletButton />
        ) : needsApproval ? (
          <Button
            mb="8px"
            onClick={() => {
              setAllowing(true)
              handleApprove()
            }}
            endIcon={allowing || (pairAddress && !pair) ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={allowing}
            disabled={allowing || !pair}
          >
            {t('%text% %symbol%', { text: pair ? 'Enable' : 'Input pair address', symbol: pair?.symbol ?? '' })}
          </Button>
        ) : (
          <Button
            mb="8px"
            onClick={handleCreateGauge}
            endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={pendingTx || pendingFb}
          >
            {t('Deposit LP')}
          </Button>
        )}
      </Flex>
    </Modal>
  )
}

export default CreatePoolModal
