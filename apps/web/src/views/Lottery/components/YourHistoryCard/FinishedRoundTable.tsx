import { useWeb3React } from '@pancakeswap/wagmi'
import styled from 'styled-components'
import { Text, Box, Flex, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import FinishedRoundRow from './FinishedRoundRow'

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
`

interface FinishedRoundTableProps {
  handleHistoryRowClick: (string) => void
  handleShowMoreClick: () => void
  numUserRoundsRequested: number
}

const FinishedRoundTable: React.FC<any> = ({
  lotteryData,
  handleShowMoreClick,
  numUserRoundsRequested,
  handleHistoryRowClick,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const filteredForClaimable = lotteryData?.history?.filter((h) => {
    const found = h.lottery?.users?.find((user) => user?.account?.toLowerCase() === account?.toLowerCase())
    return !!found
  })

  const sortedByRoundId = filteredForClaimable?.sort((roundA, roundB) => {
    return parseInt(roundB.lotteryId, 10) - parseInt(roundA.lotteryId, 10)
  })

  return (
    <>
      <Grid px="24px" pt="24px" mb="8px">
        <Text bold fontSize="12px" color="secondary">
          #
        </Text>
        <Text bold fontSize="12px" color="secondary" textTransform="uppercase">
          {t('Date')}
        </Text>
        <Text bold fontSize="12px" color="secondary" textTransform="uppercase">
          {t('Your Tickets')}
        </Text>
        <Box width="20px" />
      </Grid>
      <Flex px="24px" pb="24px" flexDirection="column" overflowY="scroll" height="240px">
        {filteredForClaimable?.length
          ? sortedByRoundId.map((finishedRound) => (
              <FinishedRoundRow
                key={finishedRound.id}
                roundId={finishedRound.id}
                hasWon={finishedRound.lottery?.users?.every((user) => !!user?.claimed)}
                numberTickets={
                  finishedRound.lottery?.users?.filter(
                    (user) => user?.account?.toLowerCase() === account?.toLowerCase(),
                  ).length
                }
                endTime={finishedRound?.updatedAt}
                onClick={handleHistoryRowClick}
              />
            ))
          : null}
        {filteredForClaimable?.length === numUserRoundsRequested && (
          <Flex justifyContent="center">
            <Button mt="12px" variant="text" width="fit-content" onClick={handleShowMoreClick}>
              {t('Show More')}
            </Button>
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default FinishedRoundTable
