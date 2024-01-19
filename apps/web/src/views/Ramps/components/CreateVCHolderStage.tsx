import axios from 'axios'
import { useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  useTooltip,
  AutoRenewIcon,
  useToast,
} from '@pancakeswap/uikit'

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
const BurnStage: React.FC<any> = ({ state, handleChange, rampHelperContract, onDismiss }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess, toastError } = useToast()

  async function onAttemptToCreateVC() {
    setIsLoading(true)
    const { data } = await axios.post('/api/createVCHolder', {
      name: state.name,
      email: state.email,
      phone: state.phone_number,
      first: state.name,
      last: state.name,
      line1: state.line1,
      city: state.city,
      state: state.state,
      postal: state.postal_code,
      country: state.country,
      sk: state.sk,
    })
    if (data.error) {
      console.log('data.error=====================>', data.error)
      toastError(t('Issue storing cardholder: %val%', { val: data.error.raw?.message }))
      setIsLoading(false)
    } else {
      const args = ['2', '0', data.cardholderId, state.country, '0', '0', state.rampAddress, state.symbol]
      console.log('data.success==================>', args, data)
      return callWithGasPrice(rampHelperContract, 'emitUpdateMiscellaneous', args)
        .then((res: any) => {
          setIsLoading(false)
          toastSuccess(t('Cardholder successfully created: %hash%', { hash: res?.hash }))
        })
        .catch((err) => {
          setIsLoading(false)
          toastError(t('Issue creating storing cardholder: %err%', { err }))
          console.log('err0=================>', err)
        })
    }
    onDismiss()
    return null
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
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Name')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="name"
          value={state.name}
          placeholder={t('input name to associate to card')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Email')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="email"
          value={state.email}
          placeholder={t('input email to associate to card')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Phone Number')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="phone_number"
          value={state.phone_number}
          placeholder={t('input phone number to associate to card')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Address Line 1')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="line1"
          value={state.line1}
          placeholder={t('input line 1 of your address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('City')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="city"
          value={state.city}
          placeholder={t('input city to associate to card')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Country')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="country"
          value={state.country}
          placeholder={t('input country to associate to card')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Postal Code')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="postal_code"
          value={state.postal_code}
          placeholder={t('input postal code to associate to card')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('State')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="state"
          value={state.state}
          placeholder={t('input state to associate to card')}
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
          placeholder={t('input currency of stripe account')}
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
          onClick={onAttemptToCreateVC}
          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {t('Create')}
        </Button>
      </Flex>
    </>
  )
}

export default BurnStage
