import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useGetAllResources } from 'state/games/hooks'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const UpdateInfoStage: React.FC<any> = ({ state, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { data: resources, refetch } = useGetAllResources(state.tokenId)

  useEffect(() => {
    refetch()
  }, [refetch, state.tokenId])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="tokenId"
          value={state.tokenId}
          placeholder={t('input your token id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Recipient Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="toAddress"
          value={state.toAddress}
          placeholder={t('input recipient address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        {resources?.length ? (
          <>
            <Text color="primary" mb="3px" mr="3px" fontSize="12px" bold as="span" textTransform="uppercase">
              {t('Resources From Burnt')}
            </Text>
            <Text lineHeight="1" mb="3px" fontSize="12px" color="textSubtle" as="span">
              {resources?.toString()}
            </Text>
          </>
        ) : null}
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will send resources left from all your burnt objects to the address specified above. Please read the documentation for more details.',
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

export default UpdateInfoStage
