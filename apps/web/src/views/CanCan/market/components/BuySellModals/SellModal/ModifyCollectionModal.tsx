import { Flex, Box, Text, Button, Input, ButtonMenu, ButtonMenuItem, useTooltip, HelpIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { GreyedOutContainer } from './styles'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  state: any
  handleChange: (any) => void
  handleRawValueChange?: any
  continueToNextStage: () => void
}

const ModifyCollectionModal: React.FC<any> = ({ state, handleChange, handleRawValueChange, continueToNextStage }) => {
  const { t } = useTranslation()

  const TooltipComponent = () => <Text>{t('This sets the wallet address of the owner of this channel.')}</Text>
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "The referrer fees is a great way to incentivise referrers to refer users to your product. Use this field to specify the percentage of the item's price you are willing to share with referrers.",
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'In case your product has some ESG badge or some other one delivered by an auditor, you can attach that badge to your product by inputting its id right here. This adds to the credibility of your product in the marketplace, you can use it to prove that you are a trustworthy merchant, that your luxury items are authentic, etc.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        "Reruccring bounties are bounties that see their balances appreciate every time the product they are attached to is purchased. Each time a purchase occurs, the recurring percentage of the item's price which is the value specified in this field, is taken and added to the balance of the attached bounty. This way, the more sales you do, the higher your bounty and the more you stand to lose if you commit any fraud. Recurring bounties are a great way to create trust with your customers.",
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>{t('This sets the minimum balance of the bounty each channel must have to partner with your channel.')}</Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t('This sets the minimum balance of the bounty each channel must have to register with your channel.')}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        "This specifies whether a channel needs permission to register with this channel or not. In case you pick Yes, their registration request will show up in the requests section of your channel's main page waiting for your approval. The requesting channel will only become a member if you approve their requests. In case You pick No below, then users will become members as soon as they fill and validate the registration form.",
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        "This specifies whether a channel needs permission to partner with this channel or not. In case you pick Yes, their partnership request will show up in the requests section of your channel's main page waiting for your approval. The requesting channel will only become a partner if you approve their requests. In case You pick No below, then users will become partners as soon as they fill and validate the partnership form.",
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

  return (
    <>
      <Box p="16px">
        <Text fontSize="24px" bold>
          {t('Modify Collection')}
        </Text>
        <GreyedOutContainer>
          <Flex ref={targetRef}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Owner')}
            </Text>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="collection"
            value={state.collection}
            placeholder={t('input channel owner')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef2}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Referrer Fee')}
            </Text>
            {tooltipVisible2 && tooltip2}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="number"
            scale="sm"
            name="referrerFee"
            value={state.referrerFee}
            placeholder={t('percent fee to reward referrers')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef3}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Badge ID')}
            </Text>
            {tooltipVisible3 && tooltip3}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="badgeId"
            value={state.badgeId}
            placeholder={t('input channel badge id')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef4}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Recurring Bounty (%)')}
            </Text>
            {tooltipVisible4 && tooltip4}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="recurringBounty"
            value={state.recurringBounty}
            placeholder={t('input recurring bounty percentage')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef5}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Partner Minimum Bounty')}
            </Text>
            {tooltipVisible5 && tooltip5}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="minBounty"
            value={state.minBounty}
            placeholder={t('partner minimum bounty')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef6}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('User Minimum Bounty')}
            </Text>
            {tooltipVisible6 && tooltip6}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="userMinBounty"
            value={state.userMinBounty}
            placeholder={t('user minimum bounty')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer style={{ paddingTop: '50px' }}>
          <StyledItemRow>
            <Flex ref={targetRef7} paddingRight="50px">
              <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" bold>
                {t('User Permission Required')}
              </Text>
              {tooltipVisible7 && tooltip7}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <ButtonMenu
              scale="xs"
              variant="subtle"
              activeIndex={state.requestUserRegistration}
              onItemClick={handleRawValueChange('requestUserRegistration')}
            >
              <ButtonMenuItem>{t('No')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
            </ButtonMenu>
          </StyledItemRow>
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef8}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" paddingTop="3px" paddingRight="50px" bold>
              {t('Partner Permission Required')}
            </Text>
            {tooltipVisible8 && tooltip8}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.requestPartnerRegistration}
            onItemClick={handleRawValueChange('requestPartnerRegistration')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </GreyedOutContainer>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default ModifyCollectionModal
