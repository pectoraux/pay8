import { Button, Text, Flex, Box, Balance } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = () => {
  const { t } = useTranslation()

  return (
    <ActionContainer>
      <ActionContent>
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Open the votes for more details')}
        </Text>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
