import styled from 'styled-components'
import { useMemo } from 'react'
import { Flex, Box, Text, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyCard } from 'components/Card'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useWeb3React } from '@pancakeswap/wagmi'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { format } from 'date-fns'
import YourDeposit from '../YourDeposit'
import WinRate from '../WinRate'
import DepositAction from './DepositAction'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

const CardAction = styled(Flex)`
  flex-direction: column;
  padding: 26px 24px 36px 24px;
`

const Deposit: React.FC<any> = ({ tokenId, data, setTokenId }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const { data } = usePotteryData()
  const symb = ` ${data?.token?.symbol?.toUpperCase() ?? '$'}`

  // const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Pottery draws on each Friday at 12 PM UTC!'), {
  //   placement: 'bottom-start',
  // })

  // const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  const tokenData = useMemo(() => {
    return data?.accounts?.find((protocol) => protocol.id === tokenId)
  }, [data, tokenId])
  const { days, hours, minutes } = getTimePeriods(Number(tokenData?.deadline ?? '0'))
  const {
    days: daysReceivable,
    hours: hoursReceivable,
    minutes: minutesReceivable,
  } = getTimePeriods(Number(tokenData?.gameMinutes ?? '0'))

  return (
    <Box>
      <Container>
        <GreyCard mb="18px">
          <Flex justifyContent="space-between">
            <YourDeposit data={data} tokenId={tokenId} setTokenId={setTokenId} />
            <WinRate />
          </Flex>
        </GreyCard>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Total Spent')}</Text>
          <Balance
            bold
            decimals={2}
            value={getBalanceNumber(tokenData?.price ?? 0, tokenData?.token?.decimals ?? 18)}
            unit={symb}
          />
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Score')}</Text>
          <Balance bold decimals={2} value={tokenData?.score || 0} />
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Score Updated At')}</Text>
          <Text bold color="textSubtle">
            {Number(tokenData?.deadline)
              ? format(new Date(parseInt(tokenData?.deadline || 0) * 1000), 'yyyy-MM-dd HH:mm')
              : '-'}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Closing Time')}</Text>
          <Text bold color="textSubtle">
            {Number(tokenData?.userDeadLine)
              ? format(new Date(parseInt(tokenData?.userDeadLine || 0) * 1000), 'yyyy-MM-dd HH:mm')
              : '-'}
          </Text>
        </Flex>
      </Container>
      <CardAction>
        {account ? <DepositAction tokenId={tokenId} gameData={data} tokenData={tokenData} /> : <ConnectWalletButton />}
      </CardAction>
    </Box>
  )
}

export default Deposit
