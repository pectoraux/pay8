import _toNumber from 'lodash/toNumber'
import { useEffect, useRef } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  Balance,
  ButtonMenu,
  ButtonMenuItem,
} from '@pancakeswap/uikit'

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
const SetPriceStage: React.FC<any> = ({ state, notes, handleChange, handleRawValueChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      {notes?.map((note) => {
        return (
          <Flex flexDirection="row" alignItems="center" justifyContent="center">
            <GreyedOutContainer>
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {note?.name}, {note?.symbol}
              </Text>
              <br />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Name, Symbol')}
              </Text>
            </GreyedOutContainer>
            <GreyedOutContainer>
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={note?.percentage}
                unit=" %"
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Note #%val%', { val: note?.id })}
              </Text>
            </GreyedOutContainer>
          </Flex>
        )
      })}
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="tokenId"
          value={state.tokenId}
          placeholder={t('input the id of the note')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Token Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="token"
          value={state.token}
          placeholder={t('input token address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
          {t('Input the type of the token to claim')}
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
              "This will withdraw revenues currently due to this note. How do notes work? A note that unlocks an inheritance of 10 tokens after the passing of a Will's owner, can be minted and sold today for 8 tokens for instance. A note is basically like an IOU that gives its owner the right to claim a certain amount from This will contract in the future. A Will's heir can mint notes that they can sell at a slightly lesser price than the payment the note will be able to unlock in the future. That way they get to access their future inheritance early and the party that buys the note gets to earn some interest from the note when it becomes due.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Claim Inheritance')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
