import { useState } from 'react'
import { Flex, Box, Text, Button, ButtonMenu, ButtonMenuItem, Input, ErrorIcon, Grid } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import _toNumber from 'lodash/toNumber'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
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
