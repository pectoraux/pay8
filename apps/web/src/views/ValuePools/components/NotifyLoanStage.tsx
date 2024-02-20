import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  ButtonMenu,
  ButtonMenuItem,
  Balance,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { useGetBalanceOf } from 'state/valuepools/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
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
const SetPriceStage: React.FC<any> = ({ state, handleChange, handleRawValueChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { data: balanceOf } = useGetBalanceOf(state.token, state.vava, state.isNFT)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

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
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('ARP Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="cardAddress"
          value={state.cardAddress}
          placeholder={t('input arp address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount Receivable or Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input approve amount or token id')}
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
              "This will send funds approved for withdrawal through a vote to the specified ARP. Valuepools can lend tokens to auditors operating ARPs, this function enables you to process a loan once it has been approved by the Valuepool's members through votes.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Process Loan')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
