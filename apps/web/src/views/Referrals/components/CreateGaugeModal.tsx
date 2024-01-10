import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex } from '@pancakeswap/uikit'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  useERC20,
  useReferralVoter,
  useBribeContract,
  useGaugeContract,
  useBusinessMinterContract,
} from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { fetchReferralGaugesAsync } from 'state/referrals'
import { useGetEarlyAdopter } from 'state/accelerator/hooks'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateBountyStage from './UpdateBountyStage'
import BribesStage from './BribesStage'
import WithdrawStage from './WithdrawStage'
import DeletePitchStage from './DeletePitchStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_BRIBES]: t('Update Bribes'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.UPDATE_BOUNTY]: t('Update Bounty'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.CONFIRM_LOCK_TOKENS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BRIBES]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY]: t('Back'),
  [LockStage.CONFIRM_DISTRIBUTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_GAUGE]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_ADMIN_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({ variant = 'user', pool, currency, onDismiss }) => {
  const [stage, setStage] = useState(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [tokenId, setTokenId] = useState('')
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [add, setAdd] = useState(0)
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const { callWithGasPrice } = useCallWithGasPrice()
  const referralVoterContract = useReferralVoter()
  const { data: isEarlyAdopter } = useGetEarlyAdopter(pool?.ve, account)
  const businessMinterContract = useBusinessMinterContract()
  const bribeTokenContract = useERC20(currency?.address || '')
  const bribeContract = useBribeContract(pool.bribe || '')
  const gaugeContract = useGaugeContract(pool.gauge || '')
  const [lockedAmount, setLockedAmount] = useState('')
  const [currBribeAddress, setCurrBribeAddress] = useState('')
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  console.log('pppoool================>', pool)

  const goBack = () => {
    switch (stage) {
      case LockStage.CONFIRM_LOCK_TOKENS:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.UPDATE_BRIBES:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DISTRIBUTE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_GAUGE:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.DELETE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BRIBES:
        setStage(LockStage.UPDATE_BRIBES)
        break
      case LockStage.CONFIRM_UPDATE_BOUNTY:
        setStage(LockStage.UPDATE_BOUNTY)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.CONFIRM_ADMIN_WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.UPDATE_BRIBES:
        setStage(LockStage.CONFIRM_UPDATE_BRIBES)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(bribeTokenContract, account, bribeContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(bribeTokenContract, 'approve', [bribeContract.address, MaxUint256]).catch((err) =>
        console.log('approve===================>', err),
      )
    },
    // onApproveSuccess: async ({ receipt }) => {
    //   toastSuccess(getApproveToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    // },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_UPDATE_BRIBES) {
        const convertedBribeAmount: BigNumber = getDecimalAmount(new BigNumber(lockedAmount), currency?.decimals)
        console.log('CONFIRM_UPDATE_BRIBES================>', [currency?.address, convertedBribeAmount.toString()])
        return callWithGasPrice(bribeContract, 'notifyRewardAmount', [
          currency?.address,
          convertedBribeAmount.toString(),
        ]).catch((err) => console.log('CONFIRM_UPDATE_BRIBES==================>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY) {
        console.log('CONFIRM_UPDATE_BOUNTY==================>', [tokenId, !!add])
        return callWithGasPrice(gaugeContract, 'updateBounty', [tokenId, !!add]).catch((err1) =>
          console.log('CONFIRM_UPDATE_BOUNTY==================>', err1),
        )
      }
      if (stage === LockStage.CONFIRM_DISTRIBUTE) {
        console.log('CONFIRM_DISTRIBUTE==================>', [pool.gauge, pool.ve])
        return callWithGasPrice(businessMinterContract, 'update_period', [])
          .then(() => delay(5000))
          .then(() => callWithGasPrice(referralVoterContract, 'distribute', [pool.gauge, pool.ve]))
          .catch((err) => console.log('CONFIRM_DISTRIBUTE==================>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_GAUGE) {
        console.log('CONFIRM_UPDATE_GAUGE==================>', [pool.gauge, pool.ve])
        return callWithGasPrice(referralVoterContract, 'updateGauge', [pool.gauge, pool.ve]).catch((err7) =>
          console.log('CONFIRM_UPDATE_GAUGE==================>', err7),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        console.log('CONFIRM_WITHDRAW==================>', [[pool.bribe], [[currBribeAddress]]])
        return callWithGasPrice(referralVoterContract, 'claimBribes', [[pool.bribe], [[currBribeAddress]]]).catch(
          (err) => console.log('CONFIRM_WITHDRAW==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADMIN_WITHDRAW) {
        console.log('CONFIRM_ADMIN_WITHDRAW==================>', [])
        return callWithGasPrice(gaugeContract, 'withdrawAll', []).catch((err) =>
          console.log('CONFIRM_ADMIN_WITHDRAW==================>', err),
        )
      }
      if (stage === LockStage.CONFIRM_LOCK_TOKENS) {
        console.log('CONFIRM_LOCK_TOKENS==================>', [pool.ve])
        return callWithGasPrice(businessMinterContract, 'lockTokens', [pool.ve]).catch((err7) =>
          console.log('CONFIRM_LOCK_TOKENS==================>', err7),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        return callWithGasPrice(referralVoterContract, 'deactivateGauge', [pool.ve]).catch((err) =>
          console.log('CONFIRM_DELETE==================>', err),
        )
      }
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      // onSuccessSale()
      setConfirmedTxHash(receipt.transactionHash)
      setStage(LockStage.TX_CONFIRMED)
      dispatch(fetchReferralGaugesAsync({ chainId }))
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
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.CONFIRM_UPDATE_GAUGE)}>
            {t('UPDATE REWARDS')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_BRIBES)}>
            {t('UPDATE BRIBES')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY)}>
            {t('UPDATE BOUNTY')}
          </Button>
          <Button
            variant="tertiary"
            disabled={!isEarlyAdopter}
            mb="8px"
            onClick={() => setStage(LockStage.CONFIRM_LOCK_TOKENS)}
          >
            {t('LOCK TOKENS')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.CONFIRM_UPDATE_GAUGE)}>
            {t('UPDATE REWARDS')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.CONFIRM_DISTRIBUTE)}>
            {t('DISTRIBUTE REWARDS')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.CONFIRM_ADMIN_WITHDRAW)}>
            {t('WITHDRAW CLAIMED REWARDS')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE)}>
            {t('DELETE GAUGE')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.UPDATE_BOUNTY && (
        <UpdateBountyStage
          tokenId={tokenId}
          setTokenId={setTokenId}
          add={add}
          setAdd={setAdd}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_BRIBES && (
        <BribesStage
          lockedAmount={lockedAmount}
          setLockedAmount={setLockedAmount}
          currency={currency}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.WITHDRAW && (
        <WithdrawStage
          pool={pool}
          tokenId={tokenId}
          setTokenId={setTokenId}
          currBribeAddress={currBribeAddress}
          setCurrBribeAddress={setCurrBribeAddress}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DELETE && <DeletePitchStage continueToNextStage={continueToNextStage} />}
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
