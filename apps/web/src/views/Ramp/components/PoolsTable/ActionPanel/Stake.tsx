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

const Staked: React.FunctionComponent<any> = ({ pool, rampAccount, tokenSessions, toggleSessions }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const initialized = pool?.secretKeys?.length > 0 && pool?.clientIds?.length > 0 && pool?.publishableKeys?.length > 0
  const variant = !initialized ? 'init' : pool?.devaddr_?.toLowerCase() === account?.toLowerCase() ? 'admin' : 'user'
  const currencyId = useMemo(() => rampAccount?.token?.address, [rampAccount])
  const rampCurrencyInput = useCurrency(currencyId)
  const [currency, setCurrency] = useState(rampAccount?.address)
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])

  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal
      variant={variant}
      location="staked"
      pool={pool}
      currency={currency ?? rampCurrencyInput}
      rampAccount={rampAccount}
    />,
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Connect your Wallet')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!initialized) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t(
              'Ramp not yet initialized. Please wait a few moments if you already did. Do not reinitialize, keep refreshing!',
            )}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={openPresentControlPanel}
            variant="secondary"
            disabled={pool?.devaddr_ !== account}
          >
            {t('Initialize Ramp')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {pool?.accounts?.length ? t('Adjust Settings') : t('No Accounts Available Yet')}{' '}
        </Text>
      </ActionTitles>
      <>
        <CurrencyInputPanel
          id={`ramp-stake-${pool?.sousId}`}
          showUSDPrice
          showMaxButton
          showCommonBases
          showInput={false}
          showQuickInputButton
          currency={currency ?? rampCurrencyInput}
          otherCurrency={currency ?? rampCurrencyInput}
          onCurrencySelect={handleInputSelect}
        />
        <ActionContent>
          <Button width="100%" onClick={openPresentControlPanel} variant="secondary">
            {t('Control Panel')}
          </Button>
        </ActionContent>
        <ActionContent>
          <Button
            width="100%"
            // onClick={onPresentPreviousTx}
            variant="secondary"
          >
            {t('Transaction History')}
          </Button>
          {tokenSessions?.length ? (
            <>
              <Button width="100%" onClick={toggleSessions} variant="secondary">
                {t('Toggle Sessions (#%pos%)', { pos: tokenSessions?.length })}
              </Button>
              {/* <Flex mb="40px"><NotificationDot show/></Flex> */}
            </>
          ) : null}
        </ActionContent>
      </>
    </ActionContainer>
  )
}

export default Staked
