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
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

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
              {t('Deploy a Will contract')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t('This will enable you to set up a will on the blockchain!')}
            </Text>
            <Button as="a" href="#current-ifo" mt="16px" onClick={onPresentCreateGauge}>
              {t('Deploy')}
            </Button>
            {/* {renderAccountStatus()} */}
          </CardBody>
        )
      case 1:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Add Tokens')}
            </Heading>
            <Box>
              <Text mb="4px" color="textSubtle" small>
                {t('Add as many tokens as you want, either fungible or non fungible, to your deployed contract.')}
              </Text>
            </Box>
          </CardBody>
        )
      case 2:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Add Heirs')}
            </Heading>
            <Text color="textSubtle" small>
              {t('Add your heirs with the percentage of each token they should inherit from you.')} <br />
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
