import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const ResetIdentityLimits: React.FC<RemoveStageProps> = ({ continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Reset Identity Limits For Product')}
        </Text>
        <Text mt="24px" color="textSubtle">
          {t(
            'Resetting identity limits for this product will erase any record of previous rewards such that users who already got a discount/cashback will become eligible again. Use this if you enabled identity checks on this product',
          )}
        </Text>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Reset')}
        </Button>
      </Flex>
    </>
  )
}

export default ResetIdentityLimits
