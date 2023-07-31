import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'

import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useGetRequiresApproval } from 'state/trustbounties/hooks'
import { getTrustBountiesAddress } from 'utils/addressHelpers'
import { getBep20Contract } from 'utils/contractHelpers'

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

const Staked: React.FunctionComponent<any> = ({ pool, toggleApplications }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  console.log('stakemarketAddress====================>', pool)
  const token = useCurrency(pool?.tokenAddress ?? '')
  const stakingTokenContract = getBep20Contract(pool?.tokenAddress ?? '')
  const { needsApproval } = useGetRequiresApproval(stakingTokenContract, account, getTrustBountiesAddress())
  const currencyA = token
  const [currency, setCurrency] = useState(currencyA)
  const handleInputSelect = useCallback((currencyInput) => {
    setCurrency(currencyInput)
  }, [])
  const variant = pool?.owner === account ? 'admin' : 'user'
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant={variant} pool={pool} currency={currency ?? token} />,
  )
  // const [onPresentPreviousTx] = useModal(<ActivityHistory />,)

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

  if (needsApproval) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            // disabled={pendingPoolTx}
            // onClick={handlePoolApprove}
            variant="secondary"
          >
            {t('Enable')}
          </Button>
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
        <Button width="100%" onClick={openPresentControlPanel} variant="secondary">
          {t('Control Panel')}
        </Button>
        {/* <Flex mb="40px"><NotificationDot show={userData?.requests?.length} /></Flex> */}
      </ActionContent>
      <ActionContent>
        <Button
          width="100%"
          // onClick={onPresentPreviousTx}
          variant="secondary"
        >
          {t('Transaction History')}
        </Button>
        {pool?.friendlyClaims?.length ? (
          <Button width="100%" onClick={toggleApplications} variant="secondary">
            {t('Friendly Claims (#%pos%)', { pos: pool?.friendlyClaims?.length ?? 0 })}
          </Button>
        ) : null}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
