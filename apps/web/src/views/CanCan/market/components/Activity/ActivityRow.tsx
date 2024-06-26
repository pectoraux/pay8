import {
  Box,
  Flex,
  Text,
  Td,
  IconButton,
  Link,
  OpenNewIcon,
  TicketFillIcon,
  useModal,
  TokenImage,
  useMatchBreakpoints,
  NextLinkFromReactRouter,
} from '@pancakeswap/uikit'
import { useGetExtraNote } from 'state/cancan/hooks'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Activity, NftToken } from 'state/nftMarket/types'
import { Price, Currency } from '@pancakeswap/sdk'
import { useAccount } from 'wagmi'
import { getBlockExploreLink } from 'utils'
import ProfileCell from 'views/Nft/market/components/ProfileCell'
import { useActiveChainId } from 'hooks/useActiveChainId'
import WebPageModal from './WebPageModal'
import MobileModal from './MobileModal'
import ActivityPrice from './ActivityPrice'
import ActivityEventText from './ActivityEventText'
import { nftsBaseUrl } from '../../constants'
import ArticleModal from './ArticleModal'

interface ActivityRowProps {
  activity: Activity
  nft: NftToken
  bnbBusdPrice: Price<Currency, Currency>
  isUserActivity?: boolean
  isNftActivity?: boolean
}

