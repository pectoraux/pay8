import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useCurrency } from 'hooks/Tokens'
import { Button, Text, useModal, Pool } from '@pancakeswap/uikit'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { useERC20 } from 'hooks/useContract'
import { Token } from '@pancakeswap/sdk'
import { useGetRequiresApproval } from 'state/stakemarket/hooks'
import { getStakeMarketAddress } from 'utils/addressHelpers'

import { useApprovePool } from 'views/ValuePools/hooks/useApprove'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { ActionContainer, ActionContent, ActionTitles } from './styles'
import CreateGaugeModal from '../../CreateGaugeModal'

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const Staked: React.FunctionComponent<any> = ({ pool, currPool, toggleApplications }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { chainId } = useActiveChainId()
  const token = useCurrency(pool.tokenAddress) as any
  const stakemarketAddress = getStakeMarketAddress()
  const stakingTokenContract = useERC20(token?.address || DEFAULT_TFIAT)
  const { needsApproval, refetch } = useGetRequiresApproval(stakingTokenContract, account, stakemarketAddress)
  const currencyA = token
  const [currency, setCurrency] = useState(currencyA)

  const handleInputSelect = useCallback((currencyInput) => {
    setCurrency(currencyInput)
  }, [])
  const variant = pool.owner?.toLowerCase() === account?.toLowerCase() ? 'admin' : 'user'
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal variant={variant} pool={currPool} sousId={pool?.sousId} currency={currency ?? token} />,
  )
  useEffect(() => {
    refetch()
  }, [account, chainId, refetch])

  const { handleApprove, pendingTx } = useApprovePool(
    stakingTokenContract,
    stakemarketAddress,
    currency?.symbol,
    refetch,
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
            {t('Enable Stake Market')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
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
        {pool?.applications?.length && !parseInt(pool?.partnerStakeId) ? (
          <Button width="100%" onClick={toggleApplications} variant="secondary">
            {t('Toggle Applications (#%pos%)', { pos: pool?.applications?.length ?? 0 })}
          </Button>
        ) : null}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
