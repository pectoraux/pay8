import styled from 'styled-components'
import { Text, Flex, Box, CopyButton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import RichTextEditor from 'components/RichText'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const actionTitle = (
    <Flex flexDirection="row" justifyContent="space-around">
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Terms')}
      </Text>
      <Wrapper>
        <Text fontSize="12px" bold mb="10px" color="textSubtle" as="span" textTransform="uppercase">
          {t('Owner Address')}
        </Text>
        <CopyButton width="24px" text={pool?.owner} tooltipMessage={t('Copied')} />
      </Wrapper>
      <Wrapper>
        <Text fontSize="12px" bold mb="10px" color="textSubtle" as="span" textTransform="uppercase">
          {t('VeNFT Address')}
        </Text>
        <CopyButton width="24px" text={pool?.ve} tooltipMessage={t('Copied')} />
      </Wrapper>
    </Flex>
  )

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      {pool?.terms ? (
        <Flex flex="2" alignItems="center" overflow="auto" maxWidth={isMobile ? 250 : 1000}>
          <RichTextEditor value={pool?.terms} readOnly id="rte" />
        </Flex>
      ) : null}
      {!pool?.terms ? (
        <ActionContent>
          <Text color="failure" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Update the terms of your bounty so users know when it is legitimate to attack it')}
          </Text>
        </ActionContent>
      ) : null}
    </ActionContainer>
  )
}

export default HarvestAction
