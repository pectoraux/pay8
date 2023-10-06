import {
  Flex,
  Grid,
  Text,
  Button,
  Input,
  ErrorIcon,
  LinkExternal,
  ButtonMenu,
  ButtonMenuItem,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Divider, RoundedImage } from '../shared/styles'
import { GreyedOutContainer } from './styles'

interface TransferStageProps {
  nftToSell?: any
  requiredIndentity: string
  handleChange: (any) => void
  handleRawValueChange?: any
  continueToNextStage: () => void
}

const IdentityRequirementStage: React.FC<any> = ({
  thumbnail,
  nftToSell,
  state,
  collectionId,
  handleChange,
  handleRawValueChange,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const TooltipComponent = () => (
    <Text>
      {t(
        "This sets the required identity to check for. If you are planning to only sell this item to males for instance, you can input the required identity as 'gender' here",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "This sets the value that the required identity should be. If you are planning to only sell this item to males for instance, you can input the required identity as 'testify_eq_male' here. The required identity do not have to follow this format though and entirely depend on the format used by the auditor that creates them, however it is advised that all auditors follow this format so identity tokens delivered by different auditors for the same information are compatible with each other.",
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>
      {t(
        'This sets the maximum amount of time a customer can purchase the current item. This can be useful for instance in a case of sneaker drop where you might want each customer to only be able to purchase one sneaker. In that case, you will set this parameter to 1.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This sets the minimum color of the auditors that you consider as valid auditors. Any time a user tries to pass the identity check with an identity token delivered by any auditor with a lower color, the check will fail. There are 4 colors for auditors (Black, Brown, Silver, Gold from lowest rank to highest). The more votes an auditor receives from users, the highest color, the auditor gets; an auditor within the top 75th percentile and above of votes has color Gold, one within the 50th percentile and above has color Silver, one within the 25th percentile and above has color Brown and one below the 25th percentile of votes has color Black.',
      )}
    </Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t(
        "You can add trustworthy auditors through the 'Update auditors' option from the Channel Settings menu. These will be specific auditors that you trust. This parameters specifies whether to consider as valid, identity tokens not only delivered by those auditors but also the ones that have at least the minimum color specified above. If you only want those you personally added to be trusted, pick Yes but if you also trust all auditors with the right color, pick No.",
      )}
    </Text>
  )
  const TooltipComponent6 = () => (
    <Text>
      {t(
        "Some auditors keep users data for future reference purposes, those auditors are called data keepers. For instance, you might want data keepers that store your users' identities so you can have them reveal it to you in case some users commit fraud. Pick no if you do not need the user's information to be kept by their auditors for compliance reasons.",
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

  return (
    <>
      <Text fontSize="24px" bold px="16px" pt="16px">
        {t('Identity Requirements')}
      </Text>
      <Flex p="16px">
        <RoundedImage src={thumbnail} height={68} width={68} mr="8px" />
        <Grid flex="1" gridTemplateColumns="1fr 1fr" alignItems="center">
          <Text bold>{nftToSell?.tokenId}</Text>
          <Text fontSize="12px" color="textSubtle" textAlign="right">
            {`Collection #${collectionId}`}
          </Text>
        </Grid>
      </Flex>
      <GreyedOutContainer>
        <Flex ref={targetRef}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Required Identity')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          scale="sm"
          name="requiredIndentity"
          placeholder={t('gender')}
          value={state.requiredIndentity}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef2}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Value name')}
          </Text>
          {tooltipVisible2 && tooltip2}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          scale="sm"
          placeholder={t('testify_eq_male')}
          name="valueName"
          value={state.valueName}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef3}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Maximum Usage')}
          </Text>
          {tooltipVisible3 && tooltip3}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <Input
          scale="sm"
          placeholder={t('input user max usage')}
          name="maxUse"
          value={state.maxUse}
          onChange={handleChange}
        />
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef4}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Minimum auditor color')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <ButtonMenu
          scale="sm"
          activeIndex={state.minIDBadgeColor}
          onItemClick={handleRawValueChange('minIDBadgeColor')}
        >
          <ButtonMenuItem>{t('Black')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Brown')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Silver')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Gold')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef5}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Allow Only TrustWorthy Auditors?')}
          </Text>
          {tooltipVisible5 && tooltip5}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <ButtonMenu
          scale="sm"
          activeIndex={state.onlyTrustWorthyAuditors}
          onItemClick={handleRawValueChange('onlyTrustWorthyAuditors')}
        >
          <ButtonMenuItem>{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <GreyedOutContainer>
        <Flex ref={targetRef6}>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Only Data Keepers ?')}
          </Text>
          {tooltipVisible6 && tooltip6}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
        <ButtonMenu scale="sm" activeIndex={state.dataKeeperOnly} onItemClick={handleRawValueChange('dataKeeperOnly')}>
          <ButtonMenuItem>{t('No')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
        </ButtonMenu>
      </GreyedOutContainer>
      <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="360px">
        <Flex alignSelf="flex-start">
          <ErrorIcon width={24} height={24} color="textSubtle" />
        </Flex>
        <Text small color="textSubtle">
          {t(
            'This action will restrict the purchase of this item/service to people with this identity proof. Make sure it’s the correct one',
          )}
        </Text>
      </Grid>
      <Flex flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <LinkExternal href="">{t('Learn more about identiy requirements')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex flexDirection="column" px="16px" pb="16px">
        <Button mb="8px" onClick={continueToNextStage}>
          {t('Update')}
        </Button>
      </Flex>
    </>
  )
}

export default IdentityRequirementStage
