import { useEffect, useRef, useState, useCallback, ChangeEvent, useMemo } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchLotteriesAsync } from 'state/lotteries'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useLotteryContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Accelerator/components/styles'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useLottery } from 'state/lottery/hooks'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const ClaimTicketModal: React.FC<any> = ({ lotteryId, users, currentTokenId, currTokenData, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const lotteryContract = useLotteryContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const { lotteryData } = useLottery()
  const prizeAddress = useMemo(
    () =>
      lotteryData?.nftPrizes?.length >= currentTokenId
        ? lotteryData?.nftPrizes[currentTokenId]?.tokenAddress
        : lotteryData?.nftPrizes[0]?.tokenAddress,
    [lotteryData, currentTokenId],
  )

  const [state, setState] = useState<any>(() => ({
    tickets: users?.map((user) => user.id)?.join(','),
    brackets: '0,1,2,3,4,5',
    prizeAddress: parseInt(lotteryData?.isNFT) ? prizeAddress : currTokenData?.token?.address,
  }))

  const updateValue = (key: any, value: string | number | boolean | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [state.prizeAddress, lotteryId, state.tickets?.split(','), state.brackets?.split(',')]
      console.log('Confirm_claim_ticket================>', args)
      return callWithGasPrice(lotteryContract, 'claimTickets', args).catch((err) => {
        console.log('Confirm_claim_ticket================>', err)
        setPendingFb(false)
        toastError(
          t('Issue claiming ticket(s)'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Ticket(s) successfully claimed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now withdraw you rewards.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchLotteriesAsync({ fromLottery: true, chainId }))
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    state.prizeAddress,
    state.tickets,
    state.brackets,
    lotteryId,
    callWithGasPrice,
    lotteryContract,
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

  return (
    <Modal title={t('Claim Tickets')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Ticket IDs')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="tickets"
          value={state.tickets}
          placeholder={t('comma separated ids')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token To Claim')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="prizeAddress"
          value={state.prizeAddress}
          placeholder={t('input address of token to claim')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Brackets')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="brackets"
          value={state.brackets}
          placeholder={t('comma separated brackets')}
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
              'This will claim rewards for the specified tickets. Please read the documentation to learn more about claiming tickets.',
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
            {t('Claim')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default ClaimTicketModal
