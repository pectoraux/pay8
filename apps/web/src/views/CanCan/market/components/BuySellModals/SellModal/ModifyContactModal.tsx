import { Flex, Box, Text, Button, Input, useTooltip, HelpIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Filters from 'views/ChannelCreation/Filters'
import { GreyedOutContainer } from './styles'
import { Divider } from '../shared/styles'

interface RemoveStageProps {
  collection: any
  continueToNextStage: () => void
}

const ModifyCollectionModal: React.FC<any> = ({
  state,
  nftFilters,
  setNftFilters,
  collection,
  handleChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const TooltipComponent = () => <Text>{t('This updates the name of your channel.')}</Text>
  const TooltipComponent2 = () => <Text>{t('This updates the description of your channel.')}</Text>
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'Use this field to add contacts to your channel. If for instance you want to add both your Paychat account and telephone, you would input in this field: paychat, telephone.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This field works with the previous one to set your contact. If for instance you want to add both your Paychat account and telephone, you would input in the field above: paychat, telephone and in the current field, you would input the actual contacts such as: ali@gmail.com,+250555666897.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        'This sets a link to your small banner which is the one that appears on the CanCan or eCollectibles main page. The recommended size of this image is 1500x1500 pixels',
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        'This sets a link to your large banner which is the one that appears on the main page of your channel. The recommended size of this image is 1500x1500 pixels',
      )}
    </Text>
  )
  const TooltipComponent7 = () => (
    <Text>{t('This sets a link to your channel avatar. The recommended size of this image is 700x700 pixels')}</Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        'This sets the geotag for your channel so customers can find you easily. You can specify countries and cities you operate in and if you operate everywhere, just pick the option All. You can also set tags centric to business.',
      )}
    </Text>
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef2,
    tooltip: tooltip2,
    tooltipVisible: tooltipVisible2,
  } = useTooltip(<TooltipComponent2 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef3,
    tooltip: tooltip3,
    tooltipVisible: tooltipVisible3,
  } = useTooltip(<TooltipComponent3 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef4,
    tooltip: tooltip4,
    tooltipVisible: tooltipVisible4,
  } = useTooltip(<TooltipComponent4 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef5,
    tooltip: tooltip5,
    tooltipVisible: tooltipVisible5,
  } = useTooltip(<TooltipComponent5 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef6,
    tooltip: tooltip6,
    tooltipVisible: tooltipVisible6,
  } = useTooltip(<TooltipComponent6 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef7,
    tooltip: tooltip7,
    tooltipVisible: tooltipVisible7,
  } = useTooltip(<TooltipComponent7 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef8,
    tooltip: tooltip8,
    tooltipVisible: tooltipVisible8,
  } = useTooltip(<TooltipComponent8 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      <Box p="16px" maxWidth="360px">
        <Text fontSize="24px" bold>
          {t('Modify Channel Info')}
        </Text>
        <GreyedOutContainer>
          <Flex ref={targetRef}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Name')}
            </Text>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="name"
            value={state.name}
            placeholder={t('input channel name')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef2}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Channel Description')}
            </Text>
            {tooltipVisible2 && tooltip2}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="description"
            value={state.description}
            placeholder={t('input channel description')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef3}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Contact Channels')}
            </Text>
            {tooltipVisible3 && tooltip3}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="contactChannels"
            value={state.contactChannels}
            placeholder={t('input contact channels')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef4}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Contacts')}
            </Text>
            {tooltipVisible4 && tooltip4}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="contacts"
            placeholder={t('input contacts')}
            value={state.contacts}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef5}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Small Banner')}
            </Text>
            {tooltipVisible5 && tooltip5}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="bannerSmall"
            value={state.bannerSmall}
            placeholder={t('small banner(1500x500)')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef6}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Large Banner')}
            </Text>
            {tooltipVisible6 && tooltip6}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="bannerLarge"
            value={state.bannerLarge}
            placeholder={t('large banner(1500x500)')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <GreyedOutContainer>
          <Flex ref={targetRef7}>
            <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
              {t('Avatar')}
            </Text>
            {tooltipVisible7 && tooltip7}
            <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
          </Flex>
          <Input
            type="text"
            scale="sm"
            name="avatar"
            value={state.avatar}
            placeholder={t('avatar(700x700)')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
        <Flex ref={targetRef8}>
          <Filters collection={collection} nftFilters={nftFilters} setNftFilters={setNftFilters} />
          {tooltipVisible8 && tooltip8}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <GreyedOutContainer style={{ paddingTop: '18px' }}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Not satisfied with above tags ? Add a custom tag')}
          </Text>
          <Input
            type="text"
            scale="sm"
            name="customTags"
            value={state.customTags}
            placeholder={t('input a custom tag')}
            onChange={handleChange}
          />
        </GreyedOutContainer>
      </Box>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default ModifyCollectionModal
