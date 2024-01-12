import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast, Button, Flex, LinkExternal } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useSponsorContract, useSponsorHelper } from 'hooks/useContract'
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
import { convertTimeToSeconds } from 'utils/timeHelper'
import { combineDateAndTime } from 'views/Voting/CreateProposal/helpers'
import { differenceInSeconds } from 'date-fns'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import LocationStage from 'views/Ramps/components/LocationStage'
import UpdateApplicationStage from 'views/ARPs/components/UpdateApplicationStage'

import { stagesWithBackButton, StyledModal, stagesWithConfirmButton, stagesWithApproveButton } from './styles'
import { LockStage } from './types'
import UpdateParametersStage from './UpdateParametersStage'
import ClaimNoteStage from './ClaimNoteStage'
import UpdateContentStage from './UpdateContentStage'
import UpdateBountyStage from './UpdateBountyStage'
import UpdateTokenStage from './UpdateTokenStage'
import VoteStage from './VoteStage'
import PayStage from './PayStage'
import UpdateTransferToNoteReceivableStage from './UpdateTransferToNoteReceivableStage'
import DepositStage from './DepositStage'
import UpdateProtocolStage from './UpdateProtocolStage'
import UpdateOwnerStage from './UpdateOwnerStage'
import DepositDueStage from './DepositDueStage'
import AdminWithdrawStage from './AdminWithdrawStage'
import DeleteStage from './DeleteStage'
import DeleteSponsorStage from './DeleteSponsorStage'

