import {
  AutoRenewIcon,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Input,
  LinkExternal,
  Text,
  useModal,
  useToast,
  ButtonMenu,
  ReactMarkdown,
  ButtonMenuItem,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { useWeb3React } from '@pancakeswap/wagmi'
import snapshot from '@snapshot-labs/snapshot.js'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useRouter } from 'next/router'
import times from 'lodash/times'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useInitialBlock } from 'state/block/hooks'

import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getBlockExploreLink } from 'utils'
import { DatePickerPortal } from 'views/Voting/components/DatePicker'
import { useERC20, useTrustBountiesContract } from 'hooks/useContract'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import BigNumber from 'bignumber.js'
import { useGetRequiresApproval } from 'state/trustbounties/hooks'
import { getStakeMarketBribeAddress } from 'utils/addressHelpers'
import { useApprovePool } from 'views/TrustBounties/hooks/useApprove'

import Layout from '../components/Layout'
import VoteDetailsModal from '../components/VoteDetailsModal'
import { ADMINS } from '../config'
import { makeChoice, MINIMUM_CHOICES } from './Choices'
import { getFormErrors } from './helpers'
import { FormErrors, Label, SecondaryLabel } from './styles'
import { FetchStatus } from 'config/constants/types'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useActiveChainId'

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const CreateProposal = () => {
  const [state, setState] = useState<any>(() => ({
    name: '',
    body: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
    amount: '',
    friendly: 0,
    lockBounty: 0,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialBlock = useInitialBlock()
  const { chainId } = useActiveChainId()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess, toastError } = useToast()
  const [pendingFb, setPendingFb] = useState(false)
  const trustBountiesContract = useTrustBountiesContract()
  const [onPresentVoteDetailsModal] = useModal(<VoteDetailsModal block={state.snapshot} />)
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { name, body } = state
  const [allowing, setAllowing] = useState(false)
  const formErrors = getFormErrors(state, t)
  const { bountyId, decimals, tokenAddress } = useRouter().query
  const [nftFilters, setNftFilters] = useState<any>({})
  const stakingTokenContract = useERC20(tokenAddress || DEFAULT_TFIAT)
  console.log('stakingTokenContract===============>', stakingTokenContract, tokenAddress)
  const { status, needsApproval, refetch } = useGetRequiresApproval(
    stakingTokenContract,
    account,
    getStakeMarketBribeAddress(),
  )
  useEffect(() => {
    refetch()
  }, [account, chainId])

  const { handleApprove: handlePoolApprove } = useApprovePool(
    stakingTokenContract,
    getStakeMarketBribeAddress(),
    tokenAddress,
    refetch,
  )

  const handleCreateClaim = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const amount = getDecimalAmount(new BigNumber(state.amount), Number(decimals))
      const method = state.friendly ? 'createFriendlyClaim' : 'createClaim'
      const args = state.friendly
        ? [account, bountyId, amount.toString()]
        : [
            account,
            bountyId,
            amount.toString(),
            !!state.lockBounty,
            state.name,
            state.body,
            nftFilters.product?.toString() ?? '',
          ]
      console.log('!createClaim===============>', method, args, nftFilters)
      return callWithGasPrice(trustBountiesContract, method, args).catch((err) => {
        setPendingFb(false)
        console.log('err0=================>', err)
        toastError(
          t('Issue creating claim'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('litigation successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start receiving votes on your litigation.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [
    t,
    state,
    account,
    bountyId,
    decimals,
    nftFilters,
    toastError,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    trustBountiesContract,
  ])

  const updateValue = (key: any, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleEasyMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const handleRawValueChange = (key: string) => (value: string) => {
    updateValue(key, value)
  }

  const options = useMemo(() => {
    return {
      hideIcons:
        account && ADMINS.includes(account.toLowerCase())
          ? []
          : ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [account])

  useEffect(() => {
    if (initialBlock > 0) {
      setState((prevState) => ({
        ...prevState,
        snapshot: initialBlock,
      }))
    }
  }, [initialBlock, setState])

  const TooltipComponent = () => <Text>{t('This sets the amount you wish to claim from the trustBounty.')}</Text>
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "A friendly claim does not submit your claim to the trustBounties' community for a vote. This is a form of claim you make in case the owner of the trustBounty agrees to let you have the amount you are claiming, from the trustBounty.",
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Not only can you claim an amount from the trustBounty, but you can also claim that the trustBounty be locked forever. If your claim is successful, not only will you be able to withdraw the claimed amount from the trustBounty, but the trustBounty will also be deactivated for life thus also locking all of its remaining funds forever.',
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
  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="48px">
        <Breadcrumbs>
          <Link href="/trustbounties">{t('Trust Bounties')}</Link>
          <Link href="/trustbounties/voting">{t('Voting')}</Link>
          <Text>{t('Create a Claim')}</Text>
        </Breadcrumbs>
      </Box>
      <Layout>
        {!state.friendly ? (
          <Box>
            <Box mb="24px">
              <Label htmlFor="name">{t('Title')}</Label>
              <Input id="name" name="name" value={name} scale="lg" onChange={handleChange} required />
              {formErrors.name && fieldsState.name && <FormErrors errors={formErrors.name} />}
            </Box>
            {body && (
              <Box mb="24px">
                <Card>
                  <CardHeader>
                    <Heading as="h3" scale="md">
                      {t('Preview')}
                    </Heading>
                  </CardHeader>
                  <CardBody p="0" px="24px">
                    <ReactMarkdown>{body}</ReactMarkdown>
                  </CardBody>
                </Card>
              </Box>
            )}
            <Box mb="24px">
              <Label htmlFor="body">{t('Content')}</Label>
              <Text color="textSubtle" mb="8px">
                {t('Tip: write in Markdown!')}
              </Text>
              <EasyMde
                id="body"
                name="body"
                onTextChange={handleEasyMdeChange}
                value={body}
                options={options}
                required
              />
              {formErrors.body && fieldsState.body && <FormErrors errors={formErrors.body} />}
            </Box>
          </Box>
        ) : null}
        <Box>
          <Card>
            <CardHeader>
              <Heading as="h3" scale="md">
                {t('Actions')}
              </Heading>
            </CardHeader>
            <CardBody>
              <Box mb="24px">
                <Flex ref={targetRef}>
                  {tooltipVisible && tooltip}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <SecondaryLabel>{t('Amount to claim')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="amount"
                  value={state.amount}
                  placeholder={t('input amount to claim')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef2}>
                  {tooltipVisible2 && tooltip2}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <SecondaryLabel>{t('Friendly Claim ?')}</SecondaryLabel>
                <StyledItemRow>
                  <ButtonMenu
                    scale="xs"
                    variant="subtle"
                    activeIndex={state.friendly}
                    onItemClick={handleRawValueChange('friendly')}
                  >
                    <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                  </ButtonMenu>
                </StyledItemRow>
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef3}>
                  {tooltipVisible3 && tooltip3}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <SecondaryLabel>{t('Lock Bounty ?')}</SecondaryLabel>
                <StyledItemRow>
                  <ButtonMenu
                    scale="xs"
                    variant="subtle"
                    activeIndex={state.lockBounty}
                    onItemClick={handleRawValueChange('lockBounty')}
                  >
                    <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                  </ButtonMenu>
                </StyledItemRow>
              </Box>
              <Filters
                showWorkspace={false}
                showCountry={false}
                showCity={false}
                nftFilters={nftFilters}
                setNftFilters={setNftFilters}
              />
              {account && (
                <Flex alignItems="center" mb="8px">
                  <Text color="textSubtle" mr="16px">
                    {t('Creator')}
                  </Text>
                  <LinkExternal href={getBlockExploreLink(account, 'address')}>{truncateHash(account)}</LinkExternal>
                </Flex>
              )}
              {!account ? (
                <ConnectWalletButton width="100%" type="button" />
              ) : needsApproval ? (
                <Button
                  mb="8px"
                  onClick={handlePoolApprove}
                  endIcon={
                    allowing || status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null
                  }
                  isLoading={allowing}
                  disabled={allowing || status === FetchStatus.Fetching}
                >
                  {t('%text% StakeMarket Bribe', { text: status === FetchStatus.Fetching ? 'Enabling' : 'Enable' })}
                </Button>
              ) : (
                <Button
                  type="submit"
                  width="100%"
                  isLoading={isLoading}
                  onClick={handleCreateClaim}
                  endIcon={pendingTx || pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
                  mb="16px"
                >
                  {t('Publish')}
                </Button>
              )}
            </CardBody>
          </Card>
        </Box>
      </Layout>
      <DatePickerPortal />
    </Container>
  )
}

export default CreateProposal
