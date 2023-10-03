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
  useModal,
} from '@pancakeswap/uikit'
import { Address, useAccount } from 'wagmi'

import { useTranslation } from '@pancakeswap/localization'
import { useProfile } from 'state/profile/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CreateGaugeModal from './components/CreateGaugeModal'
import CopyAddress from './components/PoolsTable/ActionPanel/CopyAddress'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { getFutureCollateralsAddress } from 'utils/addressHelpers'

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

const IfoSteps: React.FC<any> = ({ title }) => {
  const { hasActiveProfile } = useProfile()
  const { t } = useTranslation()
  const stepsValidationStatus = [hasActiveProfile, true, true, true]
  const [openPresentControlPanel] = useModal(<CreateGaugeModal variant="mint" />)

  const renderCardBody = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Create an NFT Bounty')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t(
                "You’ll need this to mint the Future Collateral. Make sure you input the future collateral's address as the NFT address of your NFT bounty.",
              )}
            </Text>
            <Flex justifyContent="row">
              <Text color="textSubtle" small mr="16px">
                {t("Future Collateral's address: ")}
              </Text>
              <CopyAddress
                title={truncateHash(getFutureCollateralsAddress(), 15, 15)}
                account={getFutureCollateralsAddress()}
              />
            </Flex>
            <InlineLink external href="/trustbounties">
              {t('Create a BOUNTY')}
            </InlineLink>
          </CardBody>
        )
      case 1:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Create a stake')}
            </Heading>
            <Box>
              <Text mb="4px" color="textSubtle" small>
                {t(
                  'Create a stake in the stake market with the terms of the loan you want to make. You will receive applications from lenders after that.',
                )}
              </Text>
            </Box>
            <InlineLink external href="/stakemarket">
              {t('Create a STAKE')}
            </InlineLink>
          </CardBody>
        )
      case 2:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Pick a channel & Mint away!')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                'Read the Future Collateral section of the documentation to view the various estimation tables for all available channels, pick the best channel for your loan, get an auditor to add you to that channel and mint you a collateral to back a loan that he/she will be granting you. Congratulations, you now have borrowed money backed by a future collateral.',
              )}{' '}
              <br />
            </Text>
            <Button onClick={openPresentControlPanel}>{t('Mint')}</Button>
          </CardBody>
        )
      case 3:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Reimburse your loan!')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                'To continue to be elligible to mint future collaterals, you need to make sure you reimburse every single loan you make. Keep the due date in mind and reimburse before then.',
              )}
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