const modalTitles = (t: TranslateFunction) => ({
  [LockStage.ADMIN_SETTINGS]: t('Admin Settings'),
  [LockStage.SETTINGS]: t('Control Panel'),
  [LockStage.UPDATE_PROTOCOL]: t('Create Deal'),
  [LockStage.WITHDRAW]: t('Withdraw'),
  [LockStage.UPDATE_PARAMETERS]: t('Update Parameters'),
  [LockStage.UPDATE_CONTENT]: t('Update Content'),
  [LockStage.UPDATE_OWNER]: t('Update Owner'),
  [LockStage.DEPOSIT_DUE]: t('Deposit Due'),
  [LockStage.UPDATE_TOKEN_ID]: t('Update Attached veNFT Token'),
  [LockStage.UPDATE_BOUNTY_ID]: t('Update Attached Bounty'),
  [LockStage.VOTE]: t('Vote'),
  [LockStage.PAY]: t('Pay Due Payable'),
  [LockStage.DELETE]: t('Delete'),
  [LockStage.DEPOSIT]: t('Deposit'),
  [LockStage.CLAIM_NOTE]: t('Claim Note'),
  [LockStage.TRANSFER_TO_NOTE_RECEIVABLE]: t('Transfer Note Receivable'),
  [LockStage.DELETE_PROTOCOL]: t('Delete Protocol'),
  [LockStage.UPDATE_LOCATION]: t('Update Location'),
  [LockStage.UPDATE_APPLICATION]: t('Update Application Link'),
  [LockStage.CONFIRM_UPDATE_APPLICATION]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT]: t('Back'),
  [LockStage.CONFIRM_UPDATE_LOCATION]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_CLAIM_NOTE]: t('Back'),
  [LockStage.CONFIRM_WITHDRAW]: t('Back'),
  [LockStage.CONFIRM_UPDATE_PARAMETERS]: t('Back'),
  [LockStage.CONFIRM_UPDATE_CONTENT]: t('Back'),
  [LockStage.CONFIRM_PAY]: t('Back'),
  [LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE]: t('Back'),
  [LockStage.CONFIRM_DELETE]: t('Back'),
  [LockStage.CONFIRM_DELETE_PROTOCOL]: t('Back'),
  [LockStage.CONFIRM_UPDATE_BOUNTY_ID]: t('Back'),
  [LockStage.CONFIRM_UPDATE_TOKEN_ID]: t('Back'),
  [LockStage.CONFIRM_VOTE]: t('Back'),
  [LockStage.CONFIRM_DEPOSIT_DUE]: t('Back'),
  [LockStage.CONFIRM_UPDATE_OWNER]: t('Back'),
  [LockStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const CreateGaugeModal: React.FC<any> = ({
  variant = 'user',
  location = 'fromStake',
  pool,
  currency,
  currAccount,
  onDismiss,
}) => {
  const [stage, setStage] = useState(variant === 'user' ? LockStage.SETTINGS : LockStage.ADMIN_SETTINGS)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const router = useRouter()
  const stakingTokenContract = useERC20(currency?.address || currAccount?.token?.address || '')
  const sponsorContract = useSponsorContract(pool?.sponsorAddress || router.query.sponsor || '')
  const sponsorHelperContract = useSponsorHelper()
  console.log('mcurrencyy2===============>', currency, stakingTokenContract, pool, currAccount)
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

  const [state, setState] = useState<any>(() => ({
    avatar: pool?.collection?.avatar,
    bountyId: pool?.bountyId,
    profileId: pool?.profileId,
    tokenId: pool?.tokenId,
    sponsor: pool?.id,
    maxNotesPerProtocol: pool?.maxNotesPerProtocol,
    amountReceivable: '0',
    amountPayable: getBalanceNumber(currAccount?.amountPayable ?? '0', currAccount?.token?.decimals),
    periodPayable: parseInt(currAccount?.periodPayable ?? '0') / 60,
    startPayable: convertTimeToSeconds(currAccount?.startPayable ?? '0'),
    startTime: '',
    decimals: currAccount?.token?.decimals ?? currency?.decimals ?? 18,
    description: currAccount?.description ?? '',
    rating: currAccount?.rating ?? '0',
    protocolId: currAccount?.protocolId ?? '0',
    identityTokenId: '0',
    media: pool?.media ?? '',
    autoCharge: 0,
    like: 0,
    contentType: '',
    add: 0,
    ve: pool?._ve,
    token: currency?.address,
    name: pool?.name,
    toAddress: currAccount?.owner ?? '',
    protocol: currAccount?.owner ?? '',
    applicationLink: pool?.applicationLink || '',
    sponsorDescription: pool?.sponsorDescription ?? '',
    contactChannels: pool?.contactChannels?.toString() || [],
    contacts: pool?.contacts?.toString() || [],
    workspaces: pool?.workspaces?.toString() || [],
    country: pool?.countries?.toString() || [],
    city: pool?.cities?.toString() || [],
    product: pool?.products?.toString() || [],
    account: currAccount?.owner || account,
    owner: currAccount?.owner || account,
    content: pool?.content,
    customTags: '',
    numPeriods: '',
  }))
  const [nftFilters, setNftFilters] = useState<any>({
    workspace: pool?.workspaces,
    country: pool?.countries,
    city: pool?.cities,
    product: pool?.products,
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
      case LockStage.UPDATE_APPLICATION:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_APPLICATION:
        setStage(LockStage.UPDATE_APPLICATION)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_CLAIM_NOTE:
        setStage(LockStage.CLAIM_NOTE)
        break
      case LockStage.TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.TRANSFER_TO_NOTE_RECEIVABLE)
        break
      case LockStage.PAY:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_PAY:
        setStage(LockStage.PAY)
        break
      case LockStage.UPDATE_OWNER:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_OWNER:
        setStage(LockStage.UPDATE_OWNER)
        break
      case LockStage.DEPOSIT_DUE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DEPOSIT_DUE:
        setStage(LockStage.DEPOSIT_DUE)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PARAMETERS:
        setStage(LockStage.UPDATE_PARAMETERS)
        break
      case LockStage.UPDATE_CONTENT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_CONTENT:
        setStage(LockStage.UPDATE_CONTENT)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_PROTOCOL:
        setStage(LockStage.UPDATE_PROTOCOL)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.UPDATE_BOUNTY_ID:
        setStage(variant === 'admin' ? LockStage.ADMIN_SETTINGS : LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_UPDATE_BOUNTY_ID:
        setStage(LockStage.UPDATE_BOUNTY_ID)
        break
      case LockStage.CONFIRM_UPDATE_TOKEN_ID:
        setStage(LockStage.UPDATE_TOKEN_ID)
        break
      case LockStage.CONFIRM_VOTE:
        setStage(LockStage.VOTE)
        break
      case LockStage.VOTE:
        setStage(LockStage.SETTINGS)
        break
      case LockStage.CONFIRM_DELETE_PROTOCOL:
        setStage(LockStage.DELETE_PROTOCOL)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DELETE:
        setStage(LockStage.DELETE)
        break
      case LockStage.DELETE:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_WITHDRAW:
        setStage(LockStage.WITHDRAW)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.ADMIN_SETTINGS)
        break
      case LockStage.CONFIRM_DEPOSIT:
        setStage(LockStage.DEPOSIT)
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
      case LockStage.UPDATE_APPLICATION:
        setStage(LockStage.CONFIRM_UPDATE_APPLICATION)
        break
      case LockStage.DEPOSIT:
        setStage(LockStage.CONFIRM_DEPOSIT)
        break
      case LockStage.CLAIM_NOTE:
        setStage(LockStage.CONFIRM_CLAIM_NOTE)
        break
      case LockStage.TRANSFER_TO_NOTE_RECEIVABLE:
        setStage(LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE)
        break
      case LockStage.UPDATE_OWNER:
        setStage(LockStage.CONFIRM_UPDATE_OWNER)
        break
      case LockStage.DEPOSIT_DUE:
        setStage(LockStage.CONFIRM_DEPOSIT_DUE)
        break
      case LockStage.PAY:
        setStage(LockStage.CONFIRM_PAY)
        break
      case LockStage.UPDATE_TOKEN_ID:
        setStage(LockStage.CONFIRM_UPDATE_TOKEN_ID)
        break
      case LockStage.UPDATE_BOUNTY_ID:
        setStage(LockStage.CONFIRM_UPDATE_BOUNTY_ID)
        break
      case LockStage.VOTE:
        setStage(LockStage.CONFIRM_VOTE)
        break
      case LockStage.DELETE_PROTOCOL:
        setStage(LockStage.CONFIRM_DELETE_PROTOCOL)
        break
      case LockStage.DELETE:
        setStage(LockStage.CONFIRM_DELETE)
        break
      case LockStage.WITHDRAW:
        setStage(LockStage.CONFIRM_WITHDRAW)
        break
      case LockStage.UPDATE_PROTOCOL:
        setStage(LockStage.CONFIRM_UPDATE_PROTOCOL)
        break
      case LockStage.UPDATE_CONTENT:
        setStage(LockStage.CONFIRM_UPDATE_CONTENT)
        break
      case LockStage.UPDATE_PARAMETERS:
        setStage(LockStage.CONFIRM_UPDATE_PARAMETERS)
        break
      default:
        break
    }
  }

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        return requiresApproval(stakingTokenContract, account, sponsorContract.address)
      } catch (error) {
        return true
      }
    },
    onApprove: () => {
      return callWithGasPrice(stakingTokenContract, 'approve', [sponsorContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now start sponsoring accounts!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    // eslint-disable-next-line consistent-return
    onConfirm: () => {
      if (stage === LockStage.CONFIRM_UPDATE_LOCATION) {
        const customTags = state.customTags?.split(',')
        const args = [
          '0',
          '0',
          nftFilters?.country?.toString(),
          nftFilters?.city?.toString(),
          '0',
          '0',
          pool?.id,
          customTags.length && customTags[0],
        ]
        console.log('CONFIRM_UPDATE_LOCATION===============>', args)
        return callWithGasPrice(sponsorHelperContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_LOCATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DEPOSIT) {
        const amountReceivable = getDecimalAmount(state.amountReceivable ?? 0, currency?.decimals)
        const args = [pool?.id, amountReceivable?.toString()]
        console.log('CONFIRM_DEPOSIT===============>', args)
        return callWithGasPrice(stakingTokenContract, 'transfer', args).catch((err) =>
          console.log('CONFIRM_DEPOSIT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_APPLICATION) {
        const args = ['0', '0', '', '', '0', '0', ADDRESS_ZERO, state.applicationLink]
        console.log('CONFIRM_UPDATE_APPLICATION===============>', args)
        return callWithGasPrice(sponsorHelperContract, 'emitUpdateMiscellaneous', args).catch((err) =>
          console.log('CONFIRM_UPDATE_APPLICATION===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_CLAIM_NOTE) {
        const args = [state.sponsor, state.tokenId]
        console.log('CONFIRM_CLAIM_NOTE===============>', args)
        return callWithGasPrice(sponsorHelperContract, 'claimRevenueFromNote', args).catch((err) =>
          console.log('CONFIRM_CLAIM_NOTE===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PROTOCOL) {
        const amountPayable = getDecimalAmount(state.amountPayable ?? '0', currency?.decimals)
        const startPayable = combineDateAndTime(state.startDate, state.startTime)
        const startDate = Math.max(
          differenceInSeconds(new Date(startPayable * 1000), new Date(), {
            roundingMethod: 'ceil',
          }),
          0,
        )
        const args = [
          state.owner,
          currency?.address,
          amountPayable.toString(),
          parseInt(state.periodPayable) * 60,
          startDate.toString(),
          state.identityTokenId,
          state.protocolId,
          state.media,
          state.description,
        ]
        console.log('CONFIRM_UPDATE_PROTOCOL===============>', args)
        return callWithGasPrice(sponsorContract, 'updateProtocol', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PROTOCOL===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_PARAMETERS) {
        const args = [state.ve, state.maxNotesPerProtocol]
        console.log('CONFIRM_UPDATE_PARAMETERS===============>', args)
        return callWithGasPrice(sponsorContract, 'updateParameters', args).catch((err) =>
          console.log('CONFIRM_UPDATE_PARAMETERS===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_CONTENT) {
        const args = [state.contentType, !!state.add]
        console.log('CONFIRM_UPDATE_CONTENT===============>', args)
        return callWithGasPrice(sponsorContract, 'updateContents', args).catch((err) =>
          console.log('CONFIRM_UPDATE_CONTENT===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_PAY) {
        console.log('CONFIRM_PAY===============>', [currAccount?.owner, state.numPeriods ?? 0])
        return callWithGasPrice(sponsorContract, 'payInvoicePayable', [
          currAccount?.owner,
          state.numPeriods ?? 0,
        ]).catch((err) => console.log('CONFIRM_PAY===============>', err, sponsorContract))
      }
      if (stage === LockStage.CONFIRM_WITHDRAW) {
        const amount = getDecimalAmount(state.amountPayable ?? '0', currency?.decimals)
        console.log('CONFIRM_WITHDRAW===============>', [currency?.address, amount.toString()])
        return callWithGasPrice(sponsorContract, 'withdraw', [currency?.address, amount.toString()]).catch((err) =>
          console.log('CONFIRM_WITHDRAW===============>', err),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE_PROTOCOL) {
        console.log('CONFIRM_DELETE_PROTOCOL===============>', [currAccount?.owner])
        return callWithGasPrice(sponsorContract, 'deleteProtocol', [currAccount?.owner]).catch((err) =>
          console.log('CONFIRM_DELETE_PROTOCOL===============>', err, [currAccount?.owner]),
        )
      }
      if (stage === LockStage.CONFIRM_DELETE) {
        console.log('CONFIRM_DELETE===============>', [state.sponsor])
        return callWithGasPrice(sponsorHelperContract, 'deleteSponsor', [state.sponsor]).catch((err) =>
          console.log('CONFIRM_DELETE===============>', err, [state.sponsor]),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_BOUNTY_ID) {
        console.log('CONFIRM_UPDATE_BOUNTY===============>', [state.bountyId])
        return callWithGasPrice(sponsorContract, 'updateBounty', [state.bountyId]).catch((err) =>
          console.log('CONFIRM_UPDATE_BOUNTY===============>', err, [state.bountyId]),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_OWNER) {
        const args = variant === 'admin' ? [state.owner] : [state.owner, state.tokenId]
        const method = variant === 'admin' ? 'updateDevFromCollectionId' : 'updateOwner'
        console.log('CONFIRM_UPDATE_OWNER===============>', args)
        return callWithGasPrice(sponsorContract, method, args).catch((err) =>
          console.log('CONFIRM_UPDATE_OWNER===============>', err, args),
        )
      }
      if (stage === LockStage.CONFIRM_DEPOSIT_DUE) {
        const args = [state.protocol, state.numPeriods]
        console.log('CONFIRM_DEPOSIT_DUE===============>', args)
        return callWithGasPrice(sponsorContract, 'depositDue', args).catch((err) =>
          console.log('CONFIRM_DEPOSIT_DUE===============>', err, args),
        )
      }
      if (stage === LockStage.CONFIRM_UPDATE_TOKEN_ID) {
        console.log('CONFIRM_UPDATE_TOKEN_ID===============>', [state.tokenId])
        return callWithGasPrice(sponsorContract, 'updateTokenId', [state.tokenId]).catch((err) =>
          console.log('CONFIRM_UPDATE_TOKEN_ID===============>', err, [state.tokenId]),
        )
      }
      if (stage === LockStage.CONFIRM_VOTE) {
        const args = [pool.id, state.profileId, !!state.like]
        console.log('CONFIRM_VOTE===============>', args)
        return callWithGasPrice(sponsorHelperContract, 'vote', args).catch((err) =>
          console.log('CONFIRM_VOTE===============>', err, args),
        )
      }
      if (stage === LockStage.CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE) {
        const args = [state.sponsor, state.toAddress, state.numPeriods]
        console.log('CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>', args)
        return callWithGasPrice(sponsorHelperContract, 'transferDueToNote', args).catch((err) =>
          console.log('CONFIRM_TRANSFER_TO_NOTE_RECEIVABLE===============>', err),
        )
      }
    },
    onSuccess: async ({ receipt }) => {
      // toastSuccess(getToastText(stage, t), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      // onSuccessSale(receipt.transactionHash)
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
          <Flex justifyContent="center" style={{ cursor: 'pointer' }} alignSelf="center" mb="10px">
            <LinkExternal color="success" href={pool?.applicationLink} bold>
              {t('APPLY FOR A SPONSORSHIP')}
            </LinkExternal>
          </Flex>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.VOTE)}>
            {t('VOTE')}
          </Button>
          {pool?._ve !== ADDRESS_ZERO ? (
            <>
              <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
                {t('UPDATE OWNER')}
              </Button>
              <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_TOKEN_ID)}>
                {t('UPDATE TOKEN ID')}
              </Button>
            </>
          ) : null}
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY_ID)}>
            {t('UPDATE BOUNTY ID')}
          </Button>
        </Flex>
      )}
      {stage === LockStage.ADMIN_SETTINGS && (
        <Flex flexDirection="column" width="100%" px="16px" pt="16px" pb="16px">
          <Button variant="success" mb="8px" onClick={() => setStage(LockStage.UPDATE_PROTOCOL)}>
            {t('CREATE DEAL')}
          </Button>
          <Button mb="8px" variant="success" onClick={() => setStage(LockStage.PAY)}>
            {t('PAY DUE PAYABLE')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.DEPOSIT)}>
            {t('DEPOSIT')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_LOCATION)}>
            {t('UPDATE LOCATION')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_APPLICATION)}>
            {t('UPDATE APPLICATION')}
          </Button>
          <Button mb="8px" onClick={() => setStage(LockStage.UPDATE_PARAMETERS)}>
            {t('UPDATE PARAMETERS')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_CONTENT)}>
            {t('UPDATE CONTENT')}
          </Button>
          <Button mb="8px" variant="secondary" onClick={() => setStage(LockStage.UPDATE_BOUNTY_ID)}>
            {t('UPDATE BOUNTY ID')}
          </Button>
          {location === 'fromStake' ? (
            <>
              <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.DEPOSIT_DUE)}>
                {t('DEPOSIT DUE')}
              </Button>
              <Button variant="tertiary" mb="8px" onClick={() => setStage(LockStage.UPDATE_OWNER)}>
                {t('UPDATE OWNER')}
              </Button>
              <Button mb="8px" onClick={() => setStage(LockStage.TRANSFER_TO_NOTE_RECEIVABLE)}>
                {t('TRANSFER TO NOTE RECEIVABLE')}
              </Button>
              <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.WITHDRAW)}>
                {t('WITHDRAW')}
              </Button>
              <Button mb="8px" variant="danger" onClick={() => setStage(LockStage.CLAIM_NOTE)}>
                {t('CLAIM NOTE')}
              </Button>
            </>
          ) : null}
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE_PROTOCOL)}>
            {t('DELETE PROTOCOL')}
          </Button>
          <Button variant="danger" mb="8px" onClick={() => setStage(LockStage.DELETE)}>
            {t('DELETE CONTRACT')}
          </Button>
        </Flex>
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
      {stage === LockStage.UPDATE_APPLICATION && (
        <UpdateApplicationStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.CLAIM_NOTE && (
        <ClaimNoteStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_PARAMETERS && (
        <UpdateParametersStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_CONTENT && (
        <UpdateContentStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.VOTE && (
        <VoteStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.UPDATE_PROTOCOL && (
        <UpdateProtocolStage
          state={state}
          handleChange={handleChange}
          handleRawValueChange={handleRawValueChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.WITHDRAW && (
        <AdminWithdrawStage
          state={state}
          account={pool?.id}
          currency={currency}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.UPDATE_TOKEN_ID && (
        <UpdateTokenStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_BOUNTY_ID && (
        <UpdateBountyStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.UPDATE_OWNER && (
        <UpdateOwnerStage
          state={state}
          isAdmin={variant === 'admin'}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DEPOSIT_DUE && (
        <DepositDueStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.PAY && (
        <PayStage state={state} handleChange={handleChange} continueToNextStage={continueToNextStage} />
      )}
      {stage === LockStage.TRANSFER_TO_NOTE_RECEIVABLE && (
        <UpdateTransferToNoteReceivableStage
          state={state}
          handleChange={handleChange}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === LockStage.DEPOSIT && (
        <DepositStage
          state={state}
          currency={currency}
          continueToNextStage={continueToNextStage}
          handleRawValueChange={handleRawValueChange}
        />
      )}
      {stage === LockStage.DELETE && <DeleteStage continueToNextStage={continueToNextStage} />}
      {stage === LockStage.DELETE_PROTOCOL && <DeleteSponsorStage continueToNextStage={continueToNextStage} />}
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
