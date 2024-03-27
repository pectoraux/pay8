import axios from 'axios'
import EncryptRsa from 'encrypt-rsa'
import { differenceInSeconds } from 'date-fns'
import { useState, ChangeEvent } from 'react'
import { Flex, Grid, Text, useToast, Modal } from '@pancakeswap/uikit'
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
  useMarketOrdersContract,
  useMarketHelperContract,
  usePaywallARPFactoryContract,
  usePaywallMarketOrdersContract,
  usePaywallMarketHelperContract,
  useMarketEventsContract,
} from 'hooks/useContract'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { useGetPaywallARP } from 'state/cancan/hooks'
import { encryptArticle } from 'utils/cancan'
import { combineDateAndTime } from 'views/ValuePoolVoting/CreateProposal/helpers'

import { SellingStage, OptionType } from './types'
import ConfirmStage from '../shared/ConfirmStage'
import EnlistStage from './EnlistStage'
import LocationStage from './LocationStage'
import TaskStage from './TaskStage'
import AvatarImage from '../../BannerHeader/AvatarImage'
import PublishMediaStage from './PublishMediaStage'
import { stagesWithBackButton, stagesWithConfirmButton, stagesWithApproveButton } from './styles'

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
  [SellingStage.CREATE_PAYWALL2]: t('List Paywall'),
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
const EditStage: React.FC<any> = ({
  variant,
  collection,
  articleState,
  currency,
  workspace,
  paywallId = null,
  articleFilters = {},
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [stage, setStage] = useState(
    variant === 'article'
      ? SellingStage.CONFIRM_CREATE_ASK_ORDER
      : variant === 'paywall'
      ? SellingStage.CREATE_PAYWALL2
      : SellingStage.CREATE_ASK_ORDER,
  )
  console.log('currency?.address==============>', currency?.address, articleState)
  const [expand, setExpand] = useState(false)
  const paywallARP = useGetPaywallARP(collection?.id ?? '', paywallId)
  const [step1Complete, setStep1Complete] = useState(!!paywallARP?.paywallAddress)
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const marketCollectionsContract = useMarketCollectionsContract()
  const marketEventsContract = useMarketEventsContract()
  const marketOrdersContract = useMarketOrdersContract()
  const marketHelperContract = useMarketHelperContract()
  const paywallMarketOrdersContract = usePaywallMarketOrdersContract()
  const paywallMarketHelperContract = usePaywallMarketHelperContract()
  const paywallARPFactoryContract = usePaywallARPFactoryContract()
  const [nftFilters, setNftFilters] = useState(articleFilters)
  const [state, setState] = useState<any>(() => ({
    tokenId: articleState?.tokenId?.split()?.join('-') ?? '',
    direction: 0,
    dropinDate: articleState?.dropinDate ?? '',
    maxSupply: articleState?.maxSupply ?? '0',
    ABTesting: 0,
    ABMin: 0,
    ABMax: 0,
    mediaType: articleState?.tokenId?.trim()?.length ? 4 : 0,
    bidDuration: articleState?.bidDuration ?? '0',
    minBidIncrementPercentage: articleState?.minBidIncrementPercentage ?? '0',
    rsrcTokenId: articleState?.rsrcTokenId ?? '0',
    options: articleState?.options ?? [],
    transferrable: articleState?.transferrable ?? 1,
    requireUpfrontPayment: articleState?.requireUpfrontPayment ?? 1,
    currentAskPrice: articleState?.currentAskPrice ?? 0,
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
    let link = `https://payswap.org/cancan/collections/${collection?.id}/`
    if (stage === SellingStage.CONFIRM_CREATE_PAYWALL2) {
      link += `paywall/${state.tokenId?.split(' ')?.join('-')?.trim()}`
    } else if (stage === SellingStage.CONFIRM_CREATE_ASK_ORDER) {
      link += `${state.tokenId?.split(' ')?.join('-')?.trim()}`
    }
    const subject = t('New Product Listed')
    switch (stage) {
      case SellingStage.CONFIRM_CREATE_PAYWALL2 || SellingStage.CONFIRM_CREATE_ASK_ORDER:
        await axios.post('/api/email2', {
          subject,
          messageHtml: `
          # ${t('MarketPlace Support')}
    
          ${t("A channel you're following just launched a new product:")} [${state.tokenId}](${link})
          
          ${t('_Thanks for using Payswap_')}
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
      return callWithGasPrice(paywallARPFactoryContract, 'approve', [paywallARPFactoryContract.address, MaxUint256])
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
          console.log('1CONFIRM_CREATE_PAYWALL==================>', err, paywallARPFactoryContract),
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
          parseInt(state.bidDuration) * 60,
          parseInt(state.minBidIncrementPercentage) * 100,
          !!state.transferrable,
          !!state.requireUpfrontPayment,
          !!state.usetFIAT,
          state.rsrcTokenId,
          state.maxSupply,
          dropInTimer.toString(),
          currency?.address,
          getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase()),
        ]
        console.log('5CONFIRM_CREATE_PAYWALL2==============>', args, paywallARPFactoryContract, [
          state.tokenId?.split(' ')?.join('-')?.trim(),
        ])
        return callWithGasPrice(paywallARPFactoryContract, 'createGauge', [
          state.tokenId?.split(' ')?.join('-')?.trim(),
        ])
          .then(() => callWithGasPrice(paywallMarketOrdersContract, 'createAskOrder', args))
          .then((res) => {
            console.log('6CONFIRM_CREATE_PAYWALL2==============>')
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
              console.log('1CONFIRM_CREATE_PAYWALL2==============>', args2)
              return callWithGasPrice(paywallMarketHelperContract, 'updateOptions', args2).catch((err) =>
                console.log('rerr2=================>', err),
              )
            }
            return res
          })
          .then(() => {
            const args2 = [
              state.tokenId?.split(' ')?.join('-')?.trim(),
              state.description,
              state.prices?.split(',')?.filter((val) => !!val),
              state.start,
              state.period,
              variant === 'product' || variant === 'article' ? '0' : '1',
              !!state.isTradable,
              `${state.thumbnail},${state.original}`,
              nftFilters?.country?.toString(),
              nftFilters?.city?.toString(),
              nftFilters?.product
                ? [...nftFilters?.product, ...state.customTags.split(',')]?.filter((val) => !!val)?.toString()
                : [...state.customTags.split(',')]?.filter((val) => !!val)?.toString(),
            ]
            console.log('7CONFIRM_CREATE_PAYWALL2==============>')
            return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', args2).catch((err) =>
              console.log('CONFIRM_ADD_LOCATION================>', err),
            )
          })
          .catch((err) => console.log('8CONFIRM_CREATE_PAYWALL2=============>', err))
      }
      if (stage === SellingStage.CONFIRM_CREATE_ASK_ORDER) {
        let content
        const contentType = !state.mediaType
          ? 'img'
          : state.mediaType === 1
          ? 'video'
          : state.mediaType === 2
          ? 'form'
          : 'article'
        console.log('CONFIRM_CREATE_ASK_ORDER==============>')
        const currentAskPrice = getDecimalAmount(new BigNumber(state.currentAskPrice))
        const time = combineDateAndTime(state.dropinDate, state.startTime)?.toString()
        const dropInTimer = Math.max(
          differenceInSeconds(new Date(time ? parseInt(time) * 1000 : 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args1 = [
          state.tokenId?.split(' ')?.join('-')?.trim(),
          currentAskPrice.toString(),
          parseInt(state.bidDuration) * 60,
          parseInt(state.minBidIncrementPercentage) * 100,
          !!state.transferrable,
          !!state.requireUpfrontPayment,
          !!state.usetFIAT,
          state.rsrcTokenId,
          state.maxSupply,
          dropInTimer.toString(),
          currency?.address,
          getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase() ?? workspace?.value?.toLowerCase()),
        ]
        console.log('rerr0===========================>', marketOrdersContract, paywallId, articleState, args1)
        return callWithGasPrice(marketOrdersContract, 'createAskOrder', args1)
          .then(() => {
            if (state.options?.length > 0) {
              return callWithGasPrice(marketHelperContract, 'updateOptions', [
                state.tokenId?.split(' ')?.join('-')?.trim(),
                state.options?.reduce((accum, attr) => [...accum, attr.min], []),
                state.options?.reduce((accum, attr) => [...accum, attr.max], []),
                state.options?.reduce((accum, attr) => [...accum, getDecimalAmount(attr.unitPrice)?.toString()], []),
                state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                state.options?.reduce((accum, attr) => [...accum, attr.element], []),
                state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                state.options?.reduce((accum, attr) => [...accum, attr.element], []),
                state.options?.reduce((accum, attr) => [...accum, attr.currency], []),
              ]).catch((err) => {
                console.log('rerr2=================>', err)
              })
            }
            return null
          })
          .then(() => {
            let img0
            let img1
            if (paywallId?.length > 0) {
              const encryptRsa = new EncryptRsa()
              img0 = state.thumbnail
              if (state.mediaType === 0) {
                img0 = 'https://www.payswap.org/logo.png'
                img1 = state.thumbnail
                  ? encryptRsa.encryptStringWithRsaPublicKey({
                      text: state.thumbnail,
                      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY_4096,
                    })
                  : ''
              } else if (state.mediaType < 3) {
                img1 = state.original
                  ? encryptRsa.encryptStringWithRsaPublicKey({
                      text: state.original,
                      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY_4096,
                    })
                  : ''
              } else {
                // article
                img1 = encryptArticle(encryptRsa, state.original)
              }
              content = `${contentType},${img0},${img1}`
            } else {
              content = `${contentType},${state.thumbnail},${state.original}`
            }
            const customTags = state.customTags?.split(',')
            const args = [
              state.tokenId?.split(' ')?.join('-')?.trim(),
              state.description,
              state.prices?.split(',')?.filter((val) => !!val),
              state.start,
              state.period,
              variant === 'product' || variant === 'article' ? '0' : '1',
              !!state.isTradable,
              content,
              nftFilters?.country?.toString() ?? '',
              nftFilters?.city?.toString() ?? '',
              customTags.length && customTags[0],
            ]
            console.log('11CONFIRM_ADD_LOCATION==============>', marketCollectionsContract, args)
            return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', args).catch((err) =>
              console.log('CONFIRM_ADD_LOCATION================>', err),
            )
          })
          .then(() => {
            const args2 = [state.tokenId?.split(' ')?.join('-')?.trim(), paywallId, true, false, content]
            console.log('12CONFIRM_ADD_LOCATION==============>', args2)
            return callWithGasPrice(marketEventsContract, 'updatePaywall', args2).catch((err) =>
              console.log('13CONFIRM_ADD_LOCATION================>', err),
            )
          })
          .catch((err) => console.log('rerr=============>', err))
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
            `${state.thumbnail},${state.original}`,
            nftFilters?.country?.toString(),
            nftFilters?.city?.toString(),
            nftFilters?.product
              ? [...nftFilters?.product, ...state.customTags.split(',')]?.filter((val) => !!val)?.toString()
              : [...state.customTags.split(',')]?.filter((val) => !!val)?.toString(),
          ]
          console.log('11CONFIRM_ADD_LOCATION==============>', marketCollectionsContract, args)
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
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      if (state.emailList) onSuccessSale()
      setConfirmedTxHash(receipt?.transactionHash)
      if (stage === SellingStage.CONFIRM_CREATE_PAYWALL1) setStep1Complete(true)
      setStage(SellingStage.TX_CONFIRMED)
    },
  })
  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <Modal
      title={modalTitles(t)[stage]}
      // stage={stage}
      // expand={expand}
      // id="ship-modal"
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <Flex p="16px">
        <Flex mr="8px">
          <AvatarImage src={collection?.avatar} />
        </Flex>
        <Grid flex="1" alignItems="center">
          <Text bold>{collection?.name}</Text>
        </Grid>
      </Flex>
      {/* {stage === SellingStage.SHIP && (
        <Flex flexDirection="row">
          <ProgressSteps steps={[listed,]} />
          <Flex flexDirection="column" width="100%" px="16px" pb="16px">
            {variant === 'product' && (
              <Button className='tour2-2' variant="subtle" mb="8px" onClick={() => setStage(SellingStage.CREATE_ASK_ORDER)}>
                {t('List for sale')}
              </Button>
            )}
            {variant === 'paywall' && (
              <Button variant="subtle" mb="8px" onClick={() => setStage(SellingStage.CREATE_PAYWALL)}>
                {t('Create a paywall')}
              </Button>
            )} */}
      {/* <Button variant="secondary" mb="8px" onClick={() => setStage(SellingStage.ADD_LOCATION)}>
              {variant === 'product' ? t('Product Data') : t('Paywall Data')}
            </Button> */}
      {/* <Button variant="secondary" mb="8px" onClick={() => setStage(SellingStage.ADD_TASK)}>
              {t('Bookings, Surveys, Quizzes...')}
            </Button>
          </Flex>
        </Flex>
      )} */}
      {/* {stage === SellingStage.CREATE_PAYWALL && (
        <Flex flexDirection="row">
          <ProgressSteps steps={[step1Complete]} />
          <Flex flexDirection="column" width="100%" px="16px" pb="16px">
            <Button mb="8px" disabled={step1Complete} onClick={() => setStage(SellingStage.CONFIRM_CREATE_PAYWALL1)}>
              {t('STEP 1')}
            </Button>
            <Button mb="8px" variant="success" onClick={() => setStage(SellingStage.CREATE_PAYWALL2)}>
              {t('STEP 2')}
            </Button>
          </Flex>
        </Flex>
      )} */}
      {stage === SellingStage.UPLOAD_MEDIA && <PublishMediaStage state={state} updateValue={updateValue} />}
      {stage === SellingStage.ADD_TASK && (
        <TaskStage
          addTask={() => {
            return null
          }}
        />
      )}
      {(stage === SellingStage.CREATE_ASK_ORDER || stage === SellingStage.CREATE_PAYWALL2) && (
        <LocationStage
          state={state}
          variant={variant}
          paywallId={paywallId}
          updateValue={updateValue}
          nftFilters={nftFilters}
          collection={collection}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.CREATE_ASK_ORDER && (
        <EnlistStage
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          handleChoiceChange={handleChoiceChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
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
