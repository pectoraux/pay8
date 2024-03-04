import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  AutoRenewIcon,
  Input,
  ErrorIcon,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { createPublicClient, http, custom, createWalletClient } from 'viem'
import { fantomTestnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { rampHelperABI } from 'config/abi/rampHelper'
import { useFetchRamp } from 'state/ramps/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { getCardAddress, getRampHelperAddress } from 'utils/addressHelpers'

import { GreyedOutContainer, Divider } from './styles'

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
const SetPriceStage: React.FC<any> = ({ state, pool, currency, handleChange }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { data: ramp, refetch } = useFetchRamp(state.rampAddress?.toLowerCase())
  const rampAccount = useMemo(
    () => ramp?.accounts?.find((acct) => acct.token.address?.toLowerCase() === state?.token?.toLowerCase()),
    [ramp?.accounts, state?.token],
  )
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
    try {
      setIsLoading(true)
      const { data } = await axios.post('/api/charge2', {
        price: state.amountPayable,
        currency,
        username: pool?.sousId,
        sk: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
      })
      if (data.error) {
        console.log('data.error=====================>', data.error)
        setErrorMessage(data.error?.raw?.message)
        setIsLoading(false)
      } else {
        console.log('createGauge=================>', [
          state.rampAddress,
          getCardAddress(),
          currency?.address,
          state.amountPayable,
          state.identityTokenId,
          data.id,
        ])
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        const { request } = await client.simulateContract({
          account: acct,
          address: getRampHelperAddress(),
          abi: rampHelperABI,
          functionName: 'preMint',
          args: [
            state.rampAddress,
            getCardAddress(),
            currency?.address,
            state.amountPayable,
            state.identityTokenId,
            data.id,
          ],
        })
        await walletClient
          .writeContract(request)
          .then(async () => stripe.redirectToCheckout({ sessionId: data?.id }))
          .catch((err) => {
            console.log('createGauge=================>', err)
            setIsLoading(false)
          })
      }
    } catch (err) {
      console.log('1createGauge=================>', err)
    }
  }

  useEffect(() => {
    refetch()
  }, [refetch, state.rampAddress])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        "Identity tokens are used to confirm identity requirements burners need to fulfill to proceed with the burn. If your dRamp doesn't have any requirements, you can just input 0. If it does, make sure you get an auditor approved by the dRamp to deliver you an identity token and input its ID in this field.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "Make sure you take the burning fee into account. If your dRamp's burning fee is 10% then inputting 100 will only send you 100 - (100 * 10 / 100) = 90 in FIAT currency.",
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

  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Ramp Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="rampAddress"
          value={state.rampAddress}
          placeholder={t('input your ramp address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Amount')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="amountPayable"
          value={state.amountPayable}
          placeholder={t('input an amount to mint')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      {/* <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Identity Token ID')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="identityTokenId"
          value={state.identityTokenId}
          placeholder={t('input your identity token id')}
          onChange={handleChange}
        />
      </GreyedOutContainer> */}
      {errorMessage ? (
        <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
          <Flex alignSelf="flex-start">
            <ErrorIcon width={24} height={24} color="textSubtle" />
          </Flex>
          <Box>
            <Text small color="red">
              {t(errorMessage)}
            </Text>
          </Box>
        </Grid>
      ) : null}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="460px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              "This will mint the specified amount of the selected token to your paycard balance. The minted tokens are the equivalent of the FIAT currency being minted on the blockchain. To mint a token on an automatic ramp, the platform uses a payment processor like Stripe to retrieve payments from the minter's debit card then notifies the ramp contract which mints the requested amount of tokens on the blockchain and sends it to the minter's wallet minus the ramp's minting fee. To mint tokens on a manual ramp, the minter would have to send a request for mint through PayChat to the admin of the ramp who will then manually run the mint function through this form after having received the necessary payment from the minter. Manual ramps will list all payment methods they accept and will have guidelines in their descriptions (available at the top left of their ramp's panel) about how to proceed. With manual ramps, you should be able to find a ramp that accepts your payment method no matter what it is: cash, mobile money, etc.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={processCharge}
          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          disabled={
            !ramp?.automatic ||
            parseInt(getBalanceNumber(rampAccount?.mintable)?.toString()) < parseInt(state.amountPayable)
          }
        >
          {t('Add Balance')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
