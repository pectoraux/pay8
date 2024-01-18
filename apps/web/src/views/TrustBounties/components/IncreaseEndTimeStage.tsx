import { Flex, Box, Text, Button, Grid, ErrorIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DatePicker, DatePickerPortal } from 'views/ValuePoolVoting/components/DatePicker'
import { Divider, GreyedOutContainer } from './styles'

interface RemoveStageProps {
  variant: 'product' | 'paywall'
  addLocation: () => void
}

const LocationStage: React.FC<any> = ({ state, handleRawValueChange, continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('End Date')}
        </Text>
        <DatePicker onChange={handleRawValueChange('endDate')} selected={state.endDate} placeholderText="YYYY/MM/DD" />
        <DatePickerPortal />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will update the location information of your bounty to enable users to find it more easily. Location tags can be helpful for instance for bounties of businesses that operate in specific locations to be discovered faster by people from those locations. You can also add more custom tags related to the purpose of your bounty.',
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
