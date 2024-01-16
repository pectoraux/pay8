import axios from 'axios'
import Dots from 'components/Loader/Dots'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import {
  Flex,
  ButtonMenu,
  ButtonMenuItem,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  useToast,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetAccountSg } from 'state/ramps/hooks'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'

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
const BurnStage: React.FC<any> = ({
  state,
  rampAddress,
  handleChange,
  rampHelperContract,
  callWithGasPrice,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const router = useRouter()
  const { toastError, toastSuccess } = useToast()
  const { data: accountData, refetch } = useGetAccountSg(account, 'stripe')
  const [linking, setLinking] = useState<boolean>(false)
  const [linked, setLinked] = useState<boolean>(accountData?.active && accountData?.id)
  const [toVC, setToVC] = useState(0)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
    setLinked(accountData?.id && accountData?.active)
  }, [accountData?.active, accountData?.id, inputRef])

  async function onAttemptToCreateLink() {
    setLinking(true)
    const { data } = await axios.post('/api/link', {
      rampAddress,
      sk: state.sk,
      accountId: state.accountId,
    })
    if (!linked) {
      if (data?.err) {
        setLinked(false)
        setLinking(false)
        return
      }
      const args = ['stripe', data.accountId, state.moreInfo?.split(',')]
      await callWithGasPrice(rampHelperContract, 'linkAccount', args).catch((err) => {
        console.log('createGauge=================>', err)
      })
      router.push(data.link)
    } else if (!data.err) {
      toastSuccess(t('Bank account successfully linked'))
      setLinked(true)
      setLinking(false)
    } else {
      toastError(t('Error'), t(data.err))
      // throw new Error('cannot link to bank')
      setLinking(false)
    }
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
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'In case you decide to burn your tokens to a virtual card, make sure the token you are trying to burn is the currency of the Payment Processor Country (PPC) of this ramp. If the PPC of the ramp is FR (for France) for instance, then you can only burnt EUR tokens to your card, if the PPC is US then you can only burn USD tokens, etc. Trying to burn any other tokens will result in the loss of your funds without possibility of revocery. This is only the case if you are trying to burn tokens to a virtual card',
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
    <>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef3}>
            <Text fontSize="12px" paddingRight="10px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Burn To Virtual Card?')}
            </Text>
            {tooltipVisible3 && tooltip3}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu scale="xs" variant="subtle" activeIndex={toVC} onItemClick={setToVC}>
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      {!(accountData?.id && accountData?.active) && state.automatic && !toVC ? (
        <>
          <Divider />
          <Flex flexDirection="column">
            <Button variant={linked ? 'success' : 'primary'} onClick={onAttemptToCreateLink}>
              {linking ? <Dots>{t('Linking')}</Dots> : linked ? t('Linked') : t('Link')}
            </Button>
          </Flex>
        </>
      ) : (
        <>
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
              name="amountReceivable"
              value={state.amountReceivable}
              placeholder={t('input of amount to burn')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
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
          </GreyedOutContainer>
          <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
            <Flex alignSelf="flex-start">
              <ErrorIcon width={24} height={24} color="textSubtle" />
            </Flex>
            <Box>
              <Text small color="textSubtle">
                {t(
                  "This will burn the specified amount of the selected token from your wallet and send you the equivalent amount of the corresponding FIAT currency. To burn a token on an automatic ramp, the ramp contract retreives the requested amount of tokens from the burner's wallet on the blockchain minus the ramp's burning fee then the platform uses a payment processor like Stripe to send the requested amount in the equivalent FIAT currency to the burner's payment processor account. To burn tokens on a manual ramp, the burner would have to send a request for burn through PayChat to the admin of the ramp who will then manually run the burn function through this form and then send the necessary payment to the burner. Manual ramps will list all payment methods they accept and will have guidelines in their descriptions (available at the top left of their ramp's panel) about how to proceed. With manual ramps, you should be able to find a ramp that accepts your payment method no matter what it is: cash, mobile money, etc.",
                )}
              </Text>
            </Box>
          </Grid>
          <Divider />
          <Flex flexDirection="column" px="16px" pb="16px">
            <Button
              mb="8px"
              variant="danger"
              onClick={continueToNextStage}
              disabled={
                Number(state.amountReceivable) < 2 ||
                (toVC && state.vcTokenSymbol?.toLowerCase() !== state.symbol?.toLowerCase())
              }
            >
              {t('Burn')}
            </Button>
          </Flex>
        </>
      )}
    </>
  )
}

export default BurnStage
