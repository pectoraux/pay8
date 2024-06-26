import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { Flex, CogIcon, Button, Text, useModal } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useGetCollection } from 'state/cancan/hooks'
import PageLoader from 'components/Loader/PageLoader'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@pancakeswap/wagmi'
import MainNFTCard from './MainNFTCard'
import { TwoColumnsContainer } from '../shared/styles'
import DetailsCard from '../shared/DetailsCard'
import ReviewsCard from '../shared/ReviewsCard'
import OwnerCard from './OwnerCard'
import MoreFromThisCollection from '../shared/MoreFromThisCollection'
import AuditNFTsCard from './AuditNFTsCard'
import ActivityCard from './ActivityCard'
import ExpandableCard from '../shared/ExpandableCard'
import { useCompleteNft } from '../../../hooks/useCompleteNft'
import SellModal from '../../../components/BuySellModals/SellModal'
import SettingStage from '../../../components/BuySellModals/SellModal/SettingStage'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import RegisterModal from '../../RegisterModal'
import PartnerModal from '../../PartnerModal'

interface IndividualNFTPageProps {
  collectionAddress: string
  tokenId: string
}

const OwnerActivityContainer = styled(Flex)`
  gap: 22px;
`

const IndividualNFTPage: React.FC<any> = ({ collectionAddress, tokenId, isPaywall }) => {
  const { collection } = useGetCollection(collectionAddress)
  const { combinedNft, isProfilePic, refetch } = useCompleteNft(collectionAddress, tokenId, isPaywall)
  const nft = combinedNft as any
  const { account } = useWeb3React()
  const router = useRouter()
  const isOwnNft = account ? nft?.currentSeller?.toLowerCase() === account.toLowerCase() : false
  const { t } = useTranslation()
  const { mainCurrency } = useWorkspaceCurrency(nft?.ve?.toLowerCase(), nft?.tFIAT, nft?.usetFIAT, nft?.currentAskPrice)
  const [currency, setCurrency] = useState(mainCurrency)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])

  const [onPresentRegister] = useModal(<RegisterModal collection={collection} />)
  const [onPresentPartner] = useModal(<PartnerModal collection={collection} />)

  const [onPresentSellModal] = useModal(
    <SellModal variant={isPaywall ? 'paywall' : 'item'} nftToSell={nft} currency={currency} onSuccessSale={refetch} />,
  )
  const [onPresentSettings] = useModal(
    <SettingStage variant="ProductPage" collection={collection} mainCurrency={currency ?? mainCurrency} />,
  )

  const ownerButtons = (
    <Flex
      flexDirection={['column', 'column', 'column']}
      alignItems="center"
      justifyContent="center"
      mt="28px"
      mb="28px"
    >
      <ActionContainer style={{ marginRight: '7%' }}>
        <ActionTitles>
          <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
            {t('Update main currency')}{' '}
          </Text>
        </ActionTitles>
        <CurrencyInputPanel
          showInput={false}
          currency={currency ?? mainCurrency}
          onCurrencySelect={handleInputSelect}
          otherCurrency={currency ?? mainCurrency}
          id={`${nft?.tokenId}`}
        />
        <ActionContent>
          <Flex flexDirection="column" alignItems="center" justifyContent="center" ml="10%">
            <Button width="100%" onClick={onPresentSellModal} variant="secondary" disabled={!isOwnNft}>
              {nft?.isTradable ? t('Price settings') : t('List for sale')}
            </Button>
            <hr />
            <Button width="100%" onClick={onPresentSettings} variant="secondary" disabled={!isOwnNft}>
              {t('Channel settings')}
            </Button>
          </Flex>
        </ActionContent>
      </ActionContainer>
    </Flex>
  )

  const userButtons = (
    <Flex
      flexDirection={['column', 'column', 'column']}
      alignItems="center"
      justifyContent="center"
      mt="28px"
      mb="28px"
    >
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Button width="100%" onClick={onPresentPartner} variant="secondary">
          {t('Partner')}
        </Button>
        <hr />
        <Button width="100%" onClick={onPresentRegister} variant="secondary">
          {t('Register')}
        </Button>
        <hr />
        <Button
          width="100%"
          onClick={() => router.push(`/ssi/proposal/createAutomaticData?collectionId=${collectionAddress}`)}
          variant="secondary"
        >
          {t('Share My Email')}
        </Button>
      </Flex>
    </Flex>
  )

  if (!nft || !collection) {
    // Normally we already show a 404 page here if no nft, just put this checking here for safety.

    // For now this if is used to show loading spinner while we're getting the data
    return <PageLoader />
  }

  return (
    <Page>
      <MainNFTCard
        collection={collection}
        nft={nft}
        isOwnNft={isOwnNft}
        nftIsProfilePic={isProfilePic}
        onSuccess={refetch}
      />
      {/* <Flex style={{ position: 'relative', bottom: '20px'}}><Cart /></Flex> */}
      <TwoColumnsContainer flexDirection={['column', 'column', 'column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <AuditNFTsCard collection={collection} nft={nft} onSuccess={refetch} />
          <ExpandableCard
            title={isOwnNft ? t('Manage Your Product') : t('Networking Activities')}
            icon={<CogIcon ml="10px" width="24px" height="24px" />}
            content={isOwnNft ? ownerButtons : userButtons}
          />
          <DetailsCard contractAddress={collectionAddress} ipfsJson={nft?.metadataUrl} />
        </Flex>
        <OwnerActivityContainer flexDirection="column" width="100%">
          <ReviewsCard nft={nft} />
          <OwnerCard
            nft={nft}
            isPaywall={isPaywall}
            isOwnNft={isOwnNft}
            nftIsProfilePic={isProfilePic}
            onSuccess={refetch}
          />
          {/* {isAuction && <ForSaleTableCard nftToBuy={nft} onSuccessSale={refetch} />} */}
          <ActivityCard nft={nft} />
        </OwnerActivityContainer>
      </TwoColumnsContainer>
      <MoreFromThisCollection collectionAddress={collectionAddress} nft={nft} />
    </Page>
  )
}

export default IndividualNFTPage
