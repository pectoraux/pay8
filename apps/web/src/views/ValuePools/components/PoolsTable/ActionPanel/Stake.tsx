import { Button, Text, useModal, Pool, Flex } from '@pancakeswap/uikit'
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
import { useActiveChainId } from 'hooks/useActiveChainId'

import CreateGaugeModal from '../../CreateGaugeModal'
import InitVaModal from '../../InitVaModal'
import InitValuepoolModal from '../../InitValuepoolModal'
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

const Staked: React.FunctionComponent<any> = ({ id, toggleLoans, toggleSponsors, toggleScheduledPurchases }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pool } = usePool(id)
  const { chainId } = useActiveChainId()
  const variant = pool?.devaddr_?.toLowerCase() === account?.toLowerCase() ? 'admin' : 'user'
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
  }, [refetchVa, account, chainId])

  useEffect(() => {
    refetch()
  }, [refetch, account, chainId])

  const numOfScheduledPurchases = pool?.purchaseHistory?.filter((ph) => ph.active)?.length
  console.log(
    '1pool.id=================>',
    needsApproval,
    needsVaApproval,
    pool?.devaddr_?.toLowerCase() === account?.toLowerCase(),
  )
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
        <Button width="100%" onClick={handleVAPoolApprove} variant="secondary">
          {t('Increase VE Allowance')}
        </Button>
      </ActionContent>
      <ActionContent>
        <Button width="100%" onClick={handleVAVAPoolApprove} variant="secondary">
          {t('Increase VAVA Allowance')}
        </Button>
      </ActionContent>
      <ActionContent>
        <Button width="100%" onClick={openPresentSponsors} variant="secondary">
          {t('Sponsor')}
        </Button>
      </ActionContent>
      {pool?.sponsors?.length > 0 ? (
        <ActionContent>
          <Button width="100%" onClick={toggleSponsors} variant="secondary">
            {t('Toggle Sponsors (#%pos%)', { pos: pool?.sponsors?.length })}
          </Button>
        </ActionContent>
      ) : null}
      {pool?.loans?.length > 0 ? (
        <ActionContent>
          <Button width="100%" onClick={toggleLoans} variant="secondary">
            {t('Toggle Loans (#%pos%)', { pos: pool?.loans?.length })}
          </Button>
        </ActionContent>
      ) : null}
      {numOfScheduledPurchases ? (
        <ActionContent>
          <>
            <Button width="100%" onClick={toggleScheduledPurchases} variant="secondary">
              {t('Toggle Purchases (#%pos%)', { pos: numOfScheduledPurchases })}
            </Button>
            {/* <Flex mb="40px"><NotificationDot show /></Flex> */}
          </>
        </ActionContent>
      ) : null}
    </ActionContainer>
  )
}

export default Staked
