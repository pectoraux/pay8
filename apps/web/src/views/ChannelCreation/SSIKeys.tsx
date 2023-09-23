import { Card, CardBody, Heading, Text, LinkExternal, Checkbox, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetSharedEmail } from 'state/profile/hooks'
import { noop } from 'lodash'
import { useProfileFromSSI } from 'state/ssi/hooks'

import NextStepButton from './NextStepButton'
import useProfileCreation from './contexts/hook'

const SSIKeys: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { actions } = useProfileCreation()
  const { profile } = useProfileFromSSI(account?.toLowerCase())

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step 3')}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Create SSI Keys')}
      </Heading>
      <Text as="p">{t('This is a necessary step before you can start using the SSI system.')}</Text>
      <Text as="p">{t('You need the SSI system to create a channel.')}</Text>
      <Card mb="24px">
        <CardBody>
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <LinkExternal mb="20px" ml="40px" href="/ssi/proposal/createKeys">
              {t('Go to the SSI page to create your keys')}
            </LinkExternal>
            <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
              <Flex alignItems="center">
                <div style={{ flex: 'none' }}>
                  <Checkbox id="checkbox" scale="sm" checked={!!profile?.publicKey} onChange={noop} />
                </div>
                <Text ml="8px">{t('I have successfully created my keys')}</Text>
              </Flex>
            </label>
          </Flex>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!profile?.publicKey}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default SSIKeys
