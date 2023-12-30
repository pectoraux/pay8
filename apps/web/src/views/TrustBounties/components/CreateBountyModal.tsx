import { useEffect, useRef, useState, useCallback, ChangeEvent, useMemo } from 'react'
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
  Select,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useERC20, useTrustBountiesContract } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { DEFAULT_INPUT_CURRENCY } from 'config/constants/exchange'
import { useRouter } from 'next/router'
import { useGetRequiresApproval } from 'state/trustbounties/hooks'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { getVeFromWorkspace } from 'utils/addressHelpers'
import { differenceInSeconds } from 'date-fns'
import { FetchStatus } from 'config/constants/types'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
import { fetchBountiesAsync } from 'state/trustbounties'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Divider, GreyedOutContainer } from './styles'
import { useApprovePool } from '../hooks/useApprove'

interface SetPriceStageProps {
  currency?: any
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const CreateBountyModal: React.FC<any> = ({ currency, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()
  const { account } = useWeb3React()
  const titleName = 'Trust Bounties'
  const dispatch = useAppDispatch()
  const trustBountiesContract = useTrustBountiesContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const [pendingFb, setPendingFb] = useState(false)
  const { toastSuccess, toastError } = useToast()
  // const [allowing, setAllowing] = useState(false)
  const { chainId } = useActiveChainId()
  const [state, setState] = useState<any>({
    ve: '',
    claimableBy: ADDRESS_ZERO,
    collectionId: '',
    avatar: '',
    parentBountyId: '',
    minToClaim: '',
    endTime: '',
    isNFT: 0,
    recurring: 0,
    bountySource: '',
    token: '',
    tokenId: '',
    collateral: currency?.address ?? DEFAULT_INPUT_CURRENCY,
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
  const handleTypeChange = (bountySource: string) => {
    updateValue('bountySource', bountySource)
  }
  const currencyAddress = useMemo(() => state.collateral, [state.collateral, handleChange]) as any
  const stakingTokenContract = useERC20(currencyAddress || '')
  const [nftFilters, setNftFilters] = useState<any>({})
  const router = useRouter()
  const fromAccelerator = router.pathname.includes('accelerator')
  const fromContributors = router.pathname.includes('contributors')
  const fromSponsors = router.pathname.includes('sponsors')
  const fromAuditors = router.pathname.includes('auditors')
  const fromBusinesses = router.pathname.includes('businesses')
  const fromRamps = router.pathname.includes('ramps')
  const fromTransfers = router.pathname.includes('transfers')
  const { status, needsApproval, refetch } = useGetRequiresApproval(
    stakingTokenContract,
    account,
    trustBountiesContract.address,
  )
  const { handleApprove: handlePoolApprove, pendingTx: allowing } = useApprovePool(
    stakingTokenContract,
    trustBountiesContract.address,
    currency?.symbol,
    refetch,
  )

  useEffect(() => {
    refetch()
  }, [state.collateral, stakingTokenContract])

  const handleCreateGauge = useCallback(async () => {
    console.log('handleCreateGauge==================>')
    setPendingFb(true)
    const endTime = Math.max(
      differenceInSeconds(new Date(state.endTime || 0), new Date(), {
        roundingMethod: 'ceil',
      }),
      0,
    )
    const bountySource = fromAccelerator
      ? 'Accelerator'
      : fromAuditors
      ? 'Auditors'
      : fromContributors
      ? 'Contributors'
      : fromBusinesses
      ? 'Businesses'
      : fromRamps
      ? 'Ramps'
      : fromSponsors
      ? 'Sponsors'
      : fromTransfers
      ? 'Transfers'
      : state.bountySource
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const ve = getVeFromWorkspace(nftFilters?.workspace?.value?.toLowerCase(), chainId)
      const args = [
        account,
        state.collateral,
        ve,
        state.claimableBy,
        state.parentBountyId,
        state.collectionId,
        endTime,
        state.isNFT,
        !!state.recurring,
        state.avatar,
        bountySource,
      ]
      console.log('createbounty===============>', trustBountiesContract, args)
      return callWithGasPrice(trustBountiesContract, 'createBounty', args).catch((err) => {
        setPendingFb(false)
        console.log('err0=================>', err)
        toastError(
          t('Issue creating bounty'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Bounty successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start using it to create trust with you partners.')}
        </ToastDescriptionWithTx>,
      )
      dispatch(
        fetchBountiesAsync({
          fromAccelerator,
          fromContributors,
          fromSponsors,
          fromAuditors,
          fromBusinesses,
          fromRamps,
          fromTransfers,
          chainId,
        }),
      )
      router.reload()
    }
    onDismiss()
  }, [
    chainId,
    onDismiss,
    router,
    dispatch,
    nftFilters,
    state,
    account,
    trustBountiesContract,
    t,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    fromAccelerator,
    fromContributors,
    fromSponsors,
    fromAuditors,
    fromBusinesses,
    fromRamps,
    fromTransfers,
  ])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        'This sets the workspace of your bounty or the workspace to which belongs the community that will vote on potential future claims created around this bounty. If you pick Real Estate for instance, only users holding a Real Estate Leviathan token will be able to vote on any enventual claims created on your bounty.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This sets the address of the party that is allowed to claim this bounty. You can set it to the zero address in case you want anyone to be able to claim it. If you are creating this bounty for other contracts like the Future Collaterals or the Ramps contracts for instance, you have to input the addresses of those contracts in this field. You should read the guidelines on how to create bounties for those contracts in the documentation for more details.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t('This sets your channel ID which can help users learn more about you or your business or how to contact you.')}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This sets a parent bounty for your bounty. It can be helpful when grouping bounties to recognize which bounties have a common denominator. If your bounty does not have a parent, you can set this parameter to 0.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => <Text>{t('This sets a link to an image that defines your brand.')}</Text>
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This sets the lock duration of your bounty. You will not be able to withdraw the locked amount in your bounty until this date is passed.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This sets the type of the token that you will be locking in this bounty as a collateral. Pick fungible if it is not an NFT, otherwise pick the type of NFT you will be locking.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        'This sets the address of the collateral that you will be locking in this bounty. You might need to give the trustbounty contract access to your wallet.',
      )}
    </Text>
  )
  const TooltipComponent9 = () => (
    <Text>
      {t(
        "Recurring bounties are relevant in the context of a marketplace where a percentage of each sale generated by a merchant is taken and later on transferred into the merchant's bounty. This is a way to grow a merchant's bounty as that merchant's channel is also growing in order to create more skin in the game for the merchant and incentivize him/her to keep being honest.",
      )}
    </Text>
  )
  const TooltipComponent10 = () => (
    <Text>
      {t(
        'The bounty source is the product within the context of which this bounty is being created. This parameter helps filter and show the right bounties on the products.',
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
  const {
    targetRef: targetRef6,
    tooltip: tooltip6,
    tooltipVisible: tooltipVisible6,
  } = useTooltip(<TooltipComponent6 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef7,
    tooltip: tooltip7,
    tooltipVisible: tooltipVisible7,
  } = useTooltip(<TooltipComponent7 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef8,
    tooltip: tooltip8,
    tooltipVisible: tooltipVisible8,
  } = useTooltip(<TooltipComponent8 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef9,
    tooltip: tooltip9,
    tooltipVisible: tooltipVisible9,
  } = useTooltip(<TooltipComponent9 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef10,
    tooltip: tooltip10,
    tooltipVisible: tooltipVisible10,
  } = useTooltip(<TooltipComponent10 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Modal title={t('Create Bounty')} onDismiss={onDismiss}>
      <GreyedOutContainer style={{ paddingTop: '50px' }}>
        <StyledItemRow>
          <Flex ref={targetRef7} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Token Type')}
            </Text>
            {tooltipVisible7 && tooltip7}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu scale="xs" variant="subtle" activeIndex={state.isNFT} onItemClick={handleRawValueChange('isNFT')}>
            <ButtonMenuItem>{t('Fungible')}</ButtonMenuItem>
            <ButtonMenuItem>{t('ERC721')}</ButtonMenuItem>
            <ButtonMenuItem>{t('ERC1155')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef8}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Collateral Address')}
          </Text>
          {tooltipVisible8 && tooltip8}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="collateral"
          value={state.collateral}
          placeholder={t('input address of collateral')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      {!needsApproval || state.isNFT || state.collateral === ADDRESS_ZERO ? (
        <>
          <Flex alignSelf="center" mt={20}>
            <Flex ref={targetRef}>
              <Filters
                nftFilters={nftFilters}
                setNftFilters={setNftFilters}
                showCountry={false}
                showCity={false}
                showProduct={false}
              />
              {tooltipVisible && tooltip}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
          </Flex>
          <GreyedOutContainer>
            <Flex ref={targetRef2}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Claimable By')}
              </Text>
              {tooltipVisible2 && tooltip2}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="claimableBy"
              value={state.claimableBy}
              placeholder={t('input claimable by')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef3}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Collection ID')}
              </Text>
              {tooltipVisible3 && tooltip3}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="collectionId"
              value={state.collectionId}
              placeholder={t('input your collection id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef4}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Parent Bounty ID')}
              </Text>
              {tooltipVisible4 && tooltip4}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="parentBountyId"
              value={state.parentBountyId}
              placeholder={t('input parent bounty id')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef5}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('Link to Avatar')}
              </Text>
              {tooltipVisible5 && tooltip5}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Input
              type="text"
              scale="sm"
              name="avatar"
              value={state.avatar}
              placeholder={t('input link to your avatar')}
              onChange={handleChange}
            />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef6}>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                {t('End Time')}
              </Text>
              {tooltipVisible6 && tooltip6}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <DatePicker
              selected={state.endTime}
              placeholderText="YYYY/MM/DD"
              onChange={handleRawValueChange('endTime')}
            />
            <DatePickerPortal />
          </GreyedOutContainer>
          <GreyedOutContainer>
            <StyledItemRow>
              <Flex ref={targetRef9} paddingRight="50px">
                <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
                  {t('Recurring Bounty ?')}
                </Text>
                {tooltipVisible9 && tooltip9}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <ButtonMenu
                scale="xs"
                variant="subtle"
                activeIndex={state.recurring}
                onItemClick={handleRawValueChange('recurring')}
              >
                <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
              </ButtonMenu>
            </StyledItemRow>
          </GreyedOutContainer>
          <GreyedOutContainer>
            <Flex ref={targetRef10} paddingRight="50px">
              <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
                {t('Bounty Source')}
              </Text>
              {tooltipVisible10 && tooltip10}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <Select
              // name="bountySource"
              options={[
                {
                  label: t('Accelerator'),
                  value: 'Accelerator',
                },
                {
                  label: t('Auditors'),
                  value: 'Auditors',
                },
                {
                  label: 'ARP',
                  value: 'ARP',
                },
                {
                  label: 'Businesses',
                  value: 'Businesses',
                },
                {
                  label: 'Future Collateral',
                  value: 'Future Collateral',
                },
                {
                  label: 'Contributors',
                  value: 'Contributors',
                },
                {
                  label: t('Market Place'),
                  value: 'MarketPlace',
                },
                {
                  label: t('Profile'),
                  value: 'Profile',
                },
                {
                  label: t('Ramps'),
                  value: 'Ramps',
                },
                {
                  label: t('Sponsors'),
                  value: 'Sponsors',
                },
                {
                  label: 'SSI',
                  value: 'SSI',
                },
                {
                  label: 'Transfers',
                  value: 'Transfers',
                },
                {
                  label: t('TrustBounties'),
                  value: 'TrustBounties',
                },
                {
                  label: t('Worlds'),
                  value: 'Worlds',
                },
              ]}
              onOptionChange={(val) => handleTypeChange(val.value)}
            />
          </GreyedOutContainer>
        </>
      ) : null}
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {needsApproval && !state.isNFT && state.collateral !== ADDRESS_ZERO
              ? t('This will enable the trust bounty to withdraw from your wallet')
              : t(
                  'This will create a new bounty for you. Bounties/TrustBounties are a collateralization mechanism through which businesses or individuals lock a certain amount of collateral (in the form of fungible/non-fungible tokens) for a certain amount of time. Bounties can be attacked by the party defined in the << Claimable By >> field in case that party has proof of bounty terms violation by the bounty owner. Each bounty states certain terms which they should be claimed for violating.',
                )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {!account ? (
          <ConnectWalletButton />
        ) : needsApproval && !state.isNFT && state.collateral !== ADDRESS_ZERO ? (
          <Button
            mb="8px"
            onClick={handlePoolApprove}
            endIcon={allowing || status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={allowing}
            disabled={allowing || status === FetchStatus.Fetching}
          >
            {t('%text% %symbol%', {
              text: status === FetchStatus.Fetching ? 'Enabling for' : 'Enable for',
              symbol: currency.symbol,
              titleName,
            })}
          </Button>
        ) : (
          <Button
            mb="8px"
            onClick={handleCreateGauge}
            endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
            isLoading={pendingTx || pendingFb}
            disabled={!currency}
          >
            {t('%text% %symbol%', {
              text: 'Create a bounty with',
              symbol: !state.isNFT ? currency.symbol : 'NFT',
              titleName,
            })}
          </Button>
        )}
      </Flex>
    </Modal>
  )
}

export default CreateBountyModal
