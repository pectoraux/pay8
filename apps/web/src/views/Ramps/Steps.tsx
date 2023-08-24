import styled from 'styled-components'
import every from 'lodash/every'
import {
  Balance,
  Box,
  Button,
  Card,
  CardBody,
  CheckmarkIcon,
  Container,
  Flex,
  FlexGap,
  Heading,
  Link,
  LogoRoundIcon,
  NextLinkFromReactRouter as RouterLink,
  Skeleton,
  Step,
  StepStatus,
  Stepper,
  Text,
  TooltipText,
  useTooltip,
} from '@pancakeswap/uikit'
import { Address, useAccount } from 'wagmi'

import { useTranslation } from '@pancakeswap/localization'
import useTokenBalance from 'hooks/useTokenBalance'
import { useProfile } from 'state/profile/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useIfoCredit, useIfoCeiling } from 'state/pools/hooks'
import { getICakeWeekDisplay } from 'views/Pools/helpers'

interface TypeProps {
  ifoCurrencyAddress: Address
  hasClaimed: boolean
  isCommitted: boolean
  isLive?: boolean
}

const SmallStakePoolCard = styled(Box)`
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const Wrapper = styled(Container)`
  margin-left: -16px;
  margin-right: -16px;
  padding-top: 48px;
  padding-bottom: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -24px;
    margin-right: -24px;
  }
`

const InlineLink = styled(Link)`
  display: inline;
`

const Steps: React.FC<any> = ({ title, onPresentCreateGauge }) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const stepsValidationStatus = [true, true, true, true, true]

  const renderCardBody = (step: number) => {
    const isStepValid = stepsValidationStatus[step]

    const renderAccountStatus = () => {
      if (!account) {
        return <ConnectWalletButton />
      }

      if (isStepValid) {
        return (
          <Flex alignItems="center">
            <Text color="success" bold mr="8px">
              {t('Profile Active!')}
            </Text>
            <CheckmarkIcon color="success" />
          </Flex>
        )
      }

      return (
        <Button as={RouterLink} to={`/profile/${account.toLowerCase()}`}>
          {t('Activate your Profile')}
        </Button>
      )
    }

    switch (step) {
      case 0:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Deploy a new Ramp contract')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t(
                'This will serve as an interface between you and your customers and help you safely onramp/offramp them.',
              )}
            </Text>
            <Button as="a" onClick={onPresentCreateGauge} mt="16px">
              {t('Deploy RAMP')}
            </Button>
            {/* {renderAccountStatus()} */}
          </CardBody>
        )
      case 1:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Initialize your Ramp')}
            </Heading>
            <Box>
              <Text mb="4px" color="textSubtle" small>
                {t(
                  "Find your ramp by selecting the Mine Only filter. If you still can't find your ramp, reload the page. Click the Details arrow to expose the entire ramp, then in the Control Panel, pick the Update Ramp Info option. Fill in the form with your payment processor information. We currently only support Stripe",
                )}
              </Text>
            </Box>
          </CardBody>
        )
      case 2:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Update Fees')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                'Next step is to update your fees. Pick the Update Parameters option in the Control Panel and input your mint and burn fees.',
              )}{' '}
              <br />
            </Text>
          </CardBody>
        )
      case 3:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Create Bounties')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t(
                'Figure out the tokens you want to on/offramp and lock in a certain amount of the native token of your blockchain in a bounty. You can only mint 80% of the equivalent value of the locked native token in your on/offramp token!',
              )}
            </Text>
            <Text color="textSubtle" small mb="16px">
              {t(
                'Adding your verified profile to your ramp contract will unlock 100% of the locked native token value for minting in the on/offramp token',
              )}
            </Text>
            <InlineLink external href="/trustbounties">
              {t('Create a BOUNTY')}
            </InlineLink>
            {/* {renderAccountStatus()} */}
          </CardBody>
        )
      default:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Add On/OffRamp Tokens')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t(
                'You can now start adding on/offramp tokens and attach a different bounty to each. This will enable users to mint/burn tokens through your ramp!',
              )}
            </Text>
            <InlineLink external href="/trustbounties">
              {t('Please read the documentation for more information')}
            </InlineLink>
            {/* {renderAccountStatus()} */}
          </CardBody>
        )
    }
  }

  return (
    <Wrapper>
      <Heading id="ifo-how-to" as="h2" scale="xl" color="secondary" mb="24px" textAlign="center">
        {title}
      </Heading>
      <Stepper>
        {stepsValidationStatus.map((_, index) => (
          <Step
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            statusFirstPart="current"
            statusSecondPart="future"
          >
            <Card>{renderCardBody(index)}</Card>
          </Step>
        ))}
      </Stepper>
    </Wrapper>
  )
}

export default Steps
