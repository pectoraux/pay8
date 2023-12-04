import styled from 'styled-components'
import { Flex, Card, Grid, SellIcon, Text, useModal, Box, Skeleton, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { NftToken } from 'state/nftMarket/types'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { multiplyPriceByAmount } from 'utils/prices'
import { CurrencyLogo } from 'components/Logo'
import { useWorkspaceCurrency } from 'hooks/Tokens'

import BuyModal from '../../../components/BuySellModals/BuyModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import ProfileCell from '../../../components/ProfileCell'
import { ButtonContainer, TableHeading } from '../shared/styles'

const StyledCard = styled(Card)`
  width: 100%;
  & > div:first-child {
    display: flex;
    flex-direction: column;
  }
`

const OwnerRow = styled(Grid)`
  grid-template-columns: 2fr 2fr 1fr;
  grid-row-gap: 16px;
  margin-top: 16px;
  margin-bottom: 8px;
  align-items: center;
`

interface OwnerCardProps {
  nft: NftToken
  isOwnNft: boolean
  onSuccess: () => void
}

const OwnerCard: React.FC<any> = ({ nft, isOwnNft, isPaywall, onSuccess }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const bnbBusdPrice = useBNBBusdPrice()

  // const { owner, isLoadingOwner } = useNftOwner(nft, isOwnNft)
  const owner = nft.currentSeller
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, parseFloat(nft?.currentAskPrice))
  const { mainCurrency } = useWorkspaceCurrency(nft?.ve?.toLowerCase(), nft?.tFIAT, nft?.usetFIAT, nft?.currentAskPrice)

  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nft} />)
  const [onPresentAdjustPriceModal] = useModal(
    <SellModal variant={isPaywall ? 'paywall' : 'item'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )

  return (
    <StyledCard>
      <Grid
        flex="0 1 auto"
        gridTemplateColumns="34px 1fr"
        alignItems="center"
        height="72px"
        px="24px"
        borderBottom={`1px solid ${theme.colors.cardBorder}`}
      >
        <SellIcon width="24px" height="24px" />
        <Text bold>{t('Owner')}</Text>
      </Grid>
      {owner && (
        <>
          <TableHeading flex="0 1 auto" gridTemplateColumns="2fr 2fr 1fr" py="12px">
            <Flex alignItems="center">
              <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px" px="24px">
                {t('Price')}
              </Text>
            </Flex>
            <Text textTransform="uppercase" color="textSubtle" bold fontSize="12px">
              {t('Owner')}
            </Text>
          </TableHeading>
          <OwnerRow>
            <Box pl="24px">
              {nft?.isTradable ? (
                <>
                  <Flex justifySelf="flex-start" alignItems="center" width="max-content">
                    <CurrencyLogo currency={mainCurrency} size="24px" style={{ marginRight: '8px' }} />
                    <Text bold>{formatNumber(parseFloat(nft?.currentAskPrice), 0, 5)}</Text>
                  </Flex>
                  {bnbBusdPrice ? (
                    <Text fontSize="12px" color="textSubtle">
                      {`(~${formatNumber(priceInUsd, 2, 2)} USD)`}
                    </Text>
                  ) : null
                  // <Skeleton width="86px" height="12px" mt="4px" />
                  }
                </>
              ) : (
                <Flex alignItems="center" height="100%">
                  <Text>{t('Not for sale')}</Text>
                </Flex>
              )}
            </Box>
            <Box>
              <Flex width="max-content" alignItems="center">
                <ProfileCell accountAddress={owner.toLowerCase()} />
              </Flex>
            </Box>
            <ButtonContainer>
              {isOwnNft ? (
                <Button scale="sm" variant="secondary" maxWidth="128px" onClick={onPresentAdjustPriceModal}>
                  {nft?.isTradable ? t('Manage') : t('Sell')}
                </Button>
              ) : (
                <Button
                  disabled={!nft?.isTradable}
                  scale="sm"
                  variant="secondary"
                  maxWidth="128px"
                  onClick={onPresentBuyModal}
                >
                  {t('Buy')}
                </Button>
              )}
            </ButtonContainer>
          </OwnerRow>
        </>
      )}
      {!owner && (
        <Flex justifyContent="center" alignItems="center" padding="24px">
          <Text>{t('Owner information is not available for this item')}</Text>
        </Flex>
      )}
    </StyledCard>
  )
}

export default OwnerCard
