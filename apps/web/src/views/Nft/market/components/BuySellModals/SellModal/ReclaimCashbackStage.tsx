import { Flex, Box, Text, Button, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Divider } from '../shared/styles'
import { GreyedOutContainer } from './styles'
import { useGetNftCashbackRevenue } from 'state/cancan/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { format } from 'date-fns'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const ResetIdentityLimits: React.FC<any> = ({ nftToSell, isPaywall, continueToNextStage }) => {
  const { t } = useTranslation()
  const data = useGetNftCashbackRevenue(nftToSell?.collection?.id, nftToSell?.tokenId, isPaywall)
  const amount = data?.length ? data[1] : '0'
  const dueDate = data?.length ? data[0] : '0'
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Reclaim Cashback Fund For Product')}
        </Text>
        <GreyedOutContainer>
          <Balance
            lineHeight="1"
            color="textSubtle"
            fontSize="12px"
            decimals={18}
            value={getBalanceNumber(new BigNumber(amount?.toString()))}
          />
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Cashback Amount')}
          </Text>
        </GreyedOutContainer>
        {parseInt(dueDate) ? (
          <Text small bold color="textSubtle">
            {t(`Claimable By: ${format(Number(dueDate) * 1000, 'MMM dd, yyyy HH:mm')}`)}
          </Text>
        ) : null}
        <Text mt="24px" color="textSubtle">
          {t(
            "You can reclaim your cashback fund in the event, your cashback requirements weren't met. You can do that by running this function.",
          )}
        </Text>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Reclaim')}
        </Button>
      </Flex>
    </>
  )
}

export default ResetIdentityLimits
