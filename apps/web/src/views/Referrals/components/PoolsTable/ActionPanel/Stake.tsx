import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { useERC20 } from 'hooks/useContract'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'

import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useMemo, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CreateGaugeModal from '../../CreateGaugeModal'

const IconButtonWrapper = styled.div`
  display: flex;
`
const HelpIconWrapper = styled.div`
  align-self: center;
`

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const Staked: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const currencyA = useCurrency(pool?.vestingTokenAddress ?? '')
  const [currency, setCurrency] = useState(currencyA)
  const handleInputSelect = useCallback((currencyInput) => {
    setCurrency(currencyInput)
  }, [])
  const isOwner = pool?.owner?.toLowerCase() === account?.toLowerCase()
  const [openPresentUserSettings] = useModal(<CreateGaugeModal pool={pool} currency={currency} />)
  const [openPresentAdminSettings] = useModal(<CreateGaugeModal variant="admin" pool={pool} currency={currency} />)

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start earning')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {t('Adjust Settings')}{' '}
        </Text>
      </ActionTitles>
      <CurrencyInputPanel
        showInput={false}
        currency={currency ?? currencyA}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currency ?? currencyA}
        id={pool?.sousId}
      />
      <ActionContent>
        <Button width="100%" onClick={isOwner ? openPresentAdminSettings : openPresentUserSettings} variant="secondary">
          {t('Control Panel')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
