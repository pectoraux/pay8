import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import { differenceInSeconds } from 'date-fns'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { getBalanceAmount, getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation, ContextApi, TranslateFunction } from '@pancakeswap/localization'
import {
  useNftMarketTradesContract,
  useNftMarketOrdersContract,
  useNftMarketContract,
  useNftMarketHelperContract,
  useMarketCollectionsContract,
  usePaywallMarketHelperContract,
  usePaywallMarketOrdersContract,
  usePaywallMarketTradesContract,
  usePaywallMarketHelper2Contract,
  useNftMarketHelper2Contract,
} from 'hooks/useContract'
import { useGetLowestPriceFromNft } from 'views/CanCan/market/hooks/useGetLowestPrice'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useWeb3React } from '@pancakeswap/wagmi'
import { decryptContent, getThumbnailNContent } from 'utils/cancan'
import { useGetPaywallARP, useGetSubscriptionStatus, useGetTagsFromProductId } from 'state/cancan/hooks'
import { getSSIContract } from 'utils/contractHelpers'

import SetPriceStage from './SetPriceStage'
import SetOptionsStage from './SetOptionsStage'
import EditStage from './EditStage'
import { StyledModal, stagesWithBackButton } from './styles'
import { SellingStage, OptionType, ARRAY_KEYS } from './types'
import ConfirmStage from '../shared/ConfirmStage'
import RemoveStage from './RemoveStage'
import IdentityRequirementStage from './IdentityRequirementStage'
import BurnTokenForCreditStage from './BurnTokenForCreditStage'
import UserPaymentCredits from './UserPaymentCredits'
import DiscountsNCashbacks from './DiscountsNCashbacks'
import ResetIdentityLimits from './ResetIdentityLimits'
import ResetDiscountLimits from './ResetDiscountLimits'
import ResetCashbackLimits from './ResetCashbackLimits'
import LocationStage from './LocationStage'
import ReclaimCashbackStage from './ReclaimCashbackStage'

const modalTitles = (t: TranslateFunction) => ({
  [SellingStage.EDIT]: t('Price Settings'),
  [SellingStage.ADJUST_PRICE]: t('Adjust Price'),
  [SellingStage.ADJUST_OPTIONS]: t('Adjust Options'),
  [SellingStage.RECLAIM_CASHBACK_FUND]: t('Reclaim Cashback Fund'),
  [SellingStage.ADD_LOCATION]: t('Adjust Location Data'),
  [SellingStage.UPDATE_IDENTITY_REQUIREMENTS]: t('Update Identity Requirements'),
  [SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS]: t('Update Tokens To Burn For Credit'),
  [SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS]: t('Update Discounts and Cashbacks'),
  [SellingStage.ADD_USERS_PAYMENT_CREDIT]: t('Users Payment Credits'),
  [SellingStage.REMOVE_FROM_MARKET]: t('Remove From Market'),
  [SellingStage.REINITIALIZE_IDENTITY_LIMITS]: t('Reset Identity Limits'),
  [SellingStage.REINITIALIZE_DISCOUNTS_LIMITS]: t('Reset Discounts Limits'),
  [SellingStage.REINITIALIZE_CASHBACK_LIMITS]: t('Reset Cashback Limits'),
  [SellingStage.CONFIRM_ADJUST_PRICE]: t('Back'),
  [SellingStage.CONFIRM_ADJUST_OPTIONS]: t('Back'),
  [SellingStage.CONFIRM_ADD_LOCATION]: t('Back'),
  [SellingStage.CONFIRM_REMOVE_FROM_MARKET]: t('Back'),
  [SellingStage.CONFIRM_RECLAIM_CASHBACK_FUND]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS]: t('Back'),
  [SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT]: t('Back'),
  [SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS]: t('Back'),
  [SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS]: t('Back'),
  [SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS]: t('Back'),
  [SellingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

const getToastText = (variant: string, stage: SellingStage, t: ContextApi['t']) => {
  if (stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET) {
    return t('Your item has been removed from the marketplace')
  }
  if (stage === SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS) {
    return t('Identity requirements for your Item have been updated')
  }
  if (stage === SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS) {
    return t('Tokens to burn for credit on your item have been updated')
  }
  if (stage === SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS) {
    return t('Discount and cashback options for your item have been updated')
  }
  if (stage === SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT) {
    return t('All users payment credits have been updated')
  }
  if (stage === SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS) {
    return t('Identity limits on your item have been reset')
  }
  if (stage === SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS) {
    return t('Discount limits on your item have been reset')
  }
  if (stage === SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS) {
    return t('Cashback limits on your item have been reset')
  }
  return t('Your item listing has been changed.')
}

interface SellModalProps extends InjectedModalProps {
  variant: 'item' | 'paywall'
  currency?: any
  nftToSell?: any
  onSuccessSale: () => void
}

const SellModal: React.FC<any> = ({ variant, currency, nftToSell, onDismiss }) => {
  const collectionId = useRouter().query.collectionAddress as string
  const { account } = useWeb3React()
  let { mp4, thumbnail } = getThumbnailNContent(nftToSell)
  const paywallARP = useGetPaywallARP(nftToSell?.collection?.id ?? '', nftToSell?.tokenId) as any
  const { ongoingSubscription } = useGetSubscriptionStatus(
    paywallARP?.paywallAddress ?? '',
    account ?? '',
    '0',
    nftToSell?.tokenId,
  )
  const { thumbnail: _thumbnail, mp4: _mp4 } = decryptContent(nftToSell, thumbnail, mp4, ongoingSubscription, account)
  const options =
    nftToSell?.option_categories?.map((cat, index) => {
      return {
        id: `${index}`,
        category: `${cat}`,
        element: `${nftToSell?.option_elements && nftToSell?.option_elements[index]}`,
        traitType: `${nftToSell?.option_traitTypes && nftToSell?.option_traitTypes[index]}`,
        value: `${nftToSell?.option_values && nftToSell?.option_values[index]}`,
        min: `${nftToSell?.option_mins && nftToSell?.option_mins[index]}`,
        max: `${nftToSell?.option_maxs && nftToSell?.option_maxs[index]}`,
        unitPrice: `${nftToSell?.option_unitPrices && getBalanceAmount(nftToSell?.option_unitPrices[index])}`,
        currency: `${nftToSell?.option_currencies && nftToSell?.option_currencies[index]}`,
      }
    }) || []

  const [state, setState] = useState<any>(() => ({
    // adjust price variables
    productId: nftToSell?.tokenId ?? '',
    tokenId: nftToSell?.tokenId ?? '',
    price: nftToSell?.currentAskPrice,
    bidDuration: parseInt(nftToSell?.bidDuration || 0) / 60,
    minBidIncrementPercentage: parseInt(nftToSell?.minBidIncrementPercentage || 0) / 100,
    transferrable: Number(nftToSell?.transferrable),
    requireUpfrontPayment: Number(nftToSell?.requireUpfrontPayment),
    rsrcTokenId: nftToSell?.rsrcTokenId || 0,
    options,
    maxSupply: nftToSell?.maxSupply || 0,
    dropInTimer: Number(nftToSell?.dropinTimer || 0) / 60,
    // discount & cashback variables
    discountStatus: Number(nftToSell.priceReductor?.discountStatus) || 0,
    discountStart: Number(nftToSell.priceReductor?.discountStart) * 1000 || 0,
    cashbackStatus: Number(nftToSell.priceReductor?.cashbackStatus) || 0,
    cashbackStart: Number(nftToSell.priceReductor?.cashbackStart) * 1000 || 0,
    cashNotCredit: Number(nftToSell.priceReductor?.cashNotCredit) || 0,
    checkIdentityCode: Number(nftToSell.priceReductor?.checkIdentityCode) || 0,
    discountNumbers: Object.values(nftToSell.priceReductor?.discountNumbers ?? {})
      ?.map((v: any, i) => {
        if (i === 2) return parseInt(v) / 100
        return v
      })
      ?.toString(),
    discountCost: Object.values(nftToSell.priceReductor?.discountCost ?? {})
      ?.map((v: any, i) => {
        if (i === 2) return parseInt(v) / 100
        if (i === 3 || i === 4) return getBalanceNumber(v)
        return v
      })
      ?.toString(),
    cashbackNumbers: Object.values(nftToSell.priceReductor?.cashbackNumbers ?? {})
      ?.map((v: any, i) => {
        if (i === 2) return parseInt(v) / 100
        return v
      })
      ?.toString(),
    cashbackCost: Object.values(nftToSell.priceReductor?.cashbackCost ?? {})
      ?.map((v: any, i) => {
        if (i === 2) return parseInt(v) / 100
        return v
      })
      ?.toString(),
    addPaywall: '',
    removePaywall: '',
    token: nftToSell.usetFIAT ? nftToSell?.tFIAT : nftToSell?.ve,
    onlyTrustWorthyAuditors: nftToSell?.identityProof?.onlyTrustWorthyAuditors ?? 0,
    dataKeeperOnly: nftToSell?.identityProof?.dataKeeperOnly ?? 0,
    maxUse: nftToSell?.identityProof?.maxUse ?? 0,
    minIDBadgeColor: nftToSell?.identityProof?.minIDBadgeColor ?? 0,
    valueName: nftToSell?.identityProof?.valueName ?? '',
    requiredIndentity: nftToSell?.identityProof?.requiredIndentity ?? '',
    usetFIAT: nftToSell?.usetFIAT ? 1 : 0,
    customTags: '',
    thumbnail: _thumbnail ?? '',
    description: nftToSell?.description ?? '',
    webm: '',
    gif: '',
    mp4: _mp4 ?? '',
    isArticle: 0,
    prices: nftToSell?.prices?.toString() ?? '',
    start: nftToSell?.start ?? '0',
    period: nftToSell?.period ?? '0',
    isTradable: Number(nftToSell?.isTradable) ?? 0,
    isPaywall: 0,
    profileId: '',
    proofType: '',
  }))
  const products = useGetTagsFromProductId(nftToSell?.tokenId)
  const [stage, setStage] = useState(SellingStage.EDIT)
  const [price, setPrice] = useState(nftToSell?.currentAskPrice)
  const [burnForCreditToken, setBurnForCreditToken] = useState('')
  const [paymentCredits, setPaymentCredits] = useState('')
  const [creditUsers, setCreditUsers] = useState('')
  const [discountNumber, setDiscountNumber] = useState(0)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const marketOrdersContract = useNftMarketOrdersContract()
  const marketTradesContract = useNftMarketTradesContract()
  const marketHelperContract = useNftMarketHelperContract()
  const marketHelper2Contract = useNftMarketHelper2Contract()
  const paywallMarketHelperContract = usePaywallMarketHelperContract()
  const paywallMarketHelper2Contract = usePaywallMarketHelper2Contract()
  const paywallMarketOrdersContract = usePaywallMarketOrdersContract()
  const paywallMarketTradesContract = usePaywallMarketTradesContract()
  const ordersSigner = variant === 'paywall' ? paywallMarketOrdersContract : marketOrdersContract
  const tradesSigner = variant === 'paywall' ? paywallMarketTradesContract : marketTradesContract
  const helpersSigner = variant === 'paywall' ? paywallMarketHelperContract : marketHelperContract
  const helpers2Signer = variant === 'paywall' ? paywallMarketHelper2Contract : marketHelper2Contract
  const marketCollectionsContract = useMarketCollectionsContract()
  const nftMarketContract = useNftMarketContract()
  const [nftFilters, setNftFilters] = useState({
    country: nftToSell?.countries,
    city: nftToSell?.cities,
    product: products,
  })

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, ARRAY_KEYS.includes(inputName) ? value?.split(',') : value)
  }
  const handleChoiceChange = (newChoices: OptionType[]) => {
    updateValue('options', newChoices)
  }
  const handleRawValueChange = (key: string) => (value: Date | number | boolean | string) => {
    updateValue(key, value)
  }
  const { lowestPrice } = useGetLowestPriceFromNft(nftToSell)

  const goBack = () => {
    switch (stage) {
      case SellingStage.ADJUST_PRICE:
        setPrice(nftToSell?.currentAskPrice)
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADJUST_PRICE:
        setStage(SellingStage.ADJUST_PRICE)
        break
      case SellingStage.ADJUST_OPTIONS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADJUST_OPTIONS:
        setStage(SellingStage.ADJUST_OPTIONS)
        break
      case SellingStage.RECLAIM_CASHBACK_FUND:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_RECLAIM_CASHBACK_FUND:
        setStage(SellingStage.RECLAIM_CASHBACK_FUND)
        break
      case SellingStage.ADD_LOCATION:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADD_LOCATION:
        setStage(SellingStage.ADD_LOCATION)
        break
      case SellingStage.UPDATE_IDENTITY_REQUIREMENTS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS:
        setStage(SellingStage.UPDATE_IDENTITY_REQUIREMENTS)
        break
      case SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS:
        setStage(SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS)
        break
      case SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS:
        setStage(SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS)
        break
      case SellingStage.ADD_USERS_PAYMENT_CREDIT:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT:
        setStage(SellingStage.ADD_USERS_PAYMENT_CREDIT)
        break
      case SellingStage.REINITIALIZE_IDENTITY_LIMITS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS:
        setStage(SellingStage.REINITIALIZE_IDENTITY_LIMITS)
        break
      case SellingStage.REINITIALIZE_DISCOUNTS_LIMITS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS:
        setStage(SellingStage.REINITIALIZE_DISCOUNTS_LIMITS)
        break
      case SellingStage.REINITIALIZE_CASHBACK_LIMITS:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS:
        setStage(SellingStage.REINITIALIZE_CASHBACK_LIMITS)
        break
      case SellingStage.REMOVE_FROM_MARKET:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_REMOVE_FROM_MARKET:
        setStage(SellingStage.REMOVE_FROM_MARKET)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case SellingStage.EDIT:
        setStage(SellingStage.ADJUST_PRICE)
        break
      case SellingStage.ADJUST_PRICE:
        setStage(SellingStage.CONFIRM_ADJUST_PRICE)
        break
      case SellingStage.ADJUST_OPTIONS:
        setStage(SellingStage.CONFIRM_ADJUST_OPTIONS)
        break
      case SellingStage.ADD_LOCATION:
        setStage(SellingStage.CONFIRM_ADD_LOCATION)
        break
      case SellingStage.UPDATE_IDENTITY_REQUIREMENTS:
        setStage(SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS)
        break
      case SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS:
        setStage(SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS)
        break
      case SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS:
        setStage(SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS)
        break
      case SellingStage.ADD_USERS_PAYMENT_CREDIT:
        setStage(SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT)
        break
      case SellingStage.REMOVE_FROM_MARKET:
        setStage(SellingStage.CONFIRM_REMOVE_FROM_MARKET)
        break
      case SellingStage.REINITIALIZE_IDENTITY_LIMITS:
        setStage(SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS)
        break
      case SellingStage.REINITIALIZE_DISCOUNTS_LIMITS:
        setStage(SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS)
        break
      case SellingStage.REINITIALIZE_CASHBACK_LIMITS:
        setStage(SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS)
        break
      case SellingStage.RECLAIM_CASHBACK_FUND:
        setStage(SellingStage.CONFIRM_RECLAIM_CASHBACK_FUND)
        break
      default:
        break
    }
  }

  const continueToUpdateIdentityStage = () => {
    setStage(SellingStage.UPDATE_IDENTITY_REQUIREMENTS)
  }

  const continueToReclaimCashbackStage = () => {
    setStage(SellingStage.CONFIRM_RECLAIM_CASHBACK_FUND)
  }

  const continueToAdjustOptions = () => setStage(SellingStage.ADJUST_OPTIONS)
  const continueToLocationStage = () => setStage(SellingStage.ADD_LOCATION)

  const continueToUpdateBurnForCreditStage = () => {
    setStage(SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS)
  }

  const continueToUpdateMerchantProofTypeStage = () => {
    setStage(SellingStage.UPDATE_MERCHANT_PROOF_TYPE)
  }

  const continueToUpdateDiscountsAndCashbackStage = () => {
    setStage(SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS)
  }

  const continueToAddUsersPaymentCreditStage = () => {
    setStage(SellingStage.ADD_USERS_PAYMENT_CREDIT)
  }

  const continueToReinitializeIdentityLimitsStage = () => {
    setStage(SellingStage.REINITIALIZE_IDENTITY_LIMITS)
  }

  const continueToReinitializeDiscountLimitsStage = () => {
    setStage(SellingStage.REINITIALIZE_DISCOUNTS_LIMITS)
  }

  const continueToReinitializeCashbackLimitsStage = () => {
    setStage(SellingStage.REINITIALIZE_CASHBACK_LIMITS)
  }

  const continueToRemoveFromMarketStage = () => {
    setStage(SellingStage.REMOVE_FROM_MARKET)
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        // const approvedForContract = await collectionContractReader.isApprovedForAll(account, nftMarketContract.address)
        // return !approvedForContract
        return false
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(nftMarketContract, 'setApprovalForAll', [nftMarketContract.address, true])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now put your NFT for sale!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET) {
        console.log('CONFIRM_REMOVE_FROM_MARKET=================>', [nftToSell?.tokenId])
        return callWithGasPrice(ordersSigner, 'cancelAskOrder', [nftToSell?.tokenId]).catch((err) =>
          console.log('CONFIRM_REMOVE_FROM_MARKET=================>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_RECLAIM_CASHBACK_FUND) {
        console.log('CONFIRM_RECLAIM_CASHBACK_FUND=================>', [nftToSell?.tokenId])
        return callWithGasPrice(helpers2Signer, 'addCashBackToRevenue', [nftToSell?.tokenId]).catch((err) =>
          console.log('CONFIRM_RECLAIM_CASHBACK_FUND=================>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_ADJUST_PRICE) {
        const currentAskPrice = getDecimalAmount(state.price ?? 0)
        const dropInTimer = Math.max(
          differenceInSeconds(new Date(state.dropInTimer || 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args = [
          nftToSell?.currentSeller,
          nftToSell?.tokenId,
          currentAskPrice.toString(),
          state.bidDuration,
          state.minBidIncrementPercentage,
          !!state.transferrable,
          !!state.requireUpfrontPayment,
          state.rsrcTokenId,
          state.maxSupply,
          dropInTimer.toString(),
        ]
        console.log('CONFIRM_ADJUST_PRICE=================>', args)
        return callWithGasPrice(ordersSigner, 'modifyAskOrder', args).catch((err) =>
          console.log('CONFIRM_ADJUST_PRICE=================>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_ADJUST_OPTIONS) {
        const args =
          variant === 'paywall'
            ? [
                nftToSell.tokenId,
                state.options?.reduce((accum, attr) => [...accum, attr.min], []),
                state.options?.reduce((accum, attr) => [...accum, attr.max], []),
                state.options?.reduce((accum, attr) => [...accum, attr.value], []),
                state.options?.reduce((accum, attr) => [...accum, getDecimalAmount(attr.unitPrice)?.toString()], []),
                state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                state.options?.reduce((accum, attr) => [...accum, attr.element], []),
                state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                state.options?.reduce((accum, attr) => [...accum, attr.currency], []),
              ]
            : [
                nftToSell.tokenId,
                state.options?.reduce((accum, attr) => [...accum, attr.min], []) || [],
                state.options?.reduce((accum, attr) => [...accum, attr.max], []) || [],
                state.options?.reduce(
                  (accum, attr) => [...accum, getDecimalAmount(attr.unitPrice ?? 0)?.toString()],
                  [],
                ) || [],
                state.options?.reduce((accum, attr) => [...accum, attr.category], []) || [],
                state.options?.reduce((accum, attr) => [...accum, attr.element], []) || [],
                state.options?.reduce((accum, attr) => [...accum, attr.category], []) || [],
                state.options?.reduce((accum, attr) => [...accum, attr.element], []) || [],
                state.options?.reduce((accum, attr) => [...accum, attr.currency], []) || [],
              ]
        console.log('CONFIRM_ADJUST_OPTIONS===================>', args)
        return callWithGasPrice(helpersSigner, 'updateOptions', args).catch((err) =>
          console.log('CONFIRM_ADJUST_OPTIONS=================>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_ADD_LOCATION) {
        try {
          console.log('CONFIRM_ADD_LOCATION==============>', [
            nftToSell.tokenId,
            state.description,
            state.prices?.split(',')?.filter((val) => !!val),
            state.start,
            state.period,
            variant === 'item' ? 2 : 1,
            !!state.isTradable,
            state.isArticle ? `${state.thumbnail},${state.mp4}` : `${state.thumbnail},${state.thumbnail}`,
            nftFilters?.country?.reduce((accum, attr) => [...accum, attr], []),
            nftFilters?.city?.reduce((accum, attr) => [...accum, attr], []),
            nftFilters?.product
              ? [...nftFilters?.product, ...state.customTags.split(',')]
                  ?.filter((val) => !!val)
                  ?.reduce((accum, attr) => [...accum, attr], [])
              : [...state.customTags.split(',')]?.filter((val) => !!val)?.reduce((accum, attr) => [...accum, attr], []),
          ])
        } catch (err) {
          console.log('1CONFIRM_ADD_LOCATION============>', err)
        }
        const customTags = state.customTags?.split(',')
        return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', [
          state.tokenId,
          state.description,
          state.prices?.split(',')?.filter((val) => !!val),
          state.start,
          state.period,
          variant === 'item' ? 2 : 1,
          !!state.isTradable,
          `${state.thumbnail},${state.mp4}`,
          nftFilters?.country?.reduce((accum, attr) => [...accum, attr], []),
          nftFilters?.city?.reduce((accum, attr) => [...accum, attr], []),
          customTags.length && customTags[0],
        ]).catch((err) => console.log('CONFIRM_ADD_LOCATION================>', err))
      }
      if (stage === SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS) {
        const args = [
          nftToSell.tokenId,
          state.requiredIndentity,
          state.valueName,
          !!state.onlyTrustWorthyAuditors,
          !!state.dataKeeperOnly,
          state.maxUse,
          state.minIDBadgeColor,
        ]
        console.log('CONFIRM_UPDATE_IDENTITY_REQUIREMENTS=================>', args)
        return callWithGasPrice(ordersSigner, 'modifyAskOrderIdentity', args).catch((err) =>
          console.log('CONFIRM_UPDATE_IDENTITY_REQUIREMENTS===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS) {
        console.log('CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS===========>', [burnForCreditToken, discountNumber])
        return callWithGasPrice(helpersSigner, 'updateBurnTokenForCredit', [burnForCreditToken, discountNumber]).catch(
          (err) => console.log('CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_UPDATE_MERCHANT_PROOF_TYPE) {
        console.log('CONFIRM_UPDATE_MERCHANT_PROOF_TYPE===========>', [state.profileId, state.proofType])
        return callWithGasPrice(getSSIContract(), 'updateMerchantProofType', [state.profileId, state.proofType]).catch(
          (err) => console.log('CONFIRM_UPDATE_MERCHANT_PROOF_TYPE===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT) {
        const amount = getDecimalAmount(new BigNumber(paymentCredits ?? 0))
        console.log('CONFIRM_ADD_USERS_PAYMENT_CREDIT===========>', [
          creditUsers,
          collectionId,
          state.productId,
          amount?.toString(),
        ])
        return callWithGasPrice(ordersSigner, 'incrementPaymentCredits', [
          creditUsers,
          collectionId,
          state.productId,
          amount?.toString(),
        ]).catch((err) => console.log('CONFIRM_ADD_USERS_PAYMENT_CREDIT===========>', err))
      }
      if (stage === SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS) {
        if (activeButtonIndex) {
          const cashbackStart = Math.max(
            differenceInSeconds(new Date(state.cashbackStart || 0), new Date(), {
              roundingMethod: 'ceil',
            }),
            0,
          )
          const cashbackNumbers = state.cashbackNumbers?.split(',')
          const cursor = cashbackNumbers?.length ? cashbackNumbers[0] : 0
          const size = cashbackNumbers?.length ? cashbackNumbers[1] : 0
          const perct = cashbackNumbers?.length ? cashbackNumbers[2] : 0
          const lowerThreshold = cashbackNumbers?.length ? cashbackNumbers[3] : 0
          const upperThreshold = cashbackNumbers?.length ? cashbackNumbers[4] : 0
          const limit = cashbackNumbers?.length ? cashbackNumbers[5] : 0

          const cashbackCost = state.cashbackCost?.split(',')
          const cursor2 = cashbackCost?.length ? cashbackCost[0] : 0
          const size2 = cashbackCost?.length ? cashbackCost[1] : 0
          const perct2 = cashbackCost?.length ? cashbackCost[2] : 0
          const lowerThreshold2 = cashbackCost?.length ? getDecimalAmount(cashbackCost[3] ?? 0) : 0
          const upperThreshold2 = cashbackCost?.length ? getDecimalAmount(cashbackCost[4] ?? 0) : 0
          const limit2 = cashbackCost?.length ? cashbackCost[5] : 0
          console.log('CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS1===============>', [
            nftToSell.tokenId,
            state.cashbackStatus,
            cashbackStart,
            !!state.cashNotCredit,
            [cursor, size, perct, lowerThreshold?.toString(), upperThreshold?.toString(), limit],
            [cursor2, size2, perct2, lowerThreshold2?.toString(), upperThreshold2?.toString(), limit2],
          ])
          return callWithGasPrice(ordersSigner, 'modifyAskOrderCashbackPriceReductors', [
            nftToSell.tokenId,
            state.cashbackStatus,
            cashbackStart,
            !!state.cashNotCredit,
            [cursor, size, perct, lowerThreshold?.toString(), upperThreshold?.toString(), limit],
            [cursor2, size2, perct2, lowerThreshold2?.toString(), upperThreshold2?.toString(), limit2],
          ]).catch((err) => console.log('CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS1===============>', err))
        }
        const discountStart = Math.max(
          differenceInSeconds(new Date(state.discountStart || 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const discountNumbers = state.discountNumbers?.split(',')
        const cursor = discountNumbers?.length ? discountNumbers[0] : 0
        const size = discountNumbers?.length ? discountNumbers[1] : 0
        const perct = discountNumbers?.length ? discountNumbers[2] : 0
        const lowerThreshold = discountNumbers?.length ? discountNumbers[3] : 0
        const upperThreshold = discountNumbers?.length ? discountNumbers[4] : 0
        const limit = discountNumbers?.length ? discountNumbers[5] : 0

        const discountCost = state.discountCost?.split(',')
        const cursor2 = discountCost?.length ? discountCost[0] : 0
        const size2 = discountCost?.length ? discountCost[1] : 0
        const perct2 = discountCost?.length ? discountCost[2] : 0
        const lowerThreshold2 = discountCost?.length ? getDecimalAmount(discountCost[3] ?? 0) : 0
        const upperThreshold2 = discountCost?.length ? getDecimalAmount(discountCost[4] ?? 0) : 0
        const limit2 = discountCost?.length ? discountCost[5] : 0
        console.log('CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS===============>', [
          nftToSell.tokenId,
          state.discountStatus,
          discountStart,
          !!state.cashNotCredit,
          !!state.checkIdentityCode,
          [cursor, size, perct, lowerThreshold?.toString(), upperThreshold?.toString(), limit],
          [cursor2, size2, perct2, lowerThreshold2?.toString(), upperThreshold2?.toString(), limit2],
        ])
        return callWithGasPrice(ordersSigner, 'modifyAskOrderDiscountPriceReductors', [
          nftToSell.tokenId,
          state.discountStatus,
          discountStart,
          !!state.cashNotCredit,
          !!state.checkIdentityCode,
          [cursor, size, perct, lowerThreshold?.toString(), upperThreshold?.toString(), limit],
          [cursor2, size2, perct2, lowerThreshold2?.toString(), upperThreshold2?.toString(), limit2],
        ]).catch((err) => console.log('CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS===============>', err))
      }
      if (stage === SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS) {
        console.log('CONFIRM_REINITIALIZE_IDENTITY_LIMITS===============>', [nftToSell?.tokenId])
        return callWithGasPrice(tradesSigner, 'reinitializeIdentityLimits', [nftToSell?.tokenId]).catch((err) =>
          console.log('CONFIRM_REINITIALIZE_IDENTITY_LIMITS===============>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS) {
        console.log('CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS===============>', [nftToSell?.tokenId])
        return callWithGasPrice(tradesSigner, 'reinitializeDiscountLimits', [nftToSell?.tokenId]).catch((err) =>
          console.log('CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS===============>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS) {
        console.log('CONFIRM_REINITIALIZE_CASHBACK_LIMITS===============>', [nftToSell?.tokenId])
        return callWithGasPrice(tradesSigner, 'reinitializeCashbackLimits', [nftToSell?.tokenId]).catch((err) =>
          console.log('CONFIRM_REINITIALIZE_CASHBACK_LIMITS===============>', err),
        )
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(getToastText(variant, stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      // onSuccessSale()
      setConfirmedTxHash(receipt.transactionHash)
      setStage(SellingStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {stage === SellingStage.EDIT && (
        <EditStage
          nftToSell={nftToSell}
          lowestPrice={lowestPrice}
          currency={currency}
          collectionId={collectionId}
          thumbnail={_thumbnail}
          continueToAdjustPriceStage={continueToNextStage}
          continueToAdjustOptions={continueToAdjustOptions}
          continueToLocationStage={continueToLocationStage}
          continueToUpdateIdentityStage={continueToUpdateIdentityStage}
          continueToReclaimCashbackStage={continueToReclaimCashbackStage}
          continueToUpdateBurnForCreditStage={continueToUpdateBurnForCreditStage}
          continueToUpdateMerchantProofTypeStage={continueToUpdateMerchantProofTypeStage}
          continueToAddUsersPaymentCreditStage={continueToAddUsersPaymentCreditStage}
          continueToUpdateDiscountsAndCashbackStage={continueToUpdateDiscountsAndCashbackStage}
          continueToReinitializeIdentityLimitsStage={continueToReinitializeIdentityLimitsStage}
          continueToReinitializeDiscountLimitsStage={continueToReinitializeDiscountLimitsStage}
          continueToReinitializeCashbackLimitsStage={continueToReinitializeCashbackLimitsStage}
          continueToRemoveFromMarketStage={continueToRemoveFromMarketStage}
        />
      )}
      {stage === SellingStage.ADJUST_PRICE && (
        <SetPriceStage
          nftToSell={nftToSell}
          variant="adjust"
          thumbnail={_thumbnail}
          currentPrice={nftToSell?.currentAskPrice}
          currency={currency}
          state={state}
          collectionId={collectionId}
          handleChange={handleChange}
          handleChoiceChange={handleChoiceChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.ADJUST_OPTIONS && (
        <SetOptionsStage
          nftToSell={nftToSell}
          state={state}
          thumbnail={_thumbnail}
          addValue={variant === 'paywall'}
          collectionId={collectionId}
          handleChoiceChange={handleChoiceChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_IDENTITY_REQUIREMENTS && (
        <IdentityRequirementStage
          nftToSell={nftToSell}
          state={state}
          thumbnail={_thumbnail}
          collectionId={collectionId}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS && (
        <BurnTokenForCreditStage
          state={state}
          nftToSell={nftToSell}
          thumbnail={_thumbnail}
          collectionId={collectionId}
          continueToNextStage={continueToNextStage}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS && (
        <DiscountsNCashbacks
          nftToSell={nftToSell}
          state={state}
          thumbnail={_thumbnail}
          collectionId={collectionId}
          activeButtonIndex={activeButtonIndex}
          setActiveButtonIndex={setActiveButtonIndex}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.ADD_USERS_PAYMENT_CREDIT && (
        <UserPaymentCredits
          state={state}
          nftToSell={nftToSell}
          thumbnail={_thumbnail}
          collectionId={collectionId}
          paymentCredits={paymentCredits}
          setPaymentCredits={setPaymentCredits}
          creditUsers={creditUsers}
          setCreditUsers={setCreditUsers}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.ADD_LOCATION && (
        <LocationStage
          show
          state={state}
          variant={variant}
          nftToSell={nftToSell}
          thumbnail={_thumbnail}
          nftFilters={nftFilters}
          products={products}
          collection={nftToSell?.collection}
          collectionId={collectionId}
          updateValue={updateValue}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.RECLAIM_CASHBACK_FUND && (
        <ReclaimCashbackStage
          nftToSell={nftToSell}
          isPaywall={variant === 'paywall'}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.REINITIALIZE_IDENTITY_LIMITS && (
        <ResetIdentityLimits continueToNextStage={continueToNextStage} />
      )}
      {stage === SellingStage.REINITIALIZE_DISCOUNTS_LIMITS && (
        <ResetDiscountLimits continueToNextStage={continueToNextStage} />
      )}
      {stage === SellingStage.REINITIALIZE_CASHBACK_LIMITS && (
        <ResetCashbackLimits continueToNextStage={continueToNextStage} />
      )}
      {[
        SellingStage.CONFIRM_ADJUST_PRICE,
        SellingStage.CONFIRM_ADJUST_OPTIONS,
        SellingStage.CONFIRM_ADD_LOCATION,
        SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS,
        SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS,
        SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS,
        SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT,
        SellingStage.CONFIRM_RECLAIM_CASHBACK_FUND,
        SellingStage.CONFIRM_REINITIALIZE_IDENTITY_LIMITS,
        SellingStage.CONFIRM_REINITIALIZE_DISCOUNTS_LIMITS,
        SellingStage.CONFIRM_REINITIALIZE_CASHBACK_LIMITS,
      ].includes(stage) && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === SellingStage.REMOVE_FROM_MARKET && <RemoveStage continueToNextStage={continueToNextStage} />}
      {stage === SellingStage.CONFIRM_REMOVE_FROM_MARKET && (
        <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />
      )}
      {stage === SellingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default SellModal
