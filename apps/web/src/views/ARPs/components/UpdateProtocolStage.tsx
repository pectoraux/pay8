import { useEffect, useRef } from 'react'
import { Flex, Grid, Box, Text, Button, Input, ErrorIcon, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { DatePicker, DatePickerPortal } from 'views/Voting/components/DatePicker'
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
        "Identity tokens are used to confirm requirements on users' identity. If your ARP does not have any requirements, you can just input 0. If it does, make sure you get from the owner of the current account, an identity token id delivered by an auditor approved by your business and input its ID in this field.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'This sets the amount the account owner will be paying the ARP (periodically for periodic accounts and on a one-time payment for non-periodic accounts). For percentage based ARPs, this number is a percentage. For non percentage based ARPs, it is an absolute value.',
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'This sets the amount the ARP will be paying the account owner (periodically for periodic accounts and on a one-time payment for non-periodic accounts). For percentage based ARPs, this number is a percentage. For non percentage based ARPs, it is an absolute value.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This sets the duration in minutes of each cycle of payment from the account owner to the ARP. If the account owner does not pay the ARP, just input 0.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'This sets the duration in minutes of each cycle of payment from the ARP to the account owner. If the ARP does not pay the account owner, just input 0.',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This sets the start date of the payment cycle from the account owner to the ARP. You should set this value even in the case of non-periodic accounts.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'This sets the start date of the payment cycle from the ARP to the account owner. You should set this value even in the case of non-periodic accounts.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        'Input the position of a discount/penalty package you would like to use for this account. If this is not relevant to this account, just input 0',
      )}
    </Text>
  )
  const TooltipComponent9 = () => <Text>{t('Use this field to describe of the purpose of this account.')}</Text>
  const TooltipComponent10 = () => (
    <Text>{t('This sets a link to any media you would like to attach to this account.')}</Text>
  )
  const TooltipComponent11 = () => (
    <Text>
      {t(
        'This sets a lower bound on the balance of the bounty that this account owner needs to setup to be able to use the account.',
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
  const {
    targetRef: targetRef10,
    tooltip: tooltip10,
    tooltipVisible: tooltipVisible10,
  } = useTooltip(<TooltipComponent10 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef11,
    tooltip: tooltip11,
    tooltipVisible: tooltipVisible11,
  } = useTooltip(<TooltipComponent11 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      <GreyedOutContainer>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('Account Owner')}
        </Text>
        <Input
          type="text"
          scale="sm"
          name="owner"
          value={state.owner}
          placeholder={t('input account owner address')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Identity Token ID')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="identityTokenId"
          value={state.identityTokenId}
          placeholder={t('input an identity token id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Amount Receivable')} {state.percentages ? '(%)' : ''}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="amountReceivable"
          value={state.amountReceivable}
          placeholder={t('input an amount receivable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Amount Payable')} {state.percentages ? '(%)' : ''}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="amountPayable"
          value={state.amountPayable}
          placeholder={t('input an amount payable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Period Receivable (in minutes)')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="periodReceivable"
          value={state.periodReceivable}
          placeholder={t('input period receivable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Period Payable (in minutes)')}
          </Text>
          {tooltipVisible5 && tooltip5}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="periodPayable"
          value={state.periodPayable}
          placeholder={t('input period payable')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Start Receivable')}
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <DatePicker
          onChange={handleRawValueChange('startReceivable')}
          selected={state.startReceivable}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef7}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Start Payable')}
          </Text>
          {tooltipVisible7 && tooltip7}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <DatePicker
          onChange={handleRawValueChange('startPayable')}
          selected={state.startPayable}
          placeholderText="YYYY/MM/DD"
        />
        <DatePickerPortal />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef8}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Option ID')}
          </Text>
          {tooltipVisible8 && tooltip8}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="optionId"
          value={state.optionId}
          placeholder={t('input an option id for the protocol')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef9}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Description')}
          </Text>
          {tooltipVisible9 && tooltip9}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="description"
          value={state.description}
          placeholder={t('input account description')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef11}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Bounty Required')}
          </Text>
          {tooltipVisible11 && tooltip11}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="bountyRequired"
          value={state.bountyRequired}
          placeholder={t('input account bounty required')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef10}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Link to Attached Media')}
          </Text>
          {tooltipVisible10 && tooltip10}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="media"
          value={state.media}
          placeholder={t('input link to attached media')}
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
              "This will create a new account or update parameters of an old one. An account can only be created by the owner of the ARP but users will request for an account by filling an application form. You can add a link to your ramp's application form the UPADATE APPLICATION function available on the main menu.",
            )}
          </Text>
        </Box>
      </Grid>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Create or Update Account')}
        </Button>
      </Flex>
    </>
  )
}

export default SetPriceStage
