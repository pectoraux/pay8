import { Text, Flex, useMatchBreakpoints, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import RichTextEditor from 'components/RichText'

import { ActionContainer, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <ActionContainer>
      <Flex mb="2px" justifyContent="center">
        <LinkExternal href={`/valuepools/voting/valuepool/${pool?.ve}`} bold={false} small>
          {t('View Proposals')}
        </LinkExternal>
      </Flex>
      {pool?.description ? (
        <Flex flex="2" alignItems="center" overflow="auto" maxWidth={isMobile ? 250 : 1000}>
          <RichTextEditor value={pool?.description} readOnly id="rte" />
        </Flex>
      ) : null}
      <ActionContent>
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Click the proposals link to view current proposals')}
        </Text>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
