import { Text, TokenImage, Pool } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'

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

  return (
    <StyledCell role="cell">
      <TokenImage mr="8px" width={40} height={40} src={pool?.avatar} />
      <Pool.CellContent>
        <Text fontSize="12px" bold color="secondary" textTransform="uppercase">
          {title}
        </Text>
        <Text fontSize="12px" color="textSubtle">
          {subtitle}
        </Text>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default NameCell
