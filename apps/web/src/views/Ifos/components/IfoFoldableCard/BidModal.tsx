import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import { Flex, Grid, Box, Text, Input, Modal, Button, AutoRenewIcon, ErrorIcon, useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useProfileContract, useProfileHelperContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Accelerator/components/styles'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useGetIsNameUsed } from 'state/profile/hooks'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const BidModal: React.FC<any> = ({
  refetch,
  profileId,
  takeOver = false,
  processAuction = false,
  updateBid = false,
  create = false,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const profileContract = useProfileContract()
  const profileHelperContract = useProfileHelperContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const [state, setState] = useState<any>(() => ({
    amountReceivable: '',
    name: '',
    profileId: '',
    referrerProfileId: '',
  }))
  const { isNameUsed } = useGetIsNameUsed(state.name)
  const updateValue = (key: any, value: string | number | boolean | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }
  console.log('profileId===================>', profileId)
  const handleCreateGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const contract = create ? profileContract : profileHelperContract
      const amount = getDecimalAmount(state.amountReceivable)
      const args = create
        ? [state.name, state.profileId, state.referrerProfileId]
        : processAuction && takeOver
        ? [profileId]
        : processAuction
        ? []
        : updateBid
        ? [profileId, amount?.toString()]
        : takeOver
        ? [profileId, amount?.toString()]
        : [amount?.toString()]
      const method = create
        ? 'createSpecificProfile'
        : processAuction && takeOver
        ? 'processTakeOverAuction'
        : processAuction
        ? 'processAuction'
        : updateBid
        ? 'updateLastBidTime'
        : takeOver
        ? 'takeOverBid'
        : 'bidForProfile'
      console.log('Confirm_Bid================>', contract, method, args)
      return callWithGasPrice(contract, method, args).catch((err) => {
        console.log('Confirm_Bid================>', err)
        setPendingFb(false)
        toastError(
          t('Issue processing the transaction'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      refetch()
      setPendingFb(false)
      toastSuccess(
        t('Transaction successfully proccessed'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {create
            ? t('Profile successfully created')
            : processAuction
            ? t('You are now the owner of this Profile ID for a year.')
            : updateBid
            ? t('You have successfully renew your Profile ID')
            : takeOver
            ? t('You are now the highest bidder on this Profile ID.')
            : t('Your bid will win if no bid is registered within the next week')}
        </ToastDescriptionWithTx>,
      )
    }
    onDismiss()
  }, [
    fetchWithCatchTxError,
    onDismiss,
    create,
    profileContract,
    profileHelperContract,
    state.amountReceivable,
    state.name,
    state.profileId,
    state.referrerProfileId,
    processAuction,
    takeOver,
    profileId,
    updateBid,
    callWithGasPrice,
    toastError,
    t,
    refetch,
    toastSuccess,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal
      title={
        create
          ? t('Create Profile')
          : processAuction
          ? t('Process Auction')
          : updateBid
          ? t('Renew Profile ID')
          : t('Bid On Profile ID')
      }
      onDismiss={onDismiss}
    >
      {processAuction ? null : create ? (
        <>
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('User Name')}
            </Text>
            <Input
              type="text"
              scale="sm"
              name="name"
              value={state.name}
              placeholder={t('input user name')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          {state.name ? (
            <Text color="primary" ml="20px" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('%name% is %pos% taken', { name: state.name, pos: isNameUsed ? '' : 'not' })}
            </Text>
          ) : null}
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Unique Profile ID')}
            </Text>
            <Input
              type="text"
              scale="sm"
              name="profileId"
              value={state.profileId}
              placeholder={t('input unique profile id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Referrer Profile ID')}
            </Text>
            <Input
              type="text"
              scale="sm"
              name="referrerProfileId"
              value={state.referrerProfileId}
              placeholder={t('input referrer profile id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
        </>
      ) : (
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Bid Amount')}
          </Text>
          <Input
            type="text"
            scale="sm"
            name="amountReceivable"
            value={state.amountReceivable}
            placeholder={t('input bid amount')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
      )}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {processAuction
              ? t(
                  'This will finalize the auction and assign the Profile ID to the auction winner. This function should only be run at the end of the auction.',
                )
              : create
              ? t('This will create a new profile for your account with the unique ID that you won in the auction.')
              : t(
                  'This will bid on the current profile id. Please read the documentation to learn more about unique profile ids.',
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
            {processAuction ? t('Confirm') : create ? t('Create Specific Profile') : t('Bid')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default BidModal
