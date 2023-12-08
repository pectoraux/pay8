import EncryptRsa from 'encrypt-rsa'
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
  useModal,
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchCardsAsync } from 'state/cards'
import { cardABI } from 'config/abi/card'
import { getCardAddress } from 'utils/addressHelpers'
import { useCardContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { createPublicClient, http, custom, createWalletClient } from 'viem'
import { fantomTestnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateCardModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [pendingFb, setPendingFb] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { toastSuccess, toastError } = useToast()
  const client = createPublicClient({
    chain: fantomTestnet,
    transport: http(),
  })
  const walletClient = createWalletClient({
    chain: fantomTestnet,
    transport: custom(window.ethereum),
  })
  const acct = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PAYSWAP_SIGNER}`)

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const encryptRsa = new EncryptRsa()
      const _username = encryptRsa.encryptStringWithRsaPublicKey({
        text: username,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      })
      const _password = encryptRsa.encryptStringWithRsaPublicKey({
        text: password,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      })
      const args = [_username, _password]
      console.log('CreateCardModal===================>', args)
      const { request } = await client.simulateContract({
        account: acct,
        address: getCardAddress(),
        abi: cardABI,
        functionName: 'createAccount',
        args: [_username, _password],
      })
      return walletClient.writeContract(request).catch((err) => {
        console.log('1createGauge=================>', err)
        setPendingFb(false)
        toastError(
          t('Issue creating PayCard'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('PayCard successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your PayCard.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchCardsAsync({ fromCard: true, chainId }))
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    username,
    password,
    client,
    acct,
    walletClient,
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
    <Modal title={t('Create PayCard')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Username')}
        </Text>
        <Input
          type="password"
          scale="sm"
          value={username}
          placeholder={t('input your username')}
          onChange={(e) => setUsername(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Password')}
        </Text>
        <Input
          type="password"
          scale="sm"
          value={password}
          placeholder={t('input your password')}
          onChange={(e) => setPassword(e.target.value)}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will create a new PayCard with you as its owner. Please read the documentation to learn more about PayCards.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={handleCreateGauge}
          endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={pendingTx || pendingFb}
        >
          {t('Create PayCard')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default CreateCardModal
