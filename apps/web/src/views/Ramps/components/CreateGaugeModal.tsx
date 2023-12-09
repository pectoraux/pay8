import EncryptRsa from 'encrypt-rsa'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useRampContract, useRampHelper, useRampAds } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useRouter } from 'next/router'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { useAppDispatch } from 'state'
import { fetchRampsAsync } from 'state/ramps'
import { createPublicClient, http, custom, createWalletClient } from 'viem'
import { fantomTestnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { rampABI } from 'config/abi/ramp'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import MintStage from './MintStage'
import BurnStage from './BurnStage'
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
import UpdateBlacklistStage from './UpdateBlacklistStage'
import UpdateParametersStage from './UpdateParametersStage'
import DeleteStage from './DeleteStage'
import InitRampStage from './InitRampStage'
import DeleteRampStage from './DeleteRampStage'
import SponsorTagStage from './SponsorTagStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import UpdateTokenStage from './UpdateTokenStage'
import UnlockBountyStage from './UnlockBountyStage'
import UpdateProfileStage from './UpdateProfileStage'
import AddExtraTokenStage from './AddExtraTokenStage'
import UpdateDevTokenStage from './UpdateDevTokenStage'
import UpdateBountyStage from './UpdateBountyStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import UpdateSponsorMediaStage from './UpdateSponsorMediaStage'
import LocationStage from './LocationStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_PROTOCOL]: t('Update Token Market'),
  [LockStage.UPDATE_INDIVIDUAL_PROTOCOL]: t('Update Token Market'),
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
  [LockStage.UPDATE_DEV_TOKEN_ID]: t('Update Ramp Leviathan Token'),
  [LockStage.UPDATE_BADGE_ID]: t('Update Attached Badge'),
  [LockStage.UPDATE_PROFILE_ID]: t('Update Attached Profile'),
  [LockStage.BUY_RAMP]: t('Buy Ramp'),
  [LockStage.BUY_ACCOUNT]: t('Buy Account'),
  [LockStage.PARTNER]: t('Partner'),
  [LockStage.BURN]: t('Burn'),
  [LockStage.MINT]: t('Mint'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.DELETE_RAMP]: t('Delete Ramp'),
  [LockStage.CREATE_PROTOCOL]: t('Add Token Market'),
  [LockStage.UPDATE_ADMIN]: t('Update Ramp Admin'),
  [LockStage.UPDATE_DEV]: t('Update Ramp Owner'),
  [LockStage.UPDATE_BLACKLIST]: t('Update Blacklist'),
  [LockStage.ADD_EXTRA_TOKEN]: t('Add Extra Token'),
  [LockStage.SPONSOR_TAG]: t('Sponsor Tag'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.UPDATE_SPONSOR_MEDIA]: t('Update Sponsor Media'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA]: t('Back'),
  [LockStage.CONFIRM_SPONSOR_TAG]: t('Back'),
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
  session,
  location = 'ramp',
  pool,
  currency,
  rampAccount,
  onDismiss,
}) => {
  const [stage, setStage] = useState(
    variant === 'mint'
      ? LockStage.CONFIRM_MINT
      : sessionId
      ? LockStage.PRE_MINT
      : variant === 'init'
      ? LockStage.INIT_RAMP
      : variant === 'user'
      ? LockStage.SETTINGS
      : variant === 'buy'
      ? LockStage.BUY_RAMP
      : variant === 'delete'
      ? LockStage.DELETE_RAMP
      : LockStage.ADMIN_SETTINGS,
  )
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account, chainId } = useAccountActiveChain()
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [checked, setChecked] = useState('')
  const { toastSuccess } = useToast()
  const adminARP = pool
  const router = useRouter()
  const stakingTokenContract = useERC20(
    currency?.address || rampAccount?.token?.address || router.query?.userCurrency || '',
  )
  const rampContract = useRampContract(pool?.rampAddress || router.query.ramp || '')
  const rampHelperContract = useRampHelper()
  const rampAdsContract = useRampAds()
  const dispatch = useAppDispatch()
  const adminAccount = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PAYSWAP_SIGNER}`)
  const client = createPublicClient({
    chain: fantomTestnet,
    transport: http(),
  })
  const walletClient = createWalletClient({
    chain: fantomTestnet,
    transport: custom(window.ethereum),
  })
  console.log('mcurrencyy1===============>', currency, rampAccount, pool, rampContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  console.log('sessionId===================>', session, sessionId)
  const [state, setState] = useState<any>(() => ({
    sk: pool?.secretKeys && pool?.secretKeys[0],
    pk: pool?.publishableKeys && pool?.publishableKeys[0],
    owner: pool?.owner,
    sponsor: '',
    tag: '',
    message: '',
    customTags: '',
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId ?? '0',
    identityTokenId: (session && session?.identityTokenId) || '0',
    automatic: pool?.automatic ? 1 : 0,
    applicationLink: pool?.applicationLink || '',
    publishableKeys: pool?.publishableKeys?.toString() || '',
    secretKeys: pool?.secretKeys?.toString() || '',
    clientIds: pool?.clientIds?.toString() || '',
    accountId: pool?.userData?.active && pool?.userData?.id,
    description: pool?.description || '',
    avatar: pool?.collection?.avatar || '',
    channels: pool?.channels?.toString() || '',
    moreInfo: '',
    amountPayable: session ? session.amount : '',
    amountReceivable: '',
    paidPayable: '',
    add: 0,
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
    token: session ? session?.token?.address : stakingTokenContract?.address || rampAccount?.token?.address,
    close: false,
    cap: pool?.cap || 0,
    salePrice: pool?.rampSalePrice || 0,
    maxPartners: pool?.maxPartners || 0,
    partnerBountyId: 0,
    bountyIds: [],
    badgeId: pool?.rampBadgeId,
    _ve: pool?._ve || stakingTokenContract?.address || rampAccount?.token?.address,
    mintFee: parseInt(pool?.mintFee ?? '0') / 100,
    burnFee: parseInt(pool?.burnFee ?? '0') / 100,
    title: '',
    content: '',
    sessionId: session?.id || sessionId || '',
  }))

  const [nftFilters, setNftFilters] = useState<any>({
    countries: pool?.countries,
    cities: pool?.cities,
    products: pool?.products,
  })
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
      case LockStage.INIT_RAMP:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_INIT_RAMP:
        setStage(LockStage.INIT_RAMP)
        break
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_LOCATION:
        setStage(LockStage.UPDATE_LOCATION)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROTOCOL:
        setStage(LockStage.UPDATE_PROTOCOL)
        break
      case LockStage.UPDATE_INDIVIDUAL_PROTOCOL:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_INDIVIDUAL_PROTOCOL:
        setStage(LockStage.UPDATE_INDIVIDUAL_PROTOCOL)
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
      case LockStage.CONFIRM_ADD_EXTRA_TOKEN:
        setStage(LockStage.ADD_EXTRA_TOKEN)
        break
      case LockStage.ADD_EXTRA_TOKEN:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_REMOVE_EXTRA_TOKEN:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
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
      case LockStage.CONFIRM_SPONSOR_TAG:
        setStage(LockStage.SPONSOR_TAG)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_SPONSOR_REVENUE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DEV_TOKEN_ID:
        setStage(LockStage.UPDATE_DEV_TOKEN_ID)
        break
      case LockStage.UPDATE_DEV_TOKEN_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BLACKLIST:
        setStage(LockStage.UPDATE_BLACKLIST)
        break
      case LockStage.UPDATE_BLACKLIST:
        setStage(LockStage.ADMIN_SETTINGS)
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
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.INIT_RAMP:
        setStage(LockStage.CONFIRM_INIT_RAMP)
        break
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.CONFIRM_UPDATE_LOCATION)
        break
      case LockStage.UPDATE_DEV:
        setStage(LockStage.CONFIRM_UPDATE_DEV)
        break
      case LockStage.UPDATE_ADMIN:
        setStage(LockStage.CONFIRM_UPDATE_ADMIN)
        break
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
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.CONFIRM_SPONSOR_TAG)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.UPDATE_DEV_TOKEN_ID:
        setStage(LockStage.CONFIRM_UPDATE_DEV_TOKEN_ID)
        break
      case LockStage.UPDATE_BLACKLIST:
        setStage(LockStage.CONFIRM_UPDATE_BLACKLIST)
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
      case LockStage.UPDATE_INDIVIDUAL_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_INDIVIDUAL_PROTOCOL)
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
      case LockStage.ADD_EXTRA_TOKEN:
        setStage(LockStage.CONFIRM_ADD_EXTRA_TOKEN)
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
      default:
        break
    }
  }

  const onSuccessSale = async (onfirmedTxHash) => {
    switch (stage) {
      case LockStage.CONFIRM_MINT:
        router.push(`/ramps/${router.query.ramp}`)
        break
      case LockStage.CONFIRM_INIT_RAMP:
        router.push(`/ramps`)
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
        const args = [state.token, state.tokenId]
        console.log('CONFIRM_CREATE_PROTOCOL===============>', args)
        return callWithGasPrice(rampContract, 'createProtocol', args).catch((err) =>
          console.log('CONFIRM_CREATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_LOCATION) {
        const args = [
          '0',
          '0',
          nftFilters?.country?.toString(),
          nftFilters?.city?.toString(),
          '0',
          '0',
          pool?.rampAddress,
          [nftFilters?.products?.toString()].filter((val) => !!val)?.toString() + state.customTags,
        ]
        console.log('CONFIRM_UPDATE_LOCATION===============>', args)
        return callWithGasPrice(rampHelperContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BLACKLIST) {
        return callWithGasPrice(rampHelperContract, 'updateBlacklist', [
          pool?.rampAddress,
          state.owner,
          !!state.add,
        ]).catch((err) => console.log('CONFIRM_UPDATE_BLACKLIST===============>', err))
      }
      if (stage === LockStage.CONFIRM_UPDATE_ADMIN) {
        console.log('CONFIRM_UPDATE_ADMIN===============>', [state.owner, !!state.add])
        return callWithGasPrice(rampContract, 'updateAdmin', [state.owner, !!state.add]).catch((err) =>
          console.log('1CONFIRM_UPDATE_ADMIN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DEV) {
        return callWithGasPrice(rampContract, 'updateDev', [state.owner]).catch((err) =>
          console.log('CONFIRM_UPDATE_DEV===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MINT) {
        const amount = getDecimalAmount(state.amountPayable, currency?.decimals)
        const args = [state.token, account, amount.toString(), state.identityTokenId, state.sessionId || '']
        console.log('CONFIRM_MINT===============>', args)
        const { request } = await client.simulateContract({
          account: adminAccount,
          address: rampContract.address,
          abi: rampABI,
          functionName: 'mint',
          args: [state.token, account, BigInt(amount.toString()), state.identityTokenId, state.sessionId || ''],
        })
        await walletClient.writeContract(request).catch((err) => console.log('1CONFIRM_MINT===============>', err))
        return callWithGasPrice(rampHelperContract, 'postMint', [state.sessionId || '']).catch((err) =>
          console.log('2CONFIRM_MINT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const amount = getDecimalAmount(state.salePrice, 18)
        const cap = getDecimalAmount(state.cap, 18)
        const args = [state.token, state.close, cap.toString(), amount.toString(), state.maxPartners]
        console.log('CONFIRM_UPDATE_PROTOCOL===============>', args)
        return callWithGasPrice(rampContract, 'updateProtocol', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_INDIVIDUAL_PROTOCOL) {
        const amount = getDecimalAmount(state.salePrice, 18)
        const cap = getDecimalAmount(state.cap, 18)
        const args = [state.token, state.close, cap.toString(), amount.toString(), state.maxPartners]
        console.log('CONFIRM_UPDATE_INDIVIDUAL_PROTOCOL===============>', args)
        return callWithGasPrice(rampContract, 'updateIndividualProtocol', args).catch((err) =>
          console.log('CONFIRM_UPDATE_INDIVIDUAL_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BURN) {
        const amount = getDecimalAmount(state.amountReceivable, currency?.decimals)
        const args = [state.token, amount.toString(), state.identityTokenId]
        console.log('CONFIRM_BURN===============>', args)
        return callWithGasPrice(rampContract, 'burn', args).catch((err) =>
          console.log('CONFIRM_BURN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BUY_ACCOUNT) {
        const args = [state.token, state.tokenId, state.bountyId]
        console.log('CONFIRM_BUY_ACCOUNT===============>', args)
        return callWithGasPrice(rampContract, 'buyAccount', args).catch((err) =>
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
        const args = [state.token, state.tokenId, state.bountyIds]
        return callWithGasPrice(rampContract, 'buyRamp', args).catch((err) =>
          console.log('CONFIRM_BUY_RAMP===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_INIT_RAMP) {
        const encryptRsa = new EncryptRsa()
        const pks = state.publishableKeys?.split(',')
        const sks = state.secretKeys?.split(',')
        const cIds = state.clientIds?.split(',')
        const cas = state.channels?.split(',')
        const pk0 = pks[0]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: pks[0],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const pk1 = pks[1]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: pks[1],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const pk2 = pks[2]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: pks[2],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const pk3 = pks[3]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: pks[3],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const pk4 = pks[4]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: pks[4],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''

        const sk0 = sks[0]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: sks[0],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const sk1 = sks[1]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: sks[1],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const sk2 = sks[2]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: sks[2],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const sk3 = sks[3]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: sks[3],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const sk4 = sks[4]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: sks[4],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''

        const cId0 = cIds[0]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: cIds[0],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const cId1 = cIds[1]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: cIds[1],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const cId2 = cIds[2]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: cIds[2],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const cId3 = cIds[3]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: cIds[3],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const cId4 = cIds[4]
          ? encryptRsa.encryptStringWithRsaPublicKey({
              text: cIds[4],
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
            })
          : ''
        const args = [
          pool.rampAddress,
          state.profileId ?? 0,
          '', // state.applicationLink,
          [pk0, pk1, pk2, pk3, pk4],
          [sk0, sk1, sk2, sk3, sk4],
          [cId0, cId1, cId2, cId3, cId4],
          state.avatar,
          state.description,
          [cas[0] || '', cas[1] || '', cas[2] || '', cas[3] || '', cas[4] || ''],
        ]
        console.log('CONFIRM_INIT_RAMP===============>', args)
        return callWithGasPrice(rampHelperContract, 'updateRampInfo', args).catch((err) =>
          console.log('CONFIRM_INIT_RAMP===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ADD_EXTRA_TOKEN) {
        const args = [pool?.rampAddress, currency.address, state.identityTokenId]
        console.log('CONFIRM_ADD_EXTRA_TOKEN===============>', args)
        return callWithGasPrice(rampHelperContract, 'addExtratoken', args).catch((err) =>
          console.log('CONFIRM_ADD_EXTRA_TOKEN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_REMOVE_EXTRA_TOKEN) {
        const args = [pool?.rampAddress, currency.address]
        console.log('CONFIRM_REMOVE_EXTRA_TOKEN===============>', args)
        return callWithGasPrice(rampHelperContract, 'removeExtratoken', args).catch((err) =>
          console.log('CONFIRM_REMOVE_EXTRA_TOKEN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_REVENUE) {
        const args = [state.token, state.partnerBountyId]
        console.log('CONFIRM_CLAIM_REVENUE===============>', args)
        return callWithGasPrice(rampContract, 'claimPendingRevenue', args).catch((err) =>
          console.log('CONFIRM_CLAIM_REVENUE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_PARTNER) {
        const args = [state.token, state.bountyId]
        console.log('CONFIRM_PARTNER===============>', args)
        return callWithGasPrice(rampContract, 'addPartner', args).catch((err) =>
          console.log('CONFIRM_PARTNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        return callWithGasPrice(rampContract, 'deleteProtocol', [state.token]).catch((err) =>
          console.log('CONFIRM_DELETE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_RAMP) {
        return callWithGasPrice(rampHelperContract, 'deleteRamp', [pool?.rampAddress]).catch((err) =>
          console.log('CONFIRM_DELETE_RAMP===============>', err, rampHelperContract),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY) {
        const args = [state.token, state.bountyId]
        console.log('CONFIRM_UPDATE_BOUNTY===============>', args)
        return callWithGasPrice(rampContract, 'updateBounty', args).catch((err) =>
          console.log('CONFIRM_UPDATE_BOUNTY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const amount = getDecimalAmount(state.salePrice ?? '0', currency?.decimals)
        const args = [
          parseInt(state.mintFee) * 100,
          parseInt(state.burnFee) * 100,
          state.badgeId,
          amount.toString(),
          !!state.automatic,
        ]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(rampContract, 'updateParameters', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM) {
        const amount = getDecimalAmount(state.amountPayable, 18)
        const args = [rampContract.address, state.token, amount.toString(), !!state.add, state.title, state.content]
        console.log('CONFIRM_CLAIM===============>', args)
        return callWithGasPrice(rampHelperContract, 'createClaim', args).catch((err) =>
          console.log('CONFIRM_CLAIM===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_SPONSOR_REVENUE) {
        console.log('CONFIRM_CLAIM_SPONSOR_REVENUE===============>', [pool?.rampAddress])
        return callWithGasPrice(rampAdsContract, 'claimPendingRevenueFromSponsors', [pool?.rampAddress]).catch((err) =>
          console.log('CONFIRM_CLAIM_SPONSOR_REVENUE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_ID) {
        const args = [state.token, state.tokenId]
        console.log('CONFIRM_UPDATE_TOKEN_ID===============>', args)
        return callWithGasPrice(rampContract, 'updateTokenId', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TOKEN_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SPONSOR_TAG) {
        const amount = getDecimalAmount(state.amountPayable, 18)
        const args = [state.sponsor, amount?.toString(), state.tag, state.message]
        console.log('CONFIRM_SPONSOR_TAG===============>', args)
        return callWithGasPrice(rampAdsContract, 'sponsorTag', args).catch((err) =>
          console.log('CONFIRM_SPONSOR_TAG===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA) {
        const args = [state.tag]
        console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', args)
        return callWithGasPrice(rampAdsContract, 'updateSponsorMedia', args).catch((err) =>
          console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DEV_TOKEN_ID) {
        console.log('CONFIRM_UPDATE_DEV_TOKEN_ID1===============>', nftFilters?.workspace?.value?.toLowerCase())
        const args = [getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase()), state.tokenId]
        console.log('CONFIRM_UPDATE_DEV_TOKEN_ID===============>', args)
        return callWithGasPrice(rampContract, 'updateDevTokenId', args).catch((err) =>
          console.log('CONFIRM_UPDATE_DEV_TOKEN_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BADGE_ID) {
        const args = [state.token, state.badgeId]
        console.log('CONFIRM_UPDATE_BADGE_ID===============>', args)
        return callWithGasPrice(rampContract, 'updateBadgeId', args).catch((err) =>
          console.log('CONFIRM_UPDATE_BADGE_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UNLOCK_BOUNTY) {
        const args = [state.token, state.bountyId]
        console.log('CONFIRM_UNLOCK_BOUNTY===============>', args)
        return callWithGasPrice(rampContract, 'unlockBounty', args).catch((err) =>
          console.log('CONFIRM_UNLOCK_BOUNTY===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROFILE_ID) {
        const args = [state.token, state.profileId]
        console.log('CONFIRM_UPDATE_PROFILE===============>', args)
        return callWithGasPrice(rampContract, 'updateProfile', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PROFILE===============>', err),
        )
      }
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
            <Button mb="8px" variant="success" onClick={() => setStage(LockStage.CONFIRM_MINT)}>
              {t('CONFIRM MINT')}
            </Button>
          ) : null}
        </Flex>
      )}
      {stage === LockStage.SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button
            mb="8px"
            variant="success"
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
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.SPONSOR_TAG)}>
            {t('SPONSOR TAG')}
          </Button>
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.UPDATE_SPONSOR_MEDIA)}>
            {t('UPDATE SPONSOR MEDIA')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.BUY_ACCOUNT)}>
            {t('BUY TOKEN MARKET')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_INDIVIDUAL_PROTOCOL)}>
            {t('UPDATE TOKEN MARKET')}
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
            {t('ADD TOKEN MARKET')}
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
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          {location !== 'header' ? (
            <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PROTOCOL)}>
              {t('UPDATE TOKEN MARKET')}
            </Button>
          ) : null}
          <Button mb="8px" onClick={() => setStage(LockStage.ADD_EXTRA_TOKEN)}>
            {t('ADD EXTRA TOKEN')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY)}>
            {t('UPDATE BOUNTY')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.INIT_RAMP)}>
            {t('UPDATE RAMP INFO')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_DEV_TOKEN_ID)}>
            {t('UPDATE RAMP LEVIATHAN TOKEN ID')}
          </Button>
          {/* <Button mb="8px" variant="light" onClick={() => setStage(LockStage.UPDATE_PROFILE_ID)}>
            {t('UPDATE PROFILE ID')}
          </Button> */}
          {/* <Button mb="8px" variant="light" onClick={() => setStage(LockStage.UPDATE_BADGE_ID)}>
            {t('UPDATE BADGE ID')}
          </Button>
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.UPDATE_TOKEN_ID)}>
            {t('UPDATE ACCOUNT TOKEN ID')}
          </Button> */}
          <Button mb="8px" variant="light" onClick={() => setStage(LockStage.CONFIRM_CLAIM_SPONSOR_REVENUE)}>
            {t('CLAIM REVENUE FROM SPONSORS')}
          </Button>
          <Button mb="8px" variant="tertiary" onClick={() => setStage(LockStage.UNLOCK_BOUNTY)}>
            {t('UNLOCK BOUNTY')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.UPDATE_BLACKLIST)}>
            {t('UPDATE BLACKLIST')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.UPDATE_ADMIN)}>
            {t('UPDATE ADMIN')}
          </Button>
          <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.UPDATE_DEV)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE)}>
            {t('DELETE PROTOCOL')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.ADMIN_WITHDRAW)}>
            {t('WITHDRAW')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.UPDATE_PARAMETERS && (
        <UpdateParametersStage
          state={state}
          setState={setState}
          currency={currency}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_LOCATION && (
        <LocationStage
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
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
      {stage === LockStage.UPDATE_BLACKLIST && (
        <UpdateBlacklistStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.CLAIM && (
        <CreateClaimStage
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
          handleChange={handleChange}
          rampAddress={pool?.rampAddress}
          rampHelperContract={rampHelperContract}
          callWithGasPrice={callWithGasPrice}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BURN && (
        <BurnStage
          state={state}
          handleChange={handleChange}
          rampAddress={pool?.rampAddress}
          callWithGasPrice={callWithGasPrice}
          rampHelperContract={rampHelperContract}
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
      {stage === LockStage.UPDATE_INDIVIDUAL_PROTOCOL && (
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
          state={state}
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
      {stage === LockStage.UPDATE_DEV_TOKEN_ID && (
        <UpdateDevTokenStage
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PROFILE_ID && (
        <UpdateProfileStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_BOUNTY && (
        <UpdateBountyStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.ADD_EXTRA_TOKEN && (
        <AddExtraTokenStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
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
      {stage === LockStage.SPONSOR_TAG && (
        <SponsorTagStage
          state={state}
          account={account}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_SPONSOR_MEDIA && (
        <UpdateSponsorMediaStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
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
