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

const NameCell: React.FC<any> = ({ pool, vpCurrencyInput }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const title: React.ReactNode = pool?.name
  const subtitle1: React.ReactNode = `${t('Save')} ${vpCurrencyInput?.symbol ?? ''}`
  const subtitle2: React.ReactNode = `${t('Receive')} ${pool?.veSymbol}`
  const showSubtitle = pool?.sousId !== 0 || (pool?.sousId === 0 && !isMobile)

  const [watchlistTokens, addWatchlistToken] = useWatchlistTokens()

  return (
    <StyledCell role="cell">
      <TokenImage mr="8px" width={40} height={40} src={pool?.collection?.avatar} />
      <Pool.CellContent>
        <Text fontSize="12px" bold color="secondary" textTransform="uppercase">
          <Flex flexDirection="row">
            {title}
            <SaveIcon
              fill={watchlistTokens.includes(pool?.id)}
              onClick={() => addWatchlistToken(pool?.id)}
              style={{ marginLeft: '10px', position: 'relative', top: '-5px' }}
            />
          </Flex>
        </Text>
        {showSubtitle && (
          <Text fontSize="12px" color="textSubtle">
            {subtitle1} {subtitle2}
          </Text>
        )}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell