import BigNumber from 'bignumber.js'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useRampContract, useRampHelper } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useRouter } from 'next/router'
import { fantomTestnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { createPublicClient, http, custom, createWalletClient } from 'viem'
import { rampABI } from 'config/abi/ramp'
import { useAppDispatch } from 'state'
import { fetchRampsAsync } from 'state/ramps'
import MintStage from 'views/Ramps/components/MintStage'
import BurnStage from 'views/Ramps/components/BurnStage'
import {
  useGetTokenData,
  useGetSessionInfo,
  useGetSessionInfoSg,
  useGetIsExtraToken,
  useGetExtraUSDPrices,
  useFetchRamp,
  useGetPrices,
} from 'state/ramps/hooks'
import { getRampHelperAddress } from 'utils/addressHelpers'
import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import PartnerStage from './PartnerStage'
import BuyRampStage from './BuyRampStage'
import UpdateDevStage from './UpdateDevStage'
import BuyAccountStage from './BuyAccountStage'
import UpdateAdminStage from './UpdateAdminStage'
import CreateClaimStage from './CreateClaimStage'
import UpdateBadgeStage from './UpdateBadgeStage'
import ClaimRevenueStage from './ClaimRevenueStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import CreateProtocolStage from './CreateProtocolStage'
import UpdateParametersStage from './UpdateParametersStage'
import DeleteStage from './DeleteStage'
import InitRampStage from './InitRampStage'
import DeleteRampStage from './DeleteRampStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import UpdateTokenStage from './UpdateTokenStage'
import UnlockBountyStage from './UnlockBountyStage'
import UpdateProfileStage from './UpdateProfileStage'
import UpdateBountyStage from './UpdateBountyStage'
import UpdateProtocolStage from './UpdateProtocolStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_PROTOCOL]: t('Update Account'),
  [LockStage.UPDATE_INDIVIDUAL_PROTOCOL]: t('Update Account'),
  [LockStage.ADMIN_WITHDRAW]: t('Withdraw'),
  [LockStage.PRE_MINT]: t('tFIAT Mint'),
  [LockStage.INIT_RAMP]: t('Update Ramp Info'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.CLAIM]: t('Create Claim'),
  [LockStage.CLAIM_REVENUE]: t('Claim Revenue'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.UPDATE_BOUNTY]: t('Update Attached Bounty'),
  [LockStage.UNLOCK_BOUNTY]: t('Unlock Attached Bounty'),
  [LockStage.UPDATE_TOKEN_ID]: t('Update veNFT Token'),
  [LockStage.UPDATE_DEV_TOKEN_ID]: t('Update Ramp veNFT Token'),
  [LockStage.UPDATE_BADGE_ID]: t('Update Attached Badge'),
  [LockStage.UPDATE_PROFILE_ID]: t('Update Attached Profile'),
  [LockStage.BUY_RAMP]: t('Buy Ramp'),
  [LockStage.BUY_ACCOUNT]: t('Buy Account'),
  [LockStage.PARTNER]: t('Partner'),
  [LockStage.BURN]: t('Burn'),
  [LockStage.MINT]: t('Mint'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.DELETE_RAMP]: t('Delete Ramp'),
  [LockStage.CREATE_PROTOCOL]: t('Create Account'),
  [LockStage.UPDATE_ADMIN]: t('Update Contract Admin'),
  [LockStage.UPDATE_DEV]: t('Update Contract Owner'),
  [LockStage.UPDATE_BLACKLIST]: t('Update Blacklist'),
  [LockStage.ADD_EXTRA_TOKEN]: t('Add Extra Token'),
  [LockStage.SPONSOR_TAG]: t('Sponsor Tag'),
  [LockStage.UPDATE_SPONSOR_MEDIA]: t('Update Sponsor Media'),
  [LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA]: t('Back'),
  [LockStage.CONFIRM_SPONSOR_TAG]: t('Back'),
  [LockStage.CONFIRM_GET_NATIVE]: t('Back'),
  [LockStage.CONFIRM_CLAIM_SPONSOR_REVENUE]: t('Back'),
  [LockStage.CONFIRM_REMOVE_EXTRA_TOKEN]: t('Back'),
  [LockStage.CONFIRM_ADD_EXTRA_TOKEN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BLACKLIST]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DEV]: t('Back'),
  [LockStage.CONFIRM_UPDATE_ADMIN]: t('Back'),
  [LockStage.CONFIRM_INIT_RAMP]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_INDIVIDUAL_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_ADMIN_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_CREATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_RAMP]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROFILE_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BADGE_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TOKEN_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DEV_TOKEN_ID]: t('Back'),
  [LockStage.CONFIRM_UNLOCK_BOUNTY]: t('Back'),
  [LockStage.CONFIRM_BUY_RAMP]: t('Back'),
  [LockStage.CONFIRM_BUY_ACCOUNT]: t('Back'),
  [LockStage.CONFIRM_PARTNER]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_CLAIM]: t('Back'),
  [LockStage.CONFIRM_CLAIM_REVENUE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_BURN]: t('Back'),
  [LockStage.CONFIRM_MINT]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({
  variant = 'user',
  sessionId,
  location = 'ramp',
  pool,
  currency,
  onDismiss,
}) => {
  const [stage, setStage] = useState(
    sessionId
      ? LockStage.PRE_MINT
      : variant === 'user'
      ? LockStage.SETTINGS
      : variant === 'buy'
      ? LockStage.BUY_RAMP
      : variant === 'init'
      ? LockStage.INIT_RAMP
      : variant === 'delete'
      ? LockStage.DELETE_RAMP
      : LockStage.ADMIN_SETTINGS,
  )
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account, chainId } = useAccountActiveChain()
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [checked, setChecked] = useState<boolean>()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: adminARP } = useFetchRamp(router.query.ramp)
  if (!pool) {
    // eslint-disable-next-line no-param-reassign
    pool = adminARP
  }
  const stakingTokenContract = useERC20(currency?.address || router.query?.userCurrency || '')
  const rampContract = useRampContract(pool?.rampAddress || router.query.ramp || '')
  const rampHelperContract = useRampHelper()
  const adminAccount = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PAYSWAP_SIGNER}`)
  const client = createPublicClient({
    chain: fantomTestnet,
    transport: http(),
    // key: process.env.NEXT_PUBLIC_PAYSWAP_SIGNER
  })
  const walletClient = createWalletClient({
    chain: fantomTestnet,
    transport: custom(window.ethereum),
  })
  console.log('1mcurrencyy===============>', pool, currency, rampContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  const { data } = useGetSessionInfoSg(sessionId, rampContract?.address?.toLowerCase())
  const getNative = (router.query?.userCurrency as any)?.toLowerCase() === getRampHelperAddress()?.toLowerCase()
  const dataAddress = getNative ? getRampHelperAddress() : data?.tokenAddress
  const { data: stripeData } = useGetSessionInfo(sessionId ?? '', pool?.secretKeys && pool?.secretKeys[0])
  const { data: tokenData } = useGetTokenData(dataAddress)
  const { data: isExtraToken } = useGetIsExtraToken(dataAddress)
  const rampAccount = useMemo(
    () => pool?.accounts?.find((acct) => acct.token.address?.toLowerCase() === dataAddress?.toLowerCase()),
    [pool?.accounts, dataAddress],
  )
  const { data: usdPrice1 } = useGetPrices(
    [rampAccount?.token?.symbol],
    process.env.NEXT_PUBLIC_RAPID_API_PRICE_INFO,
    rampAccount?.token?.address,
  )
  const { data: usdPrice } = useGetExtraUSDPrices([rampAccount?.token?.symbol], rampAccount?.encrypted)
  console.log('nativeToToken=================>', rampAccount, usdPrice)
  console.log('1data=================>', usdPrice1, data)
  console.log('stripeData=================>', sessionId, stripeData, tokenData)

  const [state, setState] = useState<any>(() => ({
    sk: pool?.secretKeys && pool?.secretKeys[0],
    pk: pool?.publishableKeys && pool?.publishableKeys[0],
    owner: pool?.owner,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    identityTokenId: '0',
    applicationLink: '',
    publishableKeys: '',
    secretKeys: '',
    clientIds: '',
    description: '',
    avatar: '',
    channels: '',
    moreInfo: '',
    add: 0,
    amountPayable: '',
    amountReceivable: '',
    paidPayable: '',
    paidReceivable: '',
    periodPayable: '',
    periodReceivable: '',
    startPayable: '',
    startReceivable: '',
    numPeriods: '',
    name: '',
    symbol: '',
    startProtocolId: '',
    endProtocolId: '',
    requestAddress: '',
    requestAmount: '',
    recipient: '',
    splitShares: '',
    adminNote: false,
    period: pool?.period,
    bufferTime: pool?.bufferTime,
    limitFactor: pool?.limitFactor,
    gaugeBalanceFactor: pool?.gaugeBalanceFactor,
    profileRequired: pool?.profileRequired,
    bountyRequired: pool?.bountyRequired,
    paidDays: '',
    cosignEnabled: pool?.cosignEnabled,
    minCosigners: pool?.minCosigners || '',
    requests: adminARP?.userData?.requests?.length || [],
    amounts: adminARP?.userData?.amounts?.length || [],
    token: currency?.address,
    close: false,
    salePrice: '',
    maxPartners: 0,
    partnerBountyId: 0,
    bountyIds: [],
    badgeId: 0,
    _ve: '',
    mintFee: 0,
    burnFee: 0,
    sessionId: '',
  }))
  useEffect(() => {
    if (data || getNative) {
      if (!getNative && (data?.user?.toLowerCase() !== account?.toLowerCase() || !data?.active)) {
        onDismiss()
        if (router.query?.ramp) router.push(`/ramps/${router.query?.ramp}`)
      } else {
        state.amountReceivable = data?.amount
        state.token = data?.tokenAddress
        state.identityTokenId = data?.identityTokenId
        state.sessionId = sessionId
        setChecked(true)
      }
    }
  }, [sessionId, data, account, state, router, onDismiss, getNative])

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
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_GET_NATIVE:
        setStage(LockStage.PRE_MINT)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROTOCOL:
        setStage(LockStage.UPDATE_PROTOCOL)
        break
      case LockStage.CONFIRM_CLAIM:
        setStage(LockStage.CLAIM)
        break
      case LockStage.CLAIM:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_REVENUE:
        setStage(LockStage.CLAIM_REVENUE)
        break
      case LockStage.CLAIM_REVENUE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_ADMIN:
        setStage(LockStage.UPDATE_ADMIN)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DEV:
        setStage(LockStage.UPDATE_DEV)
        break
      case LockStage.UPDATE_DEV:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BADGE_ID:
        setStage(LockStage.UPDATE_BADGE_ID)
        break
      case LockStage.UPDATE_BADGE_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TOKEN_ID:
        setStage(LockStage.UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_ADMIN_WITHDRAW:
        setStage(LockStage.ADMIN_WITHDRAW)
        break
      case LockStage.CONFIRM_UPDATE_PROFILE_ID:
        setStage(LockStage.UPDATE_PROFILE_ID)
        break
      case LockStage.UPDATE_PROFILE_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UNLOCK_BOUNTY:
        setStage(LockStage.UNLOCK_BOUNTY)
        break
      case LockStage.UNLOCK_BOUNTY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.DELETE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_RAMP:
        setStage(LockStage.DELETE_RAMP)
        break
      case LockStage.CONFIRM_BUY_ACCOUNT:
        setStage(LockStage.BUY_ACCOUNT)
        break
      case LockStage.BUY_ACCOUNT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_PARTNER:
        setStage(LockStage.PARTNER)
        break
      case LockStage.PARTNER:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.CONFIRM_BURN:
        setStage(LockStage.BURN)
        break
      case LockStage.BURN:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_MINT:
        if (!sessionId) setStage(LockStage.MINT)
        break
      case LockStage.MINT:
        setStage(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
        break
      case LockStage.BUY_RAMP:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BUY_RAMP:
        setStage(LockStage.BUY_RAMP)
        break
      case LockStage.CONFIRM_CREATE_PROTOCOL:
        setStage(LockStage.CREATE_PROTOCOL)
        break
      case LockStage.CONFIRM_UPDATE_BOUNTY:
        setStage(LockStage.UPDATE_BOUNTY)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.CREATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.INIT_RAMP:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_INIT_RAMP:
        setStage(LockStage.INIT_RAMP)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.CREATE_PROTOCOL:
        setStage(LockStage.CONFIRM_CREATE_PROTOCOL)
        break
      case LockStage.MINT:
        setStage(LockStage.CONFIRM_MINT)
        break
      case LockStage.BURN:
        setStage(LockStage.CONFIRM_BURN)
        break
      case LockStage.PARTNER:
        setStage(LockStage.CONFIRM_PARTNER)
        break
      case LockStage.BUY_ACCOUNT:
        setStage(LockStage.CONFIRM_BUY_ACCOUNT)
        break
      case LockStage.BUY_RAMP:
        setStage(LockStage.CONFIRM_BUY_RAMP)
        break
      case LockStage.UPDATE_BADGE_ID:
        setStage(LockStage.CONFIRM_UPDATE_BADGE_ID)
        break
      case LockStage.UPDATE_PROFILE_ID:
        setStage(LockStage.CONFIRM_UPDATE_PROFILE_ID)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.CONFIRM_UPDATE_TOKEN_ID)
        break
      case LockStage.UNLOCK_BOUNTY:
        setStage(LockStage.CONFIRM_UNLOCK_BOUNTY)
        break
      case LockStage.UPDATE_BOUNTY:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.CLAIM:
        setStage(LockStage.CONFIRM_CLAIM)
        break
      case LockStage.CLAIM_REVENUE:
        setStage(LockStage.CONFIRM_CLAIM_REVENUE)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.CONFIRM_UPDATE_ADMIN)
        break
      case LockStage.ADMIN_WITHDRAW:
        setStage(LockStage.CONFIRM_ADMIN_WITHDRAW)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.DELETE_RAMP:
        setStage(LockStage.CONFIRM_DELETE_RAMP)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      case LockStage.INIT_RAMP:
        setStage(LockStage.CONFIRM_INIT_RAMP)
        break
      default:
        break
    }
  }

  const onSuccessSale = async (onfirmedTxHash) => {
    switch (stage) {
      case LockStage.CONFIRM_MINT:
        router.push(`/ramps/${router.query.ramp}`)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return requiresApproval(stakingTokenContract, account, rampHelperContract.address)
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [rampHelperContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now transfer tokens into this contract!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: async () => {
      if (stage === LockStage.CONFIRM_CREATE_PROTOCOL) {
        console.log('CONFIRM_CREATE_PROTOCOL2===============>', [state.token, state.tokenId || 0])
        return callWithGasPrice(rampContract, 'createProtocol', [state.token, state.tokenId || 0]).catch((err) =>
          console.log('CONFIRM_CREATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_GET_NATIVE && !data) {
        const native = usdPrice1?.length && usdPrice1[0]
        const value = getDecimalAmount(
          new BigNumber(parseFloat(stripeData?.amount) / parseFloat(native?.toString())),
        )?.toString()
        const args = [account, value, state.sessionId]
        console.log('CONFIRM_GET_NATIVE===============>', args, stripeData?.amount, native?.toString())
        return callWithGasPrice(rampContract, 'buyNative', args).catch((err) =>
          console.log('CONFIRM_GET_NATIVE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MINT) {
        const native = isExtraToken ? usdPrice?.length && usdPrice[0] : 1
        console.log(
          '2CONFIRM_MINT===============>',
          stripeData?.amount,
          native,
          parseFloat(stripeData?.amount) / parseFloat(native?.toString()),
          [
            data?.tokenAddress,
            account,
            BigInt(
              getDecimalAmount(
                new BigNumber(parseFloat(stripeData?.amount) / parseFloat(native?.toString())),
              )?.toString(),
            ),
            state.identityTokenId,
            state.sessionId,
          ],
        )
        const { request } = await client.simulateContract({
          account: adminAccount,
          address: rampContract.address,
          abi: rampABI,
          functionName: 'mint',
          args: [
            data?.tokenAddress,
            account,
            BigInt(
              getDecimalAmount(
                new BigNumber(parseFloat(stripeData?.amount) / parseFloat(native?.toString())),
              )?.toString(),
            ),
            state.identityTokenId,
            state.sessionId,
          ],
        })
        await walletClient.writeContract(request).catch((err) => console.log('CONFIRM_MINT===============>', err))
        return callWithGasPrice(rampHelperContract, 'postMint', [state.sessionId || '']).catch((err) =>
          console.log('1CONFIRM_MINT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const amount = getDecimalAmount(state.salePrice, 18)
        return callWithGasPrice(rampContract, 'updateProtocol', [
          state.token,
          state.close,
          amount.toString(),
          state.maxPartners,
        ]).catch((err) => console.log('CONFIRM_UPDATE_PROTOCOL===============>', err))
      }
      if (stage === LockStage.CONFIRM_BURN) {
        const amount = getDecimalAmount(state.amountReceivable, 18)
        console.log('CONFIRM_BURN===============>', [state.token, amount.toString(), state.identityTokenId])
        return callWithGasPrice(rampContract, 'burn', [state.token, amount.toString(), state.identityTokenId]).catch(
          (err) => console.log('CONFIRM_BURN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BUY_ACCOUNT) {
        return callWithGasPrice(rampContract, 'buyAccount', [state.token, state.tokenId, state.bountyId]).catch((err) =>
          console.log('CONFIRM_BUY_ACCOUNT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADMIN_WITHDRAW) {
        const amount = getDecimalAmount(state.amountReceivable, 18)
        return callWithGasPrice(rampContract, 'withdraw', [state.token, amount.toString()]).catch((err) =>
          console.log('CONFIRM_ADMIN_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BUY_RAMP) {
        return callWithGasPrice(rampContract, 'buyRamp', [state.token, state.bountyIds]).catch((err) =>
          console.log('CONFIRM_BUY_RAMP===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_INIT_RAMP) {
        console.log('CONFIRM_INIT_RAMP===============>', [
          pool.rampAddress,
          state.profileId,
          state.applicationLink,
          state.publishableKeys?.split(','),
          state.secretKeys?.split(','),
          state.clientIds?.split(','),
          state.avatar,
          state.description,
          state.channels?.split(','),
        ])
        return callWithGasPrice(rampHelperContract, 'updateRampInfo', [
          pool.rampAddress,
          state.profileId,
          state.applicationLink,
          state.publishableKeys?.split(','),
          state.secretKeys?.split(','),
          state.clientIds?.split(','),
          state.avatar,
          state.description,
          state.channels?.split(','),
        ]).catch((err) => console.log('CONFIRM_INIT_RAMP===============>', err))
      }
      if (stage === LockStage.CONFIRM_CLAIM_REVENUE) {
        return callWithGasPrice(rampContract, 'claimPendingRevenue', [state.token, state.partnerBountyId]).catch(
          (err) => console.log('CONFIRM_CLAIM_REVENUE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_PARTNER) {
        return callWithGasPrice(rampContract, 'addPartner', [state.token, state.bountyId]).catch((err) =>
          console.log('CONFIRM_PARTNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        return callWithGasPrice(rampContract, 'deleteProtocol', [state.token]).catch((err) =>
          console.log('CONFIRM_DELETE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_RAMP) {
        return callWithGasPrice(rampHelperContract, 'deleteRamp', [router.query.ramp]).catch((err) =>
          console.log('CONFIRM_DELETE_RAMP===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY) {
        return callWithGasPrice(rampContract, 'updateBounty', [state.token, state.bountyId]).catch((err) =>
          console.log('CONFIRM_UPDATE_BOUNTY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const amount = getDecimalAmount(state.amountReceivable, 18)
        return callWithGasPrice(rampContract, 'updateParameters', [
          state._ve,
          state.mintFee,
          state.burnFee,
          state.badgeId,
          amount.toString(),
        ]).catch((err) => console.log('CONFIRM_UPDATE_PARAMETERS===============>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_ADMIN) {
        return callWithGasPrice(rampContract, 'updateAdmin', [state.owner, !!state.add]).catch((err) =>
          console.log('CONFIRM_UPDATE_ADMIN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DEV) {
        return callWithGasPrice(rampContract, 'updateDev', [state.owner]).catch((err) =>
          console.log('CONFIRM_UPDATE_DEV===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_ID) {
        return callWithGasPrice(rampContract, 'updateTokenId', [state.token, state.tokenId]).catch((err) =>
          console.log('CONFIRM_UPDATE_TOKEN_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BADGE_ID) {
        return callWithGasPrice(rampContract, 'updateBadgeId', [state.token, state.badgeId]).catch((err) =>
          console.log('CONFIRM_UPDATE_BADGE_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UNLOCK_BOUNTY) {
        return callWithGasPrice(rampContract, 'unlockBounty', [state.token, state.bountyId]).catch((err) =>
          console.log('CONFIRM_UNLOCK_BOUNTY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROFILE_ID) {
        return callWithGasPrice(rampContract, 'updateProfile', [state.token, state.profileId]).catch((err) =>
          console.log('CONFIRM_UPDATE_PROFILE===============>', err),
        )
      }
      return null
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      dispatch(fetchRampsAsync({ chainId }))
      onSuccessSale(receipt.transactionHash)
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
      {stage === LockStage.PRE_MINT && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          {!account ? (
            <ConnectWalletButton />
          ) : checked ? (
            <Button
              mb="8px"
              variant="success"
              onClick={() => (getNative ? setStage(LockStage.CONFIRM_GET_NATIVE) : setStage(LockStage.CONFIRM_MINT))}
              disabled={
                getNative
                  ? !stripeData || !(usdPrice1?.length && !Number.isNaN(usdPrice1[0])) || data
                  : !tokenData ||
                    (!isExtraToken && stripeData?.currency?.toLowerCase() !== tokenData?.symbol?.toLowerCase())
              }
            >
              {getNative ? t('CONFIRM BUY') : t('CONFIRM MINT')}
            </Button>
          ) : null}
        </Flex>
      )}
      {stage === LockStage.SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button
            mb="8px"
            variant="success"
            disabled={!rampAccount?.isOverCollateralised}
            onClick={() => {
              if (pool?.redirect) {
                router.push(pool.redirect)
              } else {
                setStage(LockStage.MINT)
              }
            }}
          >
            {t('MINT')}
          </Button>
          <Button
            mb="8px"
            variant="danger"
            disabled={!rampAccount?.isOverCollateralised}
            onClick={() => {
              if (pool?.redirect) {
                router.push(pool.redirect)
              } else {
                setStage(LockStage.BURN)
              }
            }}
          >
            {t('BURN')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.PARTNER)}>
            {t('PARTNER')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.BUY_ACCOUNT)}>
            {t('BUY ACCOUNT')}
          </Button>
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.CLAIM)}>
            {t('CLAIM')}
          </Button>
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.CLAIM_REVENUE)}>
            {t('CLAIM REVENUE')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.CREATE_PROTOCOL)}>
            {t('CREATE ACCOUNT')}
          </Button>
          <Button
            mb="8px"
            variant="success"
            disabled={!rampAccount?.isOverCollateralised}
            onClick={() => {
              if (pool?.redirect) {
                router.push(pool.redirect)
              } else {
                setStage(LockStage.MINT)
              }
            }}
          >
            {t('MINT')}
          </Button>
          <Button
            mb="8px"
            variant="danger"
            disabled={!rampAccount?.isOverCollateralised}
            onClick={() => {
              if (pool?.redirect) {
                router.push(pool.redirect)
              } else {
                setStage(LockStage.BURN)
              }
            }}
          >
            {t('BURN')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PARAMETERS)}>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.UPDATE_ADMIN)}>
            {t('UPDATE ADMIN')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.UPDATE_DEV)}>
            {t('UPDATE OWNER')}
          </Button>
          {location !== 'header' ? (
            <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PROTOCOL)}>
              {t('UPDATE ACCOUNT')}
            </Button>
          ) : null}
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.INIT_RAMP)}>
            {t('UPDATE RAMP INFO')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY)}>
            {t('UPDATE BOUNTY')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UNLOCK_BOUNTY)}>
            {t('UNLOCK BOUNTY')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_TOKEN_ID)}>
            {t('UPDATE veNFT ID')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BADGE_ID)}>
            {t('UPDATE BADGE ID')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_PROFILE_ID)}>
            {t('UPDATE PROFILE ID')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE)}>
            {t('DELETE PROTOCOL')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.ADMIN_WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.UPDATE_PARAMETERS && (
        <UpdateParametersStage
          state={state}
          setState={setState}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CLAIM && (
        <CreateClaimStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_DEV && (
        <UpdateDevStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_ADMIN && (
        <UpdateAdminStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CLAIM_REVENUE && (
        <ClaimRevenueStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.MINT && (
        <MintStage
          state={state}
          pool={pool}
          currency={currency}
          mintable={getBalanceNumber(rampAccount?.mintable)}
          handleChange={handleChange}
          rampAddress={pool?.rampAddress}
          callWithGasPrice={callWithGasPrice}
          rampHelperContract={rampHelperContract}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BURN && (
        <BurnStage
          state={state}
          isExtraToken={isExtraToken}
          rampAccount={rampAccount}
          handleChange={handleChange}
          rampAddress={pool?.rampAddress}
          rampHelperContract={rampHelperContract}
          callWithGasPrice={callWithGasPrice}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.PARTNER && (
        <PartnerStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CREATE_PROTOCOL && (
        <CreateProtocolStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_PROTOCOL && (
        <UpdateProtocolStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BUY_ACCOUNT && (
        <BuyAccountStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.BUY_RAMP && (
        <BuyRampStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.ADMIN_WITHDRAW && (
        <AdminWithdrawStage
          currency={currency}
          pendingRevenue={adminARP?.pendingRevenue}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.UPDATE_BADGE_ID && (
        <UpdateBadgeStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_TOKEN_ID && (
        <UpdateTokenStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_PROFILE_ID && (
        <UpdateProfileStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_BOUNTY && (
        <UpdateBountyStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UNLOCK_BOUNTY && (
        <UnlockBountyStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_OWNER && (
        <UpdateOwnerStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.INIT_RAMP && (
        <InitRampStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_RAMP && <DeleteRampStage continueToNextStage={continueToNextStage} />}
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
