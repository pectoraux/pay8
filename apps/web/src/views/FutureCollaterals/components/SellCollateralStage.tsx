import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon, Input } from '@pancakeswap/uikit'
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
          {t('Borrower Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="borrower"
          value={state.borrower}
          placeholder={t('input borrower address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('NFT Bounty ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="userBountyId"
          value={state.userBountyId}
          placeholder={t('input borrower bounty id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Claim Attacker ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="claimId"
          value={state.claimId}
          placeholder={t('input litigation attacker id')}
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
              "This will sell your collateral. Use this function only when the user for which you minted this collateral defaulted on the loan. This should enable you to recover part or the entirety of the loan's principal.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" variant="danger" onClick={continueToNextStage}>
          {t('Sell')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
