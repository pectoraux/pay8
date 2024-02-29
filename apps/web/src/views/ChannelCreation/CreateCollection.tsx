import { useRouter } from 'next/router'
import { ChangeEvent, useState, useCallback } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Input as UIKitInput,
  Flex,
  Heading,
  Text,
  Button,
  AutoRenewIcon,
  useToast,
  ButtonMenu,
  ButtonMenuItem,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { OptionType } from 'views/CanCan/market/components/BuySellModals/SellModal/types'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketCollectionsContract } from 'hooks/useContract'
import BigNumber from 'bignumber.js'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useCurrency } from 'hooks/Tokens'
import { DEFAULT_TFIAT } from 'config/constants/exchange'

import Filters from './Filters'
import NextStepButton from './NextStepButton'

const InputWrap = styled.div`
  position: relative;
  max-width: 240px;
  margin-bottom: 20px;
`

const Input = styled(UIKitInput)`
  padding-right: 40px;
`
const Team: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const marketCollectionsContract = useMarketCollectionsContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [nftFilters, setNftFilters] = useState<any>({})
  const [state, setState] = useState<any>(() => ({
    collection: '',
    referrerFee: '',
    name: '',
    badgeId: '',
    recurringBounty: '',
    identityTokenId: '0',
    requestUserRegistration: 0,
    requestPartnerRegistration: 0,
    auditors: [],
    addAuditors: 1,
    token: '',
    fromNote: 1,
    tokenId: '',
    amount: '',
    userAmount: '',
    cashbackFund: 1,
    start: '',
    end: '',
    avatar: '',
    ABMax: '',
    ABDeadline: '',
    description: '',
    large: '',
    small: '',
    contactChannels: '',
    contacts: '',
  }))
  const updateValue = (key: any, value: string | OptionType[] | boolean | number | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }
  const handleRawValueChange = (key: string) => (value: boolean) => {
    updateValue(key, value)
  }

  const handleCreateCollection = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const minBounty = getDecimalAmount(new BigNumber(state.amount), 18)
      const userMinBounty = getDecimalAmount(new BigNumber(state.userAmount), 18)
      const args = [
        state.referrerFee,
        state.badgeId,
        minBounty.toString(),
        userMinBounty.toString(),
        state.recurringBounty,
        state.identityTokenId,
        currency?.address,
        !!state.requestUserRegistration,
        !!state.requestPartnerRegistration,
      ]
      const args2 = [
        state.name,
        state.description,
        state.large,
        state.small,
        state.avatar,
        state.contactChannels,
        state.contacts,
        nftFilters?.workspace?.toString(), // reduce((accum, attr) => ([...accum, attr]),[],),
        nftFilters?.country?.toString(), // reduce((accum, attr) => ([...accum, attr]),[],),
        nftFilters?.city?.toString(), // reduce((accum, attr) => ([...accum, attr]),[],),
        nftFilters?.product?.toString(), // reduce((accum, attr) => ([...accum, attr]),[],),
      ]
      console.log('add==========>', marketCollectionsContract, args)
      console.log('update====================>', args2)
      return callWithGasPrice(marketCollectionsContract, 'addCollection', args)
        .then(() => {
          return callWithGasPrice(marketCollectionsContract, 'updateCollection', args2)
        })
        .catch((err) => {
          console.log('channel====================>', err)
        })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Channel Created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start listing your products either on CanCan or the NFT marketplace')}
        </ToastDescriptionWithTx>,
      )
      setIsDone(true)
    }
  }, [
    fetchWithCatchTxError,
    state.amount,
    state.userAmount,
    state.referrerFee,
    state.badgeId,
    state.recurringBounty,
    state.identityTokenId,
    state.requestUserRegistration,
    state.requestPartnerRegistration,
    state.name,
    state.description,
    state.large,
    state.small,
    state.avatar,
    state.contactChannels,
    state.contacts,
    nftFilters?.workspace,
    nftFilters?.country,
    nftFilters?.city,
    nftFilters?.product,
    marketCollectionsContract,
    callWithGasPrice,
    toastSuccess,
    t,
  ])

  const TooltipComponent = () => <Text>{t('This updates the name of your channel.')}</Text>
  const TooltipComponent2 = () => <Text>{t('This updates the description of your channel.')}</Text>
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Use this field to add contacts to your channel. If for instance you want to add both your Paychat account and telephone, you would input in this field: paychat, telephone.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This field works with the previous one to set your contact. If for instance you want to add both your Paychat account and telephone, you would input in the field above: paychat, telephone and in the current field, you would input the actual contacts such as: ali@gmail.com,+250555666897.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'This sets a lower bound on the percentage you would like channels that partner with yours to give you on sales they make through your channel',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'You can use badges to create brand trust. They are delivered by auditors (that you can find on page Earn > Auditors) to certify specific aspects of your business',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This sets a lower bound on the bounty balance you require anyone that partners with your channel to have. If you do not have any requirements in that regard, just input 0',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        'This sets a lower bound on the bounty balance you require anyone that registers with your channel to have. If you do not have any requirements in that regard, just input 0',
      )}
    </Text>
  )
  const TooltipComponent9 = () => (
    <Text>
      {t(
        "Recurring bounties are bounties that see their balances appreciate every time the product they are attached to is purchased. Each time a purchase occurs, the recurring percentage of the item's price, which is the value specified in this field, is taken and added to the balance of the attached bounty. This way, the more sales you do, the higher your bounty and the more you stand to lose if you commit any fraud. Recurring bounties are a great way to create trust with your customers and this field sets the recurring bounty percentage on all products you will list on your channel.",
      )}
    </Text>
  )
  const TooltipComponent10 = () => (
    <Text>
      {t('This sets the currency of the referrer fee, minimum partner/user bounty that you set in the previous fields')}
    </Text>
  )
  const TooltipComponent11 = () => (
    <Text>
      {t(
        'This sets a link to your large banner which is the one that appears on the main page of your channel. The recommended size of this image is 1500x1500 pixels',
      )}
    </Text>
  )
  const TooltipComponent12 = () => (
    <Text>
      {t(
        'This sets a link to your small banner which is the one that appears on the CanCan or eCollectibles main page. The recommended size of this image is 1500x1500 pixels',
      )}
    </Text>
  )
  const TooltipComponent13 = () => (
    <Text>{t('This sets a link to your channel avatar. The recommended size of this image is 700x700 pixels')}</Text>
  )
  const TooltipComponent14 = () => (
    <Text>{t('This sets whether user registrations to your channel should be permissionless or permissioned.')}</Text>
  )
  const TooltipComponent15 = () => (
    <Text>
      {t('This sets whether channel partnerships with your channel should be permissionless or permissioned.')}
    </Text>
  )
  const TooltipComponent16 = () => (
    <Text>
      {t(
        'Use these to attach location tags to your channels in order to help users of the platform find your channel faster through location filters.',
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
  const {
    targetRef: targetRef7,
    tooltip: tooltip7,
    tooltipVisible: tooltipVisible7,
  } = useTooltip(<TooltipComponent7 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef8,
    tooltip: tooltip8,
    tooltipVisible: tooltipVisible8,
  } = useTooltip(<TooltipComponent8 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef9,
    tooltip: tooltip9,
    tooltipVisible: tooltipVisible9,
  } = useTooltip(<TooltipComponent9 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef10,
    tooltip: tooltip10,
    tooltipVisible: tooltipVisible10,
  } = useTooltip(<TooltipComponent10 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef11,
    tooltip: tooltip11,
    tooltipVisible: tooltipVisible11,
  } = useTooltip(<TooltipComponent11 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef12,
    tooltip: tooltip12,
    tooltipVisible: tooltipVisible12,
  } = useTooltip(<TooltipComponent12 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef13,
    tooltip: tooltip13,
    tooltipVisible: tooltipVisible13,
  } = useTooltip(<TooltipComponent13 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef14,
    tooltip: tooltip14,
    tooltipVisible: tooltipVisible14,
  } = useTooltip(<TooltipComponent14 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef15,
    tooltip: tooltip15,
    tooltipVisible: tooltipVisible15,
  } = useTooltip(<TooltipComponent15 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef16,
    tooltip: tooltip16,
    tooltipVisible: tooltipVisible16,
  } = useTooltip(<TooltipComponent16 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState<any>(inputCurency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step 4')}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Create a Channel')}
      </Heading>
      <Text as="p" mb="24px">
        {t('Your channel can be used to list products for sale in CanCan or in the NFT marketplace!')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Flex flexDirection="row">
              <Flex flexDirection="column" mr="10px">
                <InputWrap>
                  <Flex ref={targetRef}>
                    <Input
                      name="name"
                      onChange={handleChange}
                      placeholder={t('input channel name')}
                      value={state.name}
                    />
                    {tooltipVisible && tooltip}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <InputWrap>
                  <Flex ref={targetRef2}>
                    <Input
                      onChange={handleChange}
                      name="description"
                      placeholder={t('input description')}
                      value={state.description}
                    />
                    {tooltipVisible2 && tooltip2}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <InputWrap>
                  <Flex ref={targetRef3}>
                    <Input
                      onChange={handleChange}
                      name="contactChannels"
                      placeholder={t('input contact channels')}
                      value={state.contactChannels}
                    />
                    {tooltipVisible3 && tooltip3}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <InputWrap>
                  <Flex ref={targetRef4}>
                    <Input
                      onChange={handleChange}
                      name="contacts"
                      placeholder={t('input contacts')}
                      value={state.contacts}
                    />
                    {tooltipVisible4 && tooltip4}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <InputWrap>
                  <Flex ref={targetRef5}>
                    <Input
                      name="referrerFee"
                      onChange={handleChange}
                      placeholder={t('input referrer fee')}
                      value={state.referrerFee}
                    />
                    {tooltipVisible5 && tooltip5}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <InputWrap>
                  <Flex ref={targetRef6}>
                    <Input name="badgeId" onChange={handleChange} placeholder={t('badge id')} value={state.badgeId} />
                    {tooltipVisible6 && tooltip6}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <InputWrap>
                  <Flex ref={targetRef7}>
                    <Input
                      onChange={handleChange}
                      name="amount"
                      placeholder={t('partner minimum bounty')}
                      value={state.amount}
                    />
                    {tooltipVisible7 && tooltip7}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <InputWrap>
                  <Flex ref={targetRef8}>
                    <Input
                      onChange={handleChange}
                      name="userAmount"
                      placeholder={t('input user minimum bounty')}
                      value={state.userAmount}
                    />
                    {tooltipVisible8 && tooltip8}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
              </Flex>
              <Flex flexDirection="column">
                <InputWrap>
                  <Flex ref={targetRef9}>
                    <Input
                      onChange={handleChange}
                      name="recurringBounty"
                      placeholder={t('recurring bounty percent')}
                      value={state.recurringBounty}
                    />
                    {tooltipVisible9 && tooltip9}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                {/* <InputWrap>
                  <Flex ref={targetRef9}>
                    <Input
                      onChange={handleChange}
                      name="identityTokenId"
                      placeholder={t('input identity token id')}
                      value={state.identityTokenId}
                    />
                    {tooltipVisible9 && tooltip9}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap> */}
                <InputWrap>
                  <Flex ref={targetRef11}>
                    <Input
                      onChange={handleChange}
                      name="large"
                      placeholder={t('large banner(1500x500)')}
                      value={state.large}
                    />
                    {tooltipVisible11 && tooltip11}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <InputWrap>
                  <Flex ref={targetRef12}>
                    <Input
                      onChange={handleChange}
                      name="small"
                      placeholder={t('small banner(1500x500)')}
                      value={state.small}
                    />
                    {tooltipVisible12 && tooltip12}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <InputWrap>
                  <Flex ref={targetRef13}>
                    <Input
                      onChange={handleChange}
                      name="avatar"
                      placeholder={t('avatar(700x700)')}
                      value={state.avatar}
                    />
                    {tooltipVisible13 && tooltip13}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <StyledItemRow>
                  <InputWrap>
                    <Flex ref={targetRef14} paddingRight="50px">
                      <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" bold>
                        {t('User Permission Required')}
                      </Text>
                      {tooltipVisible14 && tooltip14}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
                    <ButtonMenu
                      scale="sm"
                      variant="subtle"
                      activeIndex={state.requestUserRegistration}
                      onItemClick={handleRawValueChange('requestUserRegistration')}
                    >
                      <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                    </ButtonMenu>
                  </InputWrap>
                  <InputWrap>
                    <Flex ref={targetRef15} paddingRight="50px">
                      <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="13px" bold>
                        {t('Partner Permission Required')}
                      </Text>
                      {tooltipVisible15 && tooltip15}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
                    <ButtonMenu
                      scale="sm"
                      variant="subtle"
                      activeIndex={state.requestPartnerRegistration}
                      onItemClick={handleRawValueChange('requestPartnerRegistration')}
                    >
                      <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                    </ButtonMenu>
                  </InputWrap>
                </StyledItemRow>
                <InputWrap>
                  <Flex ref={targetRef10}>
                    <CurrencyInputPanel
                      id="base-token"
                      showUSDPrice
                      showMaxButton
                      showCommonBases
                      showInput={false}
                      showQuickInputButton
                      currency={currency ?? inputCurency}
                      onCurrencySelect={handleInputSelect}
                    />
                    {tooltipVisible10 && tooltip10}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                </InputWrap>
                <Flex ref={targetRef16}>
                  <Filters nftFilters={nftFilters} setNftFilters={setNftFilters} />
                  {tooltipVisible16 && tooltip16}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
              </Flex>
            </Flex>
            <Button
              disabled={isDone}
              onClick={handleCreateCollection}
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              // id="approveStarterCollectible"
            >
              {t('Create Channel')}
            </Button>
          </Flex>
        </CardBody>
      </Card>
      <NextStepButton onClick={() => router.push('/cancan')} disabled={!isDone}>
        {t('Go to CanCan')}
      </NextStepButton>
    </>
  )
}

export default Team
