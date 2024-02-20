import { useEffect, useRef } from 'react'
import { Flex, Grid, Input, Box, Text, ButtonMenu, ButtonMenuItem, Button, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'

import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  lowestPrice?: number
  state: any
  account?: any
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ state, handleChange, handleRawValueChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" paddingRight="50px" bold>
            {t('Are You a Referrer?')}
          </Text>
          <ButtonMenu scale="sm" variant="subtle" activeIndex={state.add} onItemClick={handleRawValueChange('add')}>
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
        <Divider />
      </GreyedOutContainer>
      {state.add ? null : (
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Ticket ID')}
          </Text>
          <Input
            type="text"
            scale="sm"
            name="ticketId"
            value={state.ticketId}
            placeholder={t('input ticket id')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
      )}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will withdraw revenue from the contract both for winners and referrers. Please read the documentation for more details.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Withdraw')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
