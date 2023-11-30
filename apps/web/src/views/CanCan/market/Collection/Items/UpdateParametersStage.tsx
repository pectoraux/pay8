import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Input,
  ErrorIcon,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer, Divider } from './styles'

interface SetPriceStageProps {
  state: any
  handleChange?: (any) => void
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
        "This sets a lower bound on the balance of account owners' bounties. If you do not require account owners to have a bounty in place, just input 0. If for instance this value is 10%, the bounty balance of the account owner is 1000 and the time lock period is 1 month, then the account owner will only be able to withdraw 10% * 1000 = 100 tokens every month",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>{t("To update your ARP's channel, input its ID right here otherwise just input 0.")}</Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        "This sets a buffer time after which a user is considered unsubscribed. If you set your buffer time to 10 minutes for instance and a user's subscription ends at 10:30, that user will still have access to your paywall's content until 10:40.",
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This sets an upper bound on the number of notes you want to let each account owner mint. How do notes work? A note that unlocks a payment of 10 tokens in 2 weeks from now, can be minted and sold today for 8 tokens for instance. A note is basically like an IOU that gives its owner the right to claim a certain amount of tokens from an ARP contract in the future. Account owners can mint notes on accounts created for them which they can sell at a slightly lesser price than the payment the note will be able to unlock in the future. That way they get to access their future payments early and the party that buys the note gets to earn some interest from the note when it becomes due. Account owners cannot mint more notes than the amount set here.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'Use this to require all admins of the ARP to have a bounty attached. This sets a lower bound on the balance attached to that bounty as a percentage of total withdrawal within the timelock period. If for instance this value is 10%, the bounty balance of the admin is 1000 and the time lock period is 1 month, then the admin will only be able to withdraw 10% * 1000 = 100 tokens every month',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This sets a timelock between the time an admin request funds withdrawal from the ARP and the time the funds are actually transferred. This is a security mechanism you can use to reassure your users or partners.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This can be used to either pause the paywall or open it up for subscriptions. Whenever a paywall is paused, users are no longer able to create subscription accounts on it;  however users that already have an account can use it to renew their subscriptions as many times as the maximum supply on your paywall allows.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        'This sets whether your paywall is a subscription or not. A subscription paywall does not charge users for every payment cycle. In the case of rent payments for instance, you should set this parameter to No so it keeps counting users rent every payment cycle.',
      )}
    </Text>
  )
  const TooltipComponent9 = () => (
    <Text>{t('This sets whether you want to require account owners to attach their profiles to their accounts.')}</Text>
  )
  const TooltipComponent10 = () => (
    <Text>{t('This sets a price per second for paywalls willing to partner with yours.')}</Text>
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
  const {
    targetRef: targetRef10,
    tooltip: tooltip10,
    tooltipVisible: tooltipVisible10,
  } = useTooltip(<TooltipComponent10 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Buffer Time (in minutes)')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="bufferTime"
          value={state.bufferTime}
          placeholder={t('input buffer time')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef10}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Partnership Price Per Second')}
          </Text>
          {tooltipVisible10 && tooltip10}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input price per second of partnership')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef8} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Is Subscription?')}
            </Text>
            {tooltipVisible8 && tooltip8}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.subscription ? 1 : 0}
            onItemClick={handleRawValueChange('subscription')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef9} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Profile Required')}
            </Text>
            {tooltipVisible9 && tooltip9}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.profileRequired ? 1 : 0}
            onItemClick={handleRawValueChange('profileRequired')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <StyledItemRow>
          <Flex ref={targetRef7} paddingRight="50px">
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
              {t('Pause Paywall')}
            </Text>
            {tooltipVisible7 && tooltip7}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.pause ? 1 : 0}
            onItemClick={handleRawValueChange('pause')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Text small color="textSubtle">
            {t(
              'This will update parameters of your paywall. Please read the description of each parameter for more information',
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update Parameters')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
