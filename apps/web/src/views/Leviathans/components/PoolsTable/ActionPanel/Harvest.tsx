import { Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { ActionContainer, ActionContent } from './styles'

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
