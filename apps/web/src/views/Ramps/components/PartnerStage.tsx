import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'

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
          {t('Bounty ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="bountyId"
          value={state.bountyId}
          placeholder={t('input your bounty id')}
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
              "This will add you as a partner of the selected token market. You can only partner with currently under-collateralized token markets, the goal being to help them become overcollateralized again by adding your bounty to theirs. Partnering with a token market that becomes under-collateralized and thus unable to mint new tokens will reward you with a share of its earnings. Your share is computed as the percentage of the total token market's bounty balance. If the sum of all the token market's bounties' balances is 100 and you have contributed 40% of than, then you will earn 40% of all the proceeds made by the token market. A token market becoming under-collateralized is therefore a huge opportunity for investors to partner with it. A token market might become under-collateralized if its blockchain's native token loses so much in value that the total balance of the bounties attached to the token market is now worth less than the total number of tokens minted by that token market.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Add Partner')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
