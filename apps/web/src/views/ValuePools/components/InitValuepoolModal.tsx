import { useRouter } from 'next/router'
import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import { Flex, Grid, Box, Text, Modal, Button, AutoRenewIcon, ErrorIcon, useToast } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchValuepoolSgAsync } from 'state/valuepools'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useVaFactoryContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider } from './styles'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const InitValuepoolModal: React.FC<any> = ({ pool, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const titleName = 'ValuePool'
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const vaFactoryContract = useVaFactoryContract()
  const [nftFilters, setNewFilters] = useState({} as any)
  const fromValuepool = useRouter().query.valuepool
  const [state, setState] = useState<any>(() => ({
    name: '',
    symbol: '',
    decimals: 18,
  }))

  useEffect(() => {
    Object.entries(nftFilters).map((entry: any) =>
      setState((prevState) => ({
        ...prevState,
        [entry[0]]: entry[1],
      })),
    )
  }, [nftFilters])

  const handleInitGauge = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      return callWithGasPrice(vaFactoryContract, 'createVe', [pool?.tokenAddress, pool?.id, pool?.riskpool]).catch(
        (err) => {
          console.log('ress===============>', err, vaFactoryContract, [pool?.tokenAddress, pool?.id, pool?.riskpool])
          toastError(
            t('Issue initializing valuepool'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
          )
        },
      )
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Valuepool successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start processing account requests for your Valuepool.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(
        fetchValuepoolSgAsync({
          fromVesting: false,
          fromValuepool,
        }),
      )
      // reload()
    }
    onDismiss()
  }, [
    onDismiss,
    dispatch,
    fromValuepool,
    vaFactoryContract,
    pool,
    t,
    // reload,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return (
    <Modal title={t('Initialize ValuePool')} onDismiss={onDismiss}>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will create a new %titleName% with you as its Admin. Please read the documentation to learn more about %titleName%s.',
              { titleName },
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? (
          <Button
            mb="8px"
            onClick={handleInitGauge}
            endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={pendingTx || pendingFb}
          >
            {t('Initialize')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default InitValuepoolModal
