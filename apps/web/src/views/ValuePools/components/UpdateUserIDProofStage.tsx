import { useEffect, useRef } from 'react'
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  ButtonMenuItem,
  ButtonMenu,
  Input,
  ErrorIcon,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

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
        "This sets the minimum color a members' auditors must have for members to be able to make purchases  using this Valuepool.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This sets a required identity to check for on members allowed to make purchases using your Valuepool. If you want to require a minimum age for the member for instance, you can set this parameter to testify_age_gte and set the actual value in the field below.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        "This sets the actual value the previous parameter must verify. For instance is the previous parameter tests for age greater than or equals (testify_age_gte), this parameter can be 18 if you're willing to require members allowed to use the Valuepool for purchases to have an age greathan or equals to 18. Please check the documentation for more information on identity tokens.",
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This parameter makes sure only members with unique profiles are allowed to use the Valuepool to make purchases or withdraw funds from it.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        "This sets whether to only accept a member's identity token as valid if it delivered by an auditor who is a data keeper. Data keepers are auditors that keep the data that they create for users. This can be useful for compliance reasons for some types of businesses.",
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        "This sets whether to only trust members' auditors that you have inputted manually as trustworthy or to also trust those with the minimum color defined above. To manually input auditors as trustworthy, go to the main menu and select the option UPDATE TRUSTWORTHY AUDITORS",
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

  return (
    <>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Minimum Badge Color')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Flex alignSelf="center" justifyContent="center">
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.badgeColor}
            onItemClick={handleRawValueChange('badgeColor')}
          >
            <ButtonMenuItem>{t('Black')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Brown')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Silver')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Gold')}</ButtonMenuItem>
          </ButtonMenu>
        </Flex>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Value Name')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="valueName"
          value={state.valueName}
          placeholder={t('input value name')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Required Value')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="value"
          value={state.value}
          placeholder={t('input required value')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Only Unique Accounts')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Flex alignSelf="center" justifyContent="center">
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.uniqueAccounts}
            onItemClick={handleRawValueChange('uniqueAccounts')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </Flex>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Only Data Keepers')}
          </Text>
          {tooltipVisible5 && tooltip5}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Flex alignSelf="center" justifyContent="center">
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.dataKeeperOnly}
            onItemClick={handleRawValueChange('dataKeeperOnly')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </Flex>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Only Trustworthy Users')}
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Flex alignSelf="center" justifyContent="center">
          <ButtonMenu
            scale="xs"
            variant="subtle"
            activeIndex={state.OnlyTrustworthyMerchants}
            onItemClick={handleRawValueChange('OnlyTrustworthyMerchants')}
          >
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </Flex>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Box>
          <Divider />
          <Text small color="textSubtle">
            {t(
              'This helps you configure identity proof requirements for users. Please read the documentation for more information on each parameter',
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
