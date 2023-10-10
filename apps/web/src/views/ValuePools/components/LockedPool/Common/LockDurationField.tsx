import styled from 'styled-components'
import _toNumber from 'lodash/toNumber'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Flex, Button, Input, Box, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { secondsToWeeks, weeksToSeconds } from '../../utils/formatSecondsToWeeks'

const DURATIONS = [1, 5, 10, 25, 52, 52 * 4]

const StyledInput = styled(Input)`
  text-align: right;
  margin-right: 8px;
`

const LockDurationField: React.FC<any> = ({
  identityTokenId,
  setIdentityTokenId,
  duration,
  setDuration,
  isOverMax,
}) => {
  const { t } = useTranslation()

  const TooltipComponent = () => (
    <Text>
      {t(
        'Identity tokens are used to confirm requirements users need to fulfill to become Valuepool members. If your Valuepool does not have any requirements, you can just input 0. If it does, make sure you get an auditor approved by the Valuepool to deliver you an identity token and input its ID in this field.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        'Pick the duration of the lock period. Once locked, you will not be able to withdraw the totality of the token before the end of the lock period. Please refer to your Valuepool recommendations for its recommended lock period. Some Valuepools that are riskpool do not enable you to withdraw your tokens ever and function more like insurances. If the Valuepool enables you to withdraw you locked tokens, the amount you can withdraw at any moment t1 is computed as this with t0 being the end of lock time: (locked_amount * t1 * 100 / t0)',
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

  return (
    <>
      <Box mb="16px">
        <Flex ref={targetRef}>
          <StyledInput
            value={identityTokenId}
            pattern="^[0-9]+$"
            inputMode="numeric"
            placeholder={t('input identity token id')}
            onChange={(e) => setIdentityTokenId(e?.target?.value)}
          />
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
      </Box>
      <Box mb="16px">
        <Flex mb="8px">
          <Flex ref={targetRef2}>
            <Text fontSize="12px" color="secondary" bold mr="2px" textTransform="uppercase">
              {t('Add')}
            </Text>
            <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
              {t('duration')}
            </Text>
            {tooltipVisible2 && tooltip2}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
        </Flex>
        <Flex flexWrap="wrap">
          {DURATIONS.map((week) => (
            <Button
              key={week}
              onClick={() => setDuration(weeksToSeconds(week))}
              mt="4px"
              mr={['2px', '2px', '4px', '4px', '4px']}
              scale="sm"
              variant={weeksToSeconds(week) === duration ? 'subtle' : 'tertiary'}
            >
              {week}W
            </Button>
          ))}
        </Flex>
      </Box>
      <Flex justifyContent="center" alignItems="center" mb="8px">
        <StyledInput
          value={secondsToWeeks(duration)}
          autoComplete="off"
          pattern="^[0-9]+$"
          inputMode="numeric"
          onChange={(e) => {
            const weeks = _toNumber(e?.target?.value)

            // Prevent large number input which cause NaN
            // Why 530, just want to avoid user get laggy experience
            // For example, allow user put 444 which they still get warning no more than 52
            if (e.currentTarget.validity.valid && weeks < 530) {
              setDuration(weeksToSeconds(_toNumber(e?.target?.value)))
            }
          }}
        />
        <Text>{t('Week')}</Text>
      </Flex>
      {isOverMax && (
        <Text fontSize="12px" textAlign="right" color="failure">
          {t('Total lock duration exceeds 4 years')}
        </Text>
      )}
    </>
  )
}

export default LockDurationField
