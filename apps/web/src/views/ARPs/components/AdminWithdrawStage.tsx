import { useEffect, useRef, useState } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  ErrorIcon,
  ButtonMenu,
  ButtonMenuItem,
  useTooltip,
  HelpIcon,
  Input,
  Balance,
} from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
//
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useCurrencyBalance } from 'state/wallet/hooks'
import BribeField from './LockedPool/Common/BribeField'
import { GreyedOutContainer, Divider } from './styles'
import { useGetBalanceOf } from 'state/valuepools/hooks'

interface SetPriceStageProps {
  currency?: any
  state: any
  account: any
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
        'Pick the marketplace where the item is listed, pick Subscription if it is a subscription product, NFT if it is purchased from eCollectibles but not a subscription product and CanCan otherwise.',
      )}
    </Text>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  const { data: balanceOf } = useGetBalanceOf(state.token, state.arp, state.isNFT)
  return (
    <>
      <GreyedOutContainer>
        <Balance
          lineHeight="1"
          color="textSubtle"
          fontSize="12px"
          decimals={state.isNFT ? 0 : state.decimals}
          value={
            state.isNFT
              ? parseInt(balanceOf?.toString())
              : getBalanceNumber(new BigNumber(balanceOf?.toString()), state.decimals)
          }
        />
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Balance')}
        </Text>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex>
          <Text fontSize="12px" paddingRight="15px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
            {t('Token Type')}
          </Text>
        </Flex>
        <ButtonMenu scale="xs" variant="subtle" activeIndex={state.isNFT} onItemClick={handleRawValueChange('isNFT')}>
          <ButtonMenuItem>{t('Fungible')}</ButtonMenuItem>
          <ButtonMenuItem>{t('ERC721')}</ButtonMenuItem>
          <ButtonMenuItem>{t('ERC1155')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="token"
          value={state.token}
          placeholder={t('input token address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      {state.isNFT ? (
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Token ID')}
          </Text>
          <Input
            type="text"
            scale="sm"
            name="amountPayable"
            value={state.amountPayable}
            placeholder={t('input token id')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
      ) : (
        <GreyedOutContainer>
          <BribeField
            add="withdraw"
            stakingAddress={currency?.address}
            stakingSymbol={currency?.symbol}
            stakingDecimals={currency?.decimals}
            lockedAmount={state.amountPayable}
            usedValueStaked={usdValueStaked}
            stakingMax={stakingTokenBalance}
            setLockedAmount={handleRawValueChange('amountPayable')}
            stakingTokenBalance={stakingTokenBalance}
          />
        </GreyedOutContainer>
      )}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              "This will withdraw tokens from the ARP contract. Select Yes on the 'From Sponsors' field to withdraw revenue generated by the ARP from sponsors. Please read the documentation for more details.",
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
