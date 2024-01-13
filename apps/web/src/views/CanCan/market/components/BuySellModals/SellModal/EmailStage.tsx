import { Flex, Box, Text, Button, ErrorIcon, Grid } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useGetEmailList, useProfileFromSSI } from 'state/ssi/hooks'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const EmailStage: React.FC<any> = ({ collection }) => {
  const { t } = useTranslation()
  const { profile } = useProfileFromSSI(`0x${process.env.NEXT_PUBLIC_PAYSWAP_ADDRESS}`)
  const accountShares = collection?.acountShares?.map((acct) => acct?.id)
  console.log('accountShares=============>', accountShares)
  const { data: emailList } = useGetEmailList([...collection?.registrations, ...accountShares] ?? [], profile)
  const csvContent = `data:text/csv;charset=utf-8,${emailList?.join('\n')}`
  const encodedUri = encodeURI(csvContent)
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Your Email List')}
        </Text>
        <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
          <Flex alignSelf="flex-start">
            <ErrorIcon width={24} height={24} color="textSubtle" />
          </Flex>
          <Text small color="textSubtle">
            {t(
              'This action will enable you to download the list of emails of all your subscribers in a csv file. Please read the documentation for more details.',
            )}
          </Text>
        </Grid>
        <Divider />
        <Flex flexDirection="column" px="16px" pb="16px">
          <Button mb="8px" onClick={() => window.open(encodedUri)} disabled={!emailList?.length}>
            {t('Download')}
          </Button>
        </Flex>
      </Box>
    </>
  )
}

export default EmailStage
