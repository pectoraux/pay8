import { useState } from 'react'
import { Flex, Box, Text, Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useGetPrices } from 'state/ramps/hooks'
import { FetchStatus } from 'config/constants/types'
import { Divider } from './styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const RemoveStage: React.FC<any> = ({ pool, setPrices, continueToNextStage }) => {
  const { t } = useTranslation()
  const [updated, SetUpdated] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const symbols = pool?.accounts?.map((account) => account?.token?.symbol)
  const { data, status, refetch } = useGetPrices(symbols, process.env.NEXT_PUBLIC_RAPID_API_PRICE_INFO)
  console.log('3mprices=================>', data)
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Fetched Prices For This Ramp')}
        </Text>
        <Flex flexDirection="column" alignItems="center">
          <Button
            scale="xs"
            mb="8px"
            endIcon={status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={() => {
              refetch()
              setDisabled(false)
            }}
          >
            {t('Refresh')}
          </Button>
          <Flex flexDirection="column">
            {data?.length === symbols?.length &&
              symbols?.map((symbol, index) => {
                if (parseFloat(data[index]) === 0) setDisabled(true)
                return <Text>{`${symbol} => ${data[index]}`}</Text>
              })}
          </Flex>
          <Button
            scale="sm"
            mb="8px"
            mt="20px"
            endIcon={status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null}
            disabled={!data?.length || (data?.length && Number.isNaN(data[0])) || data?.length !== symbols?.length}
            onClick={() => {
              setPrices(data)
              SetUpdated(true)
            }}
          >
            {t('Set Prices')}
          </Button>
        </Flex>
        <Text mt="16px" color="textSubtle">
          {t('Continue?')}
        </Text>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" disabled={!updated || disabled} onClick={continueToNextStage}>
          {t('Continue')}
        </Button>
      </Flex>
    </>
  )
}

export default RemoveStage
