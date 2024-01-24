import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'

import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useMemo, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useERC20 } from 'hooks/useContract'
import { useApprovePool } from 'views/Wills/hooks/useApprove'

import CreateGaugeModal from '../../CreateGaugeModal'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const Staked: React.FunctionComponent<any> = ({ pool, currAccount, currToken }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  console.log('currToken==================>', currToken)
  const variant = pool?.collection?.owner?.toLowerCase() === account?.toLowerCase() ? 'admin' : 'user'
  const currencyId = useMemo(() => currToken?.tokenAddress, [currToken])
  const inputCurrency = useCurrency(currencyId)
  const [currency, setCurrency] = useState(inputCurrency) as any
  const stakingTokenContract = useERC20(currency?.address || '')

  const { handleApprove } = useApprovePool(stakingTokenContract, pool?.id, currency?.symbol)
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal
      variant={variant}
      location="fromStake"
      pool={pool}
      currAccount={currAccount}
      currency={currency ?? inputCurrency}
    />,
  )
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])

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

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {t('Adjust Settings')}{' '}
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
        <Button width="100%" onClick={openPresentControlPanel} variant="secondary">
          {t('Control Panel')}
        </Button>
        {/* <Flex mb="40px"><NotificationDot show={userData?.requests?.length} /></Flex> */}
      </ActionContent>
      <ActionContent>
        {/* <Button
          width="100%"
          // onClick={onPresentPreviousTx}
          variant="secondary"
        >
          {t('Transaction History')}
        </Button> */}
        <Button width="100%" onClick={handleApprove} variant="secondary">
          {t('Increase Allowance')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
