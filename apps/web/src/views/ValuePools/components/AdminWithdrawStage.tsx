import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon } from '@pancakeswap/uikit'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'

import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import BribeField from './LockedPool/Common/BribeField'
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
const SetPriceStage: React.FC<any> = ({
  currency,
  state,
  pendingRevenue,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const [lockedAmount, setLockedAmount] = useState('')
  const stakingTokenBalance = pendingRevenue ? new BigNumber(pendingRevenue) : BIG_ZERO
  const usdValueStaked = useBUSDCakeAmount(_toNumber(lockedAmount))

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      <GreyedOutContainer>
        <BribeField
          add="withdraw"
          stakingAddress={currency?.address}
          stakingSymbol={currency?.symbol}
          stakingDecimals={18}
          lockedAmount={state.amountPayable}
          usedValueStaked={usdValueStaked}
          stakingMax={stakingTokenBalance}
          setLockedAmount={handleRawValueChange('amountPayable')}
          stakingTokenBalance={stakingTokenBalance}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              "This will withdraw funds from the Valuepool. This can be used to withdraw funds from the Valuepool's treasury.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Withdraw')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
