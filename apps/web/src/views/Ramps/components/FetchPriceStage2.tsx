import NodeRSA from 'encrypt-rsa'
import { useEffect, useState } from 'react'
import { Flex, Box, Text, Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useGetExtraPrices } from 'state/ramps/hooks'
import { FetchStatus } from 'config/constants/types'
import { Divider } from './styles'

interface RemoveStageProps {
  continueToNextStage: () => void
}

const RemoveStage: React.FC<any> = ({ encrypted, symb, setPrices, continueToNextStage }) => {
  const { t } = useTranslation()
  const [updated, SetUpdated] = useState(false)
  const [spin, setSpin] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const symbols = [symb]
  // const call = {
  //   method: 'GET',
  //   url: 'https://alpha-vantage.p.rapidapi.com/query',
  //   params: {
  //     to_currency: 'USD',
  //     function: 'CURRENCY_EXCHANGE_RATE',
  //     from_currency: '%symbol%',
  //   },
  //   headers: {
  //     'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_PRICE_INFO,
  //     'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com',
  //   },
  // }
  const nodeRSA2 = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)
  const decrypted = nodeRSA2?.decryptStringWithRsaPrivateKey({
    text: encrypted,
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
  })
  console.log('4useGetExtraPrices===============>', symbols, decrypted, JSON?.parse(decrypted)) // , JSON.parse(JSON.stringify(call)), JSON.stringify(call) === decrypted)
  const { data, status, refetch } = useGetExtraPrices(symbols, decrypted, process.env.NEXT_PUBLIC_RAPID_API_PRICE_INFO)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  useEffect(() => {
    if (spin) {
      delay(10000).then(() => setSpin(false))
    }
  }, [spin])
  console.log('33mprices=================>', encrypted, data)
  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Price For Extra Token')}
        </Text>
        <Flex flexDirection="column" alignItems="center">
          <Button
            scale="xs"
            mb="8px"
            disabled={spin}
            endIcon={status === FetchStatus.Fetching || spin ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={() => {
              refetch()
              setSpin(true)
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
