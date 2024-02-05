import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import RichTextEditor from 'components/RichText'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useCurrPool, useGetWithdrawable } from 'state/valuepools/hooks'
import { Text, Flex, useMatchBreakpoints, LinkExternal, Box, Balance } from '@pancakeswap/uikit'

import { ActionContainer, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const currState = useCurrPool()
  const currAccount = useMemo(() => pool?.tokens?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  const { data } = useGetWithdrawable(pool?.ve, currAccount?.tokenId)
  return (
    <ActionContainer>
      <Flex mb="2px" justifyContent="center">
        <LinkExternal href={`/valuepools/voting/valuepool/${pool?.ve}`} bold={false} small>
          {t('View Proposals')}
        </LinkExternal>
      </Flex>
      <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
        {data?.withdrawable ? t('Yes') : t('No')}
      </Text>
      <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
        {t('Is Withdrawable?')}
      </Text>
      <Box mr="8px" height="32px">
        <Balance
          lineHeight="1"
          color="textSubtle"
          fontSize="12px"
          decimals={5}
          value={getBalanceNumber(new BigNumber(data?.amountWithdrawable?.toString()), pool?.vaDecimals)}
        />
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Amount Withdrawable')}
        </Text>
      </Box>
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
