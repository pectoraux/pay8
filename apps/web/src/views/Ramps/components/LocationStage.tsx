import { Flex, Box, Text, Button, Grid, ErrorIcon, Input } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Filters from 'views/ChannelCreation/Filters'
import { Divider, GreyedOutContainer } from './styles'

interface RemoveStageProps {
  variant: 'product' | 'paywall'
  addLocation: () => void
}

const LocationStage: React.FC<any> = ({
  state,
  pool,
  nftFilters,
  setNftFilters,
  handleChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  return (
    <>
      <GreyedOutContainer>
        <Filters collection={pool} workspace={false} nftFilters={nftFilters} setNftFilters={setNftFilters} />
      </GreyedOutContainer>
      <GreyedOutContainer style={{ paddingTop: '18px' }}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Not satisfied with above tags ? Add a custom tag')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="customTags"
          value={state.customTags}
          placeholder={t('input a custom tag')}
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
              'This will update the location information of your contract to enable users to find it more easily. Location tags can be helpful for instance in the case of manual ramps that process cash and want their users to be able to locate them in the real world for their transactions. You can also add more custom tags related to your payment methods so users willing to transact in those payment methods can discover your ramp faster. Run this function multiple times to add multiple custom tags',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default LocationStage
