import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
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
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Input the type of the selected token')}
        </Text>
        <ButtonMenu scale="xs" variant="subtle" activeIndex={state.nftype} onItemClick={handleRawValueChange('nftype')}>
          <ButtonMenuItem>{t('Not NFT')}</ButtonMenuItem>
          <ButtonMenuItem>{t('ERC721')}</ButtonMenuItem>
          <ButtonMenuItem>{t('ERC1155')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      {parseInt(state.nftype) ? (
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('NFT Contract Address')}
          </Text>
          <Input
            type="text"
            scale="sm"
            name="token"
            value={state.token}
            placeholder={t('input nft collection address')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
      ) : null}
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Sender Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="owner"
          value={state.owner}
          placeholder={t('input sender address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {parseInt(state.nftype) ? t('Token ID') : t('Amount To Add')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input amount to add')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Is Native Token?')}
        </Text>
        <ButtonMenu
          scale="xs"
          variant="subtle"
          activeIndex={state.isNative}
          onItemClick={handleRawValueChange('isNative')}
        >
          <ButtonMenuItem>{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'Make sure you have selected a currency from the drop-down menu on top of the Control Panel button. This adds the specified amount of the selected token to your Will contract. After you have added tokens to your contract to constitute its balance, you can start adding heirs to your Will, specifying the percentage of each balance you want to leave them.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Add')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
