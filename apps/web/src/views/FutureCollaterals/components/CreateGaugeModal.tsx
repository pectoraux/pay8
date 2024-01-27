import { useRouter } from 'next/router'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useFutureCollateralContract, useTrustBountiesContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useWeb3React } from '@pancakeswap/wagmi'
import { convertTimeToSeconds } from 'utils/timeHelper'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateParametersStage from './UpdateParametersStage'
import MintStage from './MintStage'
import BurnStage from './BurnStage'
import NotifyRewardStage from './NotifyRewardStage'
import SellCollateralStage from './SellCollateralStage'
import EraseDebtStage from './EraseDebtStage'
import UpdateAdminStage from './UpdateAdminStage'
import UpdateEstimationTableStage from './UpdateEstimationTableStage'
import AddToChannelStage from './AddToChannelStage'
import UpdateBlacklistStage from './UpdateBlacklistStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_ESTIMATION_TABLE]: t('Update Estimation Table'),
  [LockStage.ADD_TO_CHANNEL]: t('Add To Channel'),
  [LockStage.UPDATE_BLACKLIST]: t('Update Blacklist'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.SELL_COLLATERAL]: t('Sell Collateral'),
  [LockStage.NOTIFY_REWARD]: t('Donate To Fund'),
  [LockStage.ERASE_DEBT]: t('Erase Debt'),
  [LockStage.UPDATE_ADMIN]: t('Update Admin'),
  [LockStage.BURN]: t('Burn'),
  [LockStage.MINT]: t('Mint'),
  [LockStage.CONFIRM_MINT]: t('Mint'),
  [LockStage.CONFIRM_NOTIFY_REWARD]: t('Back'),
  [LockStage.CONFIRM_ERASE_DEBT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ADMIN]: t('Back'),
  [LockStage.CONFIRM_BURN]: t('Back'),
  [LockStage.CONFIRM_ADD_TO_CHANNEL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BLACKLIST]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW_TREASURY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE]: t('Back'),
  [LockStage.CONFIRM_SELL_COLLATERAL]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({ variant = 'user', pool, state2, currAccount, currency, onDismiss }) => {
  const [stage, setStage] = useState(
    variant === 'add' ? LockStage.CONFIRM_MINT : variant === 'mint' ? LockStage.MINT : LockStage.SETTINGS,
  )
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { reload } = useRouter()
  const stakingTokenContract = useERC20(pool?.token?.address || currency?.address || '')
  const collateralContract = useFutureCollateralContract()
  const trustBountiesContract = useTrustBountiesContract()
  console.log(
    'mcurrencyy===============>',
    trustBountiesContract,
    state2,
    currAccount,
    currency,
    pool,
    collateralContract,
  )
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  const [state, setState] = useState<any>(() => ({
    owner: account ?? '',
    avatar: pool?.collection?.avatar,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    extraMint: '',
    category: '',
    optionId: currAccount?.optionId ?? '0',
    cap: '',
    factor: '',
    period: '',
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    amountPayable: state2?.amountPayable ?? '',
    pricePerMinute: '',
    contractAddress: '',
    card: pool?.cardAddress ?? '',
    legend: currAccount?.ratingLegend,
    amountReceivable: '',
    periodReceivable: currAccount?.periodReceivable,
    startReceivable: convertTimeToSeconds(currAccount?.startReceivable ?? 0),
    description: currAccount?.description ?? '',
    ratings: currAccount?.ratings?.toString() ?? '',
    esgRating: currAccount?.esgRating ?? '',
    media: pool?.media ?? '',
    identityTokenId: '0',
    message: '',
    tag: '',
    protocolId: currAccount?.protocolId ?? '0',
    toAddress: '',
    uriGenerator: '',
    autoCharge: 0,
    like: 0,
    bountyRequired: pool?.bountyRequired,
    ve: pool?._ve,
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    token: currency?.address,
    add: 0,
    contentType: '',
    name: pool?.name,
    numPeriods: '',
    collection: '',
    referrer: '',
    productId: '',
    userTokenId: '',
    options: '',
    isPaywall: 0,
    applicationLink: pool?.applicationLink ?? '',
    cardDescription: pool?.cardDescription ?? '',
    datakeeper: 0,
    accounts: [],
    table: '',
    channel: state2?.channel ?? pool?.channel ?? '',
    treasuryFee: parseInt(pool?.treasuryFee?.toString()) / 100 ?? '',
    bufferTime: parseInt(pool?.bufferTime ?? '0') / 60,
    minToBlacklist: pool?.minToBlacklist?.toString() ?? '',
    minBountyPercent: parseInt(pool?.minBountyPercent?.toString()) / 100 ?? '',
    updateColor: 3,
    minColor: 0,
    claimId: '',
    userBountyId: state2?.userBountyId ?? pool?.bountyId ?? '',
    stakeId: state2?.stakeId ?? '',
    auditor: state2?.auditor ?? '',
    auditorBountyId: state2?.auditorBountyId ?? '',
  }))

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
      case LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE:
        setStage(LockStage.UPDATE_ESTIMATION_TABLE)
        break
      case LockStage.UPDATE_ESTIMATION_TABLE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ADD_TO_CHANNEL:
        setStage(LockStage.ADD_TO_CHANNEL)
        break
      case LockStage.ADD_TO_CHANNEL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BLACKLIST:
        setStage(LockStage.UPDATE_BLACKLIST)
        break
      case LockStage.UPDATE_BLACKLIST:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SELL_COLLATERAL:
        setStage(LockStage.SELL_COLLATERAL)
        break
      case LockStage.SELL_COLLATERAL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW_TREASURY:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_MINT:
        setStage(LockStage.MINT)
        break
      case LockStage.MINT:
        if (variant === 'mint') break
        if (variant !== 'add') setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_NOTIFY_REWARD:
        setStage(LockStage.NOTIFY_REWARD)
        break
      case LockStage.NOTIFY_REWARD:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ERASE_DEBT:
        setStage(LockStage.ERASE_DEBT)
        break
      case LockStage.ERASE_DEBT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_ADMIN:
        setStage(LockStage.UPDATE_ADMIN)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BURN:
        setStage(LockStage.BURN)
        break
      case LockStage.BURN:
        setStage(LockStage.SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.UPDATE_ESTIMATION_TABLE:
        setStage(LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE)
        break
      case LockStage.ADD_TO_CHANNEL:
        setStage(LockStage.CONFIRM_ADD_TO_CHANNEL)
        break
      case LockStage.UPDATE_BLACKLIST:
        setStage(LockStage.CONFIRM_UPDATE_BLACKLIST)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.SELL_COLLATERAL:
        setStage(LockStage.CONFIRM_SELL_COLLATERAL)
        break
      case LockStage.MINT:
        setStage(LockStage.CONFIRM_MINT)
        break
      case LockStage.NOTIFY_REWARD:
        setStage(LockStage.CONFIRM_NOTIFY_REWARD)
        break
      case LockStage.ERASE_DEBT:
        setStage(LockStage.CONFIRM_ERASE_DEBT)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.CONFIRM_UPDATE_ADMIN)
        break
      case LockStage.BURN:
        setStage(LockStage.CONFIRM_BURN)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return (
          requiresApproval(stakingTokenContract, account, collateralContract.address) ||
          requiresApproval(stakingTokenContract, account, trustBountiesContract.address)
        )
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      console.log(
        'handleApprove====================>',
        stakingTokenContract,
        collateralContract.address,
        trustBountiesContract.address,
      )
      return callWithGasPrice(stakingTokenContract, 'approve', [collateralContract.address, MaxUint256]).then(() =>
        callWithGasPrice(stakingTokenContract, 'approve', [trustBountiesContract.address, MaxUint256]),
      )
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start receiving payments for audits!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_UPDATE_ESTIMATION_TABLE) {
        const args = [state.channel, state.table?.split(',')]
        console.log('CONFIRM_UPDATE_ESTIMATION_TABLE===============>', args)
        return callWithGasPrice(collateralContract, 'updateEstimationTable', args).catch((err) =>
          console.log('CONFIRM_UPDATE_ESTIMATION_TABLE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_TO_CHANNEL) {
        const args = [state.profileId, state.channel]
        console.log('CONFIRM_ADD_TO_CHANNEL===============>', args)
        return callWithGasPrice(collateralContract, 'addToChannel', args).catch((err) =>
          console.log('CONFIRM_ADD_TO_CHANNEL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BLACKLIST) {
        const args = [state.profileId, !!state.add]
        console.log('CONFIRM_UPDATE_BLACKLIST===============>', args)
        return callWithGasPrice(collateralContract, 'updateBlacklist', args).catch((err) =>
          console.log('CONFIRM_UPDATE_BLACKLIST===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_ADMIN) {
        const args = [state.owner, !!state.add]
        console.log('CONFIRM_UPDATE_ADMIN===============>', args)
        return callWithGasPrice(collateralContract, 'updateDev', args).catch((err) =>
          console.log('CONFIRM_UPDATE_ADMIN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const args = [
          parseInt(state.treasuryFee) * 100,
          parseInt(state.bufferTime) * 60,
          state.minToBlacklist,
          parseInt(state.minBountyPercent) * 100,
          state.updateColor,
          state.minColor,
        ]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(collateralContract, 'updateParams', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SELL_COLLATERAL) {
        const args = [state.owner, state.userBountyId, state.claimId]
        console.log('CONFIRM_SELL_COLLATERAL===============>', args)
        return callWithGasPrice(collateralContract, 'sellCollateral', args).catch((err) =>
          console.log('CONFIRM_SELL_COLLATERAL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW_TREASURY) {
        console.log('CONFIRM_WITHDRAW_TREASURY===============>')
        return callWithGasPrice(collateralContract, 'withdrawTreasury', []).catch((err) =>
          console.log('CONFIRM_WITHDRAW_TREASURY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MINT) {
        const amount = getDecimalAmount(state.amountPayable ?? 0)
        const args = [
          state.auditor,
          state.owner,
          state.userBountyId,
          state.auditorBountyId,
          state.channel,
          amount?.toString(),
        ]
        console.log('CONFIRM_MINT===============>', args)
        return callWithGasPrice(collateralContract, 'mint', args).catch((err) =>
          console.log('CONFIRM_MINT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_NOTIFY_REWARD) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.channel, amountReceivable?.toString()]
        console.log('CONFIRM_NOTIFY_REWARD===============>', args)
        return callWithGasPrice(collateralContract, 'notifyReward', args).catch((err) =>
          console.log('CONFIRM_NOTIFY_REWARD===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ERASE_DEBT) {
        const args = [state.owner]
        console.log('CONFIRM_ERASE_DEBT===============>', args)
        return callWithGasPrice(collateralContract, 'eraseDebt', args).catch((err) =>
          console.log('CONFIRM_ERASE_DEBT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BURN) {
        console.log('CONFIRM_BURN===============>')
        return callWithGasPrice(collateralContract, 'burn', []).catch((err) =>
          console.log('CONFIRM_BURN===============>', err),
        )
      }
    },
    onSuccess: async ({ receipt }) => {
      if (stage === LockStage.CONFIRM_MINT) reload()
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      setConfirmedTxHash(receipt.transactionHash)
      setStage(LockStage.TX_CONFIRMED)
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
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.UPDATE_ESTIMATION_TABLE)}>
            {t('UPDATE ESTIMATION TABLE')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.ADD_TO_CHANNEL)}>
            {t('ADD TO CHANNEL')}
          </Button>

          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.NOTIFY_REWARD)}>
            {t('DONATE TO FUND')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_BLACKLIST)}>
            {t('UPDATE BLACKLIST')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PARAMETERS)}>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.BURN)}>
            {t('BURN')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.CONFIRM_WITHDRAW_TREASURY)}>
            {t('WITHDRAW TREASURY')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.MINT)}>
            {t('MINT')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_ADMIN)}>
            {t('UPDATE ADMIN')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.SELL_COLLATERAL)}>
            {t('SELL COLLATERAL')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.ERASE_DEBT)}>
            {t('ERASE DEBT')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.UPDATE_ESTIMATION_TABLE && (
        <UpdateEstimationTableStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.ADD_TO_CHANNEL && (
        <AddToChannelStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_BLACKLIST && (
        <UpdateBlacklistStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PARAMETERS && (
        <UpdateParametersStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.SELL_COLLATERAL && (
        <SellCollateralStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.MINT && (
        <MintStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.NOTIFY_REWARD && (
        <NotifyRewardStage
          state={state}
          account={account}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BURN && (
        <BurnStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.ERASE_DEBT && (
        <EraseDebtStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_ADMIN && (
        <UpdateAdminStage
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
      {stage === LockStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default CreateGaugeModal
