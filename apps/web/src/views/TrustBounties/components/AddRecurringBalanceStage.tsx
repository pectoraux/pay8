import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyedOutContainer, Divider } from './styles'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { getMarketTradesAddress, getNftMarketTradesAddress, getPaywallMarketTradesAddress } from 'utils/addressHelpers'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ state, handleChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent2 = () => (
    <Text>
      {t(
        "This is the address of the contract that holds the recurring balance of this bounty. Input the market trades contract with a recurring balance for the channel of this bounty to claim that balance to the bounties' contract.",
      )}
    </Text>
  )
  const {
    targetRef: targetRef2,
    tooltip: tooltip2,
    tooltipVisible: tooltipVisible2,
  } = useTooltip(<TooltipComponent2 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Bounty ID')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="bountyId"
          value={state.bountyId}
          placeholder={t('input bounty id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Bounty Owner')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="bountyOwner"
          value={state.bountyOwner}
          placeholder={t('input bounty owner address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Source Address')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="sourceAddress"
          value={state.sourceAddress}
          placeholder={t('input bounty source')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This is only relevant in the context of recurring bounties and will transfer funds from the marketplace into the current bounty. The funds transferred are fees taken from sales in the marketplace made by the owner of the bounty.',
            )}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Item Market Trades Contract Address')}
          </Text>
          <CopyAddress title={truncateHash(getMarketTradesAddress(), 15, 15)} account={getMarketTradesAddress()} />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('NFT Market Trades Contract Address')}
          </Text>
          <CopyAddress
            title={truncateHash(getNftMarketTradesAddress(), 15, 15)}
            account={getNftMarketTradesAddress()}
          />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Paywall Market Trades Contract Address')}
          </Text>
          <CopyAddress
            title={truncateHash(getPaywallMarketTradesAddress(), 15, 15)}
            account={getPaywallMarketTradesAddress()}
          />
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" variant="success" onClick={continueToNextStage}>
          {t('Add')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
