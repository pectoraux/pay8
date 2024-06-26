import { useRouter } from 'next/router'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchWorldsAsync } from 'state/worlds'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useWorldFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateAuditorModal: React.FC<any> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const worldFactoryContract = useWorldFactory()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [profileId, setProfileId] = useState('')
  const { toastSuccess, toastError } = useToast()
  const { reload } = useRouter()
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log('1receipt================>', worldFactoryContract, [profileId, account])
      try {
        return callWithGasPrice(worldFactoryContract, 'createGauge', [profileId, account]).catch((err) => {
          toastError(
            t('Issue deploying world, make sure you have an active profile and a channel'),
            <ToastDescriptionWithTx txHash={receipt?.transactionHash}>{err}</ToastDescriptionWithTx>,
          )
        })
      } catch (err) {
        console.log('=================>', err)
        return null
      }
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('World successfully deployed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your World contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchWorldsAsync({ chainId }))
      delay(5000).then(() => reload())
    }
    onDismiss()
  }, [
    t,
    reload,
    chainId,
    account,
    profileId,
    dispatch,
    onDismiss,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    worldFactoryContract,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal title={t('Deploy World Contract')} onDismiss={onDismiss}>
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
              'This will deploy a new World contract with you as its Admin. World contracts enable you to mint NFTs of lands in the real world.',
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
            {t('Deploy')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateAuditorModal
