import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchAuditorsAsync } from 'state/auditors'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useAuditorFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateAuditorModal: React.FC<any> = ({ onDismiss }) => {
  const { reload } = useRouter()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const auditorFactoryContract = useAuditorFactory()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [profileId, setProfileId] = useState('')
  const { toastSuccess, toastError } = useToast()
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log('receipt================>', auditorFactoryContract, [profileId, account])
      return callWithGasPrice(auditorFactoryContract, 'createGauge', [profileId, account]).catch((err) => {
        console.log('err================>', err)
        setPendingFb(false)
        toastError(
          t('Issue deploying auditor'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Auditor successfully deployed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your Auditor contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchAuditorsAsync({ fromAuditor: true, chainId }))
      delay(3000).then(() => reload())
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    auditorFactoryContract,
    profileId,
    account,
    callWithGasPrice,
    toastError,
    t,
    toastSuccess,
    dispatch,
    chainId,
    reload,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal title={t('Deploy Auditor Contract')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Profile ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={profileId}
          placeholder={t('input your profile id')}
          onChange={(e) => setProfileId(e.target.value)}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will deploy a new Auditor contract with you as its Admin. Auditor contracts enable you to setup a payment schedule on your audit contracts or mint badges (i.e. audit certifications) to users.',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? (
          <Button
            mb="8px"
            onClick={handleCreateGauge}
            endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={pendingTx || pendingFb}
          >
            {t('Deploy Auditor Contract')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateAuditorModal
