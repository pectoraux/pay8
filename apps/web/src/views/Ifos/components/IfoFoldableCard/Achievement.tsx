import styled from 'styled-components'
import {
  Flex,
  Image,
  Text,
  PrizeIcon,
  Skeleton,
  LanguageIcon,
  SvgProps,
  Svg,
  TwitterIcon,
  Link,
  TelegramIcon,
  FlexGap,
} from '@pancakeswap/uikit'
import { bscTokens } from '@pancakeswap/tokens'
import { useTranslation } from '@pancakeswap/localization'
import { PublicIfoData } from 'views/Ifos/types'
import { Ifo } from 'config/constants/types'
import { BIG_TEN } from '@pancakeswap/utils/bigNumber'
import { getBlockExploreLink } from 'utils'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { getProfileAddress, getProfileHelperAddress } from 'utils/addressHelpers'
import { useRouter } from 'next/router'

const SmartContractIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -15 122.000000 122.000000" {...props}>
      <g transform="translate(0.000000,122.000000) scale(0.100000,-0.100000)" stroke="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M465 1200 c-102 -27 -142 -46 -221 -105 -153 -115 -244 -293 -244
-480 0 -136 62 -311 119 -334 30 -13 96 -6 119 12 9 7 12 57 12 188 0 211 -1
209 95 209 95 0 95 1 95 -201 0 -180 2 -186 48 -153 22 15 22 19 22 234 0 257
-3 250 95 250 97 0 95 4 95 -226 0 -107 4 -194 9 -194 4 0 20 9 35 21 l26 20
0 244 c0 281 -6 265 98 265 43 0 63 -5 73 -17 10 -12 15 -65 19 -205 l5 -189
67 56 c86 71 148 148 148 185 0 82 -113 249 -218 322 -152 106 -334 142 -497
98z"
        />
      </g>
    </Svg>
  )
}

const ProposalIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.037 6a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zM9.287 9.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM10.037 12a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.287 4a2 2 0 012-2h13a2 2 0 012 2v15c0 1.66-1.34 3-3 3h-14c-1.66 0-3-1.34-3-3v-2c0-.55.45-1 1-1h2V4zm0 16h11v-2h-12v1c0 .55.45 1 1 1zm14 0c.55 0 1-.45 1-1V4h-13v12h10c.55 0 1 .45 1 1v2c0 .55.45 1 1 1z"
      />
    </Svg>
  )
}

const FIXED_MIN_DOLLAR_FOR_ACHIEVEMENT = BIG_TEN

interface Props {
  ifo: Ifo
  publicIfoData: PublicIfoData
}

const Container = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  text-align: left;
  gap: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: initial;
  }
`

const AchievementFlex = styled(Flex)<{ isFinished: boolean }>`
  ${({ isFinished }) => (isFinished ? 'filter: grayscale(100%)' : '')};
  text-align: left;
`

const InlinePrize = styled(Flex)`
  display: inline-flex;
  vertical-align: top;
`

const IfoAchievement: React.FC<any> = ({ ifo, data }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isFinishedPage = router.pathname.includes('history')
  return (
    <Container p="16px" pb="32px">
      <AchievementFlex isFinished={isFinishedPage} alignItems="flex-start" flex={1}>
        <Image src="/images/logo.png" width={56} height={56} mr="8px" />
        <Flex flexDirection="column" ml="8px">
          <Text color="secondary" fontSize="12px">
            {`${t('Profile ID')}`}
          </Text>
          <Flex>
            <Text bold mr="8px" lineHeight={1.2}>
              <InlinePrize alignItems="center" ml="8px">
                <PrizeIcon color="textSubtle" width="16px" mr="4px" />
                <Text lineHeight={1.2} color="textSubtle">
                  #{data?.boughtProfileId}
                </Text>
              </InlinePrize>
            </Text>
          </Flex>
          <Text color="textSubtle" fontSize="12px">
            {t('Total Unique Profiles: 1 Million')}
          </Text>
          <FlexGap gap="16px" pt="24px" pl="4px">
            <Link external href="https://paychat.payswap.org">
              <LanguageIcon color="textSubtle" />
            </Link>
            <Link external href="https://docs.payswap.org">
              <SmartContractIcon color="textSubtle" />
            </Link>
            <Link external href={getBlockExploreLink(getProfileHelperAddress(), 'address')}>
              <SmartContractIcon color="textSubtle" />
            </Link>
            <Link external href="https://twitter.com/payswap_org">
              <TwitterIcon color="textSubtle" />
            </Link>
            <Link external href="t.me/payswaporg">
              <TelegramIcon color="textSubtle" />
            </Link>
          </FlexGap>
        </Flex>
      </AchievementFlex>
      {ifo.description && (
        <Flex alignItems="flex-end" flexDirection="column" flex={1}>
          <Text fontSize="14px" lineHeight={1.2} style={{ whiteSpace: 'pre-line' }}>
            {t(
              'Profiles are a way to prove your identity to other members of the community. Anyone can create a profile for free on the profile page. Unique Profile IDs are easier to memorize as they only go from 1 to 1 Million and can be a status symbol in the PaySwap community. To get a unique profile id, you can either take over an expired one or participate in an ongoing auction for a new one.',
            )}
          </Text>
        </Flex>
      )}
    </Container>
  )
}

export default IfoAchievement
