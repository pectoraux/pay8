import { differenceInSeconds } from 'date-fns'
import { useState, ChangeEvent } from 'react'
import { requiresApproval } from 'utils/requiresApproval'
import { Flex, Grid, Text, Button, useToast } from '@pancakeswap/uikit'
import { MaxUint256 } from '@pancakeswap/sdk'
import useTheme from 'hooks/useTheme'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetTagFromCollectionId } from 'state/cancan/hooks'
import { useTranslation, ContextApi } from '@pancakeswap/localization'

import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { getBep20Contract } from 'utils/contractHelpers'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useMarketCollectionsContract, useMarketTradesContract } from 'hooks/useContract'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import AvatarImage from '../../BannerHeader/AvatarImage'
import { SellingStage } from './types'
import ConfirmStage from '../shared/ConfirmStage'
import UpdateAuditorsStage from './UpdateAuditorsStage'
import ModifyCollectionModal from './ModifyCollectionModal'
import ModifyContactModal from './ModifyContactModal'
import TransferDueToNote from './TransferDueToNote'
import FundPendingRevenue from './FundPendingRevenue'
import ClaimPendingRevenue from './ClaimPendingRevenue'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'

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
  return ''
}

// Initial stage when user wants to edit already listed NFT (i.e. adjust price or remove from sale)
const EditStage: React.FC<any> = ({ variant = 'ChannelPage', collection, mainCurrency, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [stage, setStage] = useState(SellingStage.SETTINGS)
  const { toastSuccess } = useToast()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const marketCollectionsContract = useMarketCollectionsContract()
  const marketTradesContract = useMarketTradesContract()
  const tokenContract = getBep20Contract(mainCurrency?.address ?? '')
  const [state, setState] = useState<any>(() => ({
    collection: collection?.owner,
    referrerFee: parseInt(collection?.referrerFee) / 100 ?? '0',
    name: collection?.name ?? '',
    badgeId: collection?.badgeId ?? '0',
    minBounty: getBalanceNumber(collection?.minBounty ?? '0'),
    userMinBounty: getBalanceNumber(collection?.userMinBounty ?? '0'),
    recurringBounty: parseInt(collection?.recurringBounty ?? '0') / 100,
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
    customTags: '',
    contactChannels: collection?.contactChannels?.toString() ?? '',
    contacts: collection?.contacts?.toString() ?? '',
    workspace: [],
    country: [],
    city: [],
    product: [],
  }))
  const _mtags = useGetTagFromCollectionId([parseInt(collection?.id)])
  const mtags = _mtags?.length ? _mtags.map((tag) => tag.id) : []
  const [nftFilters, setNewFilters] = useState({
    workspace: collection?.workspaces,
    country: collection?.countries,
    city: collection?.cities,
    product: mtags,
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
      if (stage === SellingStage.CONFIRM_MODIFY_CONTACT) {
        const customTags = state.customTags?.split(',')
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
          nftFilters?.product?.length ? nftFilters?.product[0] : customTags?.length && customTags[0],
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
    <StyledModal
      title={t('Channel Settings')}
      stage={stage}
      expand={false}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <Flex p="16px">
        <Flex mr="8px">
          <AvatarImage src={collection.avatar} />
        </Flex>
        <Grid flex="1" alignItems="center">
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {collection?.collectionName}
          </Text>
          <Text bold>
            {t(
              'Change settings about your collection, claim earnings, tranfer future earnings to NFT notes, update auditors...',
            )}
          </Text>
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
          <Button mb="8px" variant="secondary" onClick={() => setStage(SellingStage.UPDATE_AUDITORS)}>
            {t('Update auditors')}
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
          <Button variant="secondary" mb="8px" disabled onClick={() => setStage(SellingStage.UPDATE_AUDITORS)}>
            {t('Download Email List')}
          </Button>
        </Flex>
      )}

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
          nftFilters={nftFilters}
          setNftFilters={setNewFilters}
          collection={collection}
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
          nftFilters={{
            workspace: nftFilters.workspace,
            country: nftFilters.country,
            city: nftFilters.city,
            product: mtags.toString(),
          }}
          setNftFilters={setNewFilters}
          handleChange={handleChange}
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
    </StyledModal>
  )
}

export default EditStage
