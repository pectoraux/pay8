import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { useERC20 } from 'hooks/useContract'
import { Token } from '@pancakeswap/sdk'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback } from 'react'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useApprovePool } from 'views/ARPs/hooks/useApprove'

import { ActionContainer, ActionContent, ActionTitles } from './styles'
import CreateGaugeModal from '../../CreateGaugeModal'

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const Staked: React.FunctionComponent<any> = ({ pool, currAccount, currency, setCurrency }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const variant = pool?.devaddr_?.toLowerCase() === account?.toLowerCase() ? 'admin' : 'user'
  const stakingTokenContract = useERC20(currency?.address || '')

  const { handleApprove } = useApprovePool(stakingTokenContract, pool?.id, currency?.symbol)

  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal
      variant={variant}
      location="fromStake"
      pool={pool}
      currAccount={currAccount}
      currency={currency}
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
        currency={currency}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currency}
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
