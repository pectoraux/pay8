import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, LinkExternal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  useERC20,
  useMarketTradesContract,
  useNFTicket,
  useNFTicketHelper,
  useNftMarketTradesContract,
  usePaywallMarketTradesContract,
} from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { differenceInSeconds } from 'date-fns'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles2'
import { LockStage } from './types'
import TransferDueToNoteStage from './TransferDueToNoteStage'
import ClaimRevenueStage from './ClaimRevenueStage'
import FundRevenueStage from './FundRevenueStage'
import ClaimRevenueFromNoteStage from './ClaimRevenueFromNoteStage'
import ClaimSuperChatRevenueStage from './ClaimSuperChatRevenueStage'
import SuperChatStage from './SuperChatStage'
import SuperChatAllStage from './SuperChatAllStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.TRANSFER_DUE_RECEIVABLE]: t('Transfer Due Receivable'),
  [LockStage.CLAIM_REVENUE_FROM_NOTE]: t('Claim Revenue From Note'),
  [LockStage.CLAIM_REVENUE]: t('Claim Revenue'),
  [LockStage.FUND_REVENUE]: t('Fund Revenue'),
  [LockStage.SUPERCHAT]: t('Superchat'),
  [LockStage.SUPERCHAT_ALL]: t('Superchat Every Ticket'),
  [LockStage.CLAIM_SP_REVENUE]: t('Claim SuperChat Revenue'),
  [LockStage.CONFIRM_CLAIM_SP_REVENUE]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_FUND_REVENUE]: t('Back'),
  [LockStage.CONFIRM_SUPERCHAT]: t('Back'),
  [LockStage.CONFIRM_SUPERCHAT_ALL]: t('Back'),
  [LockStage.CONFIRM_CLAIM_REVENUE_FROM_NOTE]: t('Back'),
  [LockStage.CONFIRM_CLAIM_REVENUE]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_DUE_RECEIVABLE]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({ isAdmin, pool, currency, variant, refetch, onDismiss }) => {
  const [stage, setStage] = useState(
    variant === 'withdraw' ? LockStage.CONFIRM_WITHDRAW : !isAdmin ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS,
  )
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || '')
  const nfticketContract = useNFTicket()
  const nfticketHelperContract = useNFTicketHelper()
  const marketTradesContract = useMarketTradesContract()
  const paywallMarketTradesContract = usePaywallMarketTradesContract()
  const nftMarketTradesContract = useNftMarketTradesContract()
  console.log('1mcurrencyy===============>', pool, isAdmin)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  const [state, setState] = useState<any>(() => ({
    cashbackFund: 0,
    amountPayable: '',
    amountReceivable: '',
    startReceivable: '',
    endReceivable: '',
    tokenId: '0',
    identityTokenId: '0',
    message: '',
    token: currency?.address,
    marketplace: 0,
    decimals: currency?.decimals ?? 18,
    collectionId: pool?.collection?.id ?? '',
  }))
  const [nftFilters, setNftFilters] = useState<any>({
    countries: pool?.countries,
    cities: pool?.cities,
    products: pool?.products,
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
  const handleRawValueChange = (key: string) => (value: string | Date) => {
    updateValue(key, value)
  }

  const goBack = () => {
    switch (stage) {
      case LockStage.TRANSFER_DUE_RECEIVABLE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_TRANSFER_DUE_RECEIVABLE:
        setStage(LockStage.TRANSFER_DUE_RECEIVABLE)
        break
      case LockStage.CLAIM_REVENUE_FROM_NOTE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_REVENUE_FROM_NOTE:
        setStage(LockStage.CLAIM_REVENUE_FROM_NOTE)
        break
      case LockStage.CLAIM_REVENUE:
        setStage(isAdmin ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_REVENUE:
        setStage(LockStage.CLAIM_REVENUE)
        break
      case LockStage.FUND_REVENUE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_FUND_REVENUE:
        setStage(LockStage.FUND_REVENUE)
        break
      case LockStage.CLAIM_SP_REVENUE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_SP_REVENUE:
        setStage(LockStage.CLAIM_SP_REVENUE)
        break
      case LockStage.SUPERCHAT:
        setStage(isAdmin ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SUPERCHAT:
        setStage(LockStage.SUPERCHAT)
        break
      case LockStage.SUPERCHAT_ALL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_SUPERCHAT_ALL:
        setStage(LockStage.SUPERCHAT_ALL)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.TRANSFER_DUE_RECEIVABLE:
        setStage(LockStage.CONFIRM_TRANSFER_DUE_RECEIVABLE)
        break
      case LockStage.CLAIM_REVENUE:
        setStage(LockStage.CONFIRM_CLAIM_REVENUE)
        break
      case LockStage.CLAIM_REVENUE_FROM_NOTE:
        setStage(LockStage.CONFIRM_CLAIM_REVENUE_FROM_NOTE)
        break
      case LockStage.FUND_REVENUE:
        setStage(LockStage.CONFIRM_FUND_REVENUE)
        break
      case LockStage.CLAIM_SP_REVENUE:
        setStage(LockStage.CONFIRM_CLAIM_SP_REVENUE)
        break
      case LockStage.SUPERCHAT:
        setStage(LockStage.CONFIRM_SUPERCHAT)
        break
      case LockStage.SUPERCHAT_ALL:
        setStage(LockStage.CONFIRM_SUPERCHAT_ALL)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        if (variant === 'superchat') return requiresApproval(stakingTokenContract, account, nfticketContract.address)
        const needsApproval1 = requiresApproval(stakingTokenContract, account, marketTradesContract.address)
        const needsApproval2 = requiresApproval(stakingTokenContract, account, nftMarketTradesContract.address)
        const needsApproval3 = requiresApproval(stakingTokenContract, account, paywallMarketTradesContract.address)
        return needsApproval1 || needsApproval2 || needsApproval3
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      if (variant === 'superchat') {
        return callWithGasPrice(stakingTokenContract, 'approve', [nfticketContract.address, MaxUint256])
      }
      return callWithGasPrice(stakingTokenContract, 'approve', [marketTradesContract.address, MaxUint256])
        .then(() => callWithGasPrice(stakingTokenContract, 'approve', [nftMarketTradesContract.address, MaxUint256]))
        .then(() =>
          callWithGasPrice(stakingTokenContract, 'approve', [paywallMarketTradesContract.address, MaxUint256]),
        )
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start processing transactions!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_CLAIM_REVENUE) {
        const args = [currency?.address, account, state.identityTokenId]
        const contract = !state.marketplace
          ? marketTradesContract
          : state.marketplace == 1
          ? nftMarketTradesContract
          : paywallMarketTradesContract
        console.log('CONFIRM_CLAIM_REVENUE===============>', args)
        return callWithGasPrice(contract, 'claimPendingRevenue', args).catch((err) =>
          console.log('CONFIRM_CLAIM_REVENUE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_REVENUE_FROM_NOTE) {
        const args = [currency?.address, state.tokenId, state.identityTokenId]
        const contract = !state.marketplace
          ? marketTradesContract
          : state.marketplace == 1
          ? nftMarketTradesContract
          : paywallMarketTradesContract
        console.log('CONFIRM_CLAIM_REVENUE_FROM_NOTE===============>', args)
        return callWithGasPrice(contract, 'claimPendingRevenueFromNote', args).catch((err) =>
          console.log('CONFIRM_CLAIM_REVENUE_FROM_NOTE===============>', err),
        )
      }
      if (stage === LockStage.CLAIM_REVENUE_FROM_NOTE) {
        const args = [currency?.address, state.tokenId, state.identityTokenId]
        const contract = !state.marketplace
          ? marketTradesContract
          : state.marketplace == 1
          ? nftMarketTradesContract
          : paywallMarketTradesContract
        console.log('CLAIM_REVENUE_FROM_NOTE===============>', args)
        return callWithGasPrice(contract, 'claimPendingRevenueFromNote', args).catch((err) =>
          console.log('CLAIM_REVENUE_FROM_NOTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_DUE_RECEIVABLE) {
        const contract = !state.marketplace
          ? marketTradesContract
          : state.marketplace == 1
          ? nftMarketTradesContract
          : paywallMarketTradesContract
        const startReceivable = Math.max(
          differenceInSeconds(new Date(state.startReceivable ?? 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const endReceivable = Math.max(
          differenceInSeconds(new Date(state.endReceivable ?? 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args = [startReceivable.toString(), endReceivable.toString()]
        console.log('CONFIRM_TRANSFER_DUE_RECEIVABLE===============>', args)
        return callWithGasPrice(contract, 'transferDueToNote', args).catch((err) =>
          console.log('CONFIRM_TRANSFER_DUE_RECEIVABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_FUND_REVENUE) {
        const contract = !state.marketplace
          ? marketTradesContract
          : state.marketplace == 1
          ? nftMarketTradesContract
          : paywallMarketTradesContract
        const amountPayable = getDecimalAmount(state.amountPayable ?? 0, currency?.decimals)
        const args = [pool?.owner, currency?.address, amountPayable?.toString(), state.cashbackFund]
        console.log('CONFIRM_FUND_REVENUE===============>', args)
        return callWithGasPrice(contract, 'fundPendingRevenue', args).catch((err) =>
          console.log('CONFIRM_FUND_REVENUE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        console.log('CONFIRM_WITHDRAW===============>')
        return callWithGasPrice(nfticketHelperContract, 'claimPendingRevenue', []).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_SP_REVENUE) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [amountReceivable?.toString()]
        console.log('CONFIRM_CLAIM_SP_REVENUE===============>', args)
        return callWithGasPrice(nfticketContract, 'withdrawRevenue', args).catch((err) =>
          console.log('CONFIRM_CLAIM_SP_REVENUE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SUPERCHAT) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.tokenId?.split(','), amountReceivable?.toString(), state.message]
        console.log('CONFIRM_SUPERCHAT===============>', args)
        return callWithGasPrice(nfticketContract, 'batchSuperChat', args).catch((err) =>
          console.log('CONFIRM_SUPERCHAT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SUPERCHAT_ALL) {
        const args = [state.message]
        console.log('CONFIRM_SUPERCHAT_ALL===============>', args)
        return callWithGasPrice(nfticketContract, 'superChatAll', args).catch((err) =>
          console.log('CONFIRM_SUPERCHAT_ALL===============>', err),
        )
      }
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      setConfirmedTxHash(receipt.transactionHash)
      setStage(LockStage.TX_CONFIRMED)
      refetch()
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
      {stage === LockStage.SETTINGS && (
        <Flex flexDirection="column" width="100%" pt="16px">
          {variant === 'superchat' ? (
            <Button mb="8px" onClick={() => setStage(LockStage.SUPERCHAT)}>
              {t('SUPERCHAT')}
            </Button>
          ) : (
            <>
              <Button mb="8px" onClick={() => setStage(LockStage.CLAIM_REVENUE)}>
                {t('CLAIM REVENUE')}
              </Button>
              <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CLAIM_REVENUE_FROM_NOTE)}>
                {t('CLAIM REVENUE FROM NOTE')}
              </Button>
            </>
          )}
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          {variant === 'superchat' ? (
            <>
              <Button mb="8px" onClick={() => setStage(LockStage.SUPERCHAT)}>
                {t('SUPERCHAT')}
              </Button>
              <Button mb="8px" onClick={() => setStage(LockStage.SUPERCHAT_ALL)}>
                {t('SUPERCHAT ALL TICKETS')}
              </Button>
              <Button mb="8px" onClick={() => setStage(LockStage.CLAIM_SP_REVENUE)}>
                {t('CLAIM SUPERCHAT REVENUE')}
              </Button>
            </>
          ) : (
            <>
              <Button mb="8px" onClick={() => setStage(LockStage.TRANSFER_DUE_RECEIVABLE)}>
                {t('TRANSFER DUE RECEIVABLE')}
              </Button>
              <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.FUND_REVENUE)}>
                {t('FUND REVENUE')}
              </Button>
              <Button mb="8px" onClick={() => setStage(LockStage.CLAIM_REVENUE)}>
                {t('CLAIM REVENUE')}
              </Button>
              <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CLAIM_REVENUE_FROM_NOTE)}>
                {t('CLAIM REVENUE FROM NOTE')}
              </Button>
            </>
          )}
        </Flex>
      )}
      {stage === LockStage.FUND_REVENUE && (
        <FundRevenueStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.CLAIM_REVENUE && (
        <ClaimRevenueStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.CLAIM_SP_REVENUE && (
        <ClaimSuperChatRevenueStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CLAIM_REVENUE_FROM_NOTE && (
        <ClaimRevenueFromNoteStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.TRANSFER_DUE_RECEIVABLE && (
        <TransferDueToNoteStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.SUPERCHAT && (
        <SuperChatStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.SUPERCHAT_ALL && (
        <SuperChatAllStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
      {stage === LockStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default CreateGaugeModal
