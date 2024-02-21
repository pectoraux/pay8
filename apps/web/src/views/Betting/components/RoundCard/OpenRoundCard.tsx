import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Button,
  Card,
  CardBody,
  PlayCircleOutlineIcon,
  useToast,
  useTooltip,
  Flex,
  Text,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import useTheme from 'hooks/useTheme'
import { useMemo, useState } from 'react'
import { BetPosition, NodeLedger, NodeRound } from 'state/types'
import { PrizePoolRow, RoundResultBox } from '../RoundResult'
import CardHeader, { getBorderBackground } from './CardHeader'
import MultiplierArrow from './MultiplierArrow'
import SetPositionCard from './SetPositionCard'
import CardFlip from '../CardFlip'

interface OpenRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: string
  bearMultiplier: string
}

interface State {
  isSettingPosition: boolean
  position: BetPosition
}

const OpenRoundCard: React.FC<any> = ({ betting, allBettings }) => {
  const [state, setState] = useState<State>({
    isSettingPosition: false,
    position: BetPosition.BULL,
  })
  const { t } = useTranslation()
  const { theme } = useTheme()
  // const { token, displayedDecimals } = useConfig()
  const { isSettingPosition, position } = state
  return (
    <CardFlip isFlipped={isSettingPosition} height="404px">
      <Card borderBackground={getBorderBackground(theme, 'next')} style={{ cursor: 'pointer' }}>
        <CardHeader
          status="next"
          epoch={betting?.idx}
          icon={<PlayCircleOutlineIcon color="white" mr="4px" width="21px" />}
          title={t('Next')}
        />
        <CardBody p="16px">
          <RoundResultBox isNext isLive>
            <PrizePoolRow betting={betting} closeTimestamp={betting?.currEnd} mb="8px" />
            <Flex
              justifyContent="flex-start"
              alignItems="center"
              flexDirection="column"
              overflow="auto"
              maxHeight="200px"
            >
              {betting?.subjects?.split(',')?.map((subject) => (
                <Button
                  // variant={variants[index % 6]}
                  width="150px"
                  height="200px"
                  // onClick={() => handleSetPosition(BetPosition.BULL)}
                  mb="4px"
                  disabled
                >
                  <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                    {subject}
                  </Text>
                </Button>
              ))}
            </Flex>
          </RoundResultBox>
          <MultiplierArrow
            allBettings={allBettings}
            action={betting?.action}
            adminShare={betting?.adminShare}
            referrerShare={betting?.referrerShare}
            bettingId={betting?.bettingId}
            rewardBreakdown={betting?.rewardBreakdown}
          />
        </CardBody>
      </Card>
      <SetPositionCard
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onBack={() => {}}
        // onBack={handleBack}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSuccess={() => {}}
        // onSuccess={handleSuccess}
        position={position}
        // togglePosition={togglePosition}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        togglePosition={() => {}}
        epoch={betting?.idx}
      />
    </CardFlip>
  )
}

export default OpenRoundCard
