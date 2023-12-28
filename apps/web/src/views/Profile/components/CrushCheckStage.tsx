import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, ErrorIcon, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useGetIsCrush } from 'state/profile/hooks'
import { StyledItemRow } from 'views/CanCan/market/components/Filters/ListFilter/styles'
import { FetchStatus } from 'config/constants/types'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ state }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { isCrush, status } = useGetIsCrush(state.profileId)

  const [reveal, setReveal] = useState(0)
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="50px" paddingTop="3px" bold>
            {t('Current Crush?')}
          </Text>
          <ButtonMenu scale="xs" variant="subtle" activeIndex={reveal} onItemClick={() => setReveal(reveal ? 0 : 1)}>
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      {reveal && status === FetchStatus.Fetched ? (
        <Text color="primary" ml="20px" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Am I A Crush? %val%', { val: isCrush ? 'Yes' : 'No' })}
        </Text>
      ) : null}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will check whether you are a crush of this profile or not')}
          </Text>
        </Box>
      </Grid>
      <Divider />
    </>
  )
}

export default SetPriceStage
