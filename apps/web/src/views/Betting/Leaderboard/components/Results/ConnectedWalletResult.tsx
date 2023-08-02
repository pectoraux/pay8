import { Card, Heading, Table, Th, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@pancakeswap/wagmi'
import Container from 'components/Layout/Container'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useConfig } from 'views/Betting/context/ConfigProvider'

const ConnectedWalletResult = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { token } = useConfig()
  return (
    <Container mb="48px">
      <Heading as="h2" scale="md" color="secondary" mb="16px">
        {t('My Rankings')}
      </Heading>
      {isDesktop ? (
        <Card isActive>
          <Table>
            <thead>
              <tr>
                <Th width="60px">&nbsp;</Th>
                <Th textAlign="left">&nbsp;</Th>
                <Th textAlign="right">{t('Net Winnings (%symbol%)', { symbol: token.symbol })}</Th>
                <Th textAlign="center">{t('Win Rate')}</Th>
                <Th>{t('Rounds Won')}</Th>
                <Th>{t('Rounds Played')}</Th>
              </tr>
            </thead>
            <tbody></tbody>
          </Table>
        </Card>
      ) : null}
    </Container>
  )
}

export default ConnectedWalletResult
