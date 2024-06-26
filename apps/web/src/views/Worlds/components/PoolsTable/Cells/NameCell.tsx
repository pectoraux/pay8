import { Text, TokenImage, Pool, Flex } from '@pancakeswap/uikit'
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

const NameCell: React.FC<any> = ({ pool }) => {
  const { t } = useTranslation()
  const [watchlistTokens, addWatchlistToken] = useWatchlistTokens()
  const colors = { 0: 'failure', 1: 'red', 2: 'blue', 3: 'green' }
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" bold color={colors[pool?.category]} textTransform="uppercase">
          <Flex flexDirection="column">
            <SaveIcon
              fill={watchlistTokens.includes(pool?.id)}
              onClick={() => addWatchlistToken(pool?.id)}
              style={{ marginRight: '20px', position: 'relative' }}
            />
            <TokenImage mr="8px" width={40} height={40} src={pool?.collection?.avatar} />
            {pool?.collection?.name ?? ''}
          </Flex>
        </Text>
        {!pool?.category ? (
          <Text fontSize="12px" color="failure">
            {t('Undefined Category')}
          </Text>
        ) : (
          <Text fontSize="12px" color={colors[pool?.category]}>
            {t('%val% World', {
              val: pool?.category === 1 ? 'Red Pill' : pool?.category === 2 ? 'Blue Pill' : 'Green',
            })}
          </Text>
        )}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell
