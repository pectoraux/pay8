import axios from 'axios'
import Dots from 'components/Loader/Dots'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, useToast } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import _toNumber from 'lodash/toNumber'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetAccountSg } from 'state/ramps/hooks'

import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  lowestPrice?: number
  state: any
  account?: any
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const BurnStage: React.FC<any> = ({
  state,
  rampAddress,
  handleChange,
  rampHelperContract,
  callWithGasPrice,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const router = useRouter()
  const { toastError, toastSuccess } = useToast()
  const { data: accountData, refetch } = useGetAccountSg(account, 'stripe')
  const [linking, setLinking] = useState<boolean>(false)
  const [linked, setLinked] = useState<boolean>(accountData?.id && accountData?.active)

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
    setLinked(accountData?.id && accountData?.active)
  }, [inputRef])

  async function onAttemptToCreateLink() {
    setLinking(true)
    const { data } = await axios.post('/api/link', {
      account,
      rampAddress,
      sk: state.sk,
      accountId: state.accountId,
    })

    if (!linked) {
      if (data?.err) {
        setLinked(false)
        setLinking(false)
        return
      }
      const args = ['stripe', data.accountId, state.moreInfo?.split(',')]
      await callWithGasPrice(rampHelperContract, 'linkAccount', args).catch((err) => {
        console.log('createGauge=================>', err)
      })
      router.push(data.link)
    } else if (!data.err) {
      toastSuccess(t('Bank account successfully linked'))
      setLinked(true)
      setLinking(false)
    } else {
      toastError(t('Error'), t(data.err))
      // throw new Error('cannot link to bank')
      setLinking(false)
    }
  }

  return !(accountData?.id && accountData?.active) ? (
    <>
      <Divider />
      <Flex flexDirection="column">
        <Button
          disabled={!account || !rampAddress || !state.sk}
          variant={linked ? 'success' : 'primary'}
          onClick={onAttemptToCreateLink}
        >
          {linking ? <Dots>{t('Linking')}</Dots> : linked ? t('Linked') : t('Link')}
        </Button>
      </Flex>
    </>
  ) : (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Amount')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input of amount to burn')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Identity Token ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="identityTokenId"
          value={state.identityTokenId}
          placeholder={t('input your identity token id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will burn the specified amount of token from your wallet. Please read the documentation for more details.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage} disabled={Number(state.amountReceivable) < 2}>
          {t('Burn')}
        </Button>
      </Flex>
    </>
  )
}

export default BurnStage
