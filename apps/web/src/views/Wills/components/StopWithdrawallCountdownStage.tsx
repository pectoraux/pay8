import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Divider } from './styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const RemoveStage: React.FC<any> = ({ continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Stop Withdrawal')}
        </Text>
        <Text mt="24px" color="textSubtle">
          {t(
            'Use this to stop an ongoing Will withdrawal countdown. If you are the owner of this Will and its withdrawal countdown has been launched by an heir even though you did not yet pass, you can use this function to stop the countdown.',
          )}
        </Text>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button variant="danger" mb="8px" onClick={continueToNextStage}>
          {t('Stop')}
        </Button>
      </Flex>
    </>
  )
}

export default RemoveStage
