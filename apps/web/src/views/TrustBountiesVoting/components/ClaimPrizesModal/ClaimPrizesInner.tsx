import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, Flex, PresentWonIcon, Text, useToast, Balance, Input } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { LotteryTicketClaimData } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
import { useLotteryContract, useStakeMarketBribeContract, useTrustBountiesVoterContract } from 'hooks/useContract'
import { useState, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { fetchUserLotteries } from 'state/lottery'
import { useLottery } from 'state/lottery/hooks'
import { useGetTokenData } from 'state/ramps/hooks'
import { useGasPrice } from 'state/user/hooks'
import { callWithEstimateGas } from 'utils/calls'
import { getTrustBountiesVoterContract } from 'utils/contractHelpers'
import { GreyedOutContainer } from 'views/Accelerator/components/styles'

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<any> = ({ earned, veAddress, tokenAddress, tokenId }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const [claimed, setClaimed] = useState(false)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { data: tokenData } = useGetTokenData(tokenAddress)
  const winnings = getBalanceNumber(earned, tokenData?.decimals)
  console.log('currTokenData============>', veAddress, tokenAddress, tokenId, tokenData)
  const StakeMarketBribeContract = useStakeMarketBribeContract()

  const handleClaim = async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [veAddress, tokenId, [tokenAddress]]
      console.log('handleClaim===============>', args)
      return callWithEstimateGas(StakeMarketBribeContract, 'getRewardForOwner', args).catch((err) =>
        console.log('0handleClaim=================>', err),
      )
    })
    if (receipt?.status) {
      setClaimed(true)
      toastSuccess(
        t('Winnings Collected!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your winnings for the specified NFT token have been sent to your wallet')}
        </ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <>
      <Flex flexDirection="column">
        <Text mb="4px" textAlign={['center', null, 'left']}>
          {t('You won')}
        </Text>
        <Flex
          alignItems={['flex-start', null, 'center']}
          justifyContent={['flex-start', null, 'space-between']}
          flexDirection={['column', null, 'row']}
        >
          <Balance
            textAlign={['center', null, 'left']}
            lineHeight="1.1"
            value={winnings}
            fontSize="44px"
            bold
            color="secondary"
            unit={` ${tokenData?.symbol?.toUpperCase() ?? ''}`}
          />
          <PresentWonIcon ml={['0', null, '12px']} width="64px" />
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <Button
          disabled={claimed}
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="20px"
          width="100%"
          onClick={() => handleClaim()}
        >
          {pendingTx ? t('Claiming') : t('Claim')} {Number(winnings) > 0 ? `(${winnings})` : ''}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimInnerContainer
