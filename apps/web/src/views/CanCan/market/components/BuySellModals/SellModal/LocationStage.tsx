import {
  Flex,
  Box,
  Text,
  Button,
  LinkExternal,
  Input,
  AutoRenewIcon,
  ButtonMenu,
  ButtonMenuItem,
  Grid,
  useTooltip,
  HelpIcon,
} from '@pancakeswap/uikit'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import capitalize from 'lodash/capitalize'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import RichTextEditor from 'components/RichText'
import Filters from './Filters'
import { GreyedOutContainer } from './styles'
import { Divider, RoundedImage } from '../shared/styles'
import { noop } from 'lodash'

interface RemoveStageProps {
  variant: 'product' | 'paywall'
  addLocation: () => void
}

const LocationStage: React.FC<any> = ({
  state,
  thumbnail,
  nftToSell,
  collection,
  collectionId,
  variant,
  updateValue,
  nftFilters,
  setNftFilters,
  handleChange,
  continueToNextStage,
  show = false,
}) => {
  const { t } = useTranslation()
  const variantName = capitalize(variant)
  const [value, onChange] = useState('')
  const [value3, onChange3] = useState('')
  const [pendingFb, setPendingFb] = useState(false)
  const collectionAddress = useRouter().query.collectionAddress as string
  const [activeButtonIndex, setActiveButtonIndex] = useState<any>(0)
  const [activeButtonIndex3, setActiveButtonIndex3] = useState(0)
  const handleThumbnailUpload = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('image', file)
        fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            resolve(result.data.url)
            updateValue('thumbnail', result.data.url)
          })
          .catch(() => reject(new Error('Upload failed')))
      }),
    [],
  )

  const TooltipComponent = () => (
    <Text>
      {t(
        "This will be your product's name in the marketplace, your product id will be the same but with the spaces replaced with a dash -.",
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "This is the link to your video, leave it empty if you are note planning on adding a video. If you do though, you can input the embed link to your video right here, to get the embed link for a Youtube video for instance, go to the page of the video, double clik on the video and select 'Copy embed code'. This will copy the entire embed code with the embed link your clipboard, get the embed link in the code which is a youtube link that looks like this: https://www.youtube.com/embed/1CpCdolHdeA. Copy the link right here.",
      )}
    </Text>
  )
  const TooltipComponent3 = () => (
    <Text>{t('You can either add a link to an image on the internet or upload a new image right here.')}</Text>
  )
  const TooltipComponent4 = () => (
    <Text>{t('A good example for dimensions is 640 x 640 pixels for your image to appear perfectly.')}</Text>
  )
  const TooltipComponent5 = () => (
    <Text>
      {t('To upload an image, click on the icon below to open a window so you can pick an image locally to upload.')}
    </Text>
  )
  const TooltipComponent6 = () => <Text>{t('Use this field to provide a summary description of your product.')}</Text>
  const TooltipComponent7 = () => (
    <Text>
      {t(
        'Use this field to set a geotag on your product, pick all the countries or cities where it is available for purchase. In case it is available everywhere, just pick the option All for countries and cities. As for the product tags, they should describe a core functionality or category of your product.',
      )}
    </Text>
  )
  const TooltipComponent8 = () => (
    <Text>
      {t(
        'Use this field to add a custom tag in case you did not find an appropriate one above. Your tag name should be one worded and preferably not too long.',
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
      <Box p="16px">
        {variantName !== 'Paywall' ? (
          <Flex justifyContent="center" alignItems="center" mb="10px">
            <ButtonMenu scale="sm" variant="subtle" activeIndex={activeButtonIndex} onItemClick={noop}>
              <ButtonMenuItem>{t('Image/Video')}</ButtonMenuItem>
              <ButtonMenuItem>
                <LinkExternal href={variant === 'item' ? 'createArticle' : `${collectionAddress}/createArticle`}>
                  {t('Article')}
                </LinkExternal>
              </ButtonMenuItem>
            </ButtonMenu>
          </Flex>
        ) : null}
        {activeButtonIndex ? (
          <Text mt="24px" color="textSubtle" mb="8px">
            {t('Write your article in the opened page.')}
          </Text>
        ) : (
          <>
            <GreyedOutContainer>
              <Flex ref={targetRef}>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                  {t('Product Name')}
                </Text>
                {tooltipVisible && tooltip}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <Input
                type="text"
                scale="sm"
                name="tokenId"
                value={state.tokenId}
                placeholder={t('input product name')}
                onChange={handleChange}
              />
            </GreyedOutContainer>
            <GreyedOutContainer>
              <Flex ref={targetRef2}>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                  {t('Link to Video')}
                </Text>
                {tooltipVisible2 && tooltip2}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <RichTextEditor
                id="original"
                value={value}
                onChange={(e) => {
                  updateValue('original', e)
                  onChange(e)
                }}
                controls={[['video']]}
              />
            </GreyedOutContainer>
            <GreyedOutContainer>
              <Flex ref={targetRef3}>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                  {t('Image')}
                </Text>
                {tooltipVisible3 && tooltip3}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <StyledItemRow>
                <ButtonMenu
                  scale="xs"
                  variant="subtle"
                  activeIndex={activeButtonIndex3}
                  onItemClick={setActiveButtonIndex3}
                >
                  <ButtonMenuItem>{t('Upload')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Link')}</ButtonMenuItem>
                </ButtonMenu>
              </StyledItemRow>
            </GreyedOutContainer>
            {activeButtonIndex3 ? (
              <GreyedOutContainer>
                <Flex ref={targetRef4}>
                  <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                    {t('Link to Image/Gif')}
                  </Text>
                  {tooltipVisible4 && tooltip4}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <Input
                  type="text"
                  scale="sm"
                  name="thumbnail"
                  value={state.thumbnail}
                  placeholder={t('input link to img/gif')}
                  onChange={handleChange}
                />
              </GreyedOutContainer>
            ) : (
              <GreyedOutContainer>
                <Flex ref={targetRef5}>
                  <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                    {t('Upload Image/Gif')}
                  </Text>
                  {tooltipVisible5 && tooltip5}
                  <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                </Flex>
                <RichTextEditor
                  id="thumbnail"
                  value={value3}
                  controls={[['image']]}
                  onChange={onChange3}
                  onImageUpload={handleThumbnailUpload}
                />
              </GreyedOutContainer>
            )}
            <GreyedOutContainer>
              <Flex ref={targetRef6}>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                  {t('Description')}
                </Text>
                {tooltipVisible6 && tooltip6}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <Input
                type="text"
                scale="sm"
                name="description"
                value={state.description}
                placeholder={t('input a description')}
                onChange={handleChange}
              />
            </GreyedOutContainer>
            <Text mt="24px" color="textSubtle" mb="8px">
              {t("Click on each one of these to set your %variantName%'s location data", { variantName })}
            </Text>
            <Flex ref={targetRef7}>
              <Filters
                collection={collection}
                showWorkspace={false}
                nftFilters={nftFilters}
                setNftFilters={setNftFilters}
              />
              {tooltipVisible7 && tooltip7}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <GreyedOutContainer style={{ paddingTop: '18px' }}>
              <Flex ref={targetRef8}>
                <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
                  {t('Not satisfied with above tags ? Add custom tags')}
                </Text>
                {tooltipVisible8 && tooltip8}
                <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
              </Flex>
              <Input
                type="text"
                scale="sm"
                name="customTags"
                value={state.customTags}
                placeholder={t('comma separated tags')}
                onChange={handleChange}
              />
            </GreyedOutContainer>
          </>
        )}
      </Box>
      {show ? (
        <>
          <Divider />
          <Flex flexDirection="column" px="16px" pb="16px">
            <Button
              mb="8px"
              disabled={pendingFb}
              onClick={continueToNextStage}
              endIcon={pendingFb ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            >
              {t('Save Product Data')}
            </Button>
          </Flex>
        </>
      ) : null}
    </>
  )
}

export default LocationStage
