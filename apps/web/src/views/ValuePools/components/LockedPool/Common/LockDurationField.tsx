import styled from 'styled-components'
import _toNumber from 'lodash/toNumber'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Flex, Button, Input, Box } from '@pancakeswap/uikit'
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

  return (
    <>
      <Box mb="16px">
        <StyledInput
          value={identityTokenId}
          pattern="^[0-9]+$"
          inputMode="numeric"
          placeholder={t('input identity token id')}
          onChange={(e) => setIdentityTokenId(e?.target?.value)}
        />
      </Box>
      <Box mb="16px">
        <Flex mb="8px">
          <Text fontSize="12px" color="secondary" bold mr="2px" textTransform="uppercase">
            {t('Add')}
          </Text>
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('duration')}
          </Text>
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
