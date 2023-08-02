import { useRouter } from 'next/router'
import { useState, ChangeEvent, FormEvent } from 'react'
import {
  Button,
  Card,
  CardBody,
  useToast,
  CardHeader,
  CardProps,
  Heading,
  Box,
  Input,
  AutoRenewIcon,
  Toggle,
} from '@pancakeswap/uikit'
import { Proposal } from 'state/types'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Label } from '../CreateProposal/styles'
const CryptoJS = require('crypto-js')

interface SendToIPFSProps extends CardProps {
  proposal: Proposal
}

const SendToIPFS: React.FC<SendToIPFSProps> = ({ proposal, ...props }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [answer, setAnswer] = useState('')
  const [isSend, setIsSend] = useState(true)
  const [isSearchable, setIsSearchable] = useState(false)

  const toggle = async () => {
    setIsSend(!isSend)
  }

  const toggle2 = async () => {
    setIsSearchable(!isSearchable)
  }

  return (
    <Card {...props}>
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('IPFS')}
        </Heading>
      </CardHeader>
      <CardBody>
        <form>
          <Box mb="24px">
            <Label htmlFor="name">{t('Auditor Wallet Address')}</Label>
            <Input id="name" name="name" value={name} scale="lg" required />
          </Box>
          <Box mb="24px">
            <Label htmlFor="answer">{t('Decrypted')}</Label>
            <Input id="answer" name="answer" value={answer} scale="lg" isSuccess />
          </Box>
          <Box mb="24px">
            <Label htmlFor="name">{isSend ? t('Send') : t('Delete')}</Label>
            <Toggle checked={isSend} onChange={toggle} />
          </Box>
          <Box mb="24px">
            <Label htmlFor="name">{!isSearchable ? t('Store Encrypted') : t('Store Unencrypted')}</Label>
            <Toggle checked={isSearchable} onChange={toggle2} />
          </Box>
          {account ? (
            <Button
              type="submit"
              disabled={answer === ''}
              isLoading={isLoading}
              endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
            >
              {isSend ? t('Send to IPFS') : t('Delete')}
            </Button>
          ) : (
            <ConnectWalletButton />
          )}
        </form>
      </CardBody>
    </Card>
  )
}

export default SendToIPFS
