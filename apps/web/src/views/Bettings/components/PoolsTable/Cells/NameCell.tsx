import { Text, TokenImage, Pool, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import SaveIcon from 'views/Info/components/SaveIcon'
import { useWatchlistTokens } from 'state/user/hooks'

interface NameCellProps {
  pool: Pool.DeserializedPool<Token>
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`

const NameCell: React.FC<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [watchlistTokens, addWatchlistToken] = useWatchlistTokens()
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Flex flexDirection="column" justifyContent="flex-end">
          <SaveIcon
            fill={watchlistTokens.includes(pool?.id)}
            onClick={() => addWatchlistToken(pool?.id)}
            style={{ marginRight: '20px', position: 'relative' }}
          />
          <Text bold={!isMobile} small={isMobile}>
            <TokenImage mr="8px" width={40} height={40} src={currAccount?.media ?? pool?.collection?.avatar} />
            {t(pool?.collection?.name ?? '')}
          </Text>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell
