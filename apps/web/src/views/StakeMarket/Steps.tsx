import styled from 'styled-components'
import {
  Box,
  Button,
  Card,
  CardBody,
  CheckmarkIcon,
  Container,
  Flex,
  Heading,
  Link,
  NextLinkFromReactRouter as RouterLink,
  Step,
  Stepper,
  Text,
} from '@pancakeswap/uikit'
import { Address, useAccount } from 'wagmi'

import { useTranslation } from '@pancakeswap/localization'
import useTokenBalance from 'hooks/useTokenBalance'
import { useProfile } from 'state/profile/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'

interface TypeProps {
  ifoCurrencyAddress: Address
  hasClaimed: boolean
  isCommitted: boolean
  isLive?: boolean
}

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

const Steps: React.FC<any> = ({ title, onPresentCreateGauge }) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const stepsValidationStatus = [true, true, true, true]

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
              {t('Create a Stake')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t('You’ll need this for users to start applying to your stake.')}
            </Text>
            <Button as="a" href="#current-ifo" mt="16px" onClick={onPresentCreateGauge}>
              {t('Create a STAKE')}
            </Button>
            {/* {renderAccountStatus()} */}
          </CardBody>
        )
      case 1:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Select one or more applications')}
            </Heading>
            <Box>
              <Text mb="4px" color="textSubtle" small>
                {t(
                  'Review the terms of each application and select one or multiple candidates that you are willing to work with.',
                )}
              </Text>
            </Box>
          </CardBody>
        )
      case 2:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Update agreements')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                'When you are done working with your stake mate, you can update the state of your stake to either agreement or disagreement.',
              )}{' '}
              <br />
            </Text>
          </CardBody>
        )
      case 3:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Unlock Stake')}
            </Heading>
            <Text color="textSubtle" small>
              {t('When your stake is at the end of its lifecycle, you can process all due payments.')}
            </Text>
          </CardBody>
        )
      default:
        return null
    }
  }

  return (
    <Wrapper>
      <Heading id="how-to" as="h2" scale="xl" color="secondary" mb="24px" textAlign="center">
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
