import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  useERC20,
  useGameContract,
  useGameFactory,
  useGameMinter,
  useGameHelper,
  useGameHelper2,
} from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { ChangeEvent, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import ApproveAndConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from 'views/Nft/market/components/BuySellModals/shared/ConfirmStage'
import TransactionConfirmed from 'views/Nft/market/components/BuySellModals/shared/TransactionConfirmed'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetGame } from 'state/games/hooks'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { differenceInSeconds } from 'date-fns'
import { fantomTestnet } from 'viem/chains'
import { createPublicClient, http, custom, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { getGameMinterAddress } from 'utils/addressHelpers'
import { gameMinterABI } from 'config/abi/gameMinter'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateTokenIdStage from './UpdateTokenIdStage'
import UpdateGameStage from './UpdateGameStage'
import AttachKillDetachStage from './AttachKillDetachStage'
import UpdateSponsorMediaStage from './UpdateSponsorMediaStage'
import CreateGamingStage from './CreateGamingStage'
import ProcessScoreStage from './ProcessScoreStage'
import ProcessScoreStage2 from './ProcessScoreStage2'
import BurnStage from './BurnStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import UpdateObjectStage from './UpdateObjectStage'
import UpdateBurnForCreditStage from './UpdateBurnForCreditStage'
import UpdatePricePerMinuteStage from './UpdatePricePerMinuteStage'
import UpdateDestinationStage from './UpdateDestinationStage'
import UpdateMaxUseStage from './UpdateMaxUseStage'
import SponsorTagStage from './SponsorTagStage'
import MintObjectStage from './MintObjectStage'
import BurnObjectStage from './BurnObjectStage'
import WithdrawResourceStage from './WithdrawResourceStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteStage from './DeleteStage'
import LocationStage from './LocationStage'
import BuyMinutesStage from './BuyMinutesStage'
import BurnTokenForCreditStage from './BurnTokenForCreditStage'
import UpdateUriStage from './UpdateUriStage'
import UpdateTaskStage from './UpdateTaskStage'
import BlacklistAuditorStage from './BlacklistAuditorStage'
import BlacklistTicketStage from './BlacklistTicketStage'
import UpdateExcludedContentStage from './UpdateExcludedContentStage'
import UpdateTagRegistrationStage from './UpdateTagRegistrationStage'
import UpdateInfoStage from './UpdateInfoStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.CREATE_GAMING_NFT]: t('Create Gaming NFT'),
  [LockStage.BUY_MINUTES]: t('Buy Minutes'),
  [LockStage.BURN_TOKEN_FOR_CREDIT]: t('Burn Token For Credit'),
  [LockStage.PROCESS_SCORE]: t('Process Score'),
  [LockStage.UPDATE_SCORE]: t('Update Score'),
  [LockStage.WITHDRAW]: t('Claim Rewards'),
  [LockStage.MINT_OBJECT]: t('Mint Object'),
  [LockStage.BURN_OBJECT]: t('Burn Object'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.WITHDRAW_RESOURCES]: t('Withdraw Resources'),
  [LockStage.UPDATE_DESTINATION]: t('Update Destination'),
  [LockStage.SPONSOR_TAG]: t('Sponsor Tag'),
  [LockStage.UPDATE_SPONSOR_MEDIA]: t('Update Sponsor Media'),
  [LockStage.ATTACH_KILL_DETACH_TOKEN]: t('Attach, Kill, or Detach Token'),
  [LockStage.BURN_TOKEN]: t('Burn Token'),
  [LockStage.UPDATE_GAME]: t('Update Game'),
  [LockStage.UPDATE_INFO]: t('Update Info'),
  [LockStage.UPDATE_TOKEN_ID]: t('Update Token ID'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.UPDATE_OBJECT]: t('Update Object'),
  [LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT]: t('Update Burn Token For Credit'),
  [LockStage.UPDATE_MAX_USE]: t('Update Maximum Use'),
  [LockStage.UPDATE_URI_GENERATOR]: t('Update URI Generator'),
  [LockStage.UPDATE_TASK_CONTRACT]: t('Update Task Contract'),
  [LockStage.BLACKLIST_AUDITOR]: t('Blacklist Auditor'),
  [LockStage.BLACKLIST_GAME_NFT_TOKEN]: t('Blacklist Game NFT Token'),
  [LockStage.UPDATE_EXCLUDED_CONTENT]: t('Update Excluded Content'),
  [LockStage.UPDATE_TAG_REGISTRATION]: t('Update Tag Registration'),
  [LockStage.UPDATE_PRICE_PER_MINUTE]: t('Update Price Per Minute'),
  [LockStage.DELETE_GAME]: t('Delete Game'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_GAME]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW_RESOURCES]: t('Back'),
  [LockStage.CONFIRM_UPDATE_INFO]: t('Back'),
  [LockStage.CONFIRM_BURN_TOKEN]: t('Back'),
  [LockStage.CONFIRM_ATTACH_KILL_DETACH_TOKEN]: t('Back'),
  [LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA]: t('Back'),
  [LockStage.CONFIRM_SPONSOR_TAG]: t('Back'),
  [LockStage.CONFIRM_UPDATE_DESTINATION]: t('Back'),
  [LockStage.CONFIRM_BURN_OBJECT]: t('Back'),
  [LockStage.CONFIRM_MINT_OBJECT]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_UPDATE_SCORE]: t('Back'),
  [LockStage.CONFIRM_PROCESS_SCORE]: t('Back'),
  [LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT]: t('Back'),
  [LockStage.CONFIRM_BUY_MINUTES]: t('Back'),
  [LockStage.CONFIRM_CREATE_GAMING_NFT]: t('Back'),
  [LockStage.CONFIRM_DELETE_GAME]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TAG_REGISTRATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT]: t('Back'),
  [LockStage.CONFIRM_BLACKLIST_GAME_NFT_TOKEN]: t('Back'),
  [LockStage.CONFIRM_BLACKLIST_AUDITOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TASK_CONTRACT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_URI_GENERATOR]: t('Back'),
  [LockStage.CONFIRM_UPDATE_MAX_USE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OBJECT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TOKEN_ID]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({ variant = 'user', pool, currAccount, currency, onDismiss }) => {
  const [stage, setStage] = useState(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const referrerAddress = router.query?.referrer as string
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const gameContract = useGameContract(pool?.gameAddress || router.query.game || '')
  const gameFactoryContract = useGameFactory()
  const gameMinterContract = useGameMinter()
  const gameHelperContract = useGameHelper()
  const gameHelper2Contract = useGameHelper2()
  const gameData = useGetGame(pool?.gameAPI, currAccount?.id ?? '0') as any
  // const gameData = useGetGame(`https://firestore.googleapis.com/v1/projects/tiktok-a2bdb/databases/(default)/documents/c4/${currAccount?.id ?? '0'}`) as any
  console.log('gameMinterContractWithPayswapSigner==========>', gameData, gameMinterContract)
  console.log('mcurrencyy===============>', currAccount, currency, pool, gameContract)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)
  const adminAccount = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PAYSWAP_SIGNER}`)
  const client = createPublicClient({
    chain: fantomTestnet,
    transport: http(),
  })
  const walletClient = createWalletClient({
    chain: fantomTestnet,
    transport: custom(window.ethereum),
  })
  const [state, setState] = useState<any>(() => ({
    tokenId: currAccount?.id ?? '',
    score: '',
    deadline: '',
    identityTokenId: '',
    numMinutes: '',
    toAddress: account ?? '',
    collectionId: pool?.collection?.id ?? '',
    amountReceivable: getBalanceNumber(pool?.pricePerMinutes ?? 0, currency?.decimals),
    nftype: 0,
    position: '',
    objectName: '',
    tokenIds: '',
    destination: '',
    sponsor: '',
    tag: '',
    message: '',
    contentType: '',
    gameProfileId: '',
    action: 0,
    add: 0,
    claimable: pool?.claimable ? 1 : 0,
    clear: 0,
    maxUse: '',
    auditor: '',
    uriGenerator: '',
    task: '',
    item: '',
    checker: '',
    discount: '',
    referrerFee: parseInt(pool?.referrerFee ?? '0') / 100 ?? '',
    creatorShare: parseInt(pool?.creatorShare ?? '0') / 100 ?? '',
    period: '',
    gameContract: pool?.gameContract ?? '',
    owner: pool?.owner || '',
    gameName: pool?.gameName ?? '',
    gameLink: pool?.gameLink ?? '',
    gameAPI: pool?.gameAPI ?? '',
    customTags: '',
  }))

  const [nftFilters, setNftFilters] = useState<any>({
    country: pool?.collection?.countries,
    city: pool?.collection?.cities,
    product: pool?.collection?.products,
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
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_LOCATION:
        setStage(LockStage.UPDATE_LOCATION)
        break
      case LockStage.CREATE_GAMING_NFT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_CREATE_GAMING_NFT:
        setStage(LockStage.CREATE_GAMING_NFT)
        break
      case LockStage.BUY_MINUTES:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BUY_MINUTES:
        setStage(LockStage.BUY_MINUTES)
        break
      case LockStage.BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.PROCESS_SCORE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_PROCESS_SCORE:
        setStage(LockStage.PROCESS_SCORE)
        break
      case LockStage.UPDATE_SCORE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_SCORE:
        setStage(LockStage.UPDATE_SCORE)
        break
      case LockStage.WITHDRAW:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.MINT_OBJECT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_MINT_OBJECT:
        setStage(LockStage.MINT_OBJECT)
        break
      case LockStage.BURN_OBJECT:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_BURN_OBJECT:
        setStage(LockStage.BURN_OBJECT)
        break
      case LockStage.WITHDRAW_RESOURCES:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW_RESOURCES:
        setStage(LockStage.WITHDRAW_RESOURCES)
        break
      case LockStage.UPDATE_DESTINATION:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_DESTINATION:
        setStage(LockStage.UPDATE_DESTINATION)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_SPONSOR_TAG:
        setStage(LockStage.SPONSOR_TAG)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.ATTACH_KILL_DETACH_TOKEN:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_ATTACH_KILL_DETACH_TOKEN:
        setStage(LockStage.ATTACH_KILL_DETACH_TOKEN)
        break
      case LockStage.CONFIRM_BURN_TOKEN:
        setStage(LockStage.BURN_TOKEN)
        break
      case LockStage.BURN_TOKEN:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_GAME:
        setStage(LockStage.UPDATE_GAME)
        break
      case LockStage.UPDATE_GAME:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_INFO:
        setStage(LockStage.UPDATE_INFO)
        break
      case LockStage.UPDATE_INFO:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TOKEN_ID:
        setStage(LockStage.UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OBJECT:
        setStage(LockStage.UPDATE_OBJECT)
        break
      case LockStage.UPDATE_OBJECT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_URI_GENERATOR:
        setStage(LockStage.UPDATE_URI_GENERATOR)
        break
      case LockStage.UPDATE_URI_GENERATOR:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_MAX_USE:
        setStage(LockStage.UPDATE_MAX_USE)
        break
      case LockStage.UPDATE_MAX_USE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TASK_CONTRACT:
        setStage(LockStage.UPDATE_TASK_CONTRACT)
        break
      case LockStage.UPDATE_TASK_CONTRACT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_BLACKLIST_AUDITOR:
        setStage(LockStage.BLACKLIST_AUDITOR)
        break
      case LockStage.BLACKLIST_AUDITOR:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_BLACKLIST_GAME_NFT_TOKEN:
        setStage(LockStage.BLACKLIST_GAME_NFT_TOKEN)
        break
      case LockStage.BLACKLIST_GAME_NFT_TOKEN:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_TAG_REGISTRATION:
        setStage(LockStage.UPDATE_TAG_REGISTRATION)
        break
      case LockStage.UPDATE_TAG_REGISTRATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE:
        setStage(LockStage.UPDATE_PRICE_PER_MINUTE)
        break
      case LockStage.UPDATE_PRICE_PER_MINUTE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_GAME:
        setStage(LockStage.DELETE_GAME)
        break
      case LockStage.DELETE_GAME:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      default:
        break
    }
  }

  const continueToNextStage = () => {
    switch (stage) {
      case LockStage.UPDATE_LOCATION:
        setStage(LockStage.CONFIRM_UPDATE_LOCATION)
        break
      case LockStage.CREATE_GAMING_NFT:
        setStage(LockStage.CONFIRM_CREATE_GAMING_NFT)
        break
      case LockStage.BUY_MINUTES:
        setStage(LockStage.CONFIRM_BUY_MINUTES)
        break
      case LockStage.BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.PROCESS_SCORE:
        setStage(LockStage.CONFIRM_PROCESS_SCORE)
        break
      case LockStage.UPDATE_SCORE:
        setStage(LockStage.CONFIRM_UPDATE_SCORE)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.MINT_OBJECT:
        setStage(LockStage.CONFIRM_MINT_OBJECT)
        break
      case LockStage.BURN_OBJECT:
        setStage(LockStage.CONFIRM_BURN_OBJECT)
        break
      case LockStage.WITHDRAW_RESOURCES:
        setStage(LockStage.CONFIRM_WITHDRAW_RESOURCES)
        break
      case LockStage.UPDATE_DESTINATION:
        setStage(LockStage.CONFIRM_UPDATE_DESTINATION)
        break
      case LockStage.SPONSOR_TAG:
        setStage(LockStage.CONFIRM_SPONSOR_TAG)
        break
      case LockStage.UPDATE_SPONSOR_MEDIA:
        setStage(LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA)
        break
      case LockStage.ATTACH_KILL_DETACH_TOKEN:
        setStage(LockStage.CONFIRM_ATTACH_KILL_DETACH_TOKEN)
        break
      case LockStage.BURN_TOKEN:
        setStage(LockStage.CONFIRM_BURN_TOKEN)
        break
      case LockStage.UPDATE_GAME:
        setStage(LockStage.CONFIRM_UPDATE_GAME)
        break
      case LockStage.UPDATE_INFO:
        setStage(LockStage.CONFIRM_UPDATE_INFO)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.CONFIRM_UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.UPDATE_OBJECT:
        setStage(LockStage.CONFIRM_UPDATE_OBJECT)
        break
      case LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT:
        setStage(LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT)
        break
      case LockStage.UPDATE_MAX_USE:
        setStage(LockStage.CONFIRM_UPDATE_MAX_USE)
        break
      case LockStage.UPDATE_URI_GENERATOR:
        setStage(LockStage.CONFIRM_UPDATE_URI_GENERATOR)
        break
      case LockStage.UPDATE_TASK_CONTRACT:
        setStage(LockStage.CONFIRM_UPDATE_TASK_CONTRACT)
        break
      case LockStage.BLACKLIST_AUDITOR:
        setStage(LockStage.CONFIRM_BLACKLIST_AUDITOR)
        break
      case LockStage.BLACKLIST_GAME_NFT_TOKEN:
        setStage(LockStage.CONFIRM_BLACKLIST_GAME_NFT_TOKEN)
        break
      case LockStage.UPDATE_EXCLUDED_CONTENT:
        setStage(LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT)
        break
      case LockStage.UPDATE_TAG_REGISTRATION:
        setStage(LockStage.CONFIRM_UPDATE_TAG_REGISTRATION)
        break
      case LockStage.UPDATE_PRICE_PER_MINUTE:
        setStage(LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE)
        break
      case LockStage.DELETE_GAME:
        setStage(LockStage.CONFIRM_DELETE_GAME)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, gameFactoryContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [gameFactoryContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start receiving payments for audits!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: async () => {
      if (stage === LockStage.CONFIRM_BUY_MINUTES) {
        const args = [
          state.owner,
          account,
          referrerAddress || ADDRESS_ZERO,
          '',
          state.tokenId,
          state.identityTokenId,
          [state.numMinutes],
        ]
        console.log('CONFIRM_BUY_MINUTES===============>', gameFactoryContract, args)
        return callWithGasPrice(gameFactoryContract, 'buyWithContract', args).catch((err) =>
          console.log('CONFIRM_BUY_MINUTES===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CREATE_GAMING_NFT) {
        const args = [account, state.collectionId]
        console.log('CONFIRM_CREATE_GAMING_NFT===============>', args)
        return callWithGasPrice(gameMinterContract, 'mint', args).catch((err) =>
          console.log('CONFIRM_CREATE_GAMING_NFT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BURN_TOKEN_FOR_CREDIT) {
        const amount = !state.nftype
          ? getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)?.toString()
          : state.amountReceivable
        const args = [state.owner, state.position, amount]
        console.log('CONFIRM_BURN_TOKEN_FOR_CREDIT===============>', args)
        return callWithGasPrice(gameFactoryContract, 'burnForCredit', args).catch((err) =>
          console.log('CONFIRM_BURN_TOKEN_FOR_CREDIT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_SCORE) {
        const args = [state.tokenId, state.score, state.deadline]
        console.log('CONFIRM_UPDATE_SCORE===============>', args)
        return callWithGasPrice(gameMinterContract, 'updateScoreNDeadline', args).catch((err) =>
          console.log('CONFIRM_UPDATE_SCORE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_PROCESS_SCORE) {
        console.log('CONFIRM_PROCESS_SCORE===============>', [
          currAccount?.id,
          BigInt(Object.values(gameData?.data?.score ?? gameData?.data?.value)?.toString()),
          BigInt(parseInt(Object.values(gameData?.data?.deadline)?.toString() || '0')),
        ])
        const { request } = await client.simulateContract({
          account: adminAccount,
          address: getGameMinterAddress(),
          abi: gameMinterABI,
          functionName: 'updateScoreNDeadline',
          args: [
            BigInt(currAccount?.id),
            BigInt(Object.values(gameData?.data?.score ?? gameData?.data?.value)?.toString()),
            BigInt(parseInt(Object.values(gameData?.data?.deadline)?.toString() || '0')),
          ],
        })
        return walletClient
          .writeContract(request)
          .catch((err) => console.log('1CONFIRM_PROCESS_SCORE===============>', err))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const args = [state.owner, state.identityTokenId, state.tokenId]
        console.log('CONFIRM_WITHDRAW===============>', args)
        return callWithGasPrice(gameFactoryContract, 'claimGameTicket', args).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_MINT_OBJECT) {
        const args = [state.objectName?.toLowerCase(), state.collectionId, state.tokenId, state.tokenIds?.split(',')]
        console.log('CONFIRM_MINT_OBJECT===============>', args)
        return callWithGasPrice(gameHelperContract, 'mintExtra', args).catch((err) =>
          console.log('CONFIRM_MINT_OBJECT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BURN_OBJECT) {
        const args = [state.objectName?.toLowerCase(), state.collectionId, state.tokenId, state.toAddress]
        console.log('CONFIRM_BURN_OBJECT===============>', args)
        return callWithGasPrice(gameHelperContract, 'burnObject', args).catch((err) =>
          console.log('CONFIRM_BURN_OBJECT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_WITHDRAW_RESOURCES) {
        const args = [state.tokenId, state.toAddress]
        console.log('CONFIRM_WITHDRAW_RESOURCES===============>', args)
        return callWithGasPrice(gameHelperContract, 'withdrawResources', args).catch((err) =>
          console.log('CONFIRM_WITHDRAW_RESOURCES===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_DESTINATION) {
        const args = [state.tokenId, state.destination]
        console.log('CONFIRM_UPDATE_DESTINATION===============>', args)
        return callWithGasPrice(gameHelperContract, 'updateDestination', args).catch((err) =>
          console.log('CONFIRM_UPDATE_DESTINATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_SPONSOR_TAG) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [state.sponsor, state.gameProfileId, amountReceivable.toString(), state.tag, state.message]
        console.log('CONFIRM_SPONSOR_TAG===============>', args)
        return callWithGasPrice(gameHelper2Contract, 'sponsorTag', args).catch((err) =>
          console.log('CONFIRM_SPONSOR_TAG===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_SPONSOR_MEDIA) {
        const args = [state.gameProfileId, state.tag]
        console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', args)
        return callWithGasPrice(gameHelper2Contract, 'updateSponsorMedia', args).catch((err) =>
          console.log('CONFIRM_UPDATE_SPONSOR_MEDIA===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_ATTACH_KILL_DETACH_TOKEN) {
        const period = Math.max(
          differenceInSeconds(new Date(state.period ?? 0), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args = !state.action ? [state.tokenId, period, state.toAddress] : [state.tokenId]
        const method = !state.action ? 'attach' : state.action === 1 ? 'detach' : 'killTimer'
        console.log('CONFIRM_ATTACH_KILL_DETACH_TOKEN===============>', args)
        return callWithGasPrice(gameMinterContract, method, args).catch((err) =>
          console.log('CONFIRM_ATTACH_KILL_DETACH_TOKEN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BURN_TOKEN) {
        const args = [state.tokenId]
        console.log('CONFIRM_BURN_TOKEN===============>', args)
        return callWithGasPrice(gameMinterContract, 'burn', args).catch((err) =>
          console.log('CONFIRM_BURN_TOKEN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_GAME) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [
          state.owner,
          state.gameContract,
          amountReceivable?.toString(),
          parseInt(state.creatorShare) * 100,
          parseInt(state.referrerFee) * 100,
          !!state.claimable,
        ]
        console.log('CONFIRM_UPDATE_GAME===============>', args)
        return callWithGasPrice(gameFactoryContract, 'updateProtocol', args).catch((err) =>
          console.log('CONFIRM_UPDATE_GAME===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_INFO) {
        const args = ['0', pool?.collection?.id, state.gameLink, state.gameName, '0', '0', ADDRESS_ZERO, state.gameAPI]
        console.log('CONFIRM_UPDATE_INFO===============>', args)
        return callWithGasPrice(gameFactoryContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_INFO===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_LOCATION) {
        const customTags = state.customTags?.split(',')
        const args = [
          '4',
          pool?.collection?.id,
          nftFilters?.country?.toString(),
          nftFilters?.city?.toString(),
          '0',
          '0',
          ADDRESS_ZERO,
          nftFilters?.product?.length ? nftFilters?.product[0] : customTags?.length && customTags[0],
        ]
        console.log('CONFIRM_UPDATE_LOCATION===============>', args)
        return callWithGasPrice(gameFactoryContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_ID) {
        const args = [state.tokenId, state.collectionId]
        console.log('CONFIRM_UPDATE_TOKEN_ID===============>', args)
        return callWithGasPrice(gameFactoryContract, 'updateTokenId', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TOKEN_ID===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = [state.collectionId]
        console.log('CONFIRM_UPDATE_OWNER===============>', args)
        return callWithGasPrice(gameFactoryContract, 'updateOwner', args).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OBJECT) {
        const args = [state.collectionId, state.objectName?.toLowerCase(), state.tokenIds?.split(','), state.add]
        console.log('CONFIRM_UPDATE_OBJECT===============>', args)
        return callWithGasPrice(gameHelperContract, 'updateObject', args).catch((err) =>
          console.log('CONFIRM_UPDATE_OBJECT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT) {
        const args = [
          currency.address,
          state.checker,
          state.destination,
          parseInt(state.discount) * 100,
          state.collectionId,
          !!state.clear,
          state.item,
        ]
        console.log('CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT===============>', args)
        return callWithGasPrice(gameFactoryContract, 'updateBurnTokenForCredit', args).catch((err) =>
          console.log('CONFIRM_UPDATE_BURN_TOKEN_FOR_CREDIT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_MAX_USE) {
        const args = [state.maxUse]
        console.log('CONFIRM_UPDATE_MAX_USE===============>', args)
        return callWithGasPrice(gameHelperContract, 'updateMaxUse', args).catch((err) =>
          console.log('CONFIRM_UPDATE_MAX_USE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_URI_GENERATOR) {
        const args = [state.collectionId, state.uriGenerator]
        console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', args)
        return callWithGasPrice(gameHelperContract, 'updateUriGenerator', args).catch((err) =>
          console.log('CONFIRM_UPDATE_URI_GENERATOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TASK_CONTRACT) {
        const args = [state.collectionId, state.task]
        console.log('CONFIRM_UPDATE_TASK_CONTRACT===============>', args)
        return callWithGasPrice(gameHelperContract, 'updateTaskContract', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TASK_CONTRACT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BLACKLIST_AUDITOR) {
        const args = [state.collectionId, state.auditor, !!state.add]
        console.log('CONFIRM_BLACKLIST_AUDITOR===============>', args)
        return callWithGasPrice(gameHelperContract, 'updateBlacklist', args).catch((err) =>
          console.log('CONFIRM_BLACKLIST_AUDITOR===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_BLACKLIST_GAME_NFT_TOKEN) {
        const args = [state.collectionId, state.tokenId, !!state.add]
        console.log('CONFIRM_BLACKLIST_GAME_NFT_TOKEN===============>', args)
        return callWithGasPrice(gameHelperContract, 'updateBlacklistedTicket', args).catch((err) =>
          console.log('CONFIRM_BLACKLIST_GAME_NFT_TOKEN===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_EXCLUDED_CONTENT) {
        const args = [state.tag, state.contentType, !!state.add]
        console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', args)
        return callWithGasPrice(gameHelper2Contract, 'updateExcludedContent', args).catch((err) =>
          console.log('CONFIRM_UPDATE_EXCLUDED_CONTENT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TAG_REGISTRATION) {
        const args = [state.tag, !!state.add]
        console.log('CONFIRM_UPDATE_TAG_REGISTRATION===============>', args)
        return callWithGasPrice(gameHelper2Contract, 'updateTagRegistration', args).catch((err) =>
          console.log('CONFIRM_UPDATE_TAG_REGISTRATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PRICE_PER_MINUTE) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [amountReceivable.toString()]
        console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', args)
        return callWithGasPrice(gameHelper2Contract, 'updatePricePerAttachMinutes', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PRICE_PER_MINUTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_GAME) {
        const args = [state.collectionId]
        console.log('CONFIRM_DELETE_GAME===============>', args)
        return callWithGasPrice(gameFactoryContract, 'deleteGame', args).catch((err) =>
          console.log('CONFIRM_DELETE_GAME===============>', err),
        )
      }
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
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
      {stage === LockStage.SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.CREATE_GAMING_NFT)}>
            {t('CREATE GAMING NFT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.BUY_MINUTES)}>
            {t('BUY MINUTES')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.BURN_TOKEN_FOR_CREDIT)}>
            {t('BURN TOKEN FOR CREDIT')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.PROCESS_SCORE)}>
            {t('PROCESS SCORE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.WITHDRAW)}>
            {t('CLAIM REWARDS')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.MINT_OBJECT)}>
            {t('MINT OBJECT')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.BURN_OBJECT)}>
            {t('BURN OBJECT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.WITHDRAW_RESOURCES)}>
            {t('WITHDRAW RESOURCES')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_DESTINATION)}>
            {t('UPDATE DESTINATION')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.SPONSOR_TAG)}>
            {t('SPONSOR TAG')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_SPONSOR_MEDIA)}>
            {t('UPDATE SPONSOR MEDIA')}
          </Button>
          {/* <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.ATTACH_KILL_DETACH_TOKEN)}>
            {t('ATTACH/KILL/DETACH TOKEN')}
          </Button> */}
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.BURN_TOKEN)}>
            {t('BURN TOKEN')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_GAME)}>
            {t('UPDATE GAME')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_INFO)}>
            {t('UPDATE INFO')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_TOKEN_ID)}>
            {t('UPDATE TOKEN ID')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
            {t('UPDATE OWNER')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_OBJECT)}>
            {t('UPDATE OBJECT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT)}>
            {t('UPDATE BURN TOKEN FOR CREDIT')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_MAX_USE)}>
            {t('UPDATE MAX USE')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_URI_GENERATOR)}>
            {t('UPDATE URI GENERATOR')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_TASK_CONTRACT)}>
            {t('UPDATE TASK CONTRACT')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.UPDATE_SPONSOR_MEDIA)}>
            {t('UPDATE SPONSOR MEDIA')}
          </Button>
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_SCORE)}>
            {t('UPDATE SCORE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.BLACKLIST_AUDITOR)}>
            {t('BLACKLIST AUDITOR')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.BLACKLIST_GAME_NFT_TOKEN)}>
            {t('BLACKLIST GAME NFT TOKEN')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_EXCLUDED_CONTENT)}>
            {t('UPDATE EXCLUDED CONTENT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_TAG_REGISTRATION)}>
            {t('UPDATE TAG REGISTRATION')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PRICE_PER_MINUTE)}>
            {t('UPDATE PRICE PER MINUTE')}
          </Button>
          <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.DELETE_GAME)}>
            {t('DELETE GAME')}
          </Button>
          <Button variant="secondary" mb="8px" onClick={() => setStage(LockStage.WITHDRAW)}>
            {t('CLAIM REWARDS')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.CREATE_GAMING_NFT && (
        <CreateGamingStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BUY_MINUTES && (
        <BuyMinutesStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BURN_TOKEN_FOR_CREDIT && (
        <BurnTokenForCreditStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_SCORE && (
        <ProcessScoreStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.PROCESS_SCORE && (
        <ProcessScoreStage2
          tokenId={currAccount?.id}
          score={Object.values(gameData?.data?.score ?? gameData?.data?.value)?.toString()}
          deadline={parseInt(Object.values(gameData?.data?.deadline)?.toString() || '0')}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.WITHDRAW && (
        <AdminWithdrawStage
          state={state}
          pool={pool}
          score={Object.values(gameData?.data?.score ?? gameData?.data?.value)?.toString()}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.MINT_OBJECT && (
        <MintObjectStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BURN_OBJECT && (
        <BurnObjectStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.WITHDRAW_RESOURCES && (
        <WithdrawResourceStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_DESTINATION && (
        <UpdateDestinationStage
          state={state}
          account={account}
          currency={currency}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
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
      {stage === LockStage.ATTACH_KILL_DETACH_TOKEN && (
        <AttachKillDetachStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BURN_TOKEN && (
        <BurnStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_GAME && (
        <UpdateGameStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_INFO && (
        <UpdateInfoStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_TOKEN_ID && (
        <UpdateTokenIdStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_OWNER && (
        <UpdateOwnerStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_OBJECT && (
        <UpdateObjectStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_BURN_TOKEN_FOR_CREDIT && (
        <UpdateBurnForCreditStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_MAX_USE && (
        <UpdateMaxUseStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_URI_GENERATOR && (
        <UpdateUriStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_TASK_CONTRACT && (
        <UpdateTaskStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BLACKLIST_AUDITOR && (
        <BlacklistAuditorStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.BLACKLIST_GAME_NFT_TOKEN && (
        <BlacklistTicketStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_EXCLUDED_CONTENT && (
        <UpdateExcludedContentStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_TAG_REGISTRATION && (
        <UpdateTagRegistrationStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PRICE_PER_MINUTE && (
        <UpdatePricePerMinuteStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DELETE_GAME && (
        <DeleteStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_LOCATION && (
        <LocationStage
          pool={pool}
          state={state}
          nftFilters={nftFilters}
          setNftFilters={setNftFilters}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
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
