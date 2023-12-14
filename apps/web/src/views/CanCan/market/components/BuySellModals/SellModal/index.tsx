import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import { differenceInSeconds } from 'date-fns'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation, ContextApi, TranslateFunction } from '@pancakeswap/localization'
import {
  useMarketTradesContract,
  useMarketOrdersContract,
  useNftMarketContract,
  useMarketHelperContract,
  useMarketCollectionsContract,
  usePaywallMarketHelperContract,
  useNFTicketHelper,
  usePaywallMarketOrdersContract,
  usePaywallMarketTradesContract,
  usePaywallMarketHelper2Contract,
  useMarketHelper2Contract,
} from 'hooks/useContract'
import BigNumber from 'bignumber.js'
import { useGetLowestPriceFromNft } from 'views/CanCan/market/hooks/useGetLowestPrice'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useWeb3React } from '@pancakeswap/wagmi'
import { decryptContent, getThumbnailNContent } from 'utils/cancan'
import { useGetPaywallARP, useGetSubscriptionStatus } from 'state/cancan/hooks'
import { getSSIContract } from 'utils/contractHelpers'
import { getMarketHelperAddress, getPaywallMarketHelperAddress } from 'utils/addressHelpers'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

import EditStage from './EditStage'
import SetPriceStage from './SetPriceStage'
import SetOptionsStage from './SetOptionsStage'
import { StyledModal, stagesWithBackButton } from './styles'
import { SellingStage, OptionType } from './types'
import ConfirmStage from '../shared/ConfirmStage'
import RemoveStage from './RemoveStage'
import IdentityRequirementStage from './IdentityRequirementStage'
import BurnTokenForCreditStage from './BurnTokenForCreditStage'
import UserPaymentCredits from './UserPaymentCredits'
import DiscountsNCashbacks from './DiscountsNCashbacks'
import ResetIdentityLimits from './ResetIdentityLimits'
import ResetDiscountLimits from './ResetDiscountLimits'
import ResetCashbackLimits from './ResetCashbackLimits'
import TimeEstimationStage from './TimeEstimationStage'
import ReclaimCashbackStage from './ReclaimCashbackStage'
import LocationStage from './LocationStage'

const modalTitles = (t: TranslateFunction) => ({
  [SellingStage.EDIT]: t('Price Settings'),
  [SellingStage.ADJUST_PRICE]: t('Adjust Price'),
  [SellingStage.ADJUST_OPTIONS]: t('Adjust Options'),
  [SellingStage.ADD_LOCATION]: t('Adjust Location Data'),
  [SellingStage.TIME_ESTIMATION]: t('Time Estimation'),
  [SellingStage.RECLAIM_CASHBACK_FUND]: t('Reclaim Cashback Fund'),
  [SellingStage.UPDATE_IDENTITY_REQUIREMENTS]: t('Update Identity Requirements'),
  [SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS]: t('Update Tokens To Burn For Credit'),
  [SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS]: t('Update Discounts and Cashbacks'),
  [SellingStage.ADD_USERS_PAYMENT_CREDIT]: t('Users Payment Credits'),
  [SellingStage.UPDATE_MERCHANT_PROOF_TYPE]: t('Update Merchant Proof Type'),
  [SellingStage.UPDATE_TAG]: t('Update Tag'),
  [SellingStage.UPDATE_TAG_REGISTRATION]: t('Update Tag Registration'),
  [SellingStage.UPDATE_PRICE_PER_MINUTE]: t('Update Price Per Minute'),
  [SellingStage.REMOVE_FROM_MARKET]: t('Remove From Market'),
  [SellingStage.REINITIALIZE_IDENTITY_LIMITS]: t('Reset Identity Limits'),
  [SellingStage.REINITIALIZE_DISCOUNTS_LIMITS]: t('Reset Discounts Limits'),
  [SellingStage.REINITIALIZE_CASHBACK_LIMITS]: t('Reset Cashback Limits'),
  [SellingStage.CONFIRM_ADJUST_PRICE]: t('Back'),
  [SellingStage.CONFIRM_ADJUST_OPTIONS]: t('Back'),
  [SellingStage.CONFIRM_ADD_LOCATION]: t('Back'),
  [SellingStage.CONFIRM_TIME_ESTIMATION]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_MERCHANT_PROOF_TYPE]: t('Back'),
  [SellingStage.CONFIRM_REMOVE_FROM_MARKET]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_PRICE_PER_MINUTE]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_IDENTITY_REQUIREMENTS]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS]: t('Back'),
  [SellingStage.CONFIRM_ADD_USERS_PAYMENT_CREDIT]: t('Back'),
  [SellingStage.CONFIRM_RECLAIM_CASHBACK_FUND]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_TAG]: t('Back'),
  [SellingStage.CONFIRM_UPDATE_TAG_REGISTRATION]: t('Back'),
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

const SellModal: React.FC<any> = ({ variant, nftToSell, currency, onDismiss }) => {
  const collectionId = useRouter().query.collectionAddress as string
  const options = nftToSell?.options?.map((option, index) => {
    return {
      id: index,
      ...option,
      unitPrice: getBalanceNumber(option?.unitPrice),
      value: variant === 'paywall' ? parseInt(option?.value) / 60 : option?.value,
    }
  })
  console.log('options=============>', options)
  const { account } = useWeb3React()
  const { mp4, thumbnail } = getThumbnailNContent(nftToSell)
  const paywallARP = useGetPaywallARP(nftToSell?.collection?.id ?? '')
  const { ongoingSubscription } = useGetSubscriptionStatus(
    paywallARP?.paywallAddress ?? '',
    account ?? '',
    '0',
    nftToSell?.tokenId,
  )
  const { thumbnail: _thumbnail, mp4: _mp4 } = decryptContent(nftToSell, thumbnail, mp4, ongoingSubscription, account)
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
    checkItemOnly: Number(nftToSell.priceReductor?.checkItemOnly) || 0,
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
    mp4: _mp4 ?? '',
    isArticle: 0,
    decreasing: nftToSell?.minBidIncrementPercentage > 0,
    gif: '',
    checker: '',
    discountNumber: '',
    clear: 0,
    collectionId: '',
    destination: '',
    prices: nftToSell?.prices?.toString() ?? '',
    start: nftToSell?.start ?? '0',
    period: nftToSell?.period ?? '0',
    isTradable: Number(nftToSell?.isTradable) ?? 0,
    isPaywall: 0,
    tag: '',
    add: 0,
    profileId: '',
    proofType: 0,
    mediaType: 0,
    itemTimeEstimate: '',
    options2: '',
    optionsTimeEstimates: '',
  }))
  console.log('state================>', nftToSell)
  const [stage, setStage] = useState(SellingStage.EDIT)
  const [price, setPrice] = useState(nftToSell?.currentAskPrice)
  const [paymentCredits, setPaymentCredits] = useState('')
  const [creditUsers, setCreditUsers] = useState('')
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const marketCollectionsContract = useMarketCollectionsContract()
  const marketOrdersContract = useMarketOrdersContract()
  const marketTradesContract = useMarketTradesContract()
  const marketHelperContract = useMarketHelperContract()
  const marketHelper2Contract = useMarketHelper2Contract()
  const nfticketHelperContract = useNFTicketHelper()
  const paywallMarketHelperContract = usePaywallMarketHelperContract()
  const paywallMarketHelper2Contract = usePaywallMarketHelper2Contract()
  const paywallMarketOrdersContract = usePaywallMarketOrdersContract()
  const paywallMarketTradesContract = usePaywallMarketTradesContract()
  const ordersSigner = variant === 'paywall' ? paywallMarketOrdersContract : marketOrdersContract
  const tradesSigner = variant === 'paywall' ? paywallMarketTradesContract : marketTradesContract
  const helpersSigner = variant === 'paywall' ? paywallMarketHelperContract : marketHelperContract
  const helpers2Signer = variant === 'paywall' ? paywallMarketHelper2Contract : marketHelper2Contract
  const nftMarketContract = useNftMarketContract()
  const [nftFilters, setNftFilters] = useState({
    country: nftToSell?.countries,
    city: nftToSell?.cities,
    product: nftToSell?.products,
  })

  const updateValue = (key: any, value: any) => {
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
      case SellingStage.ADD_LOCATION:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_ADD_LOCATION:
        setStage(SellingStage.ADD_LOCATION)
        break
      case SellingStage.TIME_ESTIMATION:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_TIME_ESTIMATION:
        setStage(SellingStage.TIME_ESTIMATION)
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
      case SellingStage.RECLAIM_CASHBACK_FUND:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_RECLAIM_CASHBACK_FUND:
        setStage(SellingStage.RECLAIM_CASHBACK_FUND)
        break
      case SellingStage.UPDATE_PRICE_PER_MINUTE:
        setStage(SellingStage.EDIT)
        break
      case SellingStage.CONFIRM_UPDATE_PRICE_PER_MINUTE:
        setStage(SellingStage.UPDATE_PRICE_PER_MINUTE)
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
      case SellingStage.TIME_ESTIMATION:
        setStage(SellingStage.CONFIRM_TIME_ESTIMATION)
        break
      case SellingStage.RECLAIM_CASHBACK_FUND:
        setStage(SellingStage.CONFIRM_RECLAIM_CASHBACK_FUND)
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
      case SellingStage.UPDATE_PRICE_PER_MINUTE:
        setStage(SellingStage.CONFIRM_UPDATE_PRICE_PER_MINUTE)
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
      default:
        break
    }
  }

  const continueToUpdateIdentityStage = () => {
    setStage(SellingStage.UPDATE_IDENTITY_REQUIREMENTS)
  }

  const continueToReclaimCashbackStage = () => {
    setStage(SellingStage.RECLAIM_CASHBACK_FUND)
  }

  const continueToAdjustOptions = () => setStage(SellingStage.ADJUST_OPTIONS)
  const continueToLocationStage = () => setStage(SellingStage.ADD_LOCATION)
  const continueToTimeEstimateStage = () => setStage(SellingStage.TIME_ESTIMATION)

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
        console.log('CONFIRM_ADJUST_PRICE=================>', ordersSigner, [
          nftToSell?.currentSeller,
          nftToSell?.tokenId,
          currentAskPrice.toString(),
          state.bidDuration,
          parseInt(state.minBidIncrementPercentage) * 100,
          !!state.transferrable,
          !!state.requireUpfrontPayment,
          state.rsrcTokenId,
          state.maxSupply,
          dropInTimer.toString(),
        ])
        return callWithGasPrice(ordersSigner, 'modifyAskOrder', [
          nftToSell?.currentSeller,
          nftToSell?.tokenId,
          currentAskPrice.toString(),
          state.bidDuration,
          parseInt(state.minBidIncrementPercentage) * 100,
          !!state.transferrable,
          !!state.requireUpfrontPayment,
          state.rsrcTokenId,
          state.maxSupply,
          dropInTimer.toString(),
        ]).catch((err) => console.log('CONFIRM_ADJUST_PRICE=================>', err))
      }
      if (stage === SellingStage.CONFIRM_ADJUST_OPTIONS) {
        const contract = variant === 'paywall' ? paywallMarketHelperContract : helpersSigner
        const args =
          variant === 'paywall'
            ? [
                nftToSell.tokenId,
                state.options?.reduce((accum, attr) => [...accum, attr.min], []),
                state.options?.reduce((accum, attr) => [...accum, attr.max], []),
                state.options?.reduce((accum, attr) => [...accum, parseInt(attr.value) * 60], []), // value
                state.options?.reduce((accum, attr) => [...accum, getDecimalAmount(attr.unitPrice)?.toString()], []),
                state.options?.reduce((accum, attr) => [...accum, attr.category], []),
                state.options?.reduce((accum, attr) => [...accum, attr.element], []),
                state.options?.reduce((accum, attr) => [...accum, attr.category], []), // traitype
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
                state.options?.reduce((accum, attr) => [...accum, attr.category], []) || [], // traitype
                state.options?.reduce((accum, attr) => [...accum, attr.element], []) || [], // value
                state.options?.reduce((accum, attr) => [...accum, attr.currency], []) || [],
              ]
        console.log('CONFIRM_ADJUST_OPTIONS===================>', args)
        return callWithGasPrice(contract, 'updateOptions', args).catch((err) =>
          console.log('CONFIRM_ADJUST_OPTIONS=================>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_ADD_LOCATION) {
        let args = []
        try {
          const delim = state.customTags?.length ? ',' : ''
          args = [
            state.tokenId,
            state.description,
            state.prices?.split(',')?.filter((val) => !!val),
            state.start,
            state.period,
            variant === 'item' ? 0 : 1,
            !!state.isTradable,
            state.isArticle ? `${state.thumbnail},${state.mp4}` : `${state.thumbnail},${state.thumbnail}`,
            nftFilters?.country?.toString(),
            nftFilters?.city?.toString(),
            nftFilters?.product?.toString() + delim + state.customTags,
          ]
          console.log('12CONFIRM_ADD_LOCATION==============>', args, state.thumbnail)
        } catch (err) {
          console.log('1CONFIRM_ADD_LOCATION============>', err)
        }
        return callWithGasPrice(marketCollectionsContract, 'emitAskInfo', args).catch((err) =>
          console.log('CONFIRM_ADD_LOCATION================>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_TIME_ESTIMATION) {
        const args = [
          nftToSell.tokenId,
          variant === 'paywall' ? getPaywallMarketHelperAddress() : getMarketHelperAddress(),
          parseInt(state.itemTimeEstimate) * 60,
          state.options2?.split(','),
          state.optionsTimeEstimates?.split(',')?.map((te) => parseInt(te) * 60),
        ]
        console.log('CONFIRM_TIME_ESTIMATION=================>', args)
        return callWithGasPrice(nfticketHelperContract, 'addTimeEstimates', args).catch((err) =>
          console.log('1CONFIRM_TIME_ESTIMATION===========>', err),
        )
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
        console.log('CONFIRM_UPDATE_IDENTITY_REQUIREMENTS1=================>', args)
        return callWithGasPrice(ordersSigner, 'modifyAskOrderIdentity', args).catch((err) =>
          console.log('CONFIRM_UPDATE_IDENTITY_REQUIREMENTS===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS) {
        const discountAmount = getDecimalAmount(new BigNumber(state.discountNumber ?? 0))
        const args = [
          state.token,
          state.checker ?? ADDRESS_ZERO,
          state.destination,
          state.checker ? discountAmount?.toString() : parseInt(state.discountNumber) * 100,
          state.collectionId,
          !!state.clear,
          state.productId,
        ]
        console.log('CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS===========>', args)
        return callWithGasPrice(helpersSigner, 'updateBurnTokenForCredit', args).catch((err) =>
          console.log('CONFIRM_UPDATE_BURN_FOR_CREDIT_TOKENS===========>', err),
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
          const perct = cashbackNumbers?.length ? parseInt(cashbackNumbers[2]) * 100 : 0
          const lowerThreshold = cashbackNumbers?.length ? cashbackNumbers[3] : 0
          const upperThreshold = cashbackNumbers?.length ? cashbackNumbers[4] : 0
          const limit = cashbackNumbers?.length ? cashbackNumbers[5] : 0

          const cashbackCost = state.cashbackCost?.split(',')
          const cursor2 = cashbackCost?.length ? cashbackCost[0] : 0
          const size2 = cashbackCost?.length ? cashbackCost[1] : 0
          const perct2 = cashbackCost?.length ? parseInt(cashbackCost[2]) * 100 : 0
          const lowerThreshold2 = cashbackCost?.length ? getDecimalAmount(cashbackCost[3] ?? 0) : 0
          const upperThreshold2 = cashbackCost?.length ? getDecimalAmount(cashbackCost[4] ?? 0) : 0
          const limit2 = cashbackCost?.length ? cashbackCost[5] : 0
          const args = [
            nftToSell.tokenId,
            state.cashbackStatus,
            cashbackStart,
            !!state.checkItemOnly,
            !!state.cashNotCredit,
            [cursor, size, perct, lowerThreshold?.toString(), upperThreshold?.toString(), limit],
            [cursor2, size2, perct2, lowerThreshold2?.toString(), upperThreshold2?.toString(), limit2],
          ]
          console.log('CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS1===============>', args)
          return callWithGasPrice(ordersSigner, 'modifyAskOrderCashbackPriceReductors', args).catch((err) =>
            console.log('CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS1===============>', err),
          )
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
        const perct = discountNumbers?.length ? parseInt(discountNumbers[2]) * 100 : 0
        const lowerThreshold = discountNumbers?.length ? discountNumbers[3] : 0
        const upperThreshold = discountNumbers?.length ? discountNumbers[4] : 0
        const limit = discountNumbers?.length ? discountNumbers[5] : 0

        const discountCost = state.discountCost?.split(',')
        const cursor2 = discountCost?.length ? discountCost[0] : 0
        const size2 = discountCost?.length ? discountCost[1] : 0
        const perct2 = discountCost?.length ? parseInt(discountCost[2]) * 100 : 0
        const lowerThreshold2 = discountCost?.length ? getDecimalAmount(discountCost[3] ?? 0) : 0
        const upperThreshold2 = discountCost?.length ? getDecimalAmount(discountCost[4] ?? 0) : 0
        const limit2 = discountCost?.length ? discountCost[5] : 0
        const args = [
          nftToSell.tokenId,
          state.discountStatus,
          discountStart,
          !!state.cashNotCredit,
          !!state.checkItemOnly,
          !!state.checkIdentityCode,
          [cursor, size, perct, lowerThreshold?.toString(), upperThreshold?.toString(), limit],
          [cursor2, size2, perct2, lowerThreshold2?.toString(), upperThreshold2?.toString(), limit2],
        ]
        console.log('CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS===============>', args)
        return callWithGasPrice(ordersSigner, 'modifyAskOrderDiscountPriceReductors', args).catch((err) =>
          console.log('CONFIRM_UPDATE_DISCOUNTS_AND_CASHBACKS===============>', err),
        )
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
          continueToTimeEstimateStage={continueToTimeEstimateStage}
          continueToUpdateIdentityStage={continueToUpdateIdentityStage}
          continueToUpdateBurnForCreditStage={continueToUpdateBurnForCreditStage}
          continueToReclaimCashbackStage={continueToReclaimCashbackStage}
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
          thumbnail={_thumbnail}
          nftToSell={nftToSell}
          variant="adjust"
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
          thumbnail={_thumbnail}
          nftToSell={nftToSell}
          state={state}
          addValue={variant === 'paywall'}
          collectionId={collectionId}
          handleChoiceChange={handleChoiceChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_IDENTITY_REQUIREMENTS && (
        <IdentityRequirementStage
          thumbnail={_thumbnail}
          nftToSell={nftToSell}
          state={state}
          collectionId={collectionId}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_BURN_FOR_CREDIT_TOKENS && (
        <BurnTokenForCreditStage
          thumbnail={_thumbnail}
          nftToSell={nftToSell}
          lowestPrice={lowestPrice}
          collectionId={collectionId}
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_DISCOUNTS_AND_CASHBACKS && (
        <DiscountsNCashbacks
          thumbnail={_thumbnail}
          nftToSell={nftToSell}
          lowestPrice={lowestPrice}
          state={state}
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
          thumbnail={_thumbnail}
          state={state}
          nftToSell={nftToSell}
          collectionId={collectionId}
          lowestPrice={lowestPrice}
          paymentCredits={paymentCredits}
          setPaymentCredits={setPaymentCredits}
          creditUsers={creditUsers}
          setCreditUsers={setCreditUsers}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.TIME_ESTIMATION && (
        <TimeEstimationStage
          state={state}
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
      {stage === SellingStage.ADD_LOCATION && (
        <LocationStage
          show
          thumbnail={_thumbnail}
          nftToSell={nftToSell}
          collectionId={collectionId}
          state={state}
          variant={variant}
          nftFilters={nftFilters}
          collection={nftToSell?.collection}
          setNftFilters={setNftFilters}
          updateValue={updateValue}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
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
        SellingStage.CONFIRM_TIME_ESTIMATION,
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
