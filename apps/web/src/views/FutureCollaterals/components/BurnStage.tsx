import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Divider } from './styles'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      {/* <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Owner Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="owner"
          value={state.owner}
          placeholder={t('input owner address')}
          onChange={handleChange}
        />
      </GreyedOutContainer> */}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will burn your future collateral. Use this function when everything goes well and the loan backed by this future collateral has been reimbursed. This is only callable by the current owner of the future collateral.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Burn')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
