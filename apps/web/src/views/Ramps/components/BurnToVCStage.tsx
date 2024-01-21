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
  useToast,
  ButtonMenu,
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetCardFromStripe, useGetCardId } from 'state/ramps/hooks'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'

import { GreyedOutContainer, Divider } from './styles'
import { ccFormat } from './PoolsTable/ActionPanel/Harvest'

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
const BurnStage: React.FC<any> = ({ state, setBurntToVC, rampHelperContract, onDismiss }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useWeb3React()
  const { data: vc } = useGetCardId(state.rampAddress, account)
  const { data: cardInfo } = useGetCardFromStripe(state.sk, vc?.cardId)
  const [activeButtonIndex, setActiveButtonIndex] = useState(0)
  const { toastSuccess, toastError } = useToast()

  async function onAttemptToCreateVC() {
    setIsLoading(true)
    const { data } = await axios.post('/api/burnToVC', {
      cardId: vc?.cardId,
      price: state.amountReceivable,
      cardholderId: state.cardholderId,
      symbol: state.symbol,
      sk: state.sk,
    })
    if (data.error) {
      console.log('data.error=====================>', data.error)
      setIsLoading(false)
      toastError(t('Issue storing cardholder: %val%', { val: data.error.raw?.message }))
    } else {
      const args = ['3', '0', data.cardId, state.symbol, '0', '0', state.rampAddress, '']
      console.log('data.success==================>', args, data)
      return callWithGasPrice(rampHelperContract, 'emitUpdateMiscellaneous', args)
        .then(() => callWithGasPrice(rampHelperContract, 'postMint', [state.sessionId]))
        .then((res) => {
          setIsLoading(false)
          setIsSuccess(true)
          setBurntToVC(true)
          toastSuccess(t('Amount successfully burnt to card: %hash%', { hash: res?.hash }))
          onDismiss()
        })
        .catch((err) => {
          setIsLoading(false)
          toastError(t('Issue burning to card: %err%', { err }))
          console.log('err0=================>', err)
        })
    }
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
          // onChange={handleChange}
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
          // onChange={handleChange}
        />
      </GreyedOutContainer>
      {cardInfo?.data?.cardNumber?.length ? (
        <GreyedOutContainer>
          <StyledItemRow>
            <Text bold px="16px">
              {t('Reveal Card Info')}
            </Text>
            <ButtonMenu scale="xs" variant="subtle" activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
              <ButtonMenuItem>{t('No')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
            </ButtonMenu>
          </StyledItemRow>
        </GreyedOutContainer>
      ) : null}
      {activeButtonIndex ? (
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Text small bold color="textSubtle">
            {t(`Card Number: ${ccFormat(cardInfo?.data?.cardNumber)}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`CVV: ${cardInfo?.data?.cvc}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Expiration: ${cardInfo?.data?.exp_month}/${cardInfo?.data?.exp_year}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Total Burnt To Card: ${cardInfo?.data?.amount} ${cardInfo?.data?.symbol?.toUpperCase()}`)}
          </Text>
        </Flex>
      ) : null}
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
          disabled={isSuccess}
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
