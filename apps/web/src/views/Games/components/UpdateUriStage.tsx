import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
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
const SetPriceStage: React.FC<any> = ({ state, handleChange, continueToNextStage }) => {
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
          {t('Game/Collection ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="collectionId"
          value={state.collectionId}
          placeholder={t('input your collection id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('URI Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="uriGenerator"
          value={state.uriGenerator}
          placeholder={t('input uri generator address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will update the uri generator of this arp. Please read the documentation for more information.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update URI Generator')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
