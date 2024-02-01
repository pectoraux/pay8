import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
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
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount To Remove')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="amountPayable"
          value={state.amountPayable}
          placeholder={t('input amount to remove')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="token"
          value={state.token}
          placeholder={t('input token to remove')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Selected Token Type')}
        </Text>
        <ButtonMenu scale="xs" variant="subtle" activeIndex={state.nftype} onItemClick={handleRawValueChange('nftype')}>
          <ButtonMenuItem>{t('Not NFT')}</ButtonMenuItem>
          <ButtonMenuItem>{t('ERC721')}</ButtonMenuItem>
          <ButtonMenuItem>{t('ERC1155')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'Make sure you have selected a currency from the drop down menu on top of the Control Panel button. This removes the specified amount of the specified token from your will contract.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" variant="danger" onClick={continueToNextStage}>
          {t('Remove')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
