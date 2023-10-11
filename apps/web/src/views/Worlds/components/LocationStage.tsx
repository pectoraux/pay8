import { Flex, Box, Text, Button, Grid, ErrorIcon, Input } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Filters from 'views/ChannelCreation/Filters'
import { Divider, GreyedOutContainer } from './styles'

interface RemoveStageProps {
  variant: 'product' | 'paywall'
  addLocation: () => void
}

const LocationStage: React.FC<any> = ({ state, nftFilters, setNftFilters, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <GreyedOutContainer>
        <Filters collection={nftFilters} workspace={false} nftFilters={nftFilters} setNftFilters={setNftFilters} />
      </GreyedOutContainer>
      <GreyedOutContainer style={{ paddingTop: '18px' }}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Not satisfied with above tags ? Add custom tags')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="customTags"
          value={state.customTags}
          placeholder={t('comma separated tags')}
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
              'This will update the location information of your World to enable users to find it more easily. Location tags can be helpful for instance for World operators that only want to work with users from a specific location. You can also add more custom tags related to the purpose of your World.',
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
