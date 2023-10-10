import { Flex, Box, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Divider } from 'views/Nft/market/components/BuySellModals/shared/styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const SwitchPoolStage: React.FC<any> = ({ continueToNextStage }) => {
  const { t } = useTranslation()
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Switch to/from a Valuepool')}
        </Text>
        <Text mt="24px" color="textSubtle">
          {t(
            'Use this to switch a Valuepool to a Riskpool or a Riskpool to a Valuepool. This is only possible if you have each a total amount of tokens in your Valuepool equals or greater than the minimum you need to switch. The minimum needed to switch is set by the owner when deploying the Valuepool.',
          )}
        </Text>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button variant="danger" mb="8px" onClick={continueToNextStage}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default SwitchPoolStage
