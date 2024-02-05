import RichTextEditor from 'components/RichText'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'

import { ActionContainer, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <ActionContainer>
      {pool?.description ? (
        <Flex flex="2" alignItems="center" overflow="auto" maxWidth={isMobile ? 250 : 1000}>
          <RichTextEditor value={pool?.description} readOnly id="rte" />
        </Flex>
      ) : null}
      <ActionContent>
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Open the litigations tab to view current litigations')}
        </Text>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
