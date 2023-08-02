import { Box, Button, Grid, Flex, AutoRenewIcon, useMatchBreakpoints } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { FetchStatus } from 'config/constants/types'
import DesktopResults from './DesktopResults'
import MobileResults from './MobileResults'
import RankingCard from './RankingCard'

const Results = () => {
  const { t } = useTranslation()
  const isLoading = false
  const hasMoreResults = true
  const dispatch = useLocalDispatch()

  const handleClick = () => {}

  return (
    <Box>
      <Flex mb="40px" justifyContent="center">
        {hasMoreResults && (
          <Button
            variant="secondary"
            isLoading={isLoading}
            endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            onClick={handleClick}
          >
            {isLoading ? t('Loading...') : t('View More')}
          </Button>
        )}
      </Flex>
    </Box>
  )
}

export default Results
