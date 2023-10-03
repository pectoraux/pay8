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
              {t('Attach a vaFSTT & Create a PayCard')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t('First attach a Leviathan token and then create your PayCard!')}
            </Text>
            <LinkExternal
              href="/valuepools/0xd994a268b2288e997320f5a0ccd94411b75e2dd7"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {t('Mint your Leviathan token')}
            </LinkExternal>
            <Button as="a" href="#current-ifo" mt="16px" onClick={onPresentCreateGauge}>
              {t('Attach')}
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
                  'Once you have your PayCard, you can start adding funds to it. Pick the -Mine only- option to show all your PayCards, find the right one, click -Details- to open up its panel, select the currency you would like to add, select Control Panel and pick the Add Balance option. Input the amount of tokens to add, validate and confirm.',
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
                "Once you have created your PayCard, you will need to attach a password to it. Think of this like a Visa debit card for which you need to pick a pin code. Once that's setup and you've add a balance to it, you can just input your password into the Transfer Balance or Execute Purchase form from the card's Control Panel menu to access funds from your card. You will not even need to connect your wallet to the blockchain.",
              )}{' '}
              <br />
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
                'Once you have charged your PayCard and updated its password, you can start using it for purchases in the CanCan or eCollectibles marketplace or even in real life. All you need is your password and you would not need to connect your own wallet to the blockchain to access funds from your card. Just have the merchant connect his/her wallet, find your PayCard, open its panel, select Control Panel, either select the Transfer Balance or Execute Purchase option, fill in the form, validate and confirm.',
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
