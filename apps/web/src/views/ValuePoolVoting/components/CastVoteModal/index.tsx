import { useTranslation } from '@pancakeswap/localization'
import { Box, Modal, useToast, Input, Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useValuepoolVoterContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useState, useCallback, useEffect } from 'react'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { ConfirmVoteView } from './types'
import { VotingBoxBorder } from './styles'
import { useGetVotingPower } from 'state/valuepoolvoting/hooks'
import { FetchStatus } from 'config/constants/types'
import MainView from './MainView'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'

const CastVoteModal: React.FC<any> = ({ onSuccess, proposal, isChecked, onDismiss }) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const valuepoolVoterContract = useValuepoolVoterContract()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [tokenId, setTokenId] = useState('')
  const [profileId, setProfileId] = useState('')
  const [identityTokenId, setIdentityTokenId] = useState('')
  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? null : () => setView(ConfirmVoteView.MAIN)
  const veAddress = proposal?.valuepool?.id
  const { data, refetch, status } = useGetVotingPower(veAddress, tokenId ?? '0')
  // const [total, setTotal] = useState<any>()
  console.log('CastVoteModal====================>', proposal)
  // useEffect(() => {
  //   // const val = getBalanceNumber(data?.balance, data?.decimals)
  //   setTotal(parseFloat((data?.percentile ?? 0).toString()) + parseFloat((proposal?.percentile ?? 0).toString()))
  // }, [data, proposal])

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

  const handleDismiss = () => {
    setModalIsOpen(false)
    onDismiss()
  }

  const handleVote = useCallback(async () => {
    setIsPending(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [
        proposal?.id,
        // proposal?.id?.split('-')[1],
        tokenId ?? 0,
        profileId ?? 0,
        identityTokenId ?? 0,
        !!isChecked,
        proposal?.title,
      ]
      console.log('st2==============>', args)
      return callWithGasPrice(valuepoolVoterContract, 'vote', args).catch((err) => {
        console.log('channel====================>', err)
      })
    })
    if (receipt?.status) {
      onSuccess()
      toastSuccess(
        t('Vote Submitted'),
        <ToastDescriptionWithTx txHash={receipt?.transactionHash}>
          {t('You have succesfully voted')}
        </ToastDescriptionWithTx>,
      )
    }
    setIsPending(false)
    setModalIsOpen(false)
    onDismiss()
  }, [
    t,
    tokenId,
    profileId,
    isChecked,
    identityTokenId,
    proposal,
    onSuccess,
    onDismiss,
    setIsPending,
    setModalIsOpen,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    valuepoolVoterContract,
  ])

  return (
    <Modal
      title={title[view]}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <Box mb="24px">
        <VotingBoxBorder>
          <Input
            type="number"
            onChange={(e) => {
              setTokenId(e.target.value)
              refetch()
            }}
            placeholder={t('input veNFT token id')}
            value={tokenId}
          />
        </VotingBoxBorder>
        <VotingBoxBorder>
          <Input
            type="number"
            onChange={(e) => setProfileId(e.target.value)}
            placeholder={t('input your profile id')}
            value={profileId}
          />
        </VotingBoxBorder>
        <VotingBoxBorder>
          <Input
            type="number"
            onChange={(e) => setIdentityTokenId(e.target.value)}
            placeholder={t('input your identity token id')}
            value={identityTokenId}
          />
        </VotingBoxBorder>
        {status === FetchStatus.Fetched && Number(tokenId) && view === ConfirmVoteView.MAIN ? (
          <MainView
            isChecked={!!isChecked}
            isError={false}
            isLoading={false}
            isPending={isPending}
            total={parseFloat((data?.percentile ?? 0).toString())}
            total2={getBalanceNumber(new BigNumber((data?.balance ?? 0).toString()), Number(data?.decimals ?? 18))}
            proposal={proposal}
            lockedCakeBalance={0}
            lockedEndTime={0}
            onConfirm={handleVote}
            onDismiss={handleDismiss}
          />
        ) : null}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