export const ScrollableRow = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px 0;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`

const ActivityRow: React.FC<any> = ({
  nft,
  activity,
  bnbBusdPrice,
  collection,
  isUserActivity = false,
  isNftActivity = false,
}) => {
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const { isXs, isSm } = useMatchBreakpoints()
  const priceAsFloat = parseFloat(activity.price)
  const timestampAsMs = parseFloat(activity.timestamp) * 1000
  const collectionId = useRouter().query.collectionAddress as string
  const { data: extraNotes } = useGetExtraNote(
    collectionId,
    activity?.buyer,
    activity?.item?.id ?? activity?.paywall?.id,
    !!activity?.item?.id,
  )
  const isSeller = nft?.currentSeller?.toLowerCase() === account?.toLowerCase()
  const localeTimestamp = new Date(timestampAsMs).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
  const [onPresentMobileModal] = useModal(
    <MobileModal
      nft={nft}
      activity={activity}
      localeTimestamp={localeTimestamp}
      bnbBusdPrice={bnbBusdPrice}
      isUserActivity={isUserActivity}
    />,
  )
  const currNft = nft?.transactionHistory?.find((tx) => tx.id?.toLowerCase() === activity.tx?.toLowerCase())
  const _nft = {
    ...currNft,
    metadataUrl: activity?.metadataUrl,
  }
  const [onPresentNFTicket] = useModal(<WebPageModal nft={_nft} />)
  const [onPresentNote] = useModal(<ArticleModal extraNotes={extraNotes} />)
  const tokenId = nft ? nft.tokenId : null
  const item = activity?.item || activity?.paywall

  const onClickProp = nft
    ? {
        onClick: onPresentMobileModal,
      }
    : {}
  return (
    <tr {...((isXs || isSm) && onClickProp)} data-test="nft-activity-row">
      {!isNftActivity ? (
        <Td
          {...((isXs || isSm) && {
            onClick: (event) => {
              event.stopPropagation()
            },
          })}
        >
          <Flex justifyContent="flex-start" alignItems="center" flexDirection={['column', null, 'row']}>
            <>
              <Box width={64} height={64} mr={[0, null, '16px']} mb={['8px', null, 0]}>
                <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${collectionId}/${tokenId}`}>
                  <TokenImage mr="8px" width={64} height={64} src={collection?.avatar} />
                </NextLinkFromReactRouter>
              </Box>
              <Flex flexDirection="column">
                <Text
                  as={NextLinkFromReactRouter}
                  to={`${nftsBaseUrl}/collections/${collectionId}/${tokenId}`}
                  textAlign={['center', null, 'left']}
                  bold
                >
                  {nft?.id}
                </Text>
              </Flex>
              {currNft ? (
                <IconButton style={{ cursor: 'pointer' }} as={Link} external onClick={onPresentNFTicket}>
                  <TicketFillIcon color="primary" width="18px" />
                </IconButton>
              ) : null}
              {extraNotes?.length && isSeller ? (
                <IconButton style={{ cursor: 'pointer' }} as={Link} external onClick={onPresentNote}>
                  <TicketFillIcon color="red" width="18px" />
                </IconButton>
              ) : null}
            </>
          </Flex>
        </Td>
      ) : null}
      <Td>
        <Flex alignItems="center" justifyContent="flex-end">
          <ActivityEventText
            marketEvent={
              ['SELL', 'BUY'].includes(activity.marketEvent)
                ? activity.marketEvent
                : item?.askHistory && item?.askHistory[0].orderType
            }
          />
        </Flex>
        {isXs || isSm ? <ActivityPrice nft={nft} price={priceAsFloat} bnbBusdPrice={bnbBusdPrice} /> : null}
      </Td>
      {isXs || isSm ? null : (
        <>
          <Td>
            <ActivityPrice nft={nft} price={priceAsFloat} bnbBusdPrice={bnbBusdPrice} />
          </Td>
          {activity.marketEvent === 'SELL' ? (
            <>
              <Td>
                <Flex justifyContent="center" alignItems="center">
                  {activity.seller ? <ProfileCell accountAddress={activity.seller} tokenId={tokenId} /> : '-'}
                </Flex>
              </Td>
              <Td>
                <Flex justifyContent="center" alignItems="center">
                  {activity.buyer ? <ProfileCell accountAddress={activity.buyer} tokenId={tokenId} /> : '-'}
                </Flex>
              </Td>
            </>
          ) : isUserActivity ? (
            <Td>
              <Flex justifyContent="center" alignItems="center">
                {activity.otherParty ? <ProfileCell accountAddress={activity.otherParty} tokenId={tokenId} /> : '-'}
              </Flex>
            </Td>
          ) : (
            <>
              <Td>
                <Flex justifyContent="center" alignItems="center">
                  {activity.seller ? (
                    <ProfileCell
                      accountAddress={
                        activity?.item?.currentSeller ?? activity?.paywall?.currentSeller ?? activity.seller
                      }
                      tokenId={tokenId}
                    />
                  ) : (
                    '-'
                  )}
                </Flex>
              </Td>
              <Td>
                <Flex justifyContent="center" alignItems="center">
                  {activity.buyer ? (
                    <ProfileCell
                      accountAddress={
                        activity?.item?.currentSeller ?? activity?.paywall?.currentSeller ?? activity.buyer
                      }
                      tokenId={tokenId}
                    />
                  ) : (
                    '-'
                  )}
                </Flex>
              </Td>
            </>
          )}
        </>
      )}
      <Td>
        <Flex justifyContent="center">
          <Text textAlign="center" fontSize={isXs || isSm ? '12px' : '16px'}>
            {localeTimestamp}
          </Text>
        </Flex>
      </Td>
      {isXs || isSm ? null : (
        <Td>
          <IconButton mb="8px" as={Link} external href={getBlockExploreLink(activity.tx, 'transaction', chainId)}>
            <OpenNewIcon color="textSubtle" width="18px" />
          </IconButton>
          {currNft ? (
            <IconButton style={{ cursor: 'pointer' }} as={Link} external onClick={onPresentNFTicket}>
              <TicketFillIcon color="primary" width="18px" />
            </IconButton>
          ) : null}
          {extraNotes?.length && isSeller ? (
            <IconButton style={{ cursor: 'pointer' }} as={Link} external onClick={onPresentNote}>
              <TicketFillIcon color="red" width="18px" />
            </IconButton>
          ) : null}
        </Td>
      )}
    </tr>
  )
}

export default ActivityRow
