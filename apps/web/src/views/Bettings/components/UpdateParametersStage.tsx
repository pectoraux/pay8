import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
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

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('You must harvest and compound your earnings from this pool manually.'),
    {
      placement: 'bottom',
    },
  )

  return (
    <>
      <GreyedOutContainer>
        {/* <Flex alignItems="center"> */}
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Collection ID')}
        </Text>
        {/* {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>
        </Flex> */}
        <Input
          type="text"
          scale="sm"
          name="collectionId"
          value={state.collectionId}
          placeholder={t('input new pool collection id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('New Minimum Ticket Number')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="newMinTicketNumber"
          value={state.newMinTicketNumber}
          placeholder={t('input new min ticket number')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('New Ticket Range')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="newTicketRange"
          value={state.newTicketRange}
          placeholder={t('input new ticket range')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Ticket Size')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="ticketSize"
          value={state.ticketSize}
          placeholder={t('input ticket size')}
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
              'The will update parameters of the contract. Please read the documentation for more information on each parameter',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update Parameters')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
