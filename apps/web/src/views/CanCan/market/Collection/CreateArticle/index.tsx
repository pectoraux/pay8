import {
  ChevronLeftIcon,
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
  useModal,
  ButtonMenu,
  ButtonMenuItem,
  Slider,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetCollection } from 'state/cancan/hooks'
import times from 'lodash/times'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useInitialBlock } from 'state/block/hooks'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'

import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getBlockExploreLink } from 'utils'
import RichTextEditor from 'components/RichText'
import { DatePicker, DatePickerPortal } from 'views/ValuePoolVoting/components/DatePicker'
import CurrencyInputPanel from 'components/CurrencyInputPanel'

import { makeChoice, MINIMUM_CHOICES } from './Choices'
import { getFormErrors } from './helpers'
import ShipStage from '../../components/BuySellModals/SellModal/ShipStage'
import Filters from '../../components/BuySellModals/SellModal/Filters'
import Options from '../../components/BuySellModals/SellModal/Options'
import { FormErrors, Label, SecondaryLabel } from './styles'
import { useCurrency } from 'hooks/Tokens'
import { DEFAULT_TFIAT } from 'config/constants/exchange'

const Layout = styled.div`
  align-items: start;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: minmax(0, 1fr);

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr 332px;
  }
`

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const CreateProposal = () => {
  const [state, setState] = useState<any>(() => ({
    name: '',
    body: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
    mediaLink: '',
    original: '',
    thumbnail: '',
    tokenId: '',
    description: '',
    start: '0',
    period: '0',
    prices: '',
    customTags: '',
    maxSupply: '',
    currentAskPrice: '',
    options: [],
    isTradable: 1,
    advanced: 0,
    dropinDate: '',
    bidDuration: '',
    minBidIncrementPercentage: '0',
    rsrcTokenId: '',
    requireUpfrontPayment: 1,
    transferrable: 1,
    usetFIAT: 0,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const collectionAddress = useRouter().query.collectionAddress as string
  const { collection } = useGetCollection(collectionAddress)
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const formErrors = getFormErrors(state, t)
  const [nftFilters, setNftFilters] = useState<any>({})
  const [nftFilters2, setNftFilters2] = useState<any>({})
  const inputCurency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(inputCurency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])
  const [onPresentShip] = useModal(
    <ShipStage
      variant="article"
      collection={collection}
      currency={currency}
      articleState={state}
      workspace={nftFilters2?.workspace}
      articleFilters={nftFilters}
    />,
  )

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

  const handleRawValueChange = (key: any) => (value: number) => {
    updateValue(key, value)
  }

  const handleEasyMdeChange = (value: string) => {
    updateValue('original', value)
  }

  const handleChoiceChange = (newChoices: any[]) => {
    updateValue('options', newChoices)
  }

  const options = useMemo(() => {
    return {
      hideIcons: account ? [] : ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [account])

  useEffect(() => {
    if (initialBlock > 0) {
      setState((prevState) => ({
        ...prevState,
        snapshot: initialBlock,
      }))
    }
  }, [initialBlock, setState])
  // const [value, onChange] = useState(original);

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="48px">
        <Breadcrumbs>
          <ChevronLeftIcon color="primary" width="24px" />
          <Link href={`/cancan/collections/${collectionAddress}`}>{t('Go Back')}</Link>
          <Text>{t('Create Article')}</Text>
        </Breadcrumbs>
      </Box>
      <Layout>
        <Box>
          <Box mb="24px">
            <Label htmlFor="original">{t('Article')}</Label>
            <RichTextEditor
              // name="original"
              value={state.original}
              onChange={handleEasyMdeChange}
              id="original"
            />
            {formErrors.original && fieldsState.original && <FormErrors errors={formErrors.original} />}
          </Box>
        </Box>
        <Box>
          <Card>
            <CardHeader>
              <Heading as="h3" scale="md">
                {t('Actions')}
              </Heading>
            </CardHeader>
            <CardBody>
              <Flex pl="25%">
                <Filters
                  nftFilters={nftFilters2}
                  setNftFilters={setNftFilters2}
                  showCountry={false}
                  showCity={false}
                  showProduct={false}
                />
              </Flex>
              <Box mb="24px">
                <SecondaryLabel>{t('Product Name')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="tokenId"
                  value={state.tokenId}
                  placeholder={t('input product name')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('Link to thumbnail')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="thumbnail"
                  value={state.thumbnail}
                  placeholder={t('input thumbnail link')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('Description')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="description"
                  value={state.description}
                  placeholder={t('input a description')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t("Click on each one of these to set your article's location data")}</SecondaryLabel>
                <Filters
                  collection={collection}
                  showWorkspace={false}
                  nftFilters={nftFilters}
                  setNftFilters={setNftFilters}
                />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('Not satisfied with above tags ? Add custom tags')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="customTags"
                  value={state.customTags}
                  placeholder={t('comma separated tags')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('Maximum Supply')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="maxSupply"
                  value={state.maxSupply}
                  placeholder={t('input maximum supply')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('Asking Price')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="currentAskPrice"
                  value={state.currentAskPrice}
                  placeholder={t('input item price')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('Add or remove options')}</SecondaryLabel>
                <Options name="options" choices={state.options} onChange={handleChoiceChange} />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('View advanced parameters?')}</SecondaryLabel>
                <StyledItemRow>
                  <ButtonMenu
                    scale="xs"
                    variant="subtle"
                    activeIndex={state.advanced}
                    onItemClick={handleRawValueChange('advanced')}
                  >
                    <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                  </ButtonMenu>
                </StyledItemRow>
              </Box>
              {state.advanced ? (
                <>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Pick drop-in date')}</SecondaryLabel>
                    <DatePicker
                      onChange={handleRawValueChange('dropinDate')}
                      selected={state.dropinDate}
                      placeholderText="YYYY/MM/DD"
                    />
                    <DatePickerPortal />
                  </Box>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Bid Duration (in minutes)')}</SecondaryLabel>
                    <Input
                      type="text"
                      scale="sm"
                      name="bidDuration"
                      value={state.bidDuration}
                      placeholder={t('input bid duration')}
                      onChange={handleChange}
                    />
                  </Box>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Min Bid Increment Percentage')}</SecondaryLabel>
                    <Slider
                      min={0}
                      max={100}
                      value={!state.minBidIncrementPercentage ? 0 : state.minBidIncrementPercentage}
                      name="minBidIncrementPercentage"
                      onValueChanged={handleRawValueChange('minBidIncrementPercentage')}
                      valueLabel={`${state.minBidIncrementPercentage}%`}
                      step={1}
                    />
                  </Box>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Auditor Badge ID')}</SecondaryLabel>
                    <Input
                      type="text"
                      scale="sm"
                      name="rsrcTokenId"
                      value={state.rsrcTokenId}
                      placeholder={t('input auditor badge id')}
                      onChange={handleChange}
                    />
                  </Box>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Make NFTickets Transferrable')}</SecondaryLabel>
                    <StyledItemRow>
                      <ButtonMenu
                        scale="xs"
                        variant="subtle"
                        activeIndex={state.transferrable}
                        onItemClick={handleRawValueChange('transferrable')}
                      >
                        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                      </ButtonMenu>
                    </StyledItemRow>
                  </Box>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Require Upfront Payment')}</SecondaryLabel>
                    <StyledItemRow>
                      <ButtonMenu
                        scale="xs"
                        variant="subtle"
                        activeIndex={state.requireUpfrontPayment}
                        onItemClick={handleRawValueChange('requireUpfrontPayment')}
                      >
                        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                      </ButtonMenu>
                    </StyledItemRow>
                  </Box>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Dynamic Prices')}</SecondaryLabel>
                    <Input
                      type="text"
                      scale="sm"
                      name="prices"
                      value={state.prices}
                      placeholder={t('input dynamic prices')}
                      onChange={handleChange}
                    />
                  </Box>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Dynamic pricing start and period')}</SecondaryLabel>
                    <StyledItemRow>
                      <Input
                        type="text"
                        scale="sm"
                        name="start"
                        value={state.start}
                        placeholder={t('input start')}
                        onChange={handleChange}
                      />
                      <span style={{ padding: '8px' }} />
                      <Input
                        type="text"
                        scale="sm"
                        name="period"
                        value={state.period}
                        placeholder={t('input period')}
                        onChange={handleChange}
                      />
                    </StyledItemRow>
                  </Box>
                  <Box mb="24px">
                    <SecondaryLabel>{t('Is the item tradable?')}</SecondaryLabel>
                    <StyledItemRow>
                      <ButtonMenu
                        scale="xs"
                        variant="subtle"
                        activeIndex={state.isTradable}
                        onItemClick={handleRawValueChange('isTradable')}
                      >
                        <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                        <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                      </ButtonMenu>
                    </StyledItemRow>
                  </Box>
                </>
              ) : null}
              <Box mb="24px">
                <SecondaryLabel>{t('Pick a FIAT token')}</SecondaryLabel>
                <CurrencyInputPanel
                  id="article-currency"
                  showUSDPrice
                  showMaxButton
                  showCommonBases
                  showInput={false}
                  showQuickInputButton
                  currency={currency ?? inputCurency}
                  onCurrencySelect={handleInputSelect}
                />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('Did you pick a FIAT token?')}</SecondaryLabel>
                <StyledItemRow>
                  <ButtonMenu
                    scale="xs"
                    variant="subtle"
                    activeIndex={state.usetFIAT}
                    onItemClick={handleRawValueChange('usetFIAT')}
                  >
                    <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                  </ButtonMenu>
                </StyledItemRow>
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
                <Button
                  type="submit"
                  disabled={!state.usetFIAT}
                  width="100%"
                  isLoading={isLoading}
                  onClick={onPresentShip}
                  mb="16px"
                >
                  {t('Publish')}
                </Button>
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
