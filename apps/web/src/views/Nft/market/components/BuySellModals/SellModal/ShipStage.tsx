import axios from 'axios'
import { differenceInSeconds } from 'date-fns'
import { useState, ChangeEvent } from 'react'
import { Flex, Grid, Text, Button, useToast, Modal } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { Currency, MaxUint256 } from '@pancakeswap/sdk'
import { useTranslation, TranslateFunction, ContextApi } from '@pancakeswap/localization'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import {
  useMarketCollectionsContract,
  useNftMarketOrdersContract,
  useNftMarketHelper3Contract,
  useMinterFactoryContract,
  usePaywallARPFactoryContract,
  usePaywallMarketOrdersContract,
  usePaywallMarketHelperContract,
  useErc721CollectionContract,
  useNftMarketHelperContract,
} from 'hooks/useContract'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { SellingStage, OptionType, EnlistFormState } from './types'
import ConfirmStage from '../shared/ConfirmStage'
import EnlistStage from './EnlistStage'
import PaywallStage2 from './PaywallStage2'
import LocationStage from './LocationStage'
import TaskStage from './TaskStage'
import ProgressSteps from '../../ProgressSteps'
import AvatarImage from '../../BannerHeader/AvatarImage'
import PublishMediaStage from './PublishMediaStage'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { useGetPaywallARP } from 'state/cancan/hooks'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { combineDateAndTime } from 'views/AcceleratorVoting/CreateProposal/helpers'

interface EditStageProps {
  variant: 'product' | 'paywall' | 'article'
  collection: any
  currency: Currency
}

