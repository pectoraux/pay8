import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Input, Text, Button, ErrorIcon } from '@pancakeswap/uikit'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useCurrencyBalance } from 'state/wallet/hooks'
import BigNumber from 'bignumber.js'
import BribeField from './LockedPool/Common/BribeField'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
  account?: any
  state: any
  handleChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  state,
  account,
  currency,
  currAccount,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const [lockedAmount, setLockedAmount] = useState('')
  const balance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const stakingTokenBalance = balance ? new BigNumber(currAccount?.balance) : BIG_ZERO
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <>
      <Text>{t("The amount of %symbol% to remove from your paycard's balance", { symbol: currency?.symbol })}</Text>
    </>
  )
  return (
    <>
      <GreyedOutContainer>
        <BribeField
          add="remove"
          stakingAddress={currency?.address}
          stakingSymbol={currency?.symbol}
          stakingDecimals={currency?.decimals}
          lockedAmount={state.amountReceivable}
          usedValueStaked={usdValueStaked}
          stakingMax={stakingTokenBalance}
          TooltipComponent={TooltipComponent}
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
            {t("This will remove funds from your card's balance.")}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" variant="danger" onClick={continueToNextStage}>
          {t('Remove')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
