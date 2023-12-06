import styled from 'styled-components'
import { useState } from 'react'
import {
  Box,
  Flex,
  Grid,
  Text,
  Button,
  Input,
  CopyAddress,
  ErrorIcon,
  LinkExternal,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { useGetNftTokenForCredit, useGetTokenForCredit } from 'state/cancan/hooks'
import { isAddress } from 'utils'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from '../SellModal/styles'

interface TransferStageProps {
  nftToBuy: NftToken
  continueToNextStage: () => void
}

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`
const Address = styled.div`
  flex: 1;
  position: relative;
  padding-left: 16px;

  & > input {
    background: transparent;
    border: 0;
    color: ${({ theme }) => theme.colors.text};
    display: block;
    font-weight: 600;
    font-size: 16px;
    padding: 0;
    width: 100%;

    &:focus {
      outline: 0;
    }
  }

  &:after {
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.background}00,
      ${({ theme }) => theme.colors.background}E6
    );
    content: '';
    height: 100%;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
  }
`
const PaymentCreditStage: React.FC<any> = ({
  thumbnail,
  nftToBuy,
  isPaywall,
  collectionId,
  amount,
  setAmount,
  position,
  setPosition,
  applyToTokenId,
  decimals,
  setDecimals,
  setApplyToTokenId,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const discountTokens = useGetNftTokenForCredit(collectionId, isPaywall)
  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Burn token for credit')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToBuy.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <ButtonMenu scale="sm" activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
        <ButtonMenuItem>{t('Fungibles')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Non Fungibles')}</ButtonMenuItem>
        <ButtonMenuItem>NFTickets</ButtonMenuItem>
      </ButtonMenu>
      {activeButtonIndex !== 2 && (
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Position of token to burn')}
          </Text>
          <Input
            scale="sm"
            placeholder={t("paste your token's position")}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </GreyedOutContainer>
      )}
      {!activeButtonIndex ? (
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Amount of token to burn')}
          </Text>
          <Input
            type="number"
            inputMode="decimal"
            pattern="^[0-9]+[.,]?[0-9]*$"
            scale="sm"
            value={amount}
            placeholder={t('amount of token you are willing to burn')}
            onChange={(e) => {
              setAmount(e.target.value)
            }}
          />
        </GreyedOutContainer>
      ) : (
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('ID of token to burn')}
          </Text>
          <Input
            type="number"
            scale="sm"
            value={amount}
            placeholder={t('ID of token to burn')}
            onChange={(e) => {
              setAmount(e.target.value)
            }}
          />
        </GreyedOutContainer>
      )}
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token Decimals')}
        </Text>
        <Input
          type="number"
          scale="sm"
          value={decimals}
          placeholder={t('input 0 in case of an nft')}
          onChange={(e) => {
            setDecimals(e.target.value)
          }}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Item To Apply Credit Towards')}
        </Text>
        <Input
          type="number"
          scale="sm"
          value={applyToTokenId}
          placeholder={t('input id of item to apply credit towards')}
          onChange={(e) => {
            setApplyToTokenId(e.target.value)
          }}
        />
      </GreyedOutContainer>
      {discountTokens?.map((data, index) => (
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <Text small bold color="textSubtle">
            {t(`Token Position: ${index}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Token Name: ${data.token?.name}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Token Symbol: ${data.token?.symbol}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Discount: ${parseInt(data.discount ?? '0') / 100}%`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Collection ID: ${data.collectionId}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Checker: `)}
          </Text>
          <CopyAddress account={data.checker} mb="2px" tooltipMessage={t('Copied Checker Address')} />
          <Text small bold color="textSubtle">
            {t(`Token Address: `)}
          </Text>
          <CopyAddress account={data.token?.address} mb="2px" tooltipMessage={t('Copied Token Address')} />
          <Text small bold color="textSubtle">
            {t(`Destination Address: `)}
          </Text>
          <CopyAddress account={data.destination} mb="2px" tooltipMessage={t('Copied Destination Address')} />
          <Divider />
        </Flex>
      ))}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t('This action will create discounts on this product. Eligible tokens are listed below:')}
        </Text>
      </Grid>
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href="">{t('Learn more about burns for credit')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          // disabled={
          //   isInvalidField || (!activeButtonIndex && amount <= 0) || (activeButtonIndex && (!tokenId || tokenId < 0))
          // }
        >
          {t('Process')}
        </Button>
      </Flex>
    </>
  )
}

export default PaymentCreditStage
