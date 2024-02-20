import { Flex, Box, Text, Button, Input, ErrorIcon, Grid, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Divider, GreyedOutContainer } from './styles2'

interface RemoveStageProps {
  state: any
  currency: any
  handleRawValueChange?: any
  continueToNextStage: () => void
}

const ClaimPendingRevenue: React.FC<any> = ({ state, handleChange, handleSuperChatChange, continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <GreyedOutContainer>
        <Balance
          lineHeight="1"
          color="textSubtle"
          fontSize="12px"
          decimals={18}
          value={getBalanceNumber(new BigNumber('100000000000000000'), 18)}
        />
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Minimum Superchat Amount (Not Applicable for merchants)')}
        </Text>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token IDs To Superchat To')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="tokenId"
          value={state.tokenId}
          placeholder={t('comma seperated ids of tickets')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Superchat Amount')}
        </Text>
        <Input
          type="text"
          inputMode="decimal"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input amount receivable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Superchat Message')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="message"
          value={state.message}
          placeholder={t('input superchat message')}
          onChange={handleSuperChatChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              "This will send a superchat to the specified tickets. Input the tickets' ids in a comma separated format.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Send')}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimPendingRevenue
