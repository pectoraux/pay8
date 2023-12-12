import styled from 'styled-components'
import { useRouter } from 'next/router'
import { usePool } from 'state/profile/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import AchievementCard from './AchievementCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const AchievementsList: React.FC<React.PropsWithChildren> = () => {
  const id = useRouter().query.id as string
  const { pool } = usePool(id)

  return (
    <>
      <Grid>
        <AchievementCard
          key="gold-report"
          lateSeconds={pool?.goldLateSeconds}
          lateValue={getBalanceNumber(pool?.goldLateValue)}
          badge="baller.svg"
          title="Gold Report"
        />
        <AchievementCard
          key="silver-report"
          lateSeconds={pool?.silverLateSeconds}
          lateValue={getBalanceNumber(pool?.silverLateValue)}
          badge="clairvoyant.svg"
          title="Silver Report"
        />
        <AchievementCard
          key="brown-report"
          lateSeconds={pool?.brownLateSeconds}
          lateValue={getBalanceNumber(pool?.brownLateValue)}
          badge="1-year.svg"
          title="Brown Report"
        />
        <AchievementCard
          key="black-report"
          lateSeconds={pool?.blackLateSeconds}
          lateValue={getBalanceNumber(pool?.blackLateValue)}
          badge="2-year.svg"
          title="Black Report"
        />
      </Grid>
    </>
  )
}

export default AchievementsList
