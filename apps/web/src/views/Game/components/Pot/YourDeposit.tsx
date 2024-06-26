import { Box, Text, Balance, Input } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'

interface YourDepositProps {
  depositBalance?: any
}

const YourDeposit: React.FC<any> = ({ tokenId, data, setTokenId }) => {
  const { t } = useTranslation()
  // const cakePriceBusd = usePriceCakeBusd()
  // const { data, userData } = usePotteryData()
  const tokenData = useMemo(() => {
    return data?.accounts?.find((protocol) => protocol.id === tokenId)
  }, [data, tokenId])
  // const totalDepositBalance = getBalanceAmount(tokenData?.depositBalance).toNumber()
  // const balanceInBusd = new BigNumber(totalDepositBalance).times(cakePriceBusd).toNumber()

  return (
    <Box>
      <Box mb="4px">
        <Text fontSize="12px" color="textSubtle" bold as="span" textTransform="uppercase">
          {t('Your')}
        </Text>
        <Text fontSize="12px" color="secondary" bold as="span" ml="4px" textTransform="uppercase">
          {t('Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={tokenId}
          placeholder={t('input your token id')}
          onChange={(e) => setTokenId(e.target.value)}
        />
      </Box>
      <Box mb="4px">
        <Text fontSize="12px" color="textSubtle" bold as="span" textTransform="uppercase">
          {t('Your')}
        </Text>
        <Text fontSize="12px" color="secondary" bold as="span" ml="4px" textTransform="uppercase">
          {t('Score')}
        </Text>
      </Box>
      <Balance bold decimals={3} fontSize={['20px', '20px', '24px']} lineHeight="110%" value={tokenData?.score} />
      <Balance
        unit="%"
        prefix={t('Score Percentile: ')}
        decimals={2}
        value={tokenData?.scorePercentile || 0}
        fontSize="12px"
        color="textSubtle"
      />
      <Balance
        unit="%"
        prefix={t('Price Percentile: ')}
        decimals={2}
        value={tokenData?.pricePercentile || 0}
        fontSize="12px"
        color="textSubtle"
      />
    </Box>
  )
}

export default YourDeposit
