import styled from 'styled-components'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useLottery } from 'state/lottery/hooks'
import useTheme from 'hooks/useTheme'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

import TicketNumber from '../TicketNumber'
import BuyTicketsButton from '../BuyTicketsButton'

const ScrollBox = styled(Box)`
  max-height: 300px;
  overflow-y: scroll;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 20px;
`

const CurrentRoundTicketsInner: React.FC<any> = ({ currentTokenId, currTokenData }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const {
    lotteryData: { users: userTickets },
  } = useLottery()
  const { account } = useAccountActiveChain()

  return (
    <>
      <Flex flexDirection="column">
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" mb="16px">
          {t('Your Tickets')}
        </Text>
        <ScrollBox>
          {userTickets
            ?.filter((user) => user?.account?.toLowerCase() === account?.toLowerCase())
            ?.map((ticket, index) => {
              return <TicketNumber key={ticket.id} localId={index + 1} id={ticket.id} number={ticket.ticketNumber} />
            })}
        </ScrollBox>
      </Flex>
      <Flex borderTop={`1px solid ${theme.colors.cardBorder}`} alignItems="center" justifyContent="center">
        <BuyTicketsButton
          currentTokenId={currentTokenId}
          currTokenData={currTokenData}
          disabled={false}
          userTickets={userTickets}
          mt="24px"
          width="100%"
        />
      </Flex>
    </>
  )
}

export default CurrentRoundTicketsInner
