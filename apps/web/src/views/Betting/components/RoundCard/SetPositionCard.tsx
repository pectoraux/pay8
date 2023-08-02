import BigNumber from 'bignumber.js'
import { useState } from 'react'
import {
  ArrowBackIcon,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Button,
  BinanceIcon,
  LogoIcon,
  Text,
  Slider,
  Box,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetMinBetAmount } from 'state/predictions/hooks'
import { useTranslation } from '@pancakeswap/localization'
// import { useBettingContract } from 'hooks/useContract'
// import { useGetBnbBalance, useGetCakeBalance } from 'hooks/useTokenBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { BetPosition } from 'state/types'

import PositionTag from '../PositionTag'
import FlexRow from '../FlexRow'

const LOGOS = {
  BNB: BinanceIcon,
  CAKE: LogoIcon,
}

interface SetPositionCardProps {
  position: BetPosition
  togglePosition: () => void
  epoch: number
  onBack: () => void
  onSuccess: (hash: string) => Promise<void>
}

// const dust = parseUnits('0.001', 18)
const percentShortcuts = [10, 25, 50, 75]

const getButtonProps = (value: BigNumber, bnbBalance: BigNumber, minBetAmountBalance: BigNumber) => {
  const hasSufficientBalance = () => {
    if (value.gt(0)) {
      return value.lte(bnbBalance)
    }
    return bnbBalance.gt(0)
  }

  if (!hasSufficientBalance()) {
    return { key: 'Insufficient %symbol% balance', disabled: true }
  }

  if (value.eq(0)) {
    return { key: 'Enter an amount', disabled: true }
  }

  return { key: 'Confirm', disabled: value.lt(minBetAmountBalance) }
}

// const getValueAsEthersBn = (value: string) => {
//   const valueAsFloat = parseFloat(value)
//   return Number.isNaN(valueAsFloat) ? Zero : parseUnits(value)
// }

// const TOKEN_BALANCE_CONFIG = {
//   BNB: useGetBnbBalance,
//   CAKE: useGetCakeBalance,
// }

const SetPositionCard: React.FC<any> = ({ position, togglePosition, epoch, onBack, onSuccess }) => {
  const [value, setValue] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [percent, setPercent] = useState(0)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader p="16px">
        <Flex alignItems="center">
          <IconButton
            variant="text"
            scale="sm"
            // onClick={handleGoBack}
            mr="8px"
          >
            <ArrowBackIcon width="24px" />
          </IconButton>
          <FlexRow>
            <Heading scale="md">{t('Set Position')}</Heading>
          </FlexRow>
          <PositionTag
            betPosition={position}
            // onClick={togglePosition}
          >
            {position === BetPosition.BULL ? t('Up') : t('Down')}
          </PositionTag>
        </Flex>
      </CardHeader>
      <CardBody py="16px">
        <Flex alignItems="center" justifyContent="space-between" mb="8px">
          <Text textAlign="right" color="textSubtle">
            {t('Commit')}:
          </Text>
          {/* <Flex alignItems="center">
            <Logo mr="4px" />
            <Text bold textTransform="uppercase">
              {token.symbol}
            </Text>
          </Flex> */}
        </Flex>
        {/* <BalanceInput
          value={value}
          // onUserInput={handleInputChange}
          isWarning={showFieldWarning}
          inputProps={{ disabled: !account || isTxPending }}
          className={!account || isTxPending ? '' : 'swiper-no-swiping'}
        />
        {showFieldWarning && (
          <Text color="failure" fontSize="12px" mt="4px" textAlign="right">
            {errorMessage}
          </Text>
        )} */}
        {/* <Text textAlign="right" mb="16px" color="textSubtle" fontSize="12px" style={{ height: '18px' }}>
          {account && t('Balance: %balance%', { balance: balanceDisplay })}
        </Text> */}
        <Slider
          name="balance"
          min={0}
          max={100}
          value={percent}
          // onValueChanged={handlePercentChange}
          valueLabel={account ? `${percent.toFixed(percent > 0 ? 1 : 0)}%` : ''}
          step={0.01}
          // disabled={!account || isTxPending}
          mb="4px"
          // className={!account || isTxPending ? '' : 'swiper-no-swiping'}
        />
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          {percentShortcuts.map((percentShortcut) => {
            // const handleClick = () => {
            //   handlePercentChange(percentShortcut)
            // }

            return (
              <Button
                key={percentShortcut}
                scale="xs"
                variant="tertiary"
                // onClick={handleClick}
                // disabled={!account || isTxPending}
                // className={!account || isTxPending ? '' : 'swiper-no-swiping'}
                style={{ flex: 1 }}
              >
                {`${percentShortcut}%`}
              </Button>
            )
          })}
          <Button
            scale="xs"
            variant="tertiary"
            // onClick={() => handlePercentChange(100)}
            // disabled={!account || isTxPending}
            // className={!account || isTxPending ? '' : 'swiper-no-swiping'}
          >
            {t('Max')}
          </Button>
        </Flex>
        <Box mb="8px">
          {account ? (
            true ? (
              // doesCakeApproveBetting
              <Button
                width="100%"
                // disabled={disabled}
                // className={disabled ? '' : 'swiper-no-swiping'}
                // onClick={handleEnterPosition}
                // isLoading={isTxPending}
                // endIcon={isTxPending ? <AutoRenewIcon color="currentColor" spin /> : null}
              >
                USD
                {/* {t(key, { symbol: token.symbol })} */}
              </Button>
            ) : (
              <Button
                width="100%"
                className="swiper-no-swiping"
                // onClick={handleApprove}
                // isLoading={pendingTx}
                // endIcon={pendingTx ? <AutoRenewIcon color="currentColor" spin /> : null}
              >
                {t('Enable')}
              </Button>
            )
          ) : (
            <ConnectWalletButton className="swiper-no-swiping" width="100%" />
          )}
        </Box>
        <Text as="p" fontSize="12px" lineHeight={1} color="textSubtle">
          {t('You won’t be able to remove or change your position once you enter it.')}
        </Text>
      </CardBody>
    </Card>
  )
}

export default SetPositionCard
