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
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import useSWR from 'swr'
import { useWeb3React } from '@pancakeswap/wagmi'
import times from 'lodash/times'
import { ChangeEvent, useEffect, useCallback, useState } from 'react'
import { useInitialBlock } from 'state/block/hooks'

import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import Link from 'next/link'
import { getBlockExploreLink } from 'utils'
import { DatePicker, DatePickerPortal, TimePicker } from 'views/Voting/components/DatePicker'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useSSIContract } from 'hooks/useContract'
import EncryptRsa from 'encrypt-rsa'
import { getSSIDatum } from 'state/ssi/helpers'
import Choices, { Choice, makeChoice, MINIMUM_CHOICES } from './Choices'
import { combineDateAndTime, getFormErrors } from './helpers'
import { FormErrors, Label, SecondaryLabel } from './styles'
import Layout from '../components/Layout'

const CreateProposal = () => {
  const [state, setState] = useState<any>(() => ({
    dataType: null,
    name: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    profileId: '',
    auditorProfileId: '',
    searchable: false,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const ssiContract = useSSIContract()
  const { toastSuccess } = useToast()
  const { data } = useSWR(['profile-data', state.profileId], async () => getSSIDatum(state.profileId))
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { name, choices } = state
  const formErrors = getFormErrors(state, t)
  const crypto = require('crypto')

  const handleCreateData = useCallback(async () => {
    console.log('datadata===========================>', data)
    try {
      setIsLoading(true)
      // eslint-disable-next-line consistent-return
      const receipt = await fetchWithCatchTxError(async () => {
        const encryptRsa = new EncryptRsa()
        console.log('1public===================>', encryptRsa, choices)
        const questions = state.choices.filter((choice, index) => {
          return index % 2 === 0 ? choice.value : false
        })
        state.choices
          .filter((choice, index) => {
            return index % 2 !== 0 ? choice.value : false
          })
          .map((choice, index) => {
            const pk = `-----BEGIN PUBLIC KEY-----${data.publicKey?.replace(/\s/g, '')}-----END PUBLIC KEY-----`
            console.log('1pk===================>', pk)
            const encryptedAnswer =
              choice.value && questions[index].value.toLowerCase() === 'ssid'
                ? crypto.createHash('sha1').update(choice.value).digest('hex')
                : choice.value
                ? encryptRsa.encryptStringWithRsaPublicKey({
                    text: choice.value,
                    publicKey: pk,
                  })
                : ''
            console.log('2public===================>', data?.publicKey, [
              state.profileId,
              state.auditorProfileId,
              state.name,
              account,
              combineDateAndTime(state.startDate, state.startTime)?.toString(),
              combineDateAndTime(state.endDate, state.endTime)?.toString(),
              state.searchable,
              questions[index].value.toLowerCase(),
              state.searchable ? choice.value : encryptedAnswer,
              state.dataType,
            ])
            return callWithGasPrice(ssiContract, 'createData', [
              state.profileId,
              state.auditorProfileId,
              state.name,
              account,
              combineDateAndTime(state.startDate, state.startTime)?.toString(),
              combineDateAndTime(state.endDate, state.endTime)?.toString(),
              state.searchable,
              questions[index].value.toLowerCase(),
              state.searchable ? choice.value : encryptedAnswer,
              state.dataType,
            ]).catch((err) => console.log('rerr1====================>', choice, err))
          })
      })
      if (receipt?.status) {
        setIsLoading(false)
        toastSuccess(
          t('Data Created'),
          <ToastDescriptionWithTx txHash={receipt?.transactionHash || ''}>
            {t('You can now start sharing this data with different services/users')}
          </ToastDescriptionWithTx>,
        )
      }
    } catch (err) {
      console.log('try err====================>', err)
    } finally {
      setIsLoading(false)
    }
  }, [t, data, state, choices, account, ssiContract, toastSuccess, callWithGasPrice, fetchWithCatchTxError])

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

  const handleChoiceChange = (newChoices: Choice[]) => {
    updateValue('choices', newChoices)
  }

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value)
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
    <Text>{t('This set the wallet address of the user you are creating the data for')}</Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This is the type of data you are creating, pick the category to which it belongs the most. If does not fit any category, just pick the option Other',
      )}
    </Text>
  )
  const TooltipComponent3 = () => <Text>{t('This sets the profile id of the user you are creating the data for')}</Text>
  const TooltipComponent4 = () => <Text>{t('This sets your own profile id as the auditor of that user')}</Text>
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'This sets the date from which this data is valid, use the field below to set a time in that day from which this data is valid',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This sets the date after which this data becomes invalid, use the field below to set a time in that day after which this data becomes invalid',
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
  const {
    targetRef: targetRef3,
    tooltip: tooltip3,
    tooltipVisible: tooltipVisible3,
  } = useTooltip(<TooltipComponent3 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef4,
    tooltip: tooltip4,
    tooltipVisible: tooltipVisible4,
  } = useTooltip(<TooltipComponent4 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef5,
    tooltip: tooltip5,
    tooltipVisible: tooltipVisible5,
  } = useTooltip(<TooltipComponent5 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef6,
    tooltip: tooltip6,
    tooltipVisible: tooltipVisible6,
  } = useTooltip(<TooltipComponent6 />, {
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
          <Box mb="24px">
            <Flex ref={targetRef}>
              <Label htmlFor="name">{t('Owner Wallet Address')}</Label>
              {tooltipVisible && tooltip}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input id="name" name="name" value={name} scale="lg" onChange={handleChange} required />
            {formErrors.name && fieldsState.name && <FormErrors errors={formErrors.name} />}
          </Box>
          <Choices choices={choices} onChange={handleChoiceChange} />
          {formErrors.choices && fieldsState.choices && <FormErrors errors={formErrors.choices} />}
        </Box>
        <Box>
          <Card>
            <CardHeader>
              <Heading as="h3" scale="md">
                {t('Actions')}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box mb="24px">
                <Flex ref={targetRef2}>
                  <SecondaryLabel>{t('Entry Type')}</SecondaryLabel>
                  {tooltipVisible2 && tooltip2}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Select
                  // name="dataType"
                  options={[
                    {
                      label: t('Others'),
                      value: t('others'),
                    },
                    {
                      label: t('General'),
                      value: t('general'),
                    },
                    {
                      label: t('HealthCare'),
                      value: t('healthcare'),
                    },
                    {
                      label: t('Education'),
                      value: t('education'),
                    },
                    {
                      label: t('Professional'),
                      value: t('professional'),
                    },
                    {
                      label: t('Properties'),
                      value: t('properties'),
                    },
                  ]}
                  onOptionChange={(val) => {
                    handleTypeChange(val.value)
                  }}
                />
                {formErrors.dataType && fieldsState.dataType && <FormErrors errors={formErrors.dataType} />}
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef3}>
                  <SecondaryLabel>{t("Entry Owner's Profile ID")}</SecondaryLabel>
                  {tooltipVisible3 && tooltip3}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Input
                  id="profileId"
                  name="profileId"
                  value={state.profileId}
                  scale="lg"
                  onChange={handleChange}
                  required
                />
                {formErrors.profileId && fieldsState.profileId && <FormErrors errors={formErrors.profileId} />}
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef4}>
                  <SecondaryLabel>{t("Entry Auditor's Profile ID")}</SecondaryLabel>
                  {tooltipVisible4 && tooltip4}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Input
                  id="auditorProfileId"
                  name="auditorProfileId"
                  value={state.auditorProfileId}
                  scale="lg"
                  onChange={handleChange}
                  required
                />
                {formErrors.auditorProfileId && fieldsState.auditorProfileId && (
                  <FormErrors errors={formErrors.auditorProfileId} />
                )}
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef5}>
                  <SecondaryLabel>{t('Start Date')}</SecondaryLabel>
                  {tooltipVisible5 && tooltip5}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <DatePicker
                  name="startDate"
                  onChange={handleDateChange('startDate')}
                  selected={state.startDate}
                  placeholderText="YYYY/MM/DD"
                />
                {formErrors.startDate && fieldsState.startDate && <FormErrors errors={formErrors.startDate} />}
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('Start Time')}</SecondaryLabel>
                <TimePicker
                  name="startTime"
                  onChange={handleDateChange('startTime')}
                  selected={state.startTime}
                  placeholderText="00:00"
                />
                {formErrors.startTime && fieldsState.startTime && <FormErrors errors={formErrors.startTime} />}
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef6}>
                  <SecondaryLabel>{t('End Date')}</SecondaryLabel>
                  {tooltipVisible6 && tooltip6}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <DatePicker
                  name="endDate"
                  onChange={handleDateChange('endDate')}
                  selected={state.endDate}
                  placeholderText="YYYY/MM/DD"
                />
                {formErrors.endDate && fieldsState.endDate && <FormErrors errors={formErrors.endDate} />}
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('End Time')}</SecondaryLabel>
                <TimePicker
                  name="endTime"
                  onChange={handleDateChange('endTime')}
                  selected={state.endTime}
                  placeholderText="00:00"
                />
                {formErrors.endTime && fieldsState.endTime && <FormErrors errors={formErrors.endTime} />}
              </Box>
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
                  <Button
                    type="submit"
                    width="100%"
                    isLoading={isLoading}
                    onClick={handleCreateData}
                    endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                    mb="16px"
                  >
                    {t('Publish')}
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

export default CreateProposal
