import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import _toNumber from 'lodash/toNumber'
import { useTranslation } from '@pancakeswap/localization'
import { GreyedOutContainer } from './styles'
import { Divider } from '../shared/styles'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
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
          {t('Item Time Estimate (minutes)')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="itemTimeEstimate"
          value={state.itemTimeEstimate}
          placeholder={t('input time estimate')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Comma Separated Option IDs')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="options2"
          value={state.options2}
          placeholder={t('comma separated option ids')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Comma Separated Option ID Time Estimates (minutes)')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="optionsTimeEstimates"
          value={state.optionsTimeEstimates}
          placeholder={t('comma separated option id time estimate')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will add time estimates to your item and/or options.  This is useful to let your clients know how long it will take you to deliver their item to them. Please read the documentation for more details.',
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
