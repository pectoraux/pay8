import { Flex, Box, Text, Button, Grid, ErrorIcon, Input } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Filters from 'views/ChannelCreation/Filters'
import { Divider, GreyedOutContainer } from './styles'

interface RemoveStageProps {
  variant: 'product' | 'paywall'
  addLocation: () => void
}

const UpdateApplicationStage: React.FC<any> = ({ state, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      {/* <GreyedOutContainer style={{ paddingTop: '18px' }}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Contact Channels')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="contactChannels"
          value={state.contactChannels}
          placeholder={t('comma separated contact channels')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer style={{ paddingTop: '18px' }}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Contacts')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="contacts"
          value={state.contacts}
          placeholder={t('comma separated contacts')}
          onChange={handleChange}
        />
      </GreyedOutContainer> */}
      <GreyedOutContainer style={{ paddingTop: '18px' }}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Application Link')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="applicationLink"
          value={state.applicationLink}
          placeholder={t('input application link')}
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
              'The will update the specified information of your ramp. Please read the documentation for more information.',
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

export default UpdateApplicationStage
