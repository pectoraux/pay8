import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { TabToggleGroup, TabToggle } from 'components/TabToggle'
import { useTranslation } from '@pancakeswap/localization'

const MobileChartWrapper = styled(Flex)`
  flex-direction: column;
  height: 100%;
  @media only screen and (max-width: 575px) and (max-height: 739px) {
    height: 100vh;
  }
`

const MobileChart = () => {
  const { t } = useTranslation()
  return (
    <MobileChartWrapper>
      <div style={{ height: 'min-content' }}>
        <TabToggleGroup>
          <TabToggle isActive>TradingView {t('Chart')}</TabToggle>
          <TabToggle isActive={false}>Chainlink {t('Chart')}</TabToggle>
        </TabToggleGroup>
      </div>
    </MobileChartWrapper>
  )
}

export default MobileChart
