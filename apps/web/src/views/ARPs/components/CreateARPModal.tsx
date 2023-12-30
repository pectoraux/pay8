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
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchArpsAsync } from 'state/arps'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useARPFactory } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { Divider, GreyedOutContainer } from './styles'

interface SetPriceStageProps {
  onDismiss?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateARPModal: React.FC<SetPriceStageProps> = ({ onDismiss }) => {
  const { reload } = useRouter()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const arpFactoryContract = useARPFactory()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const [profileId, setProfileId] = useState('')
  const [valuepool, setValuepool] = useState('')
  const [automatic, setAutomatic] = useState(0)
  const [percentages, setPercentages] = useState(0)
  const [immutableContract, setImmutableContract] = useState(0)
  const { chainId } = useActiveChainId()
  const { toastSuccess, toastError } = useToast()

  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      console.log('receipt================>', arpFactoryContract, [
        profileId,
        account,
        valuepool || ADDRESS_ZERO,
        !!automatic,
        !!percentages,
        !!immutableContract,
      ])
      try {
        return callWithGasPrice(arpFactoryContract, 'createGauge', [
          profileId,
          account,
          valuepool || ADDRESS_ZERO,
          !!automatic,
          !!percentages,
          !!immutableContract,
        ])
      } catch (err) {
        console.log('err================>', err)
        setPendingFb(false)
        // toastError(
        //   t('Issue creating arp'),
        //   <ToastDescriptionWithTx txHash={receipt.transactionHash}>
        //     {err}
        //   </ToastDescriptionWithTx>)
      }
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('ARP successfully deployed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing transactions through your ARP contract.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchArpsAsync({ fromArp: true, chainId }))
      reload()
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    arpFactoryContract,
    profileId,
    account,
    valuepool,
    automatic,
    percentages,
    immutableContract,
    callWithGasPrice,
    toastSuccess,
    t,
    dispatch,
    chainId,
    reload,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => <Text>{t('Make sure you have created a profile and input its id here.')}</Text>
  const TooltipComponent2 = () => (
    <Text>
      {t('In case your ARP uses Valuepools, input the address of the Valuepool here otherwise just leave it empty.')}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Automatic ARPs use Valuepool to compute the payments of each one of their accounts. If you are not using a Valuepool and are planning to manually specify the amount paid to each account, you should pick No here.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This parameter specifies whether the ARP uses percentages to compute the amount paid to each account at each period or pays the same amount each period to each account.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>{t('Pick No if you want to be able to change the amount paid by any account in your ARP.')}</Text>
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
  const {
    targetRef: targetRef3,
    tooltip: tooltip3,
    tooltipVisible: tooltipVisible3,
  } = useTooltip(<TooltipComponent3 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef4,
    tooltip: tooltip4,
    tooltipVisible: tooltipVisible4,
  } = useTooltip(<TooltipComponent4 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef5,
    tooltip: tooltip5,
    tooltipVisible: tooltipVisible5,
  } = useTooltip(<TooltipComponent5 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Modal title={t('Deploy ARP')} onDismiss={onDismiss}>
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
          placeholder={t('input your profile id')}
          onChange={(e) => setProfileId(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Valuepool Address')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={valuepool}
          placeholder={t('input valuepool address')}
          onChange={(e) => setValuepool(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef3} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Is Automatic ?')}
            </Text>
            {tooltipVisible3 && tooltip3}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu scale="xs" variant="subtle" activeIndex={automatic ? 1 : 0} onItemClick={setAutomatic}>
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef4} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Is Percentages ?')}
            </Text>
            {tooltipVisible4 && tooltip4}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu scale="xs" variant="subtle" activeIndex={percentages ? 1 : 0} onItemClick={setPercentages}>
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef5} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Is Immutable Contract ?')}
            </Text>
            {tooltipVisible5 && tooltip5}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={immutableContract ? 1 : 0}
            onItemClick={setImmutableContract}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will deploy a new ARP contract with you as its Admin. Please read the documentation to learn more about ARPs.',
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
            {t('Deploy ARP')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default CreateARPModal
