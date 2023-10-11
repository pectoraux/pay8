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

  const TooltipComponent = () => <Text>{t('This sets the address of protocol owner.')}</Text>
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "Identity tokens are used to confirm requirements on users' identities. If you do not have any requirements, you can just input 0. If you do, make sure you get an identity token id from the user, that is delivered by an auditor approved by your business and input it in this field.",
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Options are discount/penalty packages that you can maintain for your World contract. Use this parameter to pick a specific option by its index. If you have no option setup for now, you can just input 0.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This sets the amount the protocol owner will be paying (periodically for periodic protocols and a one time payment for non periodic protocols) to your World contract.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'This sets the duration in minutes of each cycle of payment from the protocol owner to your World contract. If the protocol is non periodic, just input 0',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This sets the beginning date of the first payment cycle for this protocol. The World contract starts the cycle only after this date passes.',
      )}
    </Text>
  )
  const TooltipComponent7 = () => <Text>{t('This sets a rating value for the protocol being created.')}</Text>
  const TooltipComponent8 = () => <Text>{t('Use this field to give some explanation for the rating above.')}</Text>
  const TooltipComponent9 = () => (
    <Text>{t('Use this field to attach a media to your protocol by inputing a link to that media.')}</Text>
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
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Account Owner')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
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
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Identity Token ID')}
          </Text>
          {tooltipVisible2 && tooltip2}
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
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Option ID')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="optionId"
          value={state.optionId}
          placeholder={t('input an option id')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Amount Receivable')}
          </Text>
          {tooltipVisible4 && tooltip4}
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
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Period Receivable')}
          </Text>
          {tooltipVisible5 && tooltip5}
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
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Start Date')}
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
            {t('Rating')}
          </Text>
          {tooltipVisible7 && tooltip7}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="rating"
          value={state.rating}
          placeholder={t('input your rating')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef8}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Description')}
          </Text>
          {tooltipVisible8 && tooltip8}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          type="text"
          scale="sm"
          name="description"
          value={state.description}
          placeholder={t('input rating description')}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef9}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Link to Attached Media')}
          </Text>
          {tooltipVisible9 && tooltip9}
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
              'This will create a new protocol or update parameters of an old one. Protocols are mechanisms through which you schedule periodic/non-periodic payments from the owner of a World NFT in exchange for you, maintaining their virtual Worlds. Some Worlds like the red pill Worlds need to be updated at least every 6 months to reflect the changes in the physical world otherwise the World NFTs of those Worlds might get burnt.',
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
