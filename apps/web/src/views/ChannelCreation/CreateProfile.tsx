import { Card, CardBody, Heading, Text, LinkExternal, Checkbox, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetProfileId, useGetSharedEmail, useProfileForAddress } from 'state/profile/hooks'
import { noop } from 'lodash'
import { useProfileFromSSI } from 'state/ssi/hooks'

import NextStepButton from './NextStepButton'
import useProfileCreation from './contexts/hook'

const CreateProfile: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { actions } = useProfileCreation()
  const { profileId } = useGetProfileId(account)
  console.log('profileprofileId==================>', profileId)
  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step 2')}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Create Profile')}
      </Heading>
      <Text as="p">{t('This is a necessary step before you can start using the SSI system.')}</Text>
      <Text as="p">{t('You need the SSI system to create a channel.')}</Text>
      <Card mb="24px">
        <CardBody>
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <LinkExternal mb="20px" ml="40px" href={`/profile/${account}`}>
              {t('Go to the profle page to create your profile')}
            </LinkExternal>
            <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
              <Flex alignItems="center">
                <div style={{ flex: 'none' }}>
                  <Checkbox id="checkbox" scale="sm" checked={!!Number(profileId)} onChange={noop} />
                </div>
                <Text ml="8px">{t('I have successfully created my profile')}</Text>
              </Flex>
            </label>
          </Flex>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!Number(profileId)}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default CreateProfile
