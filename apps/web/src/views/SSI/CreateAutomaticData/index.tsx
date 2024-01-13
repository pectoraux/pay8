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
  Input,
  LinkExternal,
  Text,
  Select,
  useToast,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import uniqueId from 'lodash/uniqueId'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ChangeEvent, useEffect, useState, useCallback, useMemo } from 'react'
import { useInitialBlock } from 'state/block/hooks'

import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import Link from 'next/link'
import { getBlockExploreLink } from 'utils'
import { DatePickerPortal } from 'views/Voting/components/DatePicker'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useRouter } from 'next/router'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useMarketEventsContract } from 'hooks/useContract'
import EncryptRsa from 'encrypt-rsa'
import axios from 'axios'
import { useProfileFromSSI } from 'state/ssi/hooks'
import { addYears } from 'date-fns'
import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { fantomTestnet } from 'viem/chains'
import { getProfileAddress, getSSIAddress } from 'utils/addressHelpers'
import { profileABI } from 'config/abi/profile'
import { ssiABI } from 'config/abi/ssi'
import ProgressSteps from 'views/Nft/market/components/ProgressSteps'
import { SecondaryLabel } from './styles'
import Layout from '../components/Layout'

const CreateProposal = () => {
  const [state, setState] = useState<any>(() => ({
    dataType: null,
    name: '',
    code: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    profileId: '',
    auditorProfileId: '',
    searchable: false,
  }))
  const { query } = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [codeSent, setCodeSent] = useState('')
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const { callWithGasPrice } = useCallWithGasPrice()
  const marketEventsContract = useMarketEventsContract()
  const { toastSuccess, toastError } = useToast()
  const { profile: payswapProfile } = useProfileFromSSI(`0x${process.env.NEXT_PUBLIC_PAYSWAP_ADDRESS}`)
  const { profile: userProfile } = useProfileFromSSI(account)
  const profile = userProfile?.profile ?? payswapProfile
  // const profile = payswapProfile
  const randomCode = useMemo(() => uniqueId(Date.now()?.toString()), [])
  const acct = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PAYSWAP_SIGNER}`)
  const client = createPublicClient({
    chain: fantomTestnet,
    transport: http(),
  })
  const walletClient = createWalletClient({
    chain: fantomTestnet,
    transport: custom(window.ethereum),
  })

  console.log(
    'randomCode==============>',
    // randomCode,
    profile,
    payswapProfile,
    // userProfile,
    // process.env.NEXT_PUBLIC_PAYSWAP_ADDRESS,
  )
  const handleSubmit = async () => {
    setIsLoading(true)
    const messageHtml = `
      # Payswap SSI

      This is your verification code ${randomCode}
      
      _Thanks for using Payswap_
      `
    const { data: emailRes } = await axios.post('/api/email', {
      messageHtml,
      email: state.name,
    })
    if (!emailRes.err) {
      setIsLoading(false)
      toastSuccess(
        t('Code Sent to your email address'),
        <ToastDescriptionWithTx>
          {t('Enter the code sent to your email below and then publish your email')}
        </ToastDescriptionWithTx>,
      )
      setCodeSent(randomCode)
    } else {
      setIsLoading(false)
      toastError(
        t('Failed to send code'),
        <ToastDescriptionWithTx>{t('Make sure your email is correct')}</ToastDescriptionWithTx>,
      )
    }
  }

  // eslint-disable-next-line consistent-return
  const handleCreateData = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log('public===================>', account, client, acct)
      const { request } = await client.simulateContract({
        account: acct,
        address: getProfileAddress(),
        abi: profileABI,
        functionName: 'shareEmail',
        args: [account],
      })
      if (parseInt(query.collectionId?.toString())) {
        const args = [12, query.collectionId, '', '', 0, 0, ADDRESS_ZERO, '']
        console.log('FOLLOW===================>', args)
        await callWithGasPrice(marketEventsContract, 'emitUpdateMiscellaneous', args)
      }
      return walletClient
        .writeContract(request)
        .then((res) => {
          setIsLoading(false)
          setIsShared(true)
          toastSuccess(
            t('Email successfully shared'),
            <ToastDescriptionWithTx txHash={res}>
              {t('Your email data has been created and shared with PaySwap.')}
            </ToastDescriptionWithTx>,
          )
        })
        .catch((err) => console.log('rerr2=================>', err, client))
    } catch (err) {
      setIsLoading(false)
      console.log('try err====================>', err)
    }
  }, [account, client, acct, walletClient, toastSuccess, t])

  // eslint-disable-next-line consistent-return
  const handleCreateData2 = useCallback(async () => {
    try {
      setIsLoading2(true)
      const encryptRsa = new EncryptRsa()
      const pk = `-----BEGIN PUBLIC KEY-----${profile?.publicKey?.replace(/\s/g, '')}-----END PUBLIC KEY-----`
      const encryptedAnswer = state.name
        ? encryptRsa.encryptStringWithRsaPublicKey({
            text: state.name,
            publicKey: pk,
          })
        : ''
      const nextYear = addYears(new Date(), 1)
      const args = [
        profile?.id,
        payswapProfile?.id,
        account,
        `0x${process.env.NEXT_PUBLIC_PAYSWAP_ADDRESS}`,
        BigInt(parseInt((Date.now() / 1000).toString())),
        BigInt(parseInt((nextYear.getTime() / 1000).toString())),
        false,
        'email',
        encryptedAnswer,
        'general',
      ]
      console.log('public===================>', args, account, client, acct)
      const { request } = await client.simulateContract({
        account: acct,
        address: getSSIAddress(),
        abi: ssiABI,
        functionName: 'createData',
        args: [
          profile?.id,
          payswapProfile?.id,
          account,
          `0x${process.env.NEXT_PUBLIC_PAYSWAP_ADDRESS}`,
          BigInt(parseInt((Date.now() / 1000).toString())),
          BigInt(parseInt((nextYear.getDate() / 1000).toString())),
          false,
          'email',
          encryptedAnswer,
          'general',
        ],
      })
      return walletClient
        .writeContract(request)
        .then((res) => {
          setIsLoading2(false)
          setIsPublished(true)
          toastSuccess(
            t('Data successfully published'),
            <ToastDescriptionWithTx txHash={res}>
              {t('Your email data has been created and can now be shared with others.')}
            </ToastDescriptionWithTx>,
          )
        })
        .catch((err) => console.log('rerr2=================>', err, client))
    } catch (err) {
      setIsLoading2(false)
      console.log('try err====================>', err)
    }
  }, [
    profile?.publicKey,
    profile?.id,
    state.name,
    payswapProfile?.id,
    account,
    client,
    acct,
    walletClient,
    toastSuccess,
    t,
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

  const handleTypeChange = (dataType_: string) => {
    updateValue('dataType', dataType_)
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
        'Use this to create your email data which is necessary to create a channel or to register/partner with existing channels. This form will send a code to your email inbox. Copy and paste the code in the corresponding field on this page (the field will show up once the email is sent to your inbox).',
      )}
    </Text>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
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
          <Text>{t('Make an Entry')}</Text>
        </Breadcrumbs>
      </Box>
      <Layout>
        <Box>
          <Card>
            <CardHeader>
              <Heading as="h3" scale="md">
                {t('Actions')}
              </Heading>
            </CardHeader>
            <CardBody>
              {!codeSent ? (
                <>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Entry Type')}</SecondaryLabel>
                    <Select
                      // name="dataType"
                      options={[
                        {
                          label: t('Email'),
                          value: t('email'),
                        },
                        // {
                        //   label: t('Phone Number'),
                        //   value: t('phone'),
                        // },
                      ]}
                      onOptionChange={(val) => {
                        handleTypeChange(val.value)
                      }}
                    />
                  </Box>
                  <Box mb="24px">
                    <Flex ref={targetRef}>
                      <SecondaryLabel>{t('Email')}</SecondaryLabel>
                      {tooltipVisible && tooltip}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
                    <Input id="name" name="name" value={state.name} scale="lg" onChange={handleChange} required />
                  </Box>
                </>
              ) : (
                <Box mb="24px">
                  <SecondaryLabel>{t('Code')}</SecondaryLabel>
                  <Input id="code" name="code" value={state.code} scale="lg" onChange={handleChange} required />
                </Box>
              )}
              {account && (
                <Flex alignItems="center" mb="8px">
                  <Text color="textSubtle" mr="16px">
                    {t('Creator')}
                  </Text>
                  <LinkExternal href={getBlockExploreLink(account, 'address')}>{truncateHash(account)}</LinkExternal>
                </Flex>
              )}
              {account ? (
                <>
                  {!codeSent ? (
                    <Button
                      type="submit"
                      width="100%"
                      isLoading={isLoading}
                      onClick={handleSubmit}
                      endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                      disabled={(!state.name && !codeSent) || (codeSent && state.code !== codeSent)}
                      mb="16px"
                    >
                      {t('Send')}
                    </Button>
                  ) : (
                    <Flex flexDirection="row">
                      <ProgressSteps steps={[isShared]} />
                      <Flex flexDirection="column" width="100%" px="16px" pb="16px">
                        <Button
                          type="submit"
                          width="100%"
                          mr="10px"
                          isLoading={isLoading}
                          onClick={handleCreateData}
                          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                          disabled={(!state.name && !codeSent) || (codeSent && state.code !== codeSent)}
                          mb="16px"
                        >
                          {t('Share Email')}
                        </Button>
                        <Button
                          type="submit"
                          width="100%"
                          isLoading={isLoading2}
                          onClick={handleCreateData2}
                          endIcon={isLoading2 ? <AutoRenewIcon spin color="currentColor" /> : null}
                          disabled={(!state.name && !codeSent) || (codeSent && state.code !== codeSent)}
                          mb="16px"
                        >
                          {t('Publish Email')}
                        </Button>
                      </Flex>
                    </Flex>
                  )}
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

export default CreateProposal
