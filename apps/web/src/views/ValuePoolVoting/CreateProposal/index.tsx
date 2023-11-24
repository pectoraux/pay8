import {
  AutoRenewIcon,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Text,
  useToast,
  ReactMarkdown,
  useTooltip,
  HelpIcon,
  Flex,
  ButtonMenu,
  ButtonMenuItem,
} from '@pancakeswap/uikit'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import snapshot from '@snapshot-labs/snapshot.js'
import isEmpty from 'lodash/isEmpty'
import times from 'lodash/times'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useInitialBlock } from 'state/block/hooks'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20, useValuepoolVoterContract } from 'hooks/useContract'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'

import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DatePickerPortal } from 'views/Voting/components/DatePicker'
import Filters from 'views/CanCan/market/components/BuySellModals/SellModal/Filters'
import Layout from '../components/Layout'
import { ADMINS } from '../config'
import { Label, SecondaryLabel } from './styles'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import NextStepButton from 'views/ChannelCreation/NextStepButton'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useGetRequiresApproval } from 'state/trustbounties/hooks'
import { useApprovePool } from 'views/ValuePools/hooks/useApprove'
import { FetchStatus } from 'config/constants/types'

const hub = 'https://hub.snapshot.org'
const client = new snapshot.Client712(hub)

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const CreateProposal = () => {
  const { push, query } = useRouter()
  const [state, setState] = useState<any>(() => ({
    title: '',
    body: '',
    pool: '',
    id: '',
    ve: '',
    decimals: 18,
    tokenId: '',
    tokenAddress: '',
    amount: '0',
    choices: ['Up Vote', 'Down Vote'],
    bribe: 0,
    bribeAmount: '',
    bribeToken: '',
    isNFT: 0,
    bribeDecimals: 18,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState('')
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { title, body } = state
  const [nftFilters, setNftFilters] = useState<any>({})
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
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
      const amount = getDecimalAmount(state.amount ?? 0, state.decimals)
      const bribeAmount = getDecimalAmount(state.bribeAmount ?? 0, state.bribeDecimals)
      const args = [
        state.ve,
        state.pool,
        state.tokenAddress?.trim()?.length ? state.tokenAddress : ADDRESS_ZERO,
        state.tokenId,
        amount?.toString(),
        state.title,
        state.body,
      ]
      const args2 = [
        state.ve,
        state.pool,
        state.title,
        nftFilters?.country?.toString() ?? '',
        nftFilters?.city?.toString() ?? '',
        nftFilters?.product?.toString() ?? '',
      ]
      const args3 = [
        state.ve,
        state.pool,
        state.bribeToken?.trim()?.length ? state.bribeToken : ADDRESS_ZERO,
        bribeAmount?.toString(),
        state.isNFT,
      ]
      console.log('createGauge==================>', args, args2, args3, stakingTokenContract)
      return callWithGasPrice(valuepoolVoterContract, 'createGauge', args)
        .then(() => {
          return callWithGasPrice(valuepoolVoterContract, 'updateTags', args2)
        })
        .then((res) => {
          if (!!state.bribe) {
            return callWithGasPrice(valuepoolVoterContract, 'lockBribe', args3)
          }
          return res
        })
        .catch((err) => {
          setIsLoading(false)
          console.log('err==================>', err)
          toastError(
            t('Issue creating proposal'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
          )
        })
    })
    if (receipt?.status) {
      setIsLoading(false)
      setIsDone(state.ve)
      toastSuccess(
        t('Proposal successfully created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now start receiving votes on your proposal.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [
    t,
    state,
    nftFilters,
    toastError,
    toastSuccess,
    callWithGasPrice,
    valuepoolVoterContract,
    stakingTokenContract,
    fetchWithCatchTxError,
  ])

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

  const handleEasyMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const handleRawValueChange = (key: any) => (value: number) => {
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

  const TooltipComponent = () => <Text>{t("Input the contract address of your valuepool's NFT collection")}</Text>
  const TooltipComponent2 = () => (
    <Text>{t('This sets the address of the creator of the proposal, so your address.')}</Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This sets the address of the token you are trying to withdraw from the valuepool. Leave it empty if this proposal is not so you can withdraw some tokens from the valuepool.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Only members of valuepools can create proposals in them. This is the ID of your NFT token from the valuepool.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        "This sets the amount of the token which address you've specified above, you are willing to withdraw from the valuepool. This is only valid when you are trying to withdraw tokens from the valuepool, leave it at 0 otherwise",
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

  return (
    <Container py="40px">
      <PageMeta />
      <Box mb="48px">
        <Breadcrumbs>
          <Link href="/valuepools">{t('ValuePool')}</Link>
          <Link href="/valuepools/voting">{t('Voting')}</Link>
          <Text>{t('Make a Proposal')}</Text>
        </Breadcrumbs>
      </Box>
      <Layout>
        <Box>
          <Box mb="24px">
            <Label htmlFor="title">{t('Title')}</Label>
            <Input id="title" name="title" value={title} scale="lg" onChange={handleChange} required />
            {/* {formErrors.name && fieldsState.name && <FormErrors errors={formErrors.name} />} */}
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
            <EasyMde id="body" name="body" onTextChange={handleEasyMdeChange} value={body} options={options} required />
            {/* {formErrors.body && fieldsState.body && <FormErrors errors={formErrors.body} />} */}
          </Box>
        </Box>
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
                <SecondaryLabel>{t('veNFT Address')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="ve"
                  value={state.ve}
                  placeholder={t('input ve address')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <SecondaryLabel>{t('Decimals')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="decimals"
                  value={state.decimals}
                  placeholder={t('input decimals')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef2}>
                  {tooltipVisible2 && tooltip2}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <SecondaryLabel>{t('Owner Address')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="pool"
                  value={state.pool}
                  placeholder={t('input owner address')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef3}>
                  {tooltipVisible3 && tooltip3}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <SecondaryLabel>{t('Token ID')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="tokenId"
                  value={state.tokenId}
                  placeholder={t('input token id')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef4}>
                  {tooltipVisible4 && tooltip4}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <SecondaryLabel>{t('Token Address')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="tokenAddress"
                  value={state.tokenAddress}
                  placeholder={t('input token address')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <Flex ref={targetRef5}>
                  {tooltipVisible5 && tooltip5}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <SecondaryLabel>{t('Amount')}</SecondaryLabel>
                <Input
                  type="text"
                  scale="sm"
                  name="amount"
                  value={state.amount}
                  placeholder={t('input amount to withdraw')}
                  onChange={handleChange}
                />
              </Box>
              <Box mb="24px">
                <StyledItemRow>
                  <Flex mt="5px" mr="10px">
                    <SecondaryLabel>{t('Attach Bribe?')}</SecondaryLabel>
                  </Flex>
                  <ButtonMenu
                    mb="10px"
                    scale="xs"
                    variant="subtle"
                    activeIndex={state.bribe}
                    onItemClick={handleRawValueChange('bribe')}
                  >
                    <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                  </ButtonMenu>
                </StyledItemRow>
              </Box>
              {state.bribe ? (
                <>
                  <Box mb="24px">
                    <Flex>
                      <Text
                        fontSize="12px"
                        paddingRight="15px"
                        color="secondary"
                        textTransform="uppercase"
                        paddingTop="3px"
                        bold
                      >
                        {t('Bribe Token Type')}
                      </Text>
                    </Flex>
                    <ButtonMenu
                      scale="xs"
                      variant="subtle"
                      activeIndex={state.isNFT}
                      onItemClick={handleRawValueChange('isNFT')}
                    >
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
                </>
              ) : null}
              <Filters showWorkspace={false} nftFilters={nftFilters} setNftFilters={setNftFilters} />
              {account ? (
                <>
                  <Button
                    mb="8px"
                    onClick={handlePoolApprove}
                    endIcon={
                      allowing || status === FetchStatus.Fetching ? <AutoRenewIcon spin color="currentColor" /> : null
                    }
                    isLoading={allowing}
                    disabled={allowing || !needsApproval || status === FetchStatus.Fetching}
                  >
                    {status === FetchStatus.Fetching
                      ? t('Increasing Bribe Token Allowance')
                      : t('Increase Bribe Token Allowance')}
                  </Button>
                  <Button
                    type="submit"
                    width="100%"
                    isLoading={isLoading}
                    endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
                    onClick={handleSubmit}
                    mb="16px"
                  >
                    {t('Publish')}
                  </Button>
                  <NextStepButton onClick={() => push(`/valuepools/voting/valuepool/${state.ve}`)} disabled={!isDone}>
                    {t('Go to Proposals')}
                  </NextStepButton>
                </>
              ) : (
                <ConnectWalletButton width="100%" type="button" />
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
