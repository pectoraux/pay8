import {
  Flex,
  Grid,
  Text,
  Button,
  Input,
  ErrorIcon,
  LinkExternal,
  ButtonMenu,
  ButtonMenuItem,
  Balance,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { format } from 'date-fns'
import { useComputeCashBack, useGetOrder } from 'state/cancan/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useEffect } from 'react'
import BigNumber from 'bignumber.js'

import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from '../SellModal/styles'

interface TransferStageProps {
  nftToBuy: NftToken
  continueToNextStage: () => void
}

const CashbackStage: React.FC<any> = ({
  thumbnail,
  nftToBuy,
  isPaywall,
  collectionId,
  tokenId,
  credit,
  setCredit,
  setTokenId,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const { data: cashback, refetch } = useComputeCashBack(nftToBuy?.collection?.id, tokenId, isPaywall)
  const askOrder = useGetOrder(nftToBuy?.collection?.id, nftToBuy?.tokenId, isPaywall)?.data as any
  const numbersElligibilityCriteria = Object.values(askOrder?.priceReductor?.cashbackNumbers) as any
  const costElligibilityCriteria = Object.values(askOrder?.priceReductor?.cashbackCost) as any
  const cashNotCredit = askOrder?.priceReductor?.cashNotCredit
  const numbersCashbackAvailable =
    Number(askOrder?.priceReductor?.cashbackStatus) === 1 &&
    numbersElligibilityCriteria?.length &&
    parseInt(numbersElligibilityCriteria[0]) > 0
  const costCashbackAvailable =
    Number(askOrder?.priceReductor?.cashbackStatus) === 1 &&
    costElligibilityCriteria?.length &&
    parseInt(costElligibilityCriteria[0]) > 0
  console.log('nftToBuy====================>', askOrder)

  useEffect(() => {
    refetch()
  }, [tokenId])

  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Cashback Options')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{askOrder.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <ButtonMenu scale="sm" activeIndex={credit} onItemClick={setCredit}>
        <ButtonMenuItem>{t('Credit')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Cash')}</ButtonMenuItem>
      </ButtonMenu>
      {!cashNotCredit && credit ? (
        <GreyedOutContainer>
          <Text small color="failure">
            {t('This product is not eligible for cash rewards')}
          </Text>
        </GreyedOutContainer>
      ) : null}
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Product to apply credits towards')}
        </Text>
        <Input
          scale="sm"
          disabled={!cashNotCredit && credit}
          value={tokenId}
          placeholder={t('ID of the product')}
          onChange={(e) => {
            setTokenId(e.target.value)
          }}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Balance
          lineHeight="1"
          color="textSubtle"
          fontSize="12px"
          decimals={18}
          value={getBalanceNumber(new BigNumber(cashback?.toString()))}
        />
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Cashback Due')}
        </Text>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t(
            'This action will either send funds to your wallet or reward you with credits to apply towards another product from this merchant.',
          )}
          {(numbersCashbackAvailable || costCashbackAvailable) && t('Find eligibility criteria below:')}
        </Text>
      </Grid>
      <Flex alignItems="center" flexDirection="column" justifyContent="center" mb="15px">
        <Text small bold color="secondary">
          {t(`Cashback start: ${format(Number(askOrder?.priceReductor?.cashbackStart) * 1000, 'MMM dd, yyyy HH:mm')}`)}
        </Text>
        <Text small bold color="secondary">
          {t(`Using Identity Code: ${askOrder?.priceReductor?.checkIdentityCode ? t('Yes') : t('No')}`)}
        </Text>
        <Text small bold color="secondary">
          {t(`Current Item Purchases Only: ${askOrder?.priceReductor?.checkItemOnly ? t('Yes') : t('No')}`)}
        </Text>
      </Flex>
      {numbersCashbackAvailable ? (
        <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mb="15px">
          <Text small bold color="secondary">
            {t('From numbers criteria')}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Period start: ${format(Number(numbersElligibilityCriteria[0]) * 1000, 'MMM dd, yyyy HH:mm')}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Period end: ${format(Number(numbersElligibilityCriteria[1]) * 1000, 'MMM dd, yyyy HH:mm')}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Lower threshold: ${numbersElligibilityCriteria[3]}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Upper threshold: ${numbersElligibilityCriteria[4]}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Cashback percentage: ${parseInt(numbersElligibilityCriteria[2]) / 100}%`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Limit: 1`)}
          </Text>
        </Flex>
      ) : null}
      {costCashbackAvailable ? (
        <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mb="15px">
          <Text small bold color="secondary">
            {t('From cost criteria')}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Period start: ${format(Number(costElligibilityCriteria[0]) * 1000, 'MMM dd, yyyy HH:mm')}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Period end: ${format(Number(costElligibilityCriteria[1]) * 1000, 'MMM dd, yyyy HH:mm')}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Lower threshold: ${getBalanceNumber(costElligibilityCriteria[3])}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Upper threshold: ${getBalanceNumber(costElligibilityCriteria[4])}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Cashback percentage: ${parseInt(costElligibilityCriteria[2]) / 100}`)}%
          </Text>
          <Text small bold color="textSubtle">
            {t(`Limit: 1`)}
          </Text>
        </Flex>
      ) : null}
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href="">{t('Learn more about cashbacks')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button
          mb="8px"
          onClick={continueToNextStage}
          disabled={(!credit && (!tokenId || tokenId < 0)) || (credit && !cashNotCredit)}
        >
          {t('Process')}
        </Button>
      </Flex>
    </>
  )
}

export default CashbackStage
