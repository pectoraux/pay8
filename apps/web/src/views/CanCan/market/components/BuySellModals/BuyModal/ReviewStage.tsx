import { useState, useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import styled from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
import {
  Flex,
  Text,
  Button,
  Input,
  ButtonMenu,
  ButtonMenuItem,
  Message,
  CopyAddress,
  Link,
  useMatchBreakpoints,
  MinusIcon,
  IconButton,
  ExpandableSectionButton,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { useTranslation } from '@pancakeswap/localization'
import { NftToken } from 'state/cancan/types'
import { getBscScanLinkForNft, isAddress } from 'utils'
import { FetchStatus } from 'config/constants/types'
import { formatEther } from 'ethers/lib/utils'
import { FaEquals } from 'react-icons/fa'
import useTokenBalance from 'hooks/useTokenBalance'
import { useGetNftFilters, useGetCollectionContracts } from 'state/cancan/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import AddressInputPanel from './AddressInputPanel'
import { Divider, RoundedImage } from '../shared/styles'
import { BorderedBox, BnbAmountCell, NumberCell } from './styles'
import { PaymentCurrency } from './types'
import { GreyedOutContainer } from '../SellModal/styles'
import CountdownCircle from './CountdownCircle'

interface ReviewStageProps {
  nftToBuy: NftToken
  paymentCurrency: PaymentCurrency
  setPaymentCurrency: (index: number) => void
  nftPrice: number
  notEnoughBnbForPurchase: boolean
  paymentCredits: number
  totalPayment: number
  userTokenId: number
  identityTokenId: number
  setUserTokenId: () => void
  setIdentityTokenId: () => void
  continueToNextStage: () => void
  continueToCashbackStage: () => void
  continueToPaymentCreditStage: () => void
}

const StyledBorderedBox = styled(BorderedBox)`
  width: 105%;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`
const Wrapper = styled.div`
  margin-bottom: 14px;
`

const ExpandingWrapper = styled.div`
  padding: 1px;
  padding-left: 14px;
  padding-right: 14px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: scroll;
  max-height: 300px;
`

const ReviewStage: React.FC<any> = ({
  thumbnail,
  status,
  isPaywall,
  nftToBuy,
  paymentCurrency,
  setPaymentCurrency,
  nftPrice,
  paymentCredits,
  totalPayment,
  discounted,
  discountAmount,
  userTokenId,
  identityTokenId,
  recipient,
  setRecipient,
  tokenId,
  setTokenId,
  mainCurrency,
  secondaryCurrency,
  mainToSecondaryCurrencyFactor,
  requireUpfrontPayment,
  setRequireUpfrontPayment,
  setCheckRank,
  merchantIdentityTokenId,
  note,
  address,
  setMerchantIdentityTokenId,
  setNote,
  setAddress,
  setUserTokenId,
  setIdentityTokenId,
  continueToNextStage,
  continueToCashbackStage,
  continueToAddressLimitStage,
  continueToIdentityLimitStage,
  continueToPaymentCreditStage,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [discountIndex, setDiscountIndex] = useState(0)
  const { isMobile } = useMatchBreakpoints()
  const showCredits = paymentCredits > 0
  const showSecondMenu = discounted && showCredits
  const nftFilters = useGetNftFilters(account)
  const { balance: bnbBalance, fetchStatus: bnbFetchStatus } = useTokenBalance(mainCurrency?.address ?? '')
  const notEnoughBnbForPurchase = bnbBalance.lt(totalPayment)
  const walletBalance = parseFloat(formatEther(bnbBalance.toString()))
  const slicedContract = isMobile ? `${t('Contract').slice(0, 2)}...` : t('Contract')
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const channelContracts = useGetCollectionContracts(nftToBuy.collectionAddress)
  const currencies = useMemo(() => {
    if (paymentCurrency === 2) {
      const currentContract = channelContracts && channelContracts[recipient]
      if (currentContract) {
        return [mainCurrency, mainCurrency, currentContract.currencyId === 0 ? mainCurrency : secondaryCurrency]
      }
    }
    return [mainCurrency, mainCurrency]
  }, [recipient, channelContracts, mainCurrency, secondaryCurrency, paymentCurrency])

  const getSecondaryCurrency = (curr: any) => {
    if (curr?.symbol === secondaryCurrency?.symbol) return mainCurrency
    return secondaryCurrency
  }

  const TooltipComponent = () => (
    <Text>
      {t(
        "Input the id of your token in the Valuepool provided above. If you do not have a token in that Valuepool, you should mint one from the Valuepool's page (at Win > Valuepool). Once you have one, you can input its id right here.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "Input the token id of the Leviathan from this product's workspace. If you do not have a token in that Leviathan, you should mint one from the Leviathans' page at Mint > Leviathan. Once you have one, you can input its id right here.",
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Identity tokens are used to confirm requirements customers of an item need to fulfill to purchase the item. If your item does not have any requirements, you can just input 0. If it does, make sure you get an auditor approved by the business to deliver you an identity token and input its ID in this field.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'In case customer might want to purchase this item through the stake market, this parameters sets whether or not they should be required to send the purchase price to the stake when creating it. If you want to be sure the customers have the money for the purchase before being allowed to create a stake to purchase your item, you can set this parameter to Yes, if that is not a requirement, you can set it to No.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'The merchant id is the identity token id of the merchant and is used to check that the merchant is elligbible for your valuepool. In case your valuepool does not impose any identity requirements on merchnts, just input 0.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'If you do not have enough of the tokens accepeted for this product, you can purchase more of the tokens from the dRamp on page Trade > dRamps.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'If you do not have enough of the tokens accepeted for this product, you can purchase more of the tokens from the dRamp on page Trade > dRamps.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>{t('Use this field to add any extra note you would like to send to the seller.')}</Text>
  )
  const TooltipComponent9 = () => (
    <Text>
      {t(
        'Use this field to add an address if relevant. This field can be useful for items that need to be shipped or delivered.',
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
  return (
    <>
      <Flex px="24px" pt="24px" flexDirection="column">
        <Flex>
          <RoundedImage src={thumbnail} height={68} width={68} mr="16px" />
          <Flex flexDirection="column" justifyContent="space-evenly">
            <Text color="textSubtle" fontSize="12px">
              {nftToBuy?.currentSeller}
            </Text>
            <Flex alignItems="center">
              <Text fontSize="12px" color="textSubtle" p="0px" height="16px" mr="4px">
                {t('Token ID:')}
              </Text>
              <Button
                as={Link}
                scale="xs"
                px="0px"
                pt="2px"
                external
                variant="text"
                href={getBscScanLinkForNft(nftToBuy.collectionAddress, nftToBuy.tokenId)}
              >
                {nftToBuy.tokenId}
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <StyledBorderedBox>
          <Text small color="textSubtle">
            {t('Pay with')}
          </Text>
          <ButtonMenu
            activeIndex={paymentCurrency}
            onItemClick={(index) => setPaymentCurrency(index)}
            scale="sm"
            variant="subtle"
          >
            <ButtonMenuItem>{mainCurrency?.symbol}</ButtonMenuItem>
            <ButtonMenuItem>{t('Stake Market')}</ButtonMenuItem>
            <ButtonMenuItem>
              {isMobile || paymentCurrency === 2 ? slicedContract : t('Contract').slice(0, 8)}
            </ButtonMenuItem>
          </ButtonMenu>
        </StyledBorderedBox>
        <StyledBorderedBox>
          <Text small color="textSubtle">
            {t('Base price')}
          </Text>
          <BnbAmountCell
            bnbAmount={nftPrice}
            currency={currencies[paymentCurrency]}
            secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
          />
          {Object.keys(nftFilters).map((optionKey, idx) => {
            return Object.keys(nftFilters[optionKey])
              .filter((valueKey) => !!nftFilters[optionKey][valueKey].count)
              .map((valueKey) => {
                const index = nftToBuy?.options?.findIndex((val) => parseFloat(val.value) === parseFloat(valueKey))
                const val = isPaywall ? nftToBuy?.options[index]?.element : valueKey
                return (
                  <>
                    <Text small color="textSubtle">
                      {t('%value% (%key%)', { value: val, key: optionKey })}
                    </Text>
                    <NumberCell
                      bnbAmount={nftFilters[optionKey][valueKey].count}
                      price={nftFilters[optionKey][valueKey].price}
                      currency={nftFilters[optionKey][valueKey].currency}
                      currentCurrency={currencies[paymentCurrency]}
                      mainToSecondaryCurrencyFactor={mainToSecondaryCurrencyFactor}
                      secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
                    />
                  </>
                )
              })
          })}
        </StyledBorderedBox>
        {paymentCredits > 0 || discounted ? (
          <>
            <IconButton style={{ position: 'relative', left: '47%' }} mb="8px">
              <MinusIcon color="white" />
            </IconButton>
            {showSecondMenu ? (
              <ButtonMenu
                activeIndex={discountIndex}
                onItemClick={(index) => setDiscountIndex(index)}
                scale="sm"
                variant="subtle"
              >
                <ButtonMenuItem>{t('Credits')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Discounts')}</ButtonMenuItem>
              </ButtonMenu>
            ) : null}
            <StyledBorderedBox>
              {(!showSecondMenu && showCredits) || (showSecondMenu && !discountIndex) ? (
                <>
                  {paymentCredits > 0 ? (
                    <>
                      <Text small color="textSubtle">
                        {t('Payment credits')}
                      </Text>
                      <BnbAmountCell
                        bnbAmount={paymentCredits}
                        currency={currencies[paymentCurrency]}
                        secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
                      />
                    </>
                  ) : null}
                </>
              ) : discounted ? (
                <>
                  <Text small color="textSubtle">
                    {t('Discount Amount')}
                  </Text>
                  <BnbAmountCell
                    bnbAmount={discountAmount}
                    currency={currencies[paymentCurrency]}
                    secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
                  />
                </>
              ) : null}
            </StyledBorderedBox>
          </>
        ) : null}
        {paymentCredits > 0 || discounted ? (
          <IconButton style={{ position: 'relative', left: '47%' }}>
            <FaEquals />
          </IconButton>
        ) : null}
        <StyledBorderedBox>
          <Text small color="textSubtle">
            {t('Total payment')}
          </Text>
          <BnbAmountCell
            isLoading={status !== FetchStatus.Fetched}
            bnbAmount={getBalanceNumber(totalPayment)}
            currency={currencies[paymentCurrency]}
            secondaryCurrency={getSecondaryCurrency(currencies[paymentCurrency])}
          />
          {paymentCurrency !== 2 && (
            <Text small color="textSubtle">
              {t('%symbol% in wallet', { symbol: currencies[0]?.symbol || '' })}
            </Text>
          )}
          {!account ? (
            <Flex justifySelf="flex-end">
              <ConnectWalletButton scale="sm" />
            </Flex>
          ) : (
            paymentCurrency !== 2 && (
              <BnbAmountCell
                bnbAmount={walletBalance}
                currency={currencies[0]}
                secondaryCurrency={getSecondaryCurrency(currencies[0])}
                isLoading={bnbFetchStatus !== FetchStatus.Fetched}
                isInsufficient={bnbFetchStatus === FetchStatus.Fetched && notEnoughBnbForPurchase}
              />
            )
          )}
          {paymentCurrency !== 2 && (
            <>
              <Text small color="textSubtle">
                {t('%symbol% will be taken from your wallet', { symbol: currencies[0]?.symbol || '' })}
              </Text>
            </>
          )}
        </StyledBorderedBox>
        {paymentCurrency === 2 ? (
          <>
            <ExpandingWrapper>
              <ExpandableSectionButton
                key="contract-addresses"
                onClick={() => setShowExpandableSection(!showExpandableSection)}
                // title="Show Contract"
                expanded={showExpandableSection}
              />
              {showExpandableSection && (
                <Wrapper>
                  <Flex flexDirection="column" alignItems="center" justifyContent="space-between" mb="15px">
                    {Object.keys(channelContracts || []).map((channelAddress) => {
                      return (
                        <CopyAddress
                          account={channelContracts[channelAddress]?.address}
                          title={channelContracts[channelAddress]?.name}
                          mb="24px"
                          tooltipMessage=""
                        />
                      )
                    })}
                  </Flex>
                </Wrapper>
              )}
            </ExpandingWrapper>
            <AddressInputPanel id="recipient" value={recipient} onChange={setRecipient} />
          </>
        ) : (
          bnbFetchStatus === FetchStatus.Fetched &&
          notEnoughBnbForPurchase && (
            <Message p="8px" variant="danger">
              <Text>
                {t('Not enough %symbol% to purchase this NFT', {
                  symbol: currencies[0]?.symbol,
                })}
              </Text>
            </Message>
          )
        )}
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
          <StyledBorderedBox>
            {paymentCurrency === 2 ? (
              <GreyedOutContainer>
                <Flex ref={targetRef}>
                  <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                    {t('Valuepool Token ID')}
                  </Text>
                  {tooltipVisible && tooltip}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Input
                  type="number"
                  scale="sm"
                  value={tokenId}
                  placeholder={t('input Valuepool token id')}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </GreyedOutContainer>
            ) : (
              <GreyedOutContainer>
                <Flex ref={targetRef2}>
                  <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                    {t('Product Leviathan Token ID')}
                  </Text>
                  {tooltipVisible2 && tooltip2}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Input
                  type="number"
                  scale="sm"
                  value={userTokenId}
                  placeholder={t('input product Leviathan token id')}
                  onChange={(e) => setUserTokenId(e.target.value)}
                />
              </GreyedOutContainer>
            )}
            <GreyedOutContainer>
              <Flex ref={targetRef3}>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                  {t('Identity Token ID')}
                </Text>
                {tooltipVisible3 && tooltip3}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <Input
                type="number"
                scale="sm"
                value={identityTokenId}
                placeholder={t('input identity token id')}
                onChange={(e) => setIdentityTokenId(e.target.value)}
              />
            </GreyedOutContainer>
            {paymentCurrency === 1 ? (
              <GreyedOutContainer style={{ paddingTop: '50px' }}>
                <StyledItemRow>
                  <Flex ref={targetRef4} paddingRight="50px">
                    <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
                      {t('Require Upfront Payment')}
                    </Text>
                    {tooltipVisible4 && tooltip4}
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </Flex>
                  <ButtonMenu
                    scale="xs"
                    variant="subtle"
                    activeIndex={requireUpfrontPayment}
                    onItemClick={setRequireUpfrontPayment}
                  >
                    <ButtonMenuItem>{t('No')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
                  </ButtonMenu>
                </StyledItemRow>
              </GreyedOutContainer>
            ) : null}
            {paymentCurrency === 2 ? (
              <GreyedOutContainer>
                <Flex ref={targetRef5}>
                  <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                    {t('Merchant Identity ID (For Check Rank)')}
                  </Text>
                  {tooltipVisible5 && tooltip5}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Input
                  type="number"
                  scale="sm"
                  value={merchantIdentityTokenId}
                  placeholder={t('input merchant identity id')}
                  onChange={(e) => setMerchantIdentityTokenId(e.target.value)}
                />
              </GreyedOutContainer>
            ) : null}
          </StyledBorderedBox>
          <StyledBorderedBox>
            <GreyedOutContainer>
              <Flex ref={targetRef8}>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                  {t('Note')}
                </Text>
                {tooltipVisible8 && tooltip8}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <Input
                type="text"
                scale="lg"
                value={note}
                placeholder={t('pass any note to the seller')}
                onChange={(e) => setNote(e.target.value)}
              />
            </GreyedOutContainer>
            <GreyedOutContainer>
              <Flex ref={targetRef9}>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                  {t('Address Info')}
                </Text>
                {tooltipVisible9 && tooltip9}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <Input
                type="text"
                scale="lg"
                value={address}
                placeholder={t('input your address information')}
                onChange={(e) => setAddress(e.target.value)}
              />
            </GreyedOutContainer>
          </StyledBorderedBox>
        </Flex>
        <Flex alignItems="center">
          <Flex ref={targetRef6} mr="4px">
            <Text my="16px">
              {t('Convert between %symb1% and %symb2%', {
                symb1: mainCurrency?.symbol || '',
                symb2: secondaryCurrency?.symbol || '',
              })}
            </Text>
            {tooltipVisible6 && tooltip6}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Button
            as={Link}
            p="0px"
            height="16px"
            external
            variant="text"
            href="/swap?inputCurrency=BNB&outputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
          >
            {t('Convert')}
          </Button>
        </Flex>
        <Flex alignItems="center">
          <Flex ref={targetRef7} mr="4px">
            <Text my="16px">{t('Buy with credit card')}:</Text>
            {tooltipVisible7 && tooltip7}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Button
            as={Link}
            p="0px"
            height="16px"
            external
            variant="text"
            href="/ramps?inputCurrency=BNB&outputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
          >
            {t('Get FIAT Tokens')}
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <Flex px="24px" pb="24px" flexDirection="column">
        <Button
          onClick={continueToNextStage}
          disabled={
            bnbFetchStatus !== FetchStatus.Fetched ||
            notEnoughBnbForPurchase ||
            (!isAddress(recipient) && paymentCurrency === 2)
          }
          mb="8px"
        >
          {paymentCurrency === PaymentCurrency.WBNB
            ? t('Stake')
            : paymentCurrency === 0
            ? t('Checkout')
            : t('Pick Rank')}
        </Button>
        {paymentCurrency === 2 && (
          <Button
            onClick={() => {
              setCheckRank(true)
              continueToNextStage()
            }}
            disabled={
              bnbFetchStatus !== FetchStatus.Fetched ||
              notEnoughBnbForPurchase ||
              (!isAddress(recipient) && paymentCurrency === 2)
            }
            mb="8px"
          >
            {t('Check Rank')}
            <CountdownCircle secondsRemaining={30} isUpdating={false} />
          </Button>
        )}
        <Button onClick={continueToPaymentCreditStage} external style={{ width: '100%' }} variant="secondary" mb="8px">
          {t('Get Payment Credits')}
        </Button>
        <Button onClick={continueToCashbackStage} external style={{ width: '100%' }} variant="secondary" mb="8px">
          {t('Explore Cashback Options')}
        </Button>
        <Button onClick={continueToIdentityLimitStage} external style={{ width: '100%' }} variant="secondary" mb="8px">
          {t('Reinitialize Identity Limits')}
        </Button>
        <Button onClick={continueToAddressLimitStage} external style={{ width: '100%' }} variant="secondary" mb="8px">
          {t('Reinitialize Address Limits')}
        </Button>
      </Flex>
    </>
  )
}
export default ReviewStage
