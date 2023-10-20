import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Box,
  Flex,
  Text,
  NftIcon,
  IconButton,
  AutoRenewIcon,
  ArrowForwardIcon,
  ButtonMenu,
  ButtonMenuItem,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Button,
  Farm,
  useToast,
  useMatchBreakpoints,
  Input,
  ReactMarkdown,
  ScanLink,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCatchTxError from 'hooks/useCatchTxError'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { toDate, format } from 'date-fns'
import { useTranslation } from '@pancakeswap/localization'

import { Label } from 'views/Voting/CreateProposal/styles'
import { NextLinkFromReactRouter } from '@pancakeswap/uikit/src/components/NextLink'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useMarketCollectionsContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ProposalStateTag } from './tags'
import ExpandableCard from './ExpandableCard'
import { getBlockExploreLink } from 'utils'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

interface ReviewsCardProps {
  reviews: any
  collectionId: string
  tokenId: string
}

const StyledProposalRow = styled(NextLinkFromReactRouter)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 16px 24px;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`
const StyledBox = styled(Box)`
  overflow: auto;
  max-height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
`
const getFormattedDate = (timestamp: number) => {
  const date = toDate(timestamp * 1000)
  return format(date, 'MMM do, yyyy HH:mm')
}

const NormalReview: React.FC<any> = ({ review }) => {
  const { t } = useTranslation()
  // const { NormalReviewTag } = Farm.Tags
  const { chainId } = useActiveChainId()
  return (
    <StyledProposalRow to={getBlockExploreLink(review.reviewer, 'address', chainId)}>
      <Box as="span" style={{ flex: 1 }}>
        <ScanLink href={getBlockExploreLink(review.reviewer, 'address', chainId)} bold={false} small>
          {truncateHash(review.reviewer ?? '')}
        </ScanLink>
        <CardBody p="0" px="24px" color="textSubtle">
          <ReactMarkdown>{review.body}</ReactMarkdown>
        </CardBody>
        {review.reviewTime ? (
          <Flex alignItems="center" mb="8px">
            <Text>{t('Posted on %date%', { date: getFormattedDate(Number(review.reviewTime)) })}</Text>
          </Flex>
        ) : null}
        {/* <NormalReviewTag rating="0" /> */}
      </Box>
      <IconButton variant="text">
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

const SuperReview: React.FC<any> = ({ review }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  return (
    <StyledProposalRow to={getBlockExploreLink(review?.reviewer, 'address', chainId)}>
      <Box as="span" style={{ flex: 1 }}>
        <ScanLink href={getBlockExploreLink(review?.reviewer, 'address', chainId)} bold={false} small>
          {truncateHash(review.reviewer ?? '')}
        </ScanLink>
        <CardBody p="0" px="24px" color="textSubtle">
          <ReactMarkdown>{review.body}</ReactMarkdown>
        </CardBody>
        {review?.reviewTime ? (
          <Flex alignItems="center" mb="8px">
            <Text>{t('Posted on %date%', { date: getFormattedDate(Number(review?.reviewTime)) })}</Text>
          </Flex>
        ) : null}
        <Flex alignItems="center">
          <ProposalStateTag votingPower={getBalanceNumber(review?.power, 18)} />
        </Flex>
      </Box>
      <IconButton variant="text">
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

const EasyMde = dynamic(() => import('components/EasyMde'), {
  ssr: false,
})

const ReviewsCard: React.FC<any> = ({ nft }) => {
  const { t } = useTranslation()
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const [isPaywall, setIsPaywall] = useState(0)
  const [superLike, setSuperLike] = useState(0)
  const [body, setBody] = useState('')
  const { isMobile } = useMatchBreakpoints()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const marketCollectionsContract = useMarketCollectionsContract()
  const [userTId, setUserTId] = useState<any>(0)
  const [isDone, setIsDone] = useState(false)
  const collectionId = useRouter().query.collectionAddress as string

  const handleCreateReview = useCallback(async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [collectionId, nft?.tokenId, userTId ?? 0, isPaywall, !!superLike, body]
      console.log('emitReview====================>', args)
      return callWithGasPrice(marketCollectionsContract, 'emitReview', args).catch((err) => {
        console.log('emitReview====================>', err)
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Channel Created'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your review has been successfully posted.')}
        </ToastDescriptionWithTx>,
      )
      setIsDone(true)
    }
  }, [
    t,
    body,
    nft,
    userTId,
    superLike,
    isPaywall,
    collectionId,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
    marketCollectionsContract,
  ])

  const icon = (
    <>
      {t('Reviews')}
      <ButtonMenu
        scale="sm"
        marginLeft={isMobile ? '0%' : '20%'}
        variant="subtle"
        activeIndex={activeButtonIndex}
        onItemClick={setActiveButtonIndex}
      >
        <ButtonMenuItem>{t('Add')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Super')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Normal')}</ButtonMenuItem>
      </ButtonMenu>
    </>
  )
  const options = useMemo(() => {
    return {
      hideIcons: ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [])
  const TooltipComponent = () => (
    <Text>{t('You need the password of the card to unlock enough funds from it to make the purchase.')}</Text>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const content = (
    <>
      <StyledBox p="24px">
        {activeButtonIndex > 0 ? (
          <Box style={{ overflow: 'hidden' }}>
            {activeButtonIndex === 1
              ? nft?.reviews
                  ?.filter((review) => !review.normalReview)
                  ?.map((review) => <SuperReview key={review?.id} review={review} />)
              : nft?.reviews
                  ?.filter((review) => review.normalReview)
                  ?.map((review, idx) => <NormalReview key="normal-review" review={review} />)}
          </Box>
        ) : (
          <>
            {body && (
              <Box mb="24px">
                <Card>
                  <CardHeader>
                    <Flex flexDirection="row" mb="8px">
                      <Flex justifyContent="center" alignItems="center" width="30%">
                        <Flex ref={targetRef}>
                          <Input
                            type="number"
                            scale="sm"
                            name="userTId"
                            value={userTId}
                            placeholder={t('input id of Leviathan')}
                            onChange={(e) => setUserTId(e.target.value)}
                          />
                          {tooltipVisible && tooltip}
                          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                        </Flex>
                      </Flex>
                      <Flex justifyContent="center" alignItems="center" mt="8px">
                        <ButtonMenu
                          scale="sm"
                          marginLeft={isMobile ? '0%' : '20%'}
                          variant="subtle"
                          activeIndex={isPaywall}
                          onItemClick={setIsPaywall}
                        >
                          <ButtonMenuItem>{t('Is Not Paywall')}</ButtonMenuItem>
                          <ButtonMenuItem>{t('Is Paywall')}</ButtonMenuItem>
                        </ButtonMenu>
                      </Flex>
                      <Flex justifyContent="center" alignItems="center" mt="8px">
                        <ButtonMenu
                          scale="sm"
                          marginLeft={isMobile ? '0%' : '20%'}
                          variant="subtle"
                          activeIndex={superLike}
                          onItemClick={setSuperLike}
                        >
                          <ButtonMenuItem>{t('Dislike')}</ButtonMenuItem>
                          <ButtonMenuItem>{t('Like')}</ButtonMenuItem>
                        </ButtonMenu>
                      </Flex>
                    </Flex>
                    <Heading as="h3" scale="md">
                      {t('Preview')}
                    </Heading>
                    <Flex justifyContent="flex-end">
                      <Button
                        disabled={isDone}
                        onClick={handleCreateReview}
                        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
                      >
                        {t('Post')}
                      </Button>
                    </Flex>
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
              <EasyMde id="body" name="body" onTextChange={(e) => setBody(e)} value={body} options={options} required />
            </Box>
          </>
        )}
      </StyledBox>
    </>
  )
  return <ExpandableCard title={icon} icon={<NftIcon width="24px" height="24px" />} content={content} />
}

export default ReviewsCard
