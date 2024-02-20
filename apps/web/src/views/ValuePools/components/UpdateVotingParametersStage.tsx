import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  ButtonMenuItem,
  ButtonMenu,
  Text,
  Button,
  Input,
  ErrorIcon,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  nftToSell?: any
  variant?: 'set' | 'adjust'
  currency?: any
  currentPrice?: string
  lowestPrice?: number
  state: any
  account?: any
  handleChange?: (any) => void
  handleChoiceChange?: (any) => void
  handleRawValueChange?: any
  continueToNextStage?: () => void
}

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const SetPriceStage: React.FC<any> = ({ state, handleChange, handleRawValueChange, continueToNextStage }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const TooltipComponent = () => (
    <Text>
      {t(
        'This sets the duration of each voting window in minutes. If you set 7 days (7 * 24 * 6 minutes) for instance, each voting session will last 7 days before it can be closed.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'This sets the minimum percentage of the total votes a winning proposal needs to get to be considered valid. If you set it to 50% for instance and a proposal made by a Valuepool member gets 50 positive votes and 50 negative votes, it is considered a successful proposal since it managed to get the minimum vote percentage. If that percentage was 51%, then the proposal would be considered unsuccessful.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        "This sets the channel ID of the Valuepool. This is useful in case you want to only allow certain users to vote, it will use the same requirements as those set for users allowed to register to the Valuepool's channel. Basically if you want to prevent users below a certain age to vote, set that requirements on your channel for user memberships then update the Valuepool's channel to be your channel and that's it, only users above a certain age would be able to vote in your Valuepool.",
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'This sets a lower bound on the total amount of tokens, users need to have locked in a Valuepool to be elligible to submit proposals on that Valuepool.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This sets a lower bound in minutes, on the lock duration of the bounties of ARPs where this Valuepool is allowed to send funds. Valuepools can decide through votes to   send funds to operators of various ARPs in order for them to put the funds to work through investments, laons, etc. This parameter can be used to make sure that all ARPs that this Valuepool sends money to have a collateral in place in the trustbounties contract and that the collateral is locked there for a certain minimum time.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This parameter is relevant in the same context as the previous one and sets a lower bound on the balance of the bounty that the ARPs this Valuepool sends funds to, must have.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        "This sets the voting scheme to use for this Valuepool. If you select Percentile, then the weight of each vote will be the percentile of the voter in the Valuepool (that value is available for each user on his/her Valuepool NFT); if you select Voting Power then each vote weight will be the user's voting power in the Valuepool (also available of the NFT) and lastly if you select unique, then each user's vote counts as 1. The last option will require each voter to have a unique profile which is the only way it can make sure each user only counts for one vote.",
      )}
    </Text>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
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

  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Valuepool Address')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="vava"
          value={state.vava}
          placeholder={t('input valuepool address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Voting Window (in minutes)')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="period"
          value={state.period}
          placeholder={t('input your voting window')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Minimum Valid Vote Percentage')}(%)
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="minDifference"
          value={state.minDifference}
          placeholder={t('input minimum valid vote share')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Collection ID')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="userTokenId"
          value={state.userTokenId}
          placeholder={t('input collection id of valuepool')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Minimum Lock Value')}
          </Text>
          {tooltipVisible5 && tooltip5}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="minimumLockValue"
          value={state.minimumLockValue}
          placeholder={t('input minimum lock value')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Minimum Period (in minutes)')}
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="minPeriod"
          value={state.minPeriod}
          placeholder={t('input minimum period')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef7}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Minimum Bounty Required')}(%)
          </Text>
          {tooltipVisible7 && tooltip7}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="minBountyRequired"
          value={state.minBountyRequired}
          placeholder={t('input minimum bounty required')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef8} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Voting Option')}
            </Text>
            {tooltipVisible8 && tooltip8}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.votingPower}
            onItemClick={handleRawValueChange('votingPower')}
          >
            <ButtonMenuItem>{t('Percentile')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Voting Power')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Unique')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Divider />
          <Text small color="textSubtle">
            {t(
              'This update the voting parameters of the specified valuepool. Please read the documentation for more information on each parameter',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
