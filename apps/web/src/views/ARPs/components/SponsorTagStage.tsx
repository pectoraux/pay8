import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon, Input, useTooltip } from '@pancakeswap/uikit'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useCurrencyBalance } from 'state/wallet/hooks'
import BribeField from './LockedPool/Common/BribeField'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any
  currency: any
  account: any
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  state,
  account,
  currency,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const [lockedAmount, setLockedAmount] = useState('')
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance
    ? getDecimalAmount(new BigNumber(balance.toFixed()), currency?.decimals)
    : BIG_ZERO
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        "Every purchase in the marketplace generates a vote for the corresponding business. If you have a token from the purchased item's associated workspace, input its ID right here to vote for the business.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'Identity tokens are used to confirm requirements customers of an item need to fulfill to purchase the item. If your item does not have any requirements, you can just input 0. If it does, make sure you get an auditor approved by the business to deliver you an identity token and input its ID in this field.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Pick the marketplace where the item is listed, pick Subscription if it is a subscription product, NFT if it is purchased from eCollectibles but not a subscription product and CanCan otherwise.',
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
        {/* <Flex ref={targetRef}> */}
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Sponsor Contract Address')}
        </Text>
        {/* {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex> */}
        <Input
          type="text"
          scale="sm"
          name="contractAddress"
          value={state.contractAddress}
          placeholder={t('input sponsor contract address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        {/* <Flex ref={targetRef2}> */}
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Tag Name')}
        </Text>
        {/* {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex> */}
        <Input
          type="text"
          scale="sm"
          name="tag"
          value={state.tag}
          placeholder={t('input tag name')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        {/* <Flex ref={targetRef3}> */}
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Link to Media')}
        </Text>
        {/* {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex> */}
        <Input
          type="text"
          scale="sm"
          name="message"
          value={state.message}
          placeholder={t('input link to sponsored content')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <BribeField
          add={t('pay')}
          stakingAddress={currency?.address}
          stakingSymbol={currency?.symbol}
          stakingDecimals={currency?.decimals}
          lockedAmount={state.amountReceivable}
          usedValueStaked={usdValueStaked}
          stakingMax={stakingTokenBalance}
          setLockedAmount={handleRawValueChange('amountReceivable')}
          stakingTokenBalance={stakingTokenBalance}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will display your media on NFTs from this ARP. Please read the documentation for more details.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Sponsor')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
