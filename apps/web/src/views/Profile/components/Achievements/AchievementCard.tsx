import styled from 'styled-components'
import { Flex, Text, TimerIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useCurrency } from 'hooks/Tokens'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { CurrencyLogo } from 'components/Logo'
import { formatNumber } from '@pancakeswap/utils/formatBalance'

import AchievementAvatar from './AchievementAvatar'
import AchievementTitle from './AchievementTitle'

interface AchievementCardProps {
  lateSeconds: number
  lateValue: number
  badge: string
  title: string
}

const Details = styled(Flex)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
`

const AchievementCard: React.FC<React.PropsWithChildren<AchievementCardProps>> = ({
  lateSeconds,
  lateValue,
  badge,
  title,
}) => {
  const { days, hours, minutes } = getTimePeriods(Number(lateSeconds ?? '0'))
  const { t } = useTranslation()
  const tFIAToken = useCurrency(DEFAULT_TFIAT)

  return (
    <Flex>
      <AchievementAvatar badge={badge} />
      <Details>
        <AchievementTitle title={title} />
      </Details>
      <Flex alignItems="center" mr="18px">
        <CurrencyLogo currency={tFIAToken} size="24px" style={{ marginRight: '8px' }} />
        {/* <BNBAmountLabel amount={lateValue ? parseFloat(lateValue?.toString()) : 0} /> */}
        <Text fontSize="24px" bold mr="4px">
          {formatNumber(lateValue ? parseFloat(lateValue?.toString()) : 0, 0, 18)}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <TimerIcon width="18px" color="textSubtle" mr="4px" />
        <Text color="textSubtle">
          {days} {t('days')} {hours} {t('hours')} {minutes} {t('minutes')}
        </Text>
      </Flex>
    </Flex>
  )
}

export default AchievementCard
