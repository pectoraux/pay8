import { Flex, Box, Text, Button, ErrorIcon, Grid, Input } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Divider, GreyedOutContainer } from './styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const RemoveStage: React.FC<any> = ({ state, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Profile ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="profileId"
          value={state.profileId}
          placeholder={t('input profile id of heir')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will remove the specified heir from your Will.')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" variant="danger" onClick={continueToNextStage}>
          {t('Delete Heir')}
        </Button>
      </Flex>
    </>
  )
}

export default RemoveStage
