import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'

import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useMemo, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import CreateGaugeModal from '../../CreateGaugeModal'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const Staked: React.FunctionComponent<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const variant = pool?.devaddr_?.toLowerCase() === account?.toLowerCase() ? 'admin' : 'user'
  const currencyId = useMemo(() => currAccount?.tokenAddress, [currAccount])
  const inputCurrency = useCurrency(currencyId)
  const [currency, setCurrency] = useState(inputCurrency)
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal
      variant={variant}
      location="fromStake"
      pool={pool}
      currAccount={currAccount}
      currency={currency ?? inputCurrency}
    />,
  )
  const [openPresentControlPanel2] = useModal(
    <CreateGaugeModal
      variant="add_with_debit"
      location="fromStake"
      pool={pool}
      currAccount={currAccount}
      currency={currency ?? inputCurrency}
    />,
  )
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {!account ? t('Connect your Wallet') : t('Adjust Settings')}{' '}
        </Text>
      </ActionTitles>
      <CurrencyInputPanel
        showInput={false}
        currency={currency ?? inputCurrency}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currency ?? inputCurrency}
        id={pool?.sousId}
      />
      <ActionContent>
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : (
          <Button width="100%" onClick={openPresentControlPanel} variant="secondary">
            {t('Control Panel')}
          </Button>
        )}
        {/* <Flex mb="40px"><NotificationDot show={userData?.requests?.length} /></Flex> */}
      </ActionContent>
      <ActionContent>
        <Button width="100%" onClick={openPresentControlPanel2} variant="secondary">
          {t('ADD BALANCE WITH DEBIT CARD')}
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
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
