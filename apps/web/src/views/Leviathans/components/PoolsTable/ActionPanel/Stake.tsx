import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { useERC20 } from 'hooks/useContract'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'

import { useWeb3React } from '@pancakeswap/wagmi'
import { useCallback, useEffect, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useGetRequiresApproval, usePool } from 'state/valuepools/hooks'
import { useApprovePool } from 'views/ValuePools/hooks/useApprove'

import CreateGaugeModal from '../../CreateGaugeModal'
import InitVaModal from '../../InitVaModal'
import InitValuepoolModal from '../../InitValuepoolModal'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { useActiveChainId } from 'hooks/useActiveChainId'

const IconButtonWrapper = styled.div`
  display: flex;
`
const HelpIconWrapper = styled.div`
  align-self: center;
`

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const Staked: React.FunctionComponent<any> = ({ id, toggleSponsors, toggleScheduledPurchases }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pool } = usePool(id)
  const { chainId } = useActiveChainId()
  const variant = pool?.devaddr_ !== account ? 'admin' : 'user'
  const vpCurrencyInput = useCurrency(pool?.tokenAddress)
  const [currency, setCurrency] = useState(vpCurrencyInput)
  const stakingTokenContract = useERC20(pool?.tokenAddress || '')
  const { isRequired: needsApproval, refetch } = useGetRequiresApproval(stakingTokenContract, account, pool?.id ?? '')
  const { isRequired: needsVaApproval, refetch: refetchVa } = useGetRequiresApproval(
    stakingTokenContract,
    account,
    pool?.ve ?? '',
  )

  useEffect(() => {
    refetchVa()
  }, [account, chainId])
  useEffect(() => {
    refetch()
  }, [account, chainId])

  const numOfScheduledPurchases = pool?.purchaseHistory?.filter((ph) => ph.active)?.length
  console.log('pool.id=================>', pool)
  const { handleApprove: handleVAPoolApprove, pendingTx: pendingVAPoolTx } = useApprovePool(
    stakingTokenContract,
    pool?.id,
    currency?.symbol,
    refetch,
  )
  const { handleApprove: handleVAVAPoolApprove, pendingTx: pendingVAVAPoolTx } = useApprovePool(
    stakingTokenContract,
    pool?.ve,
    currency?.symbol,
    refetchVa,
  )

  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant={variant} location="valuepool" pool={pool} currency={currency} />,
  )
  const [openPresentSponsors] = useModal(
    <CreateGaugeModal variant="add_sponsors" location="valuepool" pool={pool} currency={currency} />,
  )
  const [onPresentInitVava] = useModal(<InitValuepoolModal pool={pool} />)
  const [onPresentInitVa] = useModal(<InitVaModal pool={pool} />)
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

  if (!pool?.initialized) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Valuepool not yet initialized')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentInitVava}
            variant="secondary"
            disabled={pool?.devaddr_?.toLowerCase() !== account?.toLowerCase()}
          >
            {t('Initialize Valuepool')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!pool?.veName) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Va not yet initialized')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentInitVa}
            variant="secondary"
            disabled={pool?.devaddr_?.toLowerCase() !== account.toLowerCase()}
          >
            {t('Initialize Va')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (needsApproval || needsVaApproval) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable %va% pool', {
              va: needsApproval && needsVaApproval ? 'VA & VAVA' : needsApproval ? 'VA' : 'VAVA',
            })}
          </Text>
        </ActionTitles>
        <ActionContent>
          {needsApproval ? (
            <Button width="100%" disabled={pendingVAPoolTx} onClick={handleVAPoolApprove} variant="secondary">
              {t('Enable VE')}
            </Button>
          ) : null}
        </ActionContent>
        <ActionContent>
          {needsVaApproval ? (
            <Button width="100%" disabled={pendingVAVAPoolTx} onClick={handleVAVAPoolApprove} variant="secondary">
              {t('Enable VAVA')}
            </Button>
          ) : null}
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {pool?.tokens?.length ? t('Adjust Settings') : t('No Accounts Available Yet')}{' '}
        </Text>
      </ActionTitles>
      <CurrencyInputPanel
        showInput={false}
        currency={currency ?? vpCurrencyInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={currency ?? vpCurrencyInput}
        id={pool?.id}
      />
      <ActionContent>
        <Button width="100%" onClick={openPresentControlPanel} variant="secondary">
          {t('Control Panel')}
        </Button>
      </ActionContent>
      <ActionContent>
        <Button mr="3px" width="100%" onClick={openPresentSponsors} variant="secondary">
          {t('Sponsor')}
        </Button>
        {pool?.sponsors?.length > 0 ? (
          <Button mr="3px" width="100%" onClick={toggleSponsors} variant="secondary">
            {t('Toggle Sponsors (#%pos%)', { pos: pool?.sponsors?.length })}
          </Button>
        ) : null}
        {numOfScheduledPurchases ? (
          <>
            <Button width="100%" onClick={toggleScheduledPurchases} variant="secondary">
              {t('Toggle Purchases (#%pos%)', { pos: numOfScheduledPurchases })}
            </Button>
            {/* <Flex mb="40px"><NotificationDot show /></Flex> */}
          </>
        ) : null}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
