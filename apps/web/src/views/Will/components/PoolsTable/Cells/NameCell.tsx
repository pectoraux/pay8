import { Text, TokenImage, Pool, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import SaveIcon from 'views/Info/components/SaveIcon'
import { useWatchlistTokens } from 'state/user/hooks'
import truncateHash from '@pancakeswap/utils/truncateHash'

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

const NameCell: React.FC<any> = ({ currAccount }) => {
  const [watchlistTokens, addWatchlistToken] = useWatchlistTokens()

  return (
    <StyledCell role="cell">
      <TokenImage mr="8px" width={40} height={40} src={currAccount?.media} />
      <Pool.CellContent>
        <Text fontSize="12px" bold color="secondary" textTransform="uppercase">
          <Flex flexDirection="row">
            {truncateHash(currAccount?.id)}
            <SaveIcon
              fill={watchlistTokens.includes(currAccount?.id)}
              onClick={() => addWatchlistToken(currAccount?.id)}
              style={{ marginLeft: '10px', position: 'relative', top: '-5px' }}
            />
          </Flex>
        </Text>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell
