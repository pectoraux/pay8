import NodeRSA from 'encrypt-rsa'
import { useEffect, useRef } from 'react'
import { Card, Box, Modal, Text } from '@pancakeswap/uikit'
import RichTextEditor from 'components/RichText'
import { useTranslation } from '@pancakeswap/localization'
// import { Entry } from 'state/types'

// interface SetPriceStageProps {
//   entry: Entry
// }

// Stage where user puts price for NFT they're about to put on sale
// Also shown when user wants to adjust the price of already listed NFT
const ArticleModal: React.FC<any> = ({ extraNotes, onDismiss }) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY_4096, process.env.NEXT_PUBLIC_PRIVATE_KEY_4096)

  return (
    <Modal title={t('User Notes')} onDismiss={onDismiss}>
      {extraNotes?.map((note) => {
        const address = note?.address
          ? nodeRSA.decryptStringWithRsaPrivateKey({
              text: note?.address,
              privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
            })
          : ''
        const message = note?.message
          ? nodeRSA.decryptStringWithRsaPrivateKey({
              text: note?.message,
              privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_4096,
            })
          : ''
        return (
          <Box mb="24px" maxWidth="700px">
            <Card>
              {address?.trim()?.length ? (
                <>
                  <Text ml="40%" color="red">
                    {t('Address')}
                  </Text>
                  <RichTextEditor readOnly value={address} id="rte" />
                </>
              ) : null}
              {message?.trim()?.length ? (
                <>
                  <Text ml="40%" color="red">
                    {t('Message')}
                  </Text>
                  <RichTextEditor readOnly value={message} id="rte" />
                </>
              ) : null}
            </Card>
          </Box>
        )
      })}
    </Modal>
  )
}

export default ArticleModal
