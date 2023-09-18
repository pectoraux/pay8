import { Heading, Flex, Text, Link, SwapIcon, SellIcon, TuneIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const UsersCardData: IconCardData = {
    icon: <SellIcon color="secondary" width="36px" />,
  }

  const TradesCardData: IconCardData = {
    icon: <SwapIcon color="primary" width="36px" />,
  }

  const StakedCardData: IconCardData = {
    icon: <TuneIcon color="failure" width="36px" />,
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <Heading textAlign="center" scale="xl">
        {t('Permissionlessly,')}
      </Heading>
      <Heading textAlign="center" scale="xl" mb="32px">
        {t('Sell to every buyer everywhere!')}
      </Heading>
      <Text textAlign="center" color="textSubtle">
        {t('PaySwap enables you to permissionlessly setup your own Uber, Tinder, Booking app, etc')}
      </Text>
      <Flex flexWrap="wrap">
        <Text display="inline" textAlign="center" color="textSubtle" mb="20px">
          {t('and receive payments from all over the world')}
        </Text>
      </Flex>

      <Text textAlign="center" color="textSubtle" bold mb="32px">
        {t('Will you add a new app or use an existing one?')}
      </Text>

      <Flex maxWidth="100%" flexDirection={['column', null, null, 'row']} as={Link} href="/create-channel">
        <IconCard {...UsersCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('Setup an online-storefront')}
            bodyText={t('like Amazon')}
            highlightColor={theme.colors.secondary}
          />
        </IconCard>
        <IconCard {...TradesCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('Setup an item-marketplace')}
            bodyText={t('like Uber or LinkedIn')}
            highlightColor={theme.colors.primary}
          />
        </IconCard>
        <IconCard {...StakedCardData}>
          <StatCardContent
            headingText={t('Setup a streaming-service')}
            bodyText={t('Like Spotify')}
            highlightColor={theme.colors.failure}
          />
        </IconCard>
      </Flex>
    </Flex>
  )
}

export default Stats
