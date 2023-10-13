import {
  AutoRenewIcon,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HelpIcon,
  Input,
  LinkExternal,
  Text,
  useModal,
  useToast,
  useTooltip,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ChangeEvent, useEffect, useCallback, useState } from 'react'
import { useInitialBlock } from 'state/block/hooks'

import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import Link from 'next/link'
import { DatePickerPortal } from 'views/Voting/components/DatePicker'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useSSIContract } from 'hooks/useContract'
import { SecondaryLabel } from './styles'
import Layout from '../components/Layout'
import { useSignMessage } from 'wagmi'

const CryptoJS = require('crypto-js')

const CreateKeys = () => {
  const [state, setState] = useState<any>(() => ({
    dataType: null,
    profileId: '',
    privateKey: '',
    publicKey: '',
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const ssiContract = useSSIContract()
  const { toastSuccess, toastError } = useToast()

  const encryptWithAES = (text, key) => {
    return CryptoJS.AES.encrypt(text, key).toString()
  }
  const { signMessageAsync } = useSignMessage()

  const handleCreateKeys = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(async () => {
      try {
        setIsLoading(true)
        const signature = await signMessageAsync({ message: account })
        const encPK = encryptWithAES(state.privateKey?.replace(/\s/g, ''), signature)
        console.log('rsa3=====================>', ssiContract, [
          state.profileId,
          state.publicKey?.replace(/\s/g, ''),
          encPK,
        ])
        return callWithGasPrice(ssiContract, 'createAccount', [
          state.profileId,
          state.publicKey?.replace(/\s/g, ''),
          encPK,
        ]).catch((err) => {
          setIsLoading(false)
          console.log('channel====================>', err)
        })
      } catch (error) {
        setIsLoading(false)
        console.log('error============>', error)
        toastError(error instanceof Error && error?.message ? error.message : JSON.stringify(error))
      }
    })
    if (receipt?.status) {
      toastSuccess(
        t('Channel Created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start listing your products either on CanCan or the NFT marketplace')}
        </ToastDescriptionWithTx>,
      )
      setIsLoading(false)
    }
  }, [
    t,
    state,
    account,
    toastError,
    ssiContract,
    toastSuccess,
    signMessageAsync,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  useEffect(() => {
    if (initialBlock > 0) {
      setState((prevState) => ({
        ...prevState,
        snapshot: initialBlock,
      }))
    }
  }, [initialBlock, setState])

  const TooltipComponent = () => (
    <Text>
      {t(
        "Go to the Key generator link at the bottom of this form, on the page that opens select a key length of 1024 and click 'Generate key pair'. That will generate 2 keys, one private and another one public. Copy the private key without the '----- BEGIN RSA PRIVATE KEY-----' and '----- END RSA PRIVATE KEY-----' part and paste it here.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "Do what you did in the previous field for this field but for the public key. Copy the generated public key without the '----- BEGIN PUBLIC KEY-----' and '----- END PUBLIC KEY-----' part and paste it in here",
      )}
    </Text>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef2,
    tooltip: tooltip2,
    tooltipVisible: tooltipVisible2,
  } = useTooltip(<TooltipComponent2 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="48px">
        <Breadcrumbs>
          <Link href="/">{t('Home')}</Link>
          <Link href="/ssi">{t('SSI')}</Link>
          <Text>{t('Create Keys')}</Text>
        </Breadcrumbs>
      </Box>
      <Layout>
        <Box>
          <Card>
            <CardHeader>
              <Heading as="h3" scale="md">
                {t('Input your keys')}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box mb="24px">
                <SecondaryLabel>{t('Entry Your Profile ID')}</SecondaryLabel>
                <Input
                  id="profileId"
                  name="profileId"
                  value={state.profileId}
                  scale="lg"
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef}>
                  <SecondaryLabel>{t('Entry Private Key of length 2048 or above')}</SecondaryLabel>
                  {tooltipVisible && tooltip}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Input
                  id="privateKey"
                  name="privateKey"
                  value={state.privateKey}
                  scale="lg"
                  onChange={handleChange}
                  placeholder={t('strip away -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY-----')}
                  required
                />
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef2}>
                  <SecondaryLabel>{t('Enter Public Key of length 2048 or above')}</SecondaryLabel>
                  {tooltipVisible2 && tooltip2}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Input
                  id="publicKey"
                  name="publicKey"
                  value={state.publicKey}
                  scale="lg"
                  onChange={handleChange}
                  placeholder={t('strip away -----BEGIN PUBLIC KEY----- and -----END PUBLIC KEY-----')}
                  required
                />
              </Box>
              <Flex alignItems="center" mb="8px">
                <Text color="textSubtle" mr="16px">
                  {t('Key Generator')}
                </Text>
                <LinkExternal href="https://cryptotools.net/rsagen">{t('Generate Keys Here')}</LinkExternal>
              </Flex>
              {account ? (
                <>
                  <Button
                    type="submit"
                    width="100%"
                    isLoading={isLoading}
                    onClick={handleCreateKeys}
                    endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                    mb="16px"
                  >
                    {t('Create')}
                  </Button>
                </>
              ) : (
                <ConnectWalletButton width="100%" type="button" />
              )}
            </CardBody>
          </Card>
        </Box>
      </Layout>
      <DatePickerPortal />
    </Container>
  )
}

export default CreateKeys
