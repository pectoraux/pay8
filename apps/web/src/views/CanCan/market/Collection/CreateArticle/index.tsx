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
  useTooltip,
  HelpIcon,
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
  const TooltipComponentt = () => (
    <Text>
      {t(
        "This will be your product's name in the marketplace, your product id will be the same but with the spaces replaced with a dash -.",
      )}
    </Text>
  )
  const TooltipComponentt2 = () => (
    <Text>
      {t('This is where you write your article. You can include embed videos/images/code/etc inside your article.')}
    </Text>
  )
  const TooltipComponentt4 = () => (
    <Text>{t('A good example for dimensions is 640 x 640 pixels for your image to appear perfectly.')}</Text>
  )
  const TooltipComponentt6 = () => <Text>{t('Use this field to provide a summary description of your product.')}</Text>
  const TooltipComponentt7 = () => (
    <Text>
      {t(
        'Use this field to set a geotag on your product, pick all the countries or cities where it is available for purchase. In case it is available everywhere, just pick the option All for countries and cities. As for the product tags, they should describe a core functionality or category of your product.',
      )}
    </Text>
  )
  const TooltipComponentt8 = () => (
    <Text>
      {t(
        'Use this field to add a custom tag in case you did not find an appropriate one above. Your tag name should be one worded and preferably not too long.',
      )}
    </Text>
  )
  const TooltipComponent = () => (
    <Text>
      {t(
        "This sets the workspace of your product. In case you can't find one that works for your product, pick Software & Telco & Other. The workspace of your product helps users find your products more easily and makes you eligible for weekly token rewards.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>{t('This sets the maximum number of the current product you have in stock for users.')}</Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'This sets the purchase price of the token. In case you want to use dynamic pricing on the current item, just input 0 here.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        "This enables you to add options to your product. Options enable users to customize their orders. The category field sets the category of the option, the element field set the actual option, the currency field sets the unit of the count - set this to # if you want each count to be an increment in the number of the item; the element price is the price of each element; the element min parameter is min amount of the element customers can order; the element max is the maximum amount of the element customers can order. In case you want to enable users to pick between options $1 Tilapia and $2 Tilapia for the meat on top of their food, you add 2 options, the first one (category='Meat'; Element='$1 Tilapia'; Currency='#', Element Price='1', Element Min='0', Element Max='100') & the second one (category='Meat'; Element='$2 Tilapia'; Currency='#', Element Price='2', Element Min='0', Element Max='100'). You can add as many options as you want to your product and you can add multiple categories each with their own list of options.",
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'You can fine tune more parameters about your product. These parameters are not necessary to upade in order to list your product but offer more options to customize your product.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This parameter is useful for product drops and sets a date the product will drop in the marketplace i.e. become available for purchase.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This parameter is useful for product auctions and sets a duration in minutes after which the auction automatically closes. If for instance you set that number to 10, the auction will automatically close 10 minutes after the last bid unless a new bid is made.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        'This parameter is useful for product auctions and sets a minimum amount that has to separate a new bid from the last one in terms of its price percentages. If for instance the last bid was 10 tokens and this parameter is 10%, then any bid below 11 tokens will be invalid.',
      )}
    </Text>
  )
  const TooltipComponent9 = () => (
    <Text>
      {t(
        'In case your product has some ESG badge or some other one delivered by an auditor, you can attach that badge to your product by inputting its id right here. This adds to the credibility of your product in the marketplace, you can use it to prove that you are a trustworthy merchant, that your luxury items are authentic, etc.',
      )}
    </Text>
  )
  const TooltipComponent10 = () => (
    <Text>
      {t(
        "NFTickets are eReceipts on the blockchain that users receive after each purchase as proof of purchase. If you don't want users to be able to transfer their NFTickets to other wallets, you can set this parameter to No. For instance when selling tickets to a concert or an event, you might want to prevent users from reselling their tickets and this might help you do just that.",
      )}
    </Text>
  )
  const TooltipComponent11 = () => (
    <Text>
      {t(
        'In case customer might want to purchase this item through the stake market, this parameters sets whether or not they should be required to send the purchase price to the stake when creating it. If you want to be sure the customers have the money for the purchase before being allowed to create a stake to purchase your item, you can set this parameter to Yes, if that is not a requirement, you can set it to No.',
      )}
    </Text>
  )
  const TooltipComponent12 = () => (
    <Text>
      {t(
        'Dynamic prices enables you to set multiple prices for the same product, you can set the price of your product to appreciate over time by specifying the array of prices right here, for instance: 1,2,3,4,5',
      )}
    </Text>
  )
  const TooltipComponent13 = () => (
    <Text>
      {t(
        'This field works together with the previous to set the dynamic pricing scheme. The current price index in the array specified above is computed with the following formula: current_timestamp - start / period with current_timetamp being the time in seconds at the current time.',
      )}
    </Text>
  )
  const TooltipComponent14 = () => (
    <Text>
      {t(
        'This parameter sets whether the item is tradable or not. Set it to No if you do not want users to be able to purchase the current item which can be the case for articles, blog posts, etc.',
      )}
    </Text>
  )
  const TooltipComponent15 = () => (
    <Text>
      {t(
        "Make sure you have select a FIAT token in the drop down menu on top of the List Product/List Paywall button before clicking them. If you've done socials, pick Yes",
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
    targetRef: targetReff,
    tooltip: tooltipp,
    tooltipVisible: tooltipVisiblee,
  } = useTooltip(<TooltipComponentt />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetReff2,
    tooltip: tooltipp2,
    tooltipVisible: tooltipVisiblee2,
  } = useTooltip(<TooltipComponentt2 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetReff4,
    tooltip: tooltipp4,
    tooltipVisible: tooltipVisiblee4,
  } = useTooltip(<TooltipComponentt4 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetReff6,
    tooltip: tooltipp6,
    tooltipVisible: tooltipVisiblee6,
  } = useTooltip(<TooltipComponentt6 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetReff7,
    tooltip: tooltipp7,
    tooltipVisible: tooltipVisiblee7,
  } = useTooltip(<TooltipComponentt7 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetReff8,
    tooltip: tooltipp8,
    tooltipVisible: tooltipVisiblee8,
  } = useTooltip(<TooltipComponentt8 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

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
            <Flex ref={targetReff2}>
              <Label htmlFor="original">{t('Article')}</Label>
              {tooltipVisiblee2 && tooltipp2}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
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
                <Flex ref={targetRef}>
                  <Filters
                    nftFilters={nftFilters2}
                    setNftFilters={setNftFilters2}
                    showCountry={false}
                    showCity={false}
                    showProduct={false}
                  />
                  {tooltipVisible && tooltip}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
              </Flex>
              <Box mb="24px">
                <Flex ref={targetReff}>
                  <SecondaryLabel>{t('Product Name')}</SecondaryLabel>
                  {tooltipVisiblee && tooltipp}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
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
                <Flex ref={targetReff4}>
                  <SecondaryLabel>{t('Link to thumbnail')}</SecondaryLabel>
                  {tooltipVisiblee4 && tooltipp4}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
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
                <Flex ref={targetReff6}>
                  <SecondaryLabel>{t('Description')}</SecondaryLabel>
                  {tooltipVisiblee6 && tooltipp6}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
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
                <Flex ref={targetReff7}>
                  <SecondaryLabel>{t("Click on each one of these to set your article's location data")}</SecondaryLabel>
                  <Filters
                    collection={collection}
                    showWorkspace={false}
                    nftFilters={nftFilters}
                    setNftFilters={setNftFilters}
                  />
                  {tooltipVisiblee7 && tooltipp7}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
              </Box>
              <Box mb="24px">
                <Flex ref={targetReff8}>
                  <SecondaryLabel>{t('Not satisfied with above tags ? Add custom tags')}</SecondaryLabel>
                  {tooltipVisiblee8 && tooltipp8}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
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
                <Flex ref={targetRef2}>
                  <SecondaryLabel>{t('Maximum Supply')}</SecondaryLabel>
                  {tooltipVisible2 && tooltip2}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
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
                <Flex ref={targetRef3}>
                  <SecondaryLabel>{t('Asking Price')}</SecondaryLabel>
                  {tooltipVisible3 && tooltip3}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
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
                <Flex ref={targetRef4}>
                  <SecondaryLabel>{t('Add or remove options')}</SecondaryLabel>
                  {tooltipVisible4 && tooltip4}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Options name="options" choices={state.options} onChange={handleChoiceChange} />
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef5}>
                  <SecondaryLabel>{t('View advanced parameters?')}</SecondaryLabel>
                  {tooltipVisible5 && tooltip5}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
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
                    <Flex ref={targetRef6}>
                      <SecondaryLabel>{t('Pick drop-in date')}</SecondaryLabel>
                      {tooltipVisible6 && tooltip6}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
                    <DatePicker
                      onChange={handleRawValueChange('dropinDate')}
                      selected={state.dropinDate}
                      placeholderText="YYYY/MM/DD"
                    />
                    <DatePickerPortal />
                  </Box>
                  <Box mb="24px">
                    <Flex ref={targetRef7}>
                      <SecondaryLabel>{t('Bid Duration (in minutes)')}</SecondaryLabel>
                      {tooltipVisible7 && tooltip7}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
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
                    <Flex ref={targetRef8}>
                      <SecondaryLabel>{t('Min Bid Increment Percentage')}</SecondaryLabel>
                      {tooltipVisible8 && tooltip8}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
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
                    <Flex ref={targetRef9}>
                      <SecondaryLabel>{t('Auditor Badge ID')}</SecondaryLabel>
                      {tooltipVisible9 && tooltip9}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
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
                    <Flex ref={targetRef10} paddingRight="5px">
                      <SecondaryLabel>{t('Make NFTickets Transferrable')}</SecondaryLabel>
                      {tooltipVisible10 && tooltip10}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
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
                    <Flex ref={targetRef11} paddingRight="5px">
                      <SecondaryLabel>{t('Require Upfront Payment')}</SecondaryLabel>
                      {tooltipVisible11 && tooltip11}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
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
                    <Flex ref={targetRef12}>
                      <SecondaryLabel>{t('Dynamic Prices')}</SecondaryLabel>
                      {tooltipVisible12 && tooltip12}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
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
                    <Flex ref={targetRef13}>
                      <SecondaryLabel>{t('Dynamic pricing start and period')}</SecondaryLabel>
                      {tooltipVisible13 && tooltip13}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
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
                    <Flex ref={targetRef14}>
                      <SecondaryLabel>{t('Is the item tradable?')}</SecondaryLabel>
                      {tooltipVisible14 && tooltip14}
                      <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                    </Flex>
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
                <Flex ref={targetRef15}>
                  <SecondaryLabel>{t('Pick a FIAT token')}</SecondaryLabel>
                  {tooltipVisible15 && tooltip15}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
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
