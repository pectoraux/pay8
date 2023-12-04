import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, ErrorIcon, Input } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import Options from './Options'
import { OptionType } from './types'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'
import { getMarketHelperAddress, getPaywallMarketHelperAddress } from 'utils/addressHelpers'
import { useGetTimeEstimates } from 'state/cancan/hooks'
import { useRouter } from 'next/router'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  state: any
  handleChange: (any) => void
  handleChoiceChange: () => void
  handleRawValueChange?: any
  continueToNextStage: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({
  nftToSell,
  thumbnail,
  state,
  addValue,
  collectionId,
  handleChoiceChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { options } = state
  const collectionAddress = useRouter().query.collectionAddress as string
  const timeEstimate = useGetTimeEstimates(
    collectionAddress,
    nftToSell?.tokenId,
    addValue ? getPaywallMarketHelperAddress() : getMarketHelperAddress(),
    [],
  )

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <>
      <Text fontSize="24px" bold p="16px">
        {t('Adjust Sale Price')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell?.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Item Time Estimate')}
        </Text>
        <Input type="text" scale="sm" value={`${timeEstimate?.itemPrice ?? '0'} seconds`} disabled />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Add or remove options')}
        </Text>
        <Options
          id="options"
          addValue={addValue}
          nftToSell={nftToSell}
          name="options"
          choices={options || []}
          onChange={handleChoiceChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              "This enables you to add options to your product. Options enable users to customize their orders. The category field sets the category of the option, the element field set the actual option, the currency field sets the unit of the count - set this to # if you want each count to be an increment in the number of the item; the element price is the price of each element; the element min parameter is min amount of the element customers can order; the element max is the maximum amount of the element customers can order. In case you want to enable users to pick between options $1 Tilapia and $2 Tilapia for the meat on top of their food, you add 2 options, the first one (category='Meat'; Element='$1 Tilapia'; Currency='#', Element Price='1', Element Min='0', Element Max='100') & the second one (category='Meat'; Element='$2 Tilapia'; Currency='#', Element Price='2', Element Min='0', Element Max='100'). You can add as many options as you want to your product and you can add multiple categories each with their own list of options.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update Options')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
