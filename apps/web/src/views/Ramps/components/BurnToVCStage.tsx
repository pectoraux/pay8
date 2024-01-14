import axios from 'axios'
import { useState } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  useTooltip,
  HelpIcon,
  AutoRenewIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetCardId } from 'state/ramps/hooks'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

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
const BurnStage: React.FC<any> = ({ state, handleChange, rampHelperContract }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useWeb3React()
  const { data: vc } = useGetCardId(state.rampAddress, account)
  console.log('cardId=================>', vc)

  async function onAttemptToCreateVC() {
    setIsLoading(true)
    const { data } = await axios.post('/api/burnToVC', {
      cardId: vc?.id, // : "ic_1OYT5eAkPdhgtN6ISV6Dz0LB",
      price: state.amountReceivable,
      cardholderId: state.cardholderId,
      symbol: state.symbol,
      sk: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
    })
    if (data.error) {
      console.log('data.error=====================>', data.error)
    }
    const args = ['3', '0', data.cardId, state.symbol, '0', '0', state.rampAddress, '']
    console.log('data.success==================>', args)
    return callWithGasPrice(rampHelperContract, 'emitUpdateMiscellaneous', args)
      .then(() => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false)
        console.log('err0=================>', err)
      })
  }

  const TooltipComponent = () => (
    <Text>
      {t(
        "Identity tokens are used to confirm identity requirements burners need to fulfill to proceed with the burn. If your ramp doesn't have any requirements, you can just input 0. If it does, make sure you get an auditor approved by the ramp to deliver you an identity token and input its ID in this field.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "Make sure you take the burning fee into account. If your ramp's burning fee is 10% then inputting 100 will only send you 100 - (100 * 10 / 100) = 90 in FIAT currency.",
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
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Amount')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input amount to amountReceivable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Symbol')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="symbol"
          value={state.symbol}
          placeholder={t('input currency symbol')}
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
              'This will burn the specified amount of the selected token from your wallet and make the equivalent amount in FIAT currency available to you on the specified cirtual card.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          variant="danger"
          onClick={onAttemptToCreateVC}
          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {t('Burn')}
        </Button>
      </Flex>
    </>
  )
}

export default BurnStage
