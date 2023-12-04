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
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { format } from 'date-fns'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from '../SellModal/styles'
import { useGetOrder } from 'state/cancan/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

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
  const askOrder = nftToBuy // useGetOrder(nftToBuy?.collection?.id, nftToBuy?.tokenId, isPaywall)?.data as any
  const numbersElligibilityCriteria = nftToBuy?.priceReductor?.cashbackNumbers
  const costElligibilityCriteria = nftToBuy?.priceReductor?.cashbackCost
  const cashNotCredit = nftToBuy?.priceReductor?.cashNotCredit
  const numbersCashbackAvailable =
    Number(nftToBuy?.priceReductor?.cashbackStatus) === 1 &&
    numbersElligibilityCriteria?.length &&
    parseInt(numbersElligibilityCriteria[0]) > 0
  const costCashbackAvailable =
    Number(nftToBuy?.priceReductor?.cashbackStatus) === 1 &&
    costElligibilityCriteria?.length &&
    parseInt(costElligibilityCriteria[0]) > 0
  console.log('nftToBuy====================>', nftToBuy)
  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Cashback Options')}
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
      <ButtonMenu scale="sm" activeIndex={credit} onItemClick={setCredit}>
        <ButtonMenuItem>{t('Credit')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Cash')}</ButtonMenuItem>
      </ButtonMenu>
      {credit ? (
        <>
          {!cashNotCredit && (
            <GreyedOutContainer>
              <Text small color="failure">
                {t('This product is not eligible for cash rewards')}
              </Text>
            </GreyedOutContainer>
          )}
        </>
      ) : (
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Product to apply credits towards')}
          </Text>
          <Input
            scale="sm"
            value={tokenId}
            placeholder={t('ID of the product')}
            onChange={(e) => {
              setTokenId(e.target.value)
            }}
          />
        </GreyedOutContainer>
      )}

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
            {t(`Limit: ${numbersElligibilityCriteria[5]}`)}
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
            {t(`Lower threshold: ${costElligibilityCriteria[3]}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Upper threshold: ${costElligibilityCriteria[4]}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Cashback percentage: ${parseInt(costElligibilityCriteria[2]) / 100}`)}%
          </Text>
          <Text small bold color="textSubtle">
            {t(`Limit: ${costElligibilityCriteria[5]}`)}
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
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default CashbackStage