const modalTitles = (t: TranslateFunction) => ({
  [SellingStage.SHIP]: t('Shipping Modal'),
  [SellingStage.ADD_TASK]: t('Add a Task'),
  [SellingStage.UPLOAD_MEDIA]: t('Upload Media'),
  [SellingStage.CREATE_ASK_ORDER]: t('Create Ask Order'),
  [SellingStage.CREATE_PAYWALL]: t('Create Paywall'),
  [SellingStage.CREATE_PAYWALL1]: t('Step 1'),
  [SellingStage.CREATE_PAYWALL2]: t('Step 2'),
  [SellingStage.ADD_LOCATION]: t('Location Data'),
  [SellingStage.CONFIRM_CREATE_PAYWALL1]: t('Back'),
  [SellingStage.CONFIRM_CREATE_PAYWALL2]: t('Back'),
  [SellingStage.CONFIRM_CREATE_ASK_ORDER]: t('Back'),
  [SellingStage.CONFIRM_ADD_LOCATION]: t('Back'),
  [SellingStage.CONFIRM_ADD_LOCATION2]: t('Back'),
  [SellingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

const getToastText = (stage: SellingStage, t: ContextApi['t']) => {
  if (stage === SellingStage.CONFIRM_CREATE_PAYWALL1) {
    return t('Paywall creation step 1 successfully completed')
  }
  if (stage === SellingStage.CONFIRM_CREATE_PAYWALL2) {
    return t('Paywall successfully created')
  }
  if (stage === SellingStage.CONFIRM_CREATE_ASK_ORDER) {
    return t('Product successfully created')
  }
  return ''
}

// Initial stage when user wants to edit already listed NFT (i.e. adjust price or remove from sale)
const EditStage: React.FC<any> = ({ variant, collection, articleState, currency, articleFilters = {}, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [stage, setStage] = useState(
    variant === 'article'
      ? SellingStage.CONFIRM_CREATE_ASK_ORDER
      : variant === 'paywall'
      ? SellingStage.CREATE_PAYWALL
      : SellingStage.CREATE_ASK_ORDER,
  )
  const [expand, setExpand] = useState(false)
  const paywallARP = useGetPaywallARP(collection?.id ?? '') as any
  const [step1Complete, setStep1Complete] = useState(!!paywallARP?.paywallAddress)
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const marketCollectionsContract = useMarketCollectionsContract()
  const marketOrdersContract = useNftMarketOrdersContract()
  const marketHelper3Contract = useNftMarketHelper3Contract()
  const marketHelperContract = useNftMarketHelperContract()
  const minterFactoryContract = useMinterFactoryContract()
  const paywallMarketOrdersContract = usePaywallMarketOrdersContract()
  const paywallMarketHelperContract = usePaywallMarketHelperContract()
  const paywallARPFactoryContract = usePaywallARPFactoryContract()
  const [nftFilters, setNftFilters] = useState(articleFilters)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const [state, setState] = useState<any>(() => ({
    tokenId: articleState?.tokenId?.split()?.join('-') ?? '',
    direction: 0,
    dropinDate: articleState?.dropinDate ?? '',
    maxSupply: articleState?.maxSupply ?? '0',
    ABTesting: 0,
    ABMin: 0,
    ABMax: 0,
    bidDuration: articleState?.bidDuration ?? '0',
    minBidIncrementPercentage: articleState?.minBidIncrementPercentage ?? '0',
    rsrcTokenId: articleState?.rsrcTokenId ?? '0',
    nftTokenId: '0',
    options: articleState?.options ?? [],
    transferrable: articleState?.transferrable ?? 1,
    requireUpfrontPayment: articleState?.requireUpfrontPayment ?? 1,
    currentAskPrice: articleState?.currentAskPrice ?? 0,
    customMinter: 0,
    name: '',
    symbol: '',
    img: '',
    workspace: '',
    tFIAT: '',
    arp: '',
    country: {},
    city: {},
    product: {},
    behindPaywall: '',
    media: '',
    usetFIAT: articleState?.usetFIAT ?? 0,
    customTags: articleState?.customTags ?? '',
    thumbnail: articleState?.thumbnail ?? '',
    description: articleState?.description ?? '',
    original: articleState?.original ?? '',
    webm: '',
    gif: '',
    mp4: '',
    prices: articleState?.prices ?? '',
    start: articleState?.start ?? '0',
    period: articleState?.period ?? '0',
    isTradable: articleState?.isTradable ?? 1,
    referrer: '',
    userTokenId: '',
    identityTokenId: '',
    emailList: '',
    startTime: '',
  }))
  const tokenContract = useErc721CollectionContract(state.minter)
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
  const handleChoiceChange = (newChoices: OptionType[]) => {
    updateValue('options', newChoices)
  }
  const handleRawValueChange = (key: string) => (value: Date | number | boolean | string) => {
    updateValue(key, value)
  }
  const goBack = () => {
    switch (stage) {
      case SellingStage.UPLOAD_MEDIA:
        setExpand(false)
        setStage(SellingStage.SHIP)
        break
      case SellingStage.CREATE_ASK_ORDER:
        setStage(SellingStage.SHIP)
        break
      case SellingStage.ADD_TASK:
        setStage(SellingStage.SHIP)
        break
      case SellingStage.ADD_LOCATION:
        setStage(SellingStage.SHIP)
        break
      case SellingStage.CONFIRM_ADD_LOCATION:
        setStage(SellingStage.ADD_LOCATION)
        break
      case SellingStage.CONFIRM_BUY_SUBSCRIPTION:
        setStage(SellingStage.BUY_SUBSCRIPTION)
        break
      case SellingStage.CREATE_PAYWALL:
        setStage(SellingStage.SHIP)
        break
      case SellingStage.CREATE_PAYWALL1:
        setStage(SellingStage.CREATE_PAYWALL)
        break
      case SellingStage.CONFIRM_CREATE_PAYWALL1:
        setStage(SellingStage.CREATE_PAYWALL)
        break
      case SellingStage.CREATE_PAYWALL2:
        setStage(SellingStage.CREATE_PAYWALL)
        break
      case SellingStage.CONFIRM_CREATE_PAYWALL2:
        setStage(SellingStage.CREATE_PAYWALL2)
        break
      case SellingStage.CONFIRM_CREATE_ASK_ORDER:
        setStage(SellingStage.CREATE_ASK_ORDER)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case SellingStage.CREATE_ASK_ORDER:
        setStage(SellingStage.CONFIRM_CREATE_ASK_ORDER)
        break
      case SellingStage.CREATE_PAYWALL2:
        setStage(SellingStage.CONFIRM_CREATE_PAYWALL2)
        break
      case SellingStage.ADD_LOCATION:
        setStage(SellingStage.CONFIRM_ADD_LOCATION)
        break
      case SellingStage.ADD_LOCATION2:
        setStage(SellingStage.CONFIRM_ADD_LOCATION)
        break
      case SellingStage.BUY_SUBSCRIPTION:
        setStage(SellingStage.CONFIRM_BUY_SUBSCRIPTION)
        break
      default:
        break
    }
  }

  const onSuccessSale = async () => {
    let link = `https://payswap.org/nfts/collections/${collection?.id}/`
    if (stage === SellingStage.CONFIRM_CREATE_PAYWALL2) {
      link += `paywall/${state.tokenId?.split(' ')?.join('-')?.trim()}`
    } else if (stage === SellingStage.CONFIRM_CREATE_ASK_ORDER) {
      link += `${state.tokenId?.split(' ')?.join('-')?.trim()}`
    }
    switch (stage) {
      case SellingStage.CONFIRM_CREATE_PAYWALL2 || SellingStage.CONFIRM_CREATE_ASK_ORDER:
        await axios.post('/api/email2', {
          subject: 'New Product Listed',
          messageHtml: `
          # MarketPlace Support
    
          A channel you're following just launched a new product: [${state.tokenId}](${link})
          
          _Thanks for using Payswap_
          `,
          emailList: state.emailList,
        })
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return false
    },
    onApprove: () => {
      return null // callWithGasPrice(tokenContract, 'setApprovalForAll', [marketHelper3Contract.address, true])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now make transactions!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === SellingStage.CONFIRM_CREATE_PAYWALL1) {
        return callWithGasPrice(paywallARPFactoryContract, 'createGauge', []).catch((err) =>
          console.log('CONFIRM_CREATE_PAYWALL1==================>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_CREATE_PAYWALL2) {
        const currentAskPrice = getDecimalAmount(new BigNumber(state.currentAskPrice))
        const time = combineDateAndTime(state.dropinDate, state.startTime)?.toString()
        const dropInTimer = Math.max(
          differenceInSeconds(new Date(time ? parseInt(time) * 1000 : 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args = [
          state.tokenId?.split(' ')?.join('-')?.trim(),
          currentAskPrice.toString(),
          state.bidDuration,
          state.minBidIncrementPercentage,
          !!state.transferrable,
          !!state.requireUpfrontPayment,
          !!state.usetFIAT,
          state.rsrcTokenId,
          state.maxSupply,
          dropInTimer.toString(),
          currency?.address,
          getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase()),
        ]
        console.log('CONFIRM_CREATE_PAYWALL2===========================>', args)
        return callWithGasPrice(paywallARPFactoryContract, 'createGauge', [
          state.tokenId?.split(' ')?.join('-')?.trim(),
        ])
          .then(() => callWithGasPrice(paywallMarketOrdersContract, 'createAskOrder', args))
          .then(() => {
            if (state.options?.length > 0) {
              const args2 = [
                state.tokenId?.split(' ')?.join('-')?.trim(),
                state.options?.reduce((accum, attr) => [...accum, attr.min], []),
                state.options?.reduce((accum, attr) => [...accum, attr.max], []),
                state.options?.reduce((accum, attr) => [...accum, parseInt(attr.value) * 60], []),
                state.options?.reduce((accum, attr) => [...accum, getDecimalAmount(attr.unitPrice)?.toString()], []),
                state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                state.options?.reduce((accum, attr) => [...accum, attr.element], []),
                state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                state.options?.reduce((accum, attr) => [...accum, attr.currency], []),
              ]
              console.log('updateoptions==============>', args2)
              return callWithGasPrice(paywallMarketHelperContract, 'updateOptions', args2).catch((err) =>
                console.log('rerr2=================>', err),
              )
            }
            return null
          })
          .then(() => {
            let args = [
              state.tokenId?.split(' ')?.join('-')?.trim(),
              state.description,
              state.prices?.split(',')?.filter((val) => !!val),
              state.start,
              state.period,
              variant === 'product' || variant === 'article' ? '2' : '1',
              !!state.isTradable,
              `${state.thumbnail},${state.original}`,
              nftFilters?.country?.toString(),
              nftFilters?.city?.toString(),
              nftFilters?.product
                ? [...nftFilters?.product, ...state.customTags.split(',')]?.filter((val) => !!val)?.toString()
                : [...state.customTags.split(',')]?.filter((val) => !!val)?.toString(),
            ]
            console.log('7CONFIRM_CREATE_PAYWALL2==============>')
            return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', args).catch((err) =>
              console.log('CONFIRM_ADD_LOCATION================>', err),
            )
          })
          .catch((err) => console.log('rerr=============>', err))
      }
      if (stage === SellingStage.CONFIRM_CREATE_ASK_ORDER) {
        if (currency?.address) {
          const currentAskPrice = getDecimalAmount(new BigNumber(state.currentAskPrice))
          const time = combineDateAndTime(state.dropinDate, state.startTime)?.toString()
          const dropInTimer = Math.max(
            differenceInSeconds(new Date(time ? parseInt(time) * 1000 : 0), new Date(), {
              roundingMethod: 'ceil',
            }),
            0,
          )
          const createArgs = [
            state.tokenId?.split(' ')?.join('-')?.trim(),
            currentAskPrice.toString(),
            parseInt(state.bidDuration) * 60,
            parseInt(state.minBidIncrementPercentage) * 100,
            !!state.transferrable,
            !!state.requireUpfrontPayment,
            !!state.usetFIAT,
            [
              state.rsrcTokenId,
              Number(state.nftTokenId) ? 1 : state.maxSupply,
              dropInTimer.toString(),
              state.nftTokenId,
            ],
            state.minter || ADDRESS_ZERO,
            currency?.address,
            getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase()),
          ]
          const args = [state.tokenId?.split(' ')?.join('-')?.trim(), state.name, state.symbol, state.img?.split(',')]
          const args2 = [
            state.tokenId?.split(' ')?.join('-')?.trim(),
            state.description,
            state.prices?.split(',')?.filter((val) => !!val),
            state.start,
            state.period,
            variant === 'product' || variant === 'article' ? '2' : '1',
            !!state.isTradable,
            `${state.thumbnail},${state.thumbnail}`,
            nftFilters?.country?.toString() ?? '',
            nftFilters?.city?.toString() ?? '',
            nftFilters?.product
              ? [...nftFilters?.product, ...state.customTags.split(',')]?.filter((val) => !!val)?.toString()
              : [...state.customTags.split(',')]?.filter((val) => !!val)?.toString(),
          ]
          console.log('CONFIRM_CREATE_ASK_ORDER===========================>', createArgs, args, args2)
          if (state.customMinter) {
            console.log(
              'tokenContract1=================>',
              !!state.customMinter && !!Number(state.nftTokenId),
              Number(state.nftTokenId),
              tokenContract,
            )
            if (!!state.customMinter && !!Number(state.nftTokenId)) {
              return callWithGasPrice(tokenContract, 'setApprovalForAll', [marketHelper3Contract.address, true])
                .then(() => {
                  return callWithGasPrice(marketOrdersContract, 'createAskOrder', createArgs).catch((err) =>
                    console.log('rerr=============>', err),
                  )
                })
                .then(() => {
                  return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', args2).catch((err) =>
                    console.log('CONFIRM_ADD_LOCATION================>', err),
                  )
                })
                .catch((err) => console.log('rerr=============>', err))
            }
            return callWithGasPrice(marketOrdersContract, 'createAskOrder', createArgs)
              .then((res) => {
                if (state.options?.length > 0) {
                  const args3 = [
                    state.tokenId?.split(' ')?.join('-')?.trim(),
                    state.options?.reduce((accum, attr) => [...accum, attr.min], []),
                    state.options?.reduce((accum, attr) => [...accum, attr.max], []),
                    state.options?.reduce((accum, attr) => [...accum, parseInt(attr.value) * 60], []),
                    state.options?.reduce(
                      (accum, attr) => [...accum, getDecimalAmount(attr.unitPrice)?.toString()],
                      [],
                    ),
                    state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                    state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                    state.options?.reduce((accum, attr) => [...accum, attr.element], []),
                    state.options?.reduce((accum, attr) => [...accum, attr.currency ?? '#'], []),
                  ]
                  console.log('updateoptions==============>', args3)
                  return callWithGasPrice(marketHelperContract, 'updateOptions', args3).catch((err) =>
                    console.log('rerr2=================>', err),
                  )
                }
                return res
              })
              .then(() => {
                return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', args2).catch((err) =>
                  console.log('CONFIRM_ADD_LOCATION================>', err),
                )
              })
              .catch((err) => console.log('rerr=============>', err))
          }
          return callWithGasPrice(minterFactoryContract, 'createGauge', args)
            .then(() => delay(5000))
            .then(() => {
              return callWithGasPrice(marketOrdersContract, 'createAskOrder', createArgs).catch((err) =>
                console.log('rerr001=============>', err),
              )
            })
            .then((res) => {
              if (state.options?.length > 0) {
                const args3 = [
                  state.tokenId?.split(' ')?.join('-')?.trim(),
                  state.options?.reduce((accum, attr) => [...accum, attr.min], []),
                  state.options?.reduce((accum, attr) => [...accum, attr.max], []),
                  state.options?.reduce((accum, attr) => [...accum, parseInt(attr.value) * 60], []),
                  state.options?.reduce((accum, attr) => [...accum, getDecimalAmount(attr.unitPrice)?.toString()], []),
                  state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                  state.options?.reduce((accum, attr) => [...accum, attr.element], []),
                  state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                  state.options?.reduce((accum, attr) => [...accum, attr.currency], []),
                ]
                console.log('updateoptions==============>', args3)
                return callWithGasPrice(marketHelperContract, 'updateOptions', args3).catch((err) =>
                  console.log('rerr2=================>', err),
                )
              }
              return res
            })
            .then(() => {
              return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', args2).catch((err) =>
                console.log('CONFIRM_ADD_LOCATION================>', err),
              )
            })
            .catch((err) => console.log('rerr=============>', err))
        }
      }
      if (stage === SellingStage.CONFIRM_ADD_LOCATION || stage === SellingStage.CONFIRM_ADD_LOCATION2) {
        let args
        try {
          args = [
            state.tokenId?.split(' ')?.join('-')?.trim(),
            state.description,
            state.prices?.split(',')?.filter((val) => !!val),
            state.start,
            state.period,
            variant === 'product' || variant === 'article' ? '0' : '1',
            !!state.isTradable,
            `${state.thumbnail},${state.thumbnail}`,
            nftFilters?.country?.toString(),
            nftFilters?.city?.toString(),
            nftFilters?.product
              ? [...nftFilters?.product, ...state.customTags.split(',')]?.filter((val) => !!val)?.toString()
              : [...state.customTags.split(',')]?.filter((val) => !!val)?.toString(),
          ]
          console.log('CONFIRM_ADD_LOCATION==============>', args)
        } catch (err) {
          console.log('1CONFIRM_ADD_LOCATION============>', err)
        }
        return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', args).catch((err) =>
          console.log('CONFIRM_ADD_LOCATION================>', err),
        )
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      if (state.emailList) onSuccessSale()
      setConfirmedTxHash(receipt.transactionHash)
      setStage(SellingStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <Modal
      title={modalTitles(t)[stage]}
      // stage={stage}
      // expand={expand}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <Flex p="16px">
        <Flex mr="8px">
          <AvatarImage src={collection?.avatar} />
        </Flex>
        <Grid flex="1" alignItems="center">
          {/* <Text fontSize="12px" color="textSubtle" textAlign="right"> */}
          <Text>{collection?.name}</Text>
          {/* <Text bold>
            {variant === 'product'
              ? t('First publish a media file on your product then enlist it for sale in the marketplace')
              : t('Create a paywall, add locations, surveys... and list products behind it.')}
          </Text> */}
        </Grid>
      </Flex>
      {/* {stage === SellingStage.SHIP && (
        <Flex flexDirection="row">
          <ProgressSteps steps={[true, true]} />
          <Flex flexDirection="column" width="100%" px="16px" pb="16px">
            {variant === 'product' && (
              <Button variant="subtle" mb="8px" onClick={() => setStage(SellingStage.CREATE_ASK_ORDER)}>
                {t('List for sale')}
              </Button>
            )}
            {variant === 'paywall' && (
              <Button variant="subtle" mb="8px" onClick={() => setStage(SellingStage.CREATE_PAYWALL)}>
                {t('Create a paywall')}
              </Button>
            )}
            <Button variant="success" mb="8px" onClick={() => setStage(SellingStage.ADD_LOCATION)}>
              {variant === 'product' ? t('Product Data') : t('Paywall Data')}
            </Button>
            <Button variant="secondary" mb="8px" onClick={() => setStage(SellingStage.ADD_TASK)}>
              {t('Bookings, Surveys, Quizzes...')}
            </Button>
          </Flex>
        </Flex>
      )} */}
      {stage === SellingStage.CREATE_PAYWALL && (
        <Flex flexDirection="row">
          <ProgressSteps steps={[step1Complete]} />
          <Flex flexDirection="column" width="100%" px="16px" pb="16px">
            <Button mb="8px" onClick={() => setStage(SellingStage.CONFIRM_CREATE_PAYWALL1)}>
              {t('STEP 1')}
            </Button>
            <Button mb="8px" variant="success" onClick={() => setStage(SellingStage.CREATE_PAYWALL2)}>
              {t('STEP 2')}
            </Button>
          </Flex>
        </Flex>
      )}
      {stage === SellingStage.UPLOAD_MEDIA && <PublishMediaStage state={state} updateValue={updateValue} />}
      {(stage === SellingStage.CREATE_ASK_ORDER || stage === SellingStage.CREATE_PAYWALL2) && (
        <LocationStage
          state={state}
          variant={variant}
          updateValue={updateValue}
          collection={collection}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.CREATE_ASK_ORDER && (
        <EnlistStage
          state={state}
          variant={variant}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          updateValue={updateValue}
          handleChange={handleChange}
          handleChoiceChange={handleChoiceChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.ADD_TASK && (
        <TaskStage
          addTask={() => {
            return null
          }}
        />
      )}
      {stage === SellingStage.CREATE_PAYWALL2 && (
        <EnlistStage
          variant="paywall"
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          handleChoiceChange={handleChoiceChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stagesWithApproveButton.includes(stage) && (
        <ApproveAndConfirmStage
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stagesWithConfirmButton.includes(stage) && (
        <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />
      )}
      {stage === SellingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </Modal>
  )
}

export default EditStage
