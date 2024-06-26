import BigNumber from 'bignumber.js'
import { Flex, Text, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'

interface RewardBracketDetailProps {
  cakeAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
  isLoading?: boolean
}

const RewardBracketDetail: React.FC<any> = ({
  rewardBracket,
  cakeAmount,
  numberWinners,
  isHistoricRound,
  currTokenData,
}) => {
  const { t } = useTranslation()
  const getRewardText = () => {
    const numberMatch = rewardBracket + 1
    if (rewardBracket === 5) {
      return t('Match all %numberMatch%', { numberMatch })
    }
    return t('Match first %numberMatch%', { numberMatch })
  }

  return (
    <Flex flexDirection="column">
      <Text bold color="secondary">
        {getRewardText()}
      </Text>
      <Balance
        fontSize="20px"
        bold
        unit={` ${currTokenData?.token?.symbol ?? ''}`}
        value={getBalanceNumber(cakeAmount)}
        decimals={3}
      />
      <Balance fontSize="12px" color="textSubtle" prefix="~$" value={getBalanceNumber(cakeAmount)} decimals={3} />
      {isHistoricRound && cakeAmount ? (
        <>
          {numberWinners !== '0' && (
            <Text fontSize="12px" color="textSubtle">
              {getFullDisplayBalance(
                new BigNumber(cakeAmount).div(parseInt(numberWinners, 10)),
                currTokenData?.token?.decimals,
                2,
              )}{' '}
              {currTokenData?.token?.symbol} {t('each')}
            </Text>
          )}
          <Text fontSize="12px" color="textSubtle">
            {numberWinners} {t('Winning Ticket(s)')}
          </Text>
        </>
      ) : null}
    </Flex>
  )
}

export default RewardBracketDetail
