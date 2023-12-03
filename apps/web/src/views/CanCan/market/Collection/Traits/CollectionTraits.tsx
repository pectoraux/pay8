import { useCallback, useState } from 'react'
import times from 'lodash/times'
import capitalize from 'lodash/capitalize'
import sum from 'lodash/sum'
import orderBy from 'lodash/orderBy'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Text,
  Skeleton,
  Table,
  Td,
  Th,
  Flex,
  Box,
  Balance,
  Button,
  useModal,
  LinkExternal,
} from '@pancakeswap/uikit'
import {
  useGetCollection,
  useGetPendingRevenue,
  useGetSponsorRevenue,
  useGetSuperchatRevenue,
  useGetTokenURIs,
} from 'state/cancan/hooks'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import CollapsibleCard from 'components/CollapsibleCard'
import { useTranslation } from '@pancakeswap/localization'
import { ActionContainer, ActionContent, ActionTitles } from '../styles'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useCurrency } from 'hooks/Tokens'
import CreateGaugeModal from './CreateGaugeModal'
import WebPagesModal from './WebPagesModal'

interface CollectionTraitsProps {
  collectionAddress: string
}

const CollectionTraits: React.FC<React.PropsWithChildren<CollectionTraitsProps>> = ({ collectionAddress }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { collection, refresh } = useGetCollection(collectionAddress)
  const [currency, setCurrency] = useState(DEFAULT_TFIAT)
  const cacanCurrencyInput = useCurrency(DEFAULT_TFIAT)
  const isAdmin = collection?.owner?.toLowerCase() === account?.toLowerCase()
  const { data, refetch } = useGetPendingRevenue(currency, collectionAddress)
  const sponsorRevenue = useGetSponsorRevenue(collectionAddress)
  const superChatRevenue = useGetSuperchatRevenue(collectionAddress)
  const { data: tokenURIs } = useGetTokenURIs(collection?.owner)
  console.log('tokenURIs======================>', tokenURIs)
  const handleInputSelect = useCallback((currencyInput) => {
    setCurrency(currencyInput)
  }, [])
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal pool={collection} currency={cacanCurrencyInput} isAdmin={isAdmin} refetch={refetch} />,
  )
  const [openPresentControlPanel2] = useModal(
    <CreateGaugeModal
      variant="withdraw"
      pool={collection}
      currency={cacanCurrencyInput}
      isAdmin={isAdmin}
      refetch={refetch}
    />,
  )
  const [openPresentControlPanel3] = useModal(
    <CreateGaugeModal
      variant="superchat"
      pool={collection}
      currency={cacanCurrencyInput}
      isAdmin={isAdmin}
      refetch={refetch}
    />,
  )
  const [onPresentNote] = useModal(
    <WebPagesModal height="500px" nft={tokenURIs?.marketNote} metadataUrl={tokenURIs?.marketNoteURI} />,
  )
  const [onPresentNote2] = useModal(
    <WebPagesModal height="500px" nft={tokenURIs?.paywallNote} metadataUrl={tokenURIs?.paywallNoteURI} />,
  )
  const [onPresentNote3] = useModal(
    <WebPagesModal height="500px" nft={tokenURIs?.nftNote} metadataUrl={tokenURIs?.nftNoteURI} />,
  )

  const actionTitle = (
    <>
      <Text fontSize="12px" mr="3px" bold color="textSubtle" as="span" textTransform="uppercase">
        {cacanCurrencyInput?.symbol ?? ''}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {t('Revenue')}
      </Text>
    </>
  )

  const actionTitle2 = (
    <>
      <Text fontSize="12px" mr="3px" bold color="textSubtle" as="span" textTransform="uppercase">
        {'USD'}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {t('Revenue')}
      </Text>
    </>
  )

  return (
    <>
      <CollapsibleCard key="revenue" title={capitalize('Revenue From MarketPlaces')} initialOpenState mb="32px">
        <Flex flex="1" flexDirection="column" alignItems="center" alignSelf="flex-center">
          <ActionTitles>{actionTitle}</ActionTitles>
          <CurrencyInputPanel
            showInput={false}
            currency={cacanCurrencyInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={cacanCurrencyInput}
          />
          <ActionContent>
            <Button width="100%" mb="25px" onClick={openPresentControlPanel} variant="secondary">
              {t('Control Panel')}
            </Button>
            {/* <Flex mb="40px"><NotificationDot show={userData?.requests?.length} /></Flex> */}
          </ActionContent>
        </Flex>
        <ActionContent>
          <Flex flex="1" flexDirection="column" alignItems="center" alignSelf="flex-center">
            <Box mb="25px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(new BigNumber(data?.marketPendingRevenue?.toString()))}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Pending Revenue From Item Sales')}
              </Text>
            </Box>
            <Box mb="25px" ml="18px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(new BigNumber(data?.marketCashbackFund?.toString()))}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t("Item MarketPlace's Cashback Fund")}
              </Text>
            </Box>
            {tokenURIs?.marketNoteURI ? (
              <Flex mb="25px" justifyContent="flex-end">
                <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNote} bold={false} small>
                  {t('View Permissionary Note')}
                </LinkExternal>
              </Flex>
            ) : null}
            <Box ml="28px" mb="25px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(new BigNumber(data?.paywallMarketPendingRevenue?.toString()))}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Pending Revenue From Paywall Sales')}
              </Text>
            </Box>
            <Box ml="38px" mb="25px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(new BigNumber(data?.paywallMarketCashbackFund?.toString()))}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t("Paywall MarketPlace's Cashback Fund")}
              </Text>
            </Box>
            {tokenURIs?.paywallNoteURI ? (
              <Flex mb="25px" justifyContent="flex-end">
                <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNote2} bold={false} small>
                  {t('View Permissionary Note')}
                </LinkExternal>
              </Flex>
            ) : null}
            <Box mb="25px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(new BigNumber(data?.nftMarketPendingRevenue?.toString()))}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Pending Revenue From NFT Sales')}
              </Text>
            </Box>
            <Box mb="25px" ml="18px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(new BigNumber(data?.nftMarketCashbackFund?.toString()))}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t("NFT MarketPlace's Cashback Fund")}
              </Text>
            </Box>
            {tokenURIs?.nftNoteURI ? (
              <Flex mb="25px" justifyContent="flex-end">
                <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNote3} bold={false} small>
                  {t('View Permissionary Note')}
                </LinkExternal>
              </Flex>
            ) : null}
          </Flex>
        </ActionContent>
      </CollapsibleCard>
      <CollapsibleCard key="sponsorrevenue" title={capitalize('Revenue From Sponsors')} initialOpenState mb="32px">
        <Flex flex="1" flexDirection="column" alignItems="center" alignSelf="flex-center">
          <ActionTitles>{actionTitle2}</ActionTitles>
          <ActionContent>
            <Button width="100%" mb="25px" onClick={openPresentControlPanel2} variant="secondary">
              {t('Withdraw Revenue')}
            </Button>
          </ActionContent>
        </Flex>
        <ActionContent>
          <Flex flex="1" flexDirection="column" alignItems="center" alignSelf="flex-center">
            <Box mb="25px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(new BigNumber(sponsorRevenue?.toString()))}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Pending Revenue From Sponsors')}
              </Text>
            </Box>
          </Flex>
        </ActionContent>
      </CollapsibleCard>
      <CollapsibleCard key="superchatrevenue" title={capitalize('Revenue From SuperChats')} initialOpenState mb="32px">
        <Flex flex="1" flexDirection="column" alignItems="center" alignSelf="flex-center">
          <ActionTitles>{actionTitle2}</ActionTitles>
          <ActionContent>
            <Button width="100%" mb="25px" onClick={openPresentControlPanel3} variant="secondary">
              {t('Control Panel')}
            </Button>
          </ActionContent>
        </Flex>
        <ActionContent>
          <Flex flex="1" flexDirection="column" alignItems="center" alignSelf="flex-center">
            <Box mb="25px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(new BigNumber(superChatRevenue?.toString()))}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Pending Revenue From SuperChat')}
              </Text>
            </Box>
          </Flex>
        </ActionContent>
      </CollapsibleCard>
    </>
  )
}

export default CollectionTraits
