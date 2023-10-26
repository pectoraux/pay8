import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Input,
  Modal,
  Button,
  AutoRenewIcon,
  ErrorIcon,
  useToast,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchBettingsAsync } from 'state/bettings'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useBettingFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

import { Divider, GreyedOutContainer } from './styles'
import { useActiveChainId } from 'hooks/useActiveChainId'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateBettingModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const bettingFactoryContract = useBettingFactory()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [profileId, setProfileId] = useState('')
  const [oracle, setOracle] = useState('')
  const { toastSuccess, toastError } = useToast()

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [profileId, account, oracle || ADDRESS_ZERO]
      console.log('receipt================>', bettingFactoryContract, args)
      return callWithGasPrice(bettingFactoryContract, 'createGauge', args).catch((err) => {
        console.log('err================>', err)
        setPendingFb(false)
        toastError(
          t('Issue deploying betting contract'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Betting successfully deployed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your betting contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchBettingsAsync({ fromBetting: true, chainId }))
    }
    onDismiss()
  }, [
    t,
    profileId,
    oracle,
    account,
    dispatch,
    onDismiss,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    bettingFactoryContract,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => <Text>{t('The sets your profile id.')}</Text>
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "An oracle is an entity that provides the betting contract with the correct answers of betting events. This can be the address of a smart contract you've created to provide the betting contract with the winning answer to each betting event or the address of an auditor that will provide each betting event with the winning answer.",
      )}
    </Text>
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef2,
    tooltip: tooltip2,
    tooltipVisible: tooltipVisible2,
  } = useTooltip(<TooltipComponent2 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Modal title={t('Deploy Betting Contract')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Profile ID')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={profileId}
          placeholder={t('input profile id')}
          onChange={(e) => setProfileId(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Oracle Address (optional)')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={oracle}
          placeholder={t('input oracle address')}
          onChange={(e) => setOracle(e.target.value)}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will deploy a new betting contract with you as its Admin. Betting contracts enable you to take bets from your users on various events/topics. Please read the documentation to learn more about bettings.',
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
            {t('Deploy Betting Contract')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateBettingModal
