import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
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
          {t('Content Name')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="contentType"
          value={state.contentType}
          placeholder={t('input content name')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <ButtonMenu
          scale="xs"
          variant="subtle"
          activeIndex={state.add ? 1 : 0}
          onItemClick={handleRawValueChange('add')}
        >
          <ButtonMenuItem>{t('Remove')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Add')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'Please read the documentation for a complete list content names, pick the right content name for your marketing media and input it right here. This will enable contracts like Valuepools to automatically check whether your marketing content is appropriate for them before enabling you to buy ad-spots on their contracts.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update Content')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
