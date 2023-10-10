import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyedOutContainer, Divider } from './styles'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { getMarketTradesAddress, getNftMarketTradesAddress, getPaywallMarketTradesAddress } from 'utils/addressHelpers'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ state, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        'This sets the amount you will be receiving (periodically for periodic stakes and a one time payment for non periodic stakes) from the stake. In case you are making a purchase in the marketplace, that amount is 0. For other stakes that amount might not be depending on the purpose of the stake.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This sets the amount you will be paying (periodically for periodic stakes and a one time payment for non periodic stakes) to other parties in the stake. In case you are making a purchase in the marketplace, that amount is the price of the item you are buying.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'This sets the marketplace of your stake. If you are creating this stake to make a purchase in the marketplace, input the address of that marketplace right here. The addresses of the marketplaces for subscriptions, NFTs and products/services are listed below. If your stake is not meant to make purchases on any marketplace, you can input your wallet address here.',
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
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Amount Payable')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="amountPayable"
          value={state.amountPayable}
          placeholder={t('input amount payable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Amount Receivable')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input amount receivable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Stake Source')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="source"
          value={state.source}
          placeholder={t('input source of stake')}
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
              'This will update your stake info before litigations. Input in the amount payable field how much you would like your partner(s) to pay you and in the amount receivable field how much you agree to pay your partner(s). Make sure you update these parameters before the waiting period of your stake is expired and a litigation is created.',
            )}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Product/Services Market Trades Contract Address')}
          </Text>
          <CopyAddress
            title={truncateHash(getPaywallMarketTradesAddress(), 15, 15)}
            account={getPaywallMarketTradesAddress()}
          />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Paywall/Subscriptions Market Trades Contract Address')}
          </Text>
          <CopyAddress
            title={truncateHash(getNftMarketTradesAddress(), 15, 15)}
            account={getNftMarketTradesAddress()}
          />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('NFT Market Trades Contract Address')}
          </Text>
          <CopyAddress title={truncateHash(getMarketTradesAddress(), 15, 15)} account={getMarketTradesAddress()} />
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
