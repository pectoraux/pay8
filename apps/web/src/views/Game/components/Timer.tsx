import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'

import { remainTimeToNextFriday } from '../helpers'
import { format } from 'date-fns'

const FlexGap = styled(Flex)<{ gap: string }>`
  gap: ${({ gap }) => gap};
  width: fit-content;
`

const FlexContainer = styled(FlexGap)`
  border-bottom: dotted 1px white;
`

const StyledTimerText = styled(Heading)`
  background: linear-gradient(180deg, #8051d6 0%, #492286 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StyledWhiteText = styled(Text)`
  color: primary;
  margin-bottom: 0px;
  align-self: flex-end;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 3px;
  }
`

const Timer: React.FC<any> = ({ secondsRemaining, text }) => {
  const { t } = useTranslation()
  const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  return (
    <>
      <FlexContainer mt="32px" gap="8px" alignItems="center">
        <StyledWhiteText bold>{text}</StyledWhiteText>
        <FlexGap gap="4px" alignItems="baseline">
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {format(new Date(parseInt(secondsRemaining || 0) * 1000), 'yyyy-MM-dd HH:mm')}
          </Text>
        </FlexGap>
      </FlexContainer>
    </>
  )
}

export const BannerTimer: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  const secondsRemaining = remainTimeToNextFriday()

  return <Timer secondsRemaining={secondsRemaining} text={t('until deadline ends.')} />
}

export const LockTimer: React.FC<React.PropsWithChildren<{ lockTime: number; text: string }>> = ({
  lockTime,
  text,
}) => {
  const { t } = useTranslation()

  const secondsRemaining = Number(lockTime) === 0 ? 0 : lockTime - Date.now() / 1000

  return (
    <Flex flexDirection="row">
      <Timer secondsRemaining={Number(lockTime)} text={text} />
    </Flex>
  )
}
