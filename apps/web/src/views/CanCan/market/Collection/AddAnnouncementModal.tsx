import BigNumber from 'bignumber.js'
import { useState, useMemo, useCallback } from 'react'
import {
  Flex,
  Text,
  Button,
  Modal,
  Input,
  useToast,
  AutoRenewIcon,
  Box,
  CardBody,
  ReactMarkdown,
  Grid,
  ErrorIcon,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import dynamic from 'next/dynamic'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Divider, GreyedOutContainer } from 'views/Auditors/components/styles'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketEventsContract } from 'hooks/useContract'

interface DepositModalProps {
  max: BigNumber
  stakedBalance: BigNumber
  multiplier?: string
  lpPrice: BigNumber
  lpLabel?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
}

interface FormState {
  tokenAddress: any
  poolAddress: any
  pricePerMinute: number
  creatorShare: number
  gameName: string
}

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const AddAnnouncementModal: React.FC<any> = ({ position = 0, onDismiss }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const marketEventsContract = useMarketEventsContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [isDone, setIsDone] = useState(false)
  const [_position, setPosition] = useState(position)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const options = useMemo(() => {
    return {
      hideIcons: ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [])

  const handleAdd = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      return callWithGasPrice(marketEventsContract, 'emitUpdateAnnouncement', [_position, true, title, body]).catch(
        (err) => {
          console.log('emitUpdateAnnouncement====================>', err)
        },
      )
    })
    if (receipt?.status) {
      toastSuccess(
        t('Announcement Successfully Added'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Users of this channel will now have access to this information.')}
        </ToastDescriptionWithTx>,
      )
      setIsDone(true)
    }
  }, [t, body, title, _position, toastSuccess, callWithGasPrice, marketEventsContract, fetchWithCatchTxError])

  const TooltipComponent = () => (
    <Text>
      {t(
        'The position is the id of the announcement, you can use this form to update a previously posted announcement by just inputting its id right here. If your annoucement is a new one, then its id will be that of the last announcement + 1.',
      )}
    </Text>
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Modal title={t('Add Announcement')} onDismiss={onDismiss}>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Position')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          value={_position}
          placeholder={t('input announcement position')}
          onChange={(e) => setPosition(e.target.value)}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Title')}
        </Text>
        <Input
          type="text"
          scale="sm"
          value={title}
          placeholder={t('input announcement title')}
          onChange={(e) => setTitle(e.target.value)}
        />
      </GreyedOutContainer>
      <CardBody p="0" px="24px">
        <ReactMarkdown>{body}</ReactMarkdown>
      </CardBody>
      <GreyedOutContainer>
        <Box mb="24px">
          <Text color="textSubtle" mb="8px">
            {t('Tip: write in Markdown!')}
          </Text>
          <EasyMde id="body" name="body" onTextChange={(e) => setBody(e)} value={body} options={options} required />
        </Box>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              "This will add an announcement to this page. You can add your terms of service, guides on how to use your product as well as any announcement you deem necessary. It is advised to keep the announcements on this page to the stict minumum and only post really important ones like terms of service or guides on how to use your product. You can post the rest in your channel's PayChat group.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        {account ? (
          <Button
            mb="8px"
            disabled={isDone}
            onClick={handleAdd}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
            {t('Add')}
          </Button>
        ) : (
          <ConnectWalletButton />
        )}
      </Flex>
    </Modal>
  )
}

export default AddAnnouncementModal
