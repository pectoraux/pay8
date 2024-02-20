import {
  Flex,
  Grid,
  Text,
  Button,
  Input,
  BinanceIcon,
  ErrorIcon,
  LinkExternal,
  ButtonMenu,
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'
import { StyledItemRow } from './ListTraitFilter2/styles'

interface TransferStageProps {
  nftToSell?: any
  lowestPrice: number
  paymentCredits: string
  setPaymentCredits: React.Dispatch<React.SetStateAction<string>>
  creditUsers: string
  setCreditUsers: React.Dispatch<React.SetStateAction<string>>
  continueToNextStage: () => void
}

const UserMerchantProofType: React.FC<any> = ({
  state,
  thumbnail,
  nftToSell,
  collectionId,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const isInvalidField1 = false
  const isInvalidField2 = false
  const getErrorText = () => {
    // if (isInvalidField1) {
    //   return t('This address is invalid')
    // }
    return null
  }
  return (
    <>
      <Text fontSize="22px" bold px="16px" pt="16px">
        {t('Update Merchant Proof Type')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell?.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {t('Collection #%val%', { val: collectionId })}
          </Text>
        </Grid>
      </Flex>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Your Profile ID')}
        </Text>
        <Input scale="sm" placeholder={t('input profile id')} value={state.profileId} onChange={handleChange} />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingRight="50px" paddingTop="13px" bold>
            {t('Give Rewards in')}
          </Text>
          <ButtonMenu
            scale="sm"
            variant="subtle"
            activeIndex={state.proofType}
            onItemClick={handleRawValueChange('proofType')}
          >
            <ButtonMenuItem>{t('Shared')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Created')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t(
            "This action will add payment credits for the specified user's account. You can use this function to reward users with payment credits on specific products so that they can buy the product at a discounted price",
          )}
        </Text>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage} disabled={isInvalidField1 || isInvalidField2}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default UserMerchantProofType
