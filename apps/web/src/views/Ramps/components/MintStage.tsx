import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, AutoRenewIcon, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { useWeb3React } from '@pancakeswap/wagmi'
import { createPublicClient, http, custom, createWalletClient } from 'viem'
import { fantomTestnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

import { GreyedOutContainer, Divider } from './styles'
import { rampHelperABI } from 'config/abi/rampHelper'
import { getRampHelperAddress } from 'utils/addressHelpers'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  lowestPrice?: number
  state: any
  account?: any
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ state, pool, currency, rampAddress, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)
  const acct = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PAYSWAP_SIGNER}`)
  const client = createPublicClient({
    chain: fantomTestnet,
    transport: http(),
  })
  const walletClient = createWalletClient({
    chain: fantomTestnet,
    transport: custom(window.ethereum),
  })
  const processCharge = async () => {
    setIsLoading(true)
    console.log('processCharge===============>', currency, state.sk)
    const { data } = await axios.post('/api/charge', {
      account,
      price: state.amountPayable,
      currency,
      rampAddress,
      sk: state.sk,
    })
    if (data.error) {
      console.log('data.error=====================>', data.error)
    }
    const stripe = await loadStripe(state.pk)
    console.log('7stripe=====================>', [
      rampAddress,
      account,
      currency?.address,
      state.amountPayable,
      state.identityTokenId,
      data.id,
    ])

    const { request } = await client.simulateContract({
      account: acct,
      address: getRampHelperAddress(),
      abi: rampHelperABI,
      functionName: 'preMint',
      args: [rampAddress, account, currency?.address, state.amountPayable, state.identityTokenId, data.id],
    })
    await walletClient
      .writeContract(request)
      .then(async () => stripe.redirectToCheckout({ sessionId: data?.id }))
      .catch((err) => {
        console.log('createGauge=================>', err)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="amountPayable"
          value={state.amountPayable}
          placeholder={t('input of amount to mint')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Identity Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="identityTokenId"
          value={state.identityTokenId}
          placeholder={t('input your identity token id')}
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
              'The will mint the specified amount of token to the recipient. Please read the documentation for more details.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={() => {
            if (pool?.automatic) {
              processCharge()
            } else if (pool?.devaddr_ === account) {
              continueToNextStage()
            }
          }}
          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          disabled={!state.pk || !state.sk}
        >
          {t('Mint')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
