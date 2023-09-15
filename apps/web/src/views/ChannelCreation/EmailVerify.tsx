import { useState } from 'react'
import { Card, CardBody, Heading, Text, LinkExternal, Checkbox, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import NextStepButton from './NextStepButton'
import useProfileCreation from './contexts/hook'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetSharedEmail } from 'state/profile/hooks'
import { noop } from 'lodash'

const EmailVerify: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { actions } = useProfileCreation()
  const { sharedEmail } = useGetSharedEmail(account)

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step 1')}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Verify Email Address')}
      </Heading>
      <Text as="p">{t('The email address is neccessary to build your social graph.')}</Text>
      <Text as="p">{t('It allows people you follow to install you on their new social platform.')}</Text>
      <Card mb="24px">
        <CardBody>
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <LinkExternal mb="20px" ml="40px" href="/ssi/proposal/createAutomaticData">
              {t('Go to the SSI page to verify your email')}
            </LinkExternal>
            <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
              <Flex alignItems="center">
                <div style={{ flex: 'none' }}>
                  <Checkbox id="checkbox" scale="sm" checked={sharedEmail} onChange={noop} />
                </div>
                <Text ml="8px">{t('I have successfully verified my email address')}</Text>
              </Flex>
            </label>
          </Flex>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!sharedEmail}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default EmailVerify
