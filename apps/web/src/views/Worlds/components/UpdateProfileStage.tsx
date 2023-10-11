import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Divider } from './styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const UpdateProfileStage: React.FC<any> = ({ continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Update Profile')}
        </Text>
        <Text mt="24px" color="textSubtle">
          {t(
            'Use this to attach your profile id to your World contract which is a mandatory step before you can start minting World NFTs.',
          )}
        </Text>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default UpdateProfileStage
