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
  LinkExternal,
  NextLinkFromReactRouter as RouterLink,
  Step,
  Stepper,
  Text,
} from '@pancakeswap/uikit'
import { Address, useAccount } from 'wagmi'

import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'

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

const IfoSteps: React.FC<any> = ({ title, onPresentCreateGauge }) => {
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
              {t('Create a PayCard account')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t(
                'First create your paycard by picking a unique username and a password. Both your username and password should be secret unless you are receiving money in which case you should communicate the username to the sender.',
              )}
            </Text>
            <Button as="a" href="#current-ifo" mt="16px" onClick={onPresentCreateGauge}>
              {t('Create Paycard')}
            </Button>
          </CardBody>
        )
      case 1:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Add Balance')}
            </Heading>
            <Box>
              <Text mb="4px" color="textSubtle" small>
                {t(
                  'Once you have your PayCard, you can start adding funds to it. Enter your username and password in the fields next to the FIND YOUR CARD text above, to only display your PayCard.',
                )}
              </Text>
              <Text mb="4px" color="textSubtle" small>
                {t(
                  'Click the -Details- button to open up its panel, select the currency you would like to add, select the Add Balance With Debit Card option. Input the amount of tokens to add, validate and confirm.',
                )}
              </Text>
              <Text mb="4px" color="textSubtle" small>
                {t(
                  'You can also add tokens using your crypto wallet by picking the appropriate option from the control panel menu of your paycard.',
                )}
              </Text>
            </Box>
          </CardBody>
        )
      case 2:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Update Password')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                "Once you have created your PayCard, a good practice is to update your password once every three months. To do so, pick the right option from your paycard's control panel menu, fill in the form and validate.",
              )}
            </Text>
            <Text color="textSubtle" small>
              {t(
                'You can recover your account in the event of a loss of password provided you had previously attached a unique profile to your account. You can find the option to do that from the control panel menu of your paycard.',
              )}
            </Text>
            <Text color="textSubtle" small>
              {t(
                'If you do not want to be linked to your paycard, you should not do so but that will also mean that if you lose your password, you lose access to your paycard and all the funds it holds.',
              )}
            </Text>
          </CardBody>
        )
      case 3:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Make Purchases')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                'Once you have charged and setup your PayCard as you please,  you can start using it for purchases in the CanCan or eCollectibles marketplace or even in real life. All you need is your username & password to access funds from your card. Just have the merchant connect his/her wallet, find your PayCard, open its panel, select Control Panel, either select the Transfer Balance or Execute Purchase option, fill in the form, validate and confirm.',
              )}{' '}
              <br />
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

export default IfoSteps
