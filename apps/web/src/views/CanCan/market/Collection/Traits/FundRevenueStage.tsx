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

const ClaimPendingRevenue: React.FC<any> = ({ state, handleChange, handleRawValueChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const [lockedAmount, setLockedAmount] = useState('')

  return (
    <>
      <GreyedOutContainer style={{ paddingTop: '50px' }}>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Source')}
          </Text>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.marketplace}
            onItemClick={handleRawValueChange('marketplace')}
          >
            <ButtonMenuItem>{t('Item Sales')}</ButtonMenuItem>
            <ButtonMenuItem>{t('NFT Sales')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Paywall Sales')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount To Transfer')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="amountPayable"
          value={state.amountPayable}
          placeholder={t('input amount payable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer style={{ paddingTop: '50px' }}>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
            {t('Transfer To Cashback Fund?')}
          </Text>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.cashbackFund}
            onItemClick={handleRawValueChange('cashbackFund')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t("This will fund you channel's accounts in the specified marketplace.")}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimPendingRevenue
