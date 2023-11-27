import { differenceInSeconds } from 'date-fns'
import { useState, ChangeEvent } from 'react'
import { requiresApproval } from 'utils/requiresApproval'
import { Flex, Grid, Text, Button, useToast, Modal } from '@pancakeswap/uikit'
import { MaxUint256 } from '@pancakeswap/sdk'
import useTheme from 'hooks/useTheme'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation, ContextApi } from '@pancakeswap/localization'
import { useRouter } from 'next/router'

import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { getBep20Contract, getNFTicketHelper } from 'utils/contractHelpers'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import {
  useMarketCollectionsContract,
  useMarketEventsContract,
  useMarketTradesContract,
  useNFTicketHelper,
  usePaywallMarketTradesContract,
} from 'hooks/useContract'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import AvatarImage from '../../BannerHeader/AvatarImage'
import { SellingStage } from './types'
import ConfirmStage from '../shared/ConfirmStage'
import UpdateAuditorsStage from './UpdateAuditorsStage'
import ModifyCollectionModal from './ModifyCollectionModal'
import ModifyContactModal from './ModifyContactModal'
import TransferDueToNote from './TransferDueToNote'
import FundPendingRevenue from './FundPendingRevenue'
import ClaimPendingRevenue from './ClaimPendingRevenue'
import UpdateTagStage from './UpdateTagStage'
import UpdateTagRegistrationStage from './UpdateTagRegistrationStage'
import UpdatePricePerMinuteStage from './UpdatePricePerMinuteStage'
import UpdateExcludedContentStage from './UpdateExcludedContentStage'
import UpdateValuePoolStage from './UpdateValuePoolStage'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import BigNumber from 'bignumber.js'
import EmailStage from './EmailStage'
import VoteStage from './VoteStage'

interface EditStageProps {
  variant: 'ProductPage' | 'ChannelPage'
  collection: any
  maincurrency?: any
}

const getToastText = (stage: SellingStage, t: ContextApi['t']) => {
  if (stage === SellingStage.CONFIRM_CLAIM_PENDING_REVENUE) {
    return t('Pending revenue successfully claimed')
  }
  if (stage === SellingStage.CONFIRM_FUND_PENDING_REVENUE) {
    return t('Pending revenue successfully funded')
  }
  if (stage === SellingStage.CONFIRM_TRANSFER_DUE_TO_NOTE) {
    return t('Due successfully transferred to note')
  }
  if (stage === SellingStage.CONFIRM_MODIFY_COLLECTION || stage === SellingStage.CONFIRM_MODIFY_CONTACT) {
    return t('Collection successfully modified')
  }
  if (stage === SellingStage.CONFIRM_UPDATE_AUDITORS) {
    return t('Auditors successfully updated')
  }
  if (stage === SellingStage.CONFIRM_UPDATE_TAG) {
    return t('Tag successfully updated')
  }
  if (stage === SellingStage.CONFIRM_UPDATE_TAG_REGISTRATION) {
    return t('Tag registration successfully updated')
  }
  return ''
}

// Initial stage when user wants to edit already listed NFT (i.e. adjust price or remove from sale)
const EditStage: React.FC<any> = ({ variant = 'ChannelPage', collection, mainCurrency, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [stage, setStage] = useState(variant === 'vote' ? SellingStage.VOTE : SellingStage.SETTINGS)
  const { toastSuccess } = useToast()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const marketCollectionsContract = useMarketCollectionsContract()
  const marketEventsContract = useMarketEventsContract()
  const nfticketHelperContract = useNFTicketHelper()
  const itemMarketTradesContract = useMarketTradesContract()
  const paywallMarketTradesContract = usePaywallMarketTradesContract()
  const paywallPath = '/cancan/collections/[collectionAddress]/paywall/[tokenId]'
  const marketTradesContract =
    useRouter().pathname === paywallPath ? paywallMarketTradesContract : itemMarketTradesContract
  const tokenContract = getBep20Contract(mainCurrency?.address ?? '')
  const [state, setState] = useState<any>(() => ({
    collection: collection?.owner,
    referrerFee: parseInt(collection?.referrerFee) / 100 ?? '0',
    name: collection?.name ?? '',
    badgeId: collection?.badgeId ?? '0',
    minBounty: collection?.minBounty ?? '0',
    userMinBounty: collection?.userMinBounty ?? '0',
    recurringBounty: collection?.recurringBounty ?? '0',
    requestUserRegistration: Number(collection?.requestUserRegistration) ?? 0,
    requestPartnerRegistration: Number(collection?.requestPartnerRegistration) ?? 0,
    auditors: [],
    addAuditors: 1,
    token: mainCurrency?.address ?? '',
    fromNote: 1,
    tokenId: '0',
    identityTokenId: '0',
    amount: '0',
    cashbackFund: 1,
    start: '',
    end: '',
    bannerSmall: collection?.small ?? '',
    bannerLarge: collection?.large ?? '',
    avatar: collection?.avatar ?? '',
    description: collection?.description ?? '',
    articleLink: '',
    projectLink: '',
    tiktokChannel: '',
    twitterChannel: '',
    paychatChannel: '',
    youtubeChannel: '',
    telegramChannel: '',
    instagramChannel: '',
    contactChannels: collection?.contactChannels?.toString() ?? '',
    contacts: collection?.contacts?.toString() ?? '',
    tag: '',
    productId: '',
    price: '',
    contentType: '',
    valuepool: '',
  }))
  const [nftFilters, setNewFilters] = useState({
    workspace: collection?.workspaces,
    country: collection?.countries,
    city: collection?.cities,
    product: collection?.products,
  })

  const updateValue = (key: any, value: string | number) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    if (inputName === 'name') {
      updateValue(inputName, value.trim().split(' ').join('-'))
    } else {
      updateValue(inputName, value)
    }
  }
  const handleRawValueChange = (key: string) => (value: string | number) => {
    updateValue(key, value)
  }

  const goBack = () => {
    switch (stage) {
      case SellingStage.EMAIL_LIST:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CLAIM_PENDING_REVENUE:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_CLAIM_PENDING_REVENUE:
        setStage(SellingStage.CLAIM_PENDING_REVENUE)
        break
      case SellingStage.FUND_PENDING_REVENUE:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_FUND_PENDING_REVENUE:
        setStage(SellingStage.FUND_PENDING_REVENUE)
        break
      case SellingStage.TRANSFER_DUE_TO_NOTE:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_TRANSFER_DUE_TO_NOTE:
        setStage(SellingStage.TRANSFER_DUE_TO_NOTE)
        break
      case SellingStage.MODIFY_COLLECTION:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.MODIFY_CONTACT:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_MODIFY_CONTACT:
        setStage(SellingStage.MODIFY_CONTACT)
        break
      case SellingStage.CONFIRM_MODIFY_COLLECTION:
        setStage(SellingStage.MODIFY_COLLECTION)
        break
      case SellingStage.UPDATE_AUDITORS:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_UPDATE_AUDITORS:
        setStage(SellingStage.UPDATE_AUDITORS)
        break
      case SellingStage.VOTE:
        if (variant !== 'vote') setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_VOTE:
        setStage(SellingStage.VOTE)
        break
      case SellingStage.UPDATE_TAG:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_UPDATE_TAG:
        setStage(SellingStage.UPDATE_TAG)
        break
      case SellingStage.UPDATE_TAG_REGISTRATION:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_UPDATE_TAG_REGISTRATION:
        setStage(SellingStage.UPDATE_TAG_REGISTRATION)
        break
      case SellingStage.UPDATE_PRICE_PER_MINUTE:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_UPDATE_PRICE_PER_MINUTE:
        setStage(SellingStage.UPDATE_PRICE_PER_MINUTE)
        break
      case SellingStage.UPDATE_EXCLUDED_CONTENT:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_UPDATE_EXCLUDED_CONTENT:
        setStage(SellingStage.UPDATE_EXCLUDED_CONTENT)
        break
      case SellingStage.UPDATE_VALUEPOOL:
        setStage(SellingStage.SETTINGS)
        break
      case SellingStage.CONFIRM_UPDATE_VALUEPOOL:
        setStage(SellingStage.UPDATE_VALUEPOOL)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case SellingStage.CLAIM_PENDING_REVENUE:
        setStage(SellingStage.CONFIRM_CLAIM_PENDING_REVENUE)
        break
      case SellingStage.FUND_PENDING_REVENUE:
        setStage(SellingStage.CONFIRM_FUND_PENDING_REVENUE)
        break
      case SellingStage.TRANSFER_DUE_TO_NOTE:
        setStage(SellingStage.CONFIRM_TRANSFER_DUE_TO_NOTE)
        break
      case SellingStage.MODIFY_COLLECTION:
        setStage(SellingStage.CONFIRM_MODIFY_COLLECTION)
        break
      case SellingStage.MODIFY_CONTACT:
        setStage(SellingStage.CONFIRM_MODIFY_CONTACT)
        break
      case SellingStage.UPDATE_AUDITORS:
        setStage(SellingStage.CONFIRM_UPDATE_AUDITORS)
        break
      case SellingStage.VOTE:
        setStage(SellingStage.CONFIRM_VOTE)
        break
      case SellingStage.UPDATE_TAG:
        setStage(SellingStage.CONFIRM_UPDATE_TAG)
        break
      case SellingStage.UPDATE_TAG_REGISTRATION:
        setStage(SellingStage.CONFIRM_UPDATE_TAG_REGISTRATION)
        break
      case SellingStage.UPDATE_PRICE_PER_MINUTE:
        setStage(SellingStage.CONFIRM_UPDATE_PRICE_PER_MINUTE)
        break
      case SellingStage.UPDATE_EXCLUDED_CONTENT:
        setStage(SellingStage.CONFIRM_UPDATE_EXCLUDED_CONTENT)
        break
      case SellingStage.UPDATE_VALUEPOOL:
        setStage(SellingStage.CONFIRM_UPDATE_VALUEPOOL)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(tokenContract, account, marketTradesContract?.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(tokenContract, 'approve', [marketTradesContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(t('Contract approved'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === SellingStage.CONFIRM_MODIFY_COLLECTION) {
        const minBounty = getDecimalAmount(state.minBounty ?? 0)
        const userMinBounty = getDecimalAmount(state.userMinBounty ?? 0)
        // const recurringBounty = getDecimalAmount(state.recurringBounty ?? 0)
        const args = [
          state.collection || account,
          parseInt(state.referrerFee) * 100,
          state.badgeId || 0,
          minBounty.toString(),
          userMinBounty.toString(),
          parseInt(state.recurringBounty) * 100,
          !!state.requestUserRegistration,
          !!state.requestPartnerRegistration,
        ]
        console.log('CONFIRM_MODIFY_COLLECTION===========>', args)
        return callWithGasPrice(marketCollectionsContract, 'modifyCollection', args).catch((err) =>
          console.log('CONFIRM_MODIFY_COLLECTION===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_UPDATE_TAG_REGISTRATION) {
        console.log('CONFIRM_UPDATE_TAG_REGISTRATION===========>', [state.tag, !!state.add])
        return callWithGasPrice(nfticketHelperContract, 'updateTagRegistration', [state.tag, !!state.add]).catch(
          (err) => console.log('CONFIRM_UPDATE_TAG_REGISTRATION===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_UPDATE_TAG) {
        console.log('CONFIRM_UPDATE_TAG===========>', [state.productId, state.tag])
        return callWithGasPrice(nfticketHelperContract, 'updateTag', [state.productId, state.tag]).catch((err) =>
          console.log('CONFIRM_UPDATE_TAG===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_UPDATE_PRICE_PER_MINUTE) {
        const amount = getDecimalAmount(new BigNumber(state.price ?? 0))
        console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===========>', [amount?.toString()])
        return callWithGasPrice(nfticketHelperContract, 'updatePricePerAttachMinutes', [amount?.toString()]).catch(
          (err) => console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_UPDATE_EXCLUDED_CONTENT) {
        console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===========>', [state.tag, state.contentType, !!state.add])
        return callWithGasPrice(nfticketHelperContract, 'updateExcludedContent', [
          state.tag,
          state.contentType,
          !!state.add,
        ]).catch((err) => console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===========>', err))
      }
      if (stage === SellingStage.CONFIRM_UPDATE_VALUEPOOL) {
        console.log('CONFIRM_UPDATE_VALUEPOOL===========>', [state.valuepool, !!state.add])
        return callWithGasPrice(marketEventsContract, 'emitUpdateValuepools', [state.valuepool, !!state.add]).catch(
          (err) => console.log('CONFIRM_UPDATE_VALUEPOOL===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_MODIFY_CONTACT) {
        const args = [
          state.name,
          state.description,
          state.bannerLarge,
          state.bannerSmall,
          state.avatar,
          state.contactChannels,
          state.contacts,
          nftFilters?.workspace?.toString(),
          nftFilters?.country?.toString(),
          nftFilters?.city?.toString(),
          nftFilters?.product?.toString(),
        ]
        console.log('CONFIRM_MODIFY_CONTACT===========>', args)
        return callWithGasPrice(marketCollectionsContract, 'updateCollection', args).catch((err) =>
          console.log('CONFIRM_MODIFY_CONTACT===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_UPDATE_AUDITORS) {
        console.log('CONFIRM_UPDATE_AUDITORS===========>', [state.auditors?.split(','), !!state.addAuditors])
        return callWithGasPrice(marketCollectionsContract, 'updateCollectionTrustWorthyAuditors', [
          state.auditors?.split(','),
          !!state.addAuditors,
        ]).catch((err) => console.log('CONFIRM_UPDATE_AUDITORS===========>', err))
      }
      if (stage === SellingStage.CONFIRM_VOTE) {
        const args = [collection?.id, state.profileId, !!state.add]
        console.log('CONFIRM_VOTE===========>', args)
        return callWithGasPrice(getNFTicketHelper(), 'vote', args).catch((err) =>
          console.log('CONFIRM_VOTE===========>', err),
        )
      }
      if (stage === SellingStage.CONFIRM_CLAIM_PENDING_REVENUE) {
        if (state.fromNote) {
          console.log('CONFIRM_CLAIM_PENDING_REVENUE1===========>', [state.token, state.tokenId, state.identityTokenId])
          return callWithGasPrice(marketTradesContract, 'claimPendingRevenueFromNote', [
            state.token,
            state.tokenId,
            state.identityTokenId,
          ]).catch((err) => console.log('CONFIRM_CLAIM_PENDING_REVENUE1===========>', err))
        }
        console.log('CONFIRM_CLAIM_PENDING_REVENUE===========>', [state.token, state.identityTokenId])
        return callWithGasPrice(marketTradesContract, 'claimPendingRevenue', [
          state.token,
          state.identityTokenId,
        ]).catch((err) => console.log('CONFIRM_CLAIM_PENDING_REVENUE===========>', err))
      }
      if (stage === SellingStage.CONFIRM_FUND_PENDING_REVENUE) {
        const amount = getDecimalAmount(state.amount ?? 0)
        console.log('CONFIRM_FUND_PENDING_REVENUE===========>', [
          state.collection || account,
          state.token,
          amount?.toString(),
          !!state.cashbackFund,
        ])
        return callWithGasPrice(marketTradesContract, 'fundPendingRevenue', [
          state.collection || account,
          state.token,
          amount?.toString(),
          !!state.cashbackFund,
        ]).catch((err) => console.log('CONFIRM_FUND_PENDING_REVENUE===========>', err))
      }
      if (stage === SellingStage.CONFIRM_TRANSFER_DUE_TO_NOTE) {
        const start = Math.max(
          differenceInSeconds(new Date(state.start || 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const end = Math.max(
          differenceInSeconds(new Date(state.end || 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        console.log('CONFIRM_TRANSFER_DUE_TO_NOTE===========>', [start, end])
        return callWithGasPrice(marketTradesContract, 'transferDueToNote', [start, end]).catch((err) =>
          console.log('CONFIRM_TRANSFER_DUE_TO_NOTE===========>', err),
        )
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      // onSuccessSale()
      setConfirmedTxHash(receipt.transactionHash)
      setStage(SellingStage.TX_CONFIRMED)
    },
  })

  const showBackButton = stagesWithBackButton.includes(stage) && !isConfirming && !isApproving

  return (
    <Modal
      title={t('Channel Settings')}
      // stage={stage}
      // expand={false}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <Flex p="16px">
        <Flex mr="8px">
          <AvatarImage src={collection.avatar} />
        </Flex>
        <Grid flex="1" alignItems="center">
          <Text bold>{collection?.name}</Text>
        </Grid>
      </Flex>
      {stage === SellingStage.SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pb="16px">
          <Button mb="8px" onClick={() => setStage(SellingStage.MODIFY_COLLECTION)}>
            {t('Modify collection')}
          </Button>
          <Button mb="8px" onClick={() => setStage(SellingStage.MODIFY_CONTACT)}>
            {t('Modify location data')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(SellingStage.UPDATE_VALUEPOOL)}>
            {t('Update ValuePool List')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(SellingStage.VOTE)}>
            {t('Vote')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(SellingStage.UPDATE_AUDITORS)}>
            {t('Update auditors')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(SellingStage.UPDATE_TAG)}>
            {t('Update Tag')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(SellingStage.UPDATE_TAG_REGISTRATION)}>
            {t('Update Tag Registration')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(SellingStage.UPDATE_PRICE_PER_MINUTE)}>
            {t('Update Price Per Minute')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(SellingStage.UPDATE_EXCLUDED_CONTENT)}>
            {t('Update Excluded Content')}
          </Button>
          {variant === 'ProductPage' && (
            <>
              <Button mb="8px" onClick={() => setStage(SellingStage.CLAIM_PENDING_REVENUE)}>
                {t('Claim pending revenue')}
              </Button>
              <Button variant="subtle" mb="8px" onClick={() => setStage(SellingStage.FUND_PENDING_REVENUE)}>
                {t('Fund pending revenue')}
              </Button>
              <Button variant="subtle" mb="8px" onClick={() => setStage(SellingStage.TRANSFER_DUE_TO_NOTE)}>
                {t('Transfer due to note')}
              </Button>
            </>
          )}
          <Button variant="secondary" mb="8px" onClick={() => setStage(SellingStage.EMAIL_LIST)}>
            {t('Download Email List')}
          </Button>
        </Flex>
      )}
      {stage === SellingStage.EMAIL_LIST && <EmailStage collection={collection} />}

      {stage === SellingStage.CLAIM_PENDING_REVENUE && (
        <ClaimPendingRevenue
          state={state}
          currency={mainCurrency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.FUND_PENDING_REVENUE && (
        <FundPendingRevenue
          state={state}
          currency={mainCurrency}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.TRANSFER_DUE_TO_NOTE && (
        <TransferDueToNote
          state={state}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.MODIFY_COLLECTION && (
        <ModifyCollectionModal
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_AUDITORS && (
        <UpdateAuditorsStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.MODIFY_CONTACT && (
        <ModifyContactModal
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNewFilters}
          collection={collection}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_TAG && (
        <UpdateTagStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_TAG_REGISTRATION && (
        <UpdateTagRegistrationStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_PRICE_PER_MINUTE && (
        <UpdatePricePerMinuteStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_EXCLUDED_CONTENT && (
        <UpdateExcludedContentStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.VOTE && (
        <VoteStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === SellingStage.UPDATE_VALUEPOOL && (
        <UpdateValuePoolStage
          state={state}
          handleChange={handleChange}
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
