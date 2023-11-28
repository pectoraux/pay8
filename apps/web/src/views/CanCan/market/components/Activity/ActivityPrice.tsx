import { Flex, Text, Skeleton, CurrencyLogo } from '@pancakeswap/uikit'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import { multiplyPriceByAmount } from 'utils/prices'

const ActivityPrice = ({ nft, bnbBusdPrice, price }) => {
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, price)
  const { mainCurrency } = useWorkspaceCurrency(nft?.ve?.toLowerCase(), nft?.tFIAT, nft?.usetFIAT, nft?.currentAskPrice)
  return (
    <Flex flexDirection="column" alignItems="flex-end">
      {price ? (
        <>
          <Flex justifySelf="flex-start" alignItems="center">
            <CurrencyLogo currency={mainCurrency} size="24px" style={{ marginRight: '8px' }} />
            <Text maxWidth="80px" bold>
              {price.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 5,
              })}
            </Text>
          </Flex>
          {/* {priceInUsd ? (
            <Text fontSize="12px" color="textSubtle">
              {`(~$${priceInUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })})`}
            </Text>
          ) : (
            <Skeleton height="18px" width="42px" />
          )} */}
        </>
      ) : (
        '-'
      )}
    </Flex>
  )
}

export default ActivityPrice
