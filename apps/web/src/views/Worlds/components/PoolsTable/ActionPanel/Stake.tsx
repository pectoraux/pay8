import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'

import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useGetRequiresApproval } from 'state/valuepools/hooks'
import { useERC20 } from 'hooks/useContract'
import { getWorldHelperAddress } from 'utils/addressHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useApprovePool } from 'views/ValuePools/hooks/useApprove'

import CreateGaugeModal from '../../CreateGaugeModal'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`
const HelpIconWrapper = styled.div`
  align-self: center;
`

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const Staked: React.FunctionComponent<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const variant = pool?.devaddr_ === account ? 'admin' : 'user'
  const currencyId = useMemo(() => currAccount?.token?.address, [currAccount])
  const rampCurrencyInput = useCurrency(currencyId)
  const [currency, setCurrency] = useState(currencyId)
  const stakingTokenContract = useERC20(currency?.address || '')
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant={variant} pool={pool} currency={currency} currAccount={currAccount} />,
  )
  const handleInputSelect = useCallback((currencyInput) => setCurrency(currencyInput), [])

  const { handleApprove, pendingTx } = useApprovePool(stakingTokenContract, pool?.id, currency?.symbol)
  const { handleApprove: handleApprove2, pendingTx: pendingTx2 } = useApprovePool(
    stakingTokenContract,
    getWorldHelperAddress(),
    currency?.symbol,
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

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {t('Adjust Settings')}{' '}
        </Text>
      </ActionTitles>
      <CurrencyInputPanel
        showInput={false}
        currency={currency ?? rampCurrencyInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currency ?? rampCurrencyInput}
        id={pool?.sousId}
      />
      <ActionContent>
        <Button width="100%" onClick={openPresentControlPanel} variant="secondary">
          {t('Control Panel')}
        </Button>
        {/* <Flex mb="40px"><NotificationDot show={userData?.requests?.length} /></Flex> */}
      </ActionContent>
      <ActionContent>
        <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
          {t('Enable World')}
        </Button>
      </ActionContent>
      <ActionContent>
        <Button width="100%" disabled={pendingTx2} onClick={handleApprove2} variant="secondary">
          {t('Enable WorldHelper')}
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
