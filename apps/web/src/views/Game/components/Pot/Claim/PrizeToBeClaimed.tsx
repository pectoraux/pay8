import { useTranslation } from '@pancakeswap/localization'
import { Flex, Box, Text, Balance } from '@pancakeswap/uikit'
import { DeserializedPotteryUserData } from 'state/types'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import ClaimButton from './ClaimButton'

interface PrizeToBeClaimedProps {
  userData: DeserializedPotteryUserData
}

const PrizeToBeClaimed: React.FC<any> = ({ tokenId, tokenData, gameData }) => {
  const { t } = useTranslation()
  const symb = ` ${gameData?.token?.symbol?.toUpperCase() ?? '$'}`
  const rewards = (Number(gameData?.totalPaid) * Number(tokenData?.score)) / Number(gameData?.totalScore)
  const rewardToken = getBalanceNumber(new BigNumber(rewards.toString()), gameData?.token?.decimals)
  return (
    <Box mt="20px">
      <Text fontSize="12px" color="secondary" bold as="span" textTransform="uppercase">
        {t('prize')}
      </Text>
      <Text fontSize="12px" color="textSubtle" bold as="span" ml="4px" textTransform="uppercase">
        {t('to be claimed')}
      </Text>
      <Flex>
        <Box style={{ alignSelf: 'center' }}>
          <Balance
            fontSize="20px"
            lineHeight="110%"
            color="textSubtle"
            decimals={5}
            unit={symb}
            value={getBalanceNumber(new BigNumber(rewards.toString()), gameData?.token?.decimals)}
          />
        </Box>
        <ClaimButton tokenId={tokenId} gameData={gameData} rewardToken={rewardToken} />
      </Flex>
    </Box>
  )
}

export default PrizeToBeClaimed
