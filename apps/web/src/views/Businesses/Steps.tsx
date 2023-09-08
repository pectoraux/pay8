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
  NextLinkFromReactRouter as RouterLink,
  Step,
  Stepper,
  Text,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'

import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'

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

const Steps: React.FC<any> = ({ title }) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const stepsValidationStatus = [true, true, true]

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
              {t('Create a Channel')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t(
                'Select the Make a Channel option in the drop down menu at the top right of the page and create your channel.',
              )}
            </Text>
            {/* {renderAccountStatus()} */}
          </CardBody>
        )
      case 1:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Create a business gauge')}
            </Heading>
            <Box>
              <Text mb="4px" color="textSubtle" small>
                {t(
                  'Create your gauge in the business voter. Each sale you make in both the CanCan and eCollectible marketplaces is counted as vote for your business gauge.',
                )}
              </Text>
            </Box>
          </CardBody>
        )
      case 2:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Withdraw rewards')}
            </Heading>
            <Box>
              <Text mb="4px" color="textSubtle" small>
                {t('You get assigned rewards each week based on the amount of votes collected.')}
              </Text>
            </Box>
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
