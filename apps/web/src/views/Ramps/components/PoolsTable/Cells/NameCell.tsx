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

const NameCell: React.FC<any> = ({ pool, rampAccount }) => {
  const { t } = useTranslation()

  let title: React.ReactNode = `${t('Mint')} ${rampAccount?.token?.symbol ?? ''}`
  let subtitle: React.ReactNode = `${t('Burn')} ${rampAccount?.token?.symbol ?? ''}`

  const [watchlistTokens, addWatchlistToken] = useWatchlistTokens()

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" bold color="secondary" textTransform="uppercase">
          <Flex flexDirection="column">
            <SaveIcon
              fill={watchlistTokens.includes(pool?.id)}
              onClick={() => addWatchlistToken(pool?.id)}
              style={{ marginRight: '20px', position: 'relative' }}
            />
            <TokenImage mr="8px" width={40} height={40} src={pool?.collection?.avatar} />
            {!rampAccount ? t('Pick a token') : title}
          </Flex>
        </Text>
        {rampAccount && (
          <Text fontSize="12px" color="textSubtle">
            {subtitle}
          </Text>
        )}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell
