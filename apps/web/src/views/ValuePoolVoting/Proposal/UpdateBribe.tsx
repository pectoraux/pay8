import { useEffect, useRef, useState, useCallback, ChangeEvent } from 'react'
import {
  Card,
  Flex,
  Grid,
  Box,
  Text,
  Modal,
  Button,
  CardBody,
  CardHeader,
  AutoRenewIcon,
  ErrorIcon,
  useToast,
  Heading,
  ButtonMenu,
  ReactMarkdown,
  ButtonMenuItem,
  Input,
} from '@pancakeswap/uikit'
import dynamic from 'next/dynamic'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useERC20, useStakeMarketVoterContract, useValuepoolVoterContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider } from 'views/ARPs/components/styles'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { Label, SecondaryLabel } from '../CreateProposal/styles'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useGetRequiresApproval } from 'state/trustbounties/hooks'
import { useApprovePool } from 'views/ValuePools/hooks/useApprove'
import { FetchStatus } from 'config/constants/types'

interface SetPriceStageProps {
  litigationId?: string | null
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const UpdateBribeModal: React.FC<any> = ({ veAddress, pool, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const [state, setState] = useState<any>(() => ({
    bribe: 0,
    bribeAmount: '',
    bribeToken: '',
    isNFT: 0,
    bribeDecimals: 18,
  }))
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isLoading, setIsLoading] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const [isDone, setIsDone] = useState('')
  const valuepoolVoterContract = useValuepoolVoterContract()
  const stakingTokenContract = useERC20(state.bribeToken)
  const { status, needsApproval, refetch } = useGetRequiresApproval(
    stakingTokenContract,
    account,
    valuepoolVoterContract.address,
  )
  const { handleApprove: handlePoolApprove, pendingTx: allowing } = useApprovePool(
    stakingTokenContract,
    valuepoolVoterContract.address,
    'Bribe Token',
    refetch,
  )

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const bribeAmount = getDecimalAmount(state.bribeAmount ?? 0, state.bribeDecimals)
      const args = [
        veAddress,
        pool,
        state.bribeToken?.trim()?.length ? state.bribeToken : ADDRESS_ZERO,
        bribeAmount?.toString(),
        state.isNFT,
      ]
      console.log('createGauge==================>', args, stakingTokenContract)
      return callWithGasPrice(valuepoolVoterContract, 'lockBribe', args).catch((err) => {
        setIsLoading(false)
        console.log('err==================>', err)
        toastError(
          t('Issue adding bribe'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setIsLoading(false)
      setIsDone(state.ve)
      toastSuccess(
        t('Bribe successfully added'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your bribe will be sent to the valuepool in case your proposal passes.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [
    t,
    state,
    pool,
    veAddress,
    toastError,
    toastSuccess,
    callWithGasPrice,
    valuepoolVoterContract,
    stakingTokenContract,
    fetchWithCatchTxError,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // // Keep track of what fields the user has attempted to edit
    // setFieldsState((prevFieldsState) => ({
    //   ...prevFieldsState,
    //   [key]: true,
    // }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleRawValueChange = (key: any) => (value: number) => {
    updateValue(key, value)
  }

  return (
    <Modal title={t('Update Bribe')} onDismiss={onDismiss}>
      <Box mb="24px">
        <Flex>
          <Text fontSize="12px" paddingRight="15px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
            {t('Bribe Token Type')}
          </Text>
        </Flex>
        <ButtonMenu scale="xs" variant="subtle" activeIndex={state.isNFT} onItemClick={handleRawValueChange('isNFT')}>
          <ButtonMenuItem>{t('Fungible')}</ButtonMenuItem>
          <ButtonMenuItem>{t('ERC721')}</ButtonMenuItem>
          <ButtonMenuItem>{t('ERC1155')}</ButtonMenuItem>
        </ButtonMenu>
      </Box>
      <Box mb="24px">
        <SecondaryLabel>{t('Bribe Token')}</SecondaryLabel>
        <Input
          type="text"
          scale="sm"
          name="bribeToken"
          value={state.bribeToken}
          placeholder={t('input bribe token')}
          onChange={handleChange}
        />
      </Box>
      <Box mb="24px">
        <SecondaryLabel>{t('Bribe Token Decimals')}</SecondaryLabel>
        <Input
          type="text"
          scale="sm"
          name="bribeDecimals"
          value={state.bribeDecimals}
          placeholder={t('input bribe token decimals')}
          onChange={handleChange}
        />
      </Box>
      <Box mb="24px">
        <SecondaryLabel>{t('Bribe Amount or Token ID')}</SecondaryLabel>
        <Input
          type="text"
          scale="sm"
          name="bribeAmount"
          value={state.bribeAmount}
          placeholder={t('input bribe amount or token id')}
          onChange={handleChange}
        />
      </Box>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t('This will update your bribe for this proposal')}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {!account ? (
          <ConnectWalletButton />
        ) : needsApproval ? (
          <Button
            mb="8px"
            onClick={handlePoolApprove}
            endIcon={allowing || status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={allowing}
            disabled={allowing || status === FetchStatus.Fetching}
          >
            {status === FetchStatus.Fetching ? t('Enabling') : t('Enable')}
          </Button>
        ) : (
          <Button
            mb="8px"
            onClick={handleSubmit}
            endIcon={pendingTx || isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={pendingTx || isLoading}
          >
            {t('Update Bribe')}
          </Button>
        )}
      </Flex>
    </Modal>
  )
}

export default UpdateBribeModal
