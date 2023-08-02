import { memo } from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@pancakeswap/uikit'
import MobileMenu from './components/MobileMenu'
import History from './History'
import Positions from './Positions'
import MobileChart from './MobileChart'
import { ErrorNotification, PauseNotification } from './components/Notification'
import { PageView } from './types'
import Menu from './components/Menu'
import LoadingSection from './components/LoadingSection'

const StyledMobile = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;

  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const PowerLinkStyle = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 16px;
`

const getView = (isHistoryPaneOpen: boolean, isChartPaneOpen: boolean): PageView => {
  if (isHistoryPaneOpen) {
    return PageView.HISTORY
  }

  if (isChartPaneOpen) {
    return PageView.CHART
  }

  return PageView.POSITIONS
}

const Mobile: React.FC<React.PropsWithChildren> = () => {
  return <></>
}

export default memo(Mobile)
