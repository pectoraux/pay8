import { useEffect, useRef, useState, useCallback } from 'react'
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
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchGamesAsync } from 'state/games'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGameFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import BigNumber from 'bignumber.js'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateGameModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const { reload } = useRouter()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const gameFactoryContract = useGameFactory()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [gameContract, setGameContract] = useState<any>('')
  const [pricePerMinutes, setPricePerMinutes] = useState<any>('')
  const [creatorShare, setCreatorShare] = useState<any>(0)
  const [referrerFee, setReferrerFee] = useState<any>(0)
  const [claimable, setClaimable] = useState(0)
  const { toastSuccess, toastError } = useToast()
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    const amount = getDecimalAmount(new BigNumber(pricePerMinutes), currency?.decimals ?? 18)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [
        currency?.address,
        gameContract || ADDRESS_ZERO,
        amount.toString(),
        creatorShare,
        referrerFee,
        !!claimable,
      ]
      console.log('receipt================>', gameFactoryContract, args)
      return callWithGasPrice(gameFactoryContract, 'addProtocol', args).catch((err) => {
        console.log('err================>', err)
        setPendingFb(false)
        toastError(
          t('Issue creating game'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Game successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your Game contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchGamesAsync({ fromGame: true, chainId }))
      delay(3000)
      reload()
    }
    onDismiss()
  }, [
    pricePerMinutes,
    currency?.decimals,
    currency?.address,
    fetchWithCatchTxError,
    onDismiss,
    gameContract,
    creatorShare,
    referrerFee,
    claimable,
    gameFactoryContract,
    callWithGasPrice,
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
        "This sets the address of the entity responsible for update the scores in this game which consists of writing users' scores in the games on the blockchain. It can be another smart contract that you've deployed on the blockchain or your wallet address or a game's auditor's wallet address.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "This sets the price users will have to pay to purchase one minute in this game. Make sure you have selected the game's currency from the drop down menu next to the 'Create Game' button.",
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'This sets the percentage of the price paid by a referred user that you are willing to share with his/her referrer. This is a mechanism that incentivises users to refer other users to your game.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t('This sets the percentage of the prize pot that is shared with the creator of the game which is you.')}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'This sets whether the game will be claimable straight away or just later one. You can update this parameter later on. By picking Yes, you enable players to start earning from the game. Some game might want to wait for the prize pot to get big enough before activating this parameter.',
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
    <Modal title={t('Create Game')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Game Contract Address')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={gameContract}
          placeholder={t('input game contract address')}
          onChange={(e) => setGameContract(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Price Per Minutes')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={pricePerMinutes}
          placeholder={t('input price per minutes')}
          onChange={(e) => setPricePerMinutes(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Referrer Fee (%)')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={referrerFee}
          placeholder={t('input referrer fee')}
          onChange={(e) => setReferrerFee(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Creator Share (%)')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={creatorShare}
          placeholder={t('input creator share')}
          onChange={(e) => setCreatorShare(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef5} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Make claimable ?')}
            </Text>
            {tooltipVisible5 && tooltip5}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu scale="xs" variant="subtle" activeIndex={claimable ? 1 : 0} onItemClick={setClaimable}>
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
              'This will deploy a new Game contract with you as its Admin. Game contracts enable you to setup a play and earn mechanism around standalone games. Please read the documentation to learn more about Games.',
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
            {t('Create Game')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateGameModal
