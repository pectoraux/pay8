import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, Flex, PresentWonIcon, Text, useToast, Balance, Input } from '@pancakeswap/uikit'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { LotteryTicketClaimData } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
import { useLotteryContract, useLotteryHelperContract } from 'hooks/useContract'
import { useState, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { fetchUserLotteries } from 'state/lottery'
import { useLottery } from 'state/lottery/hooks'
import { useGasPrice } from 'state/user/hooks'
import { callWithEstimateGas } from 'utils/calls'
import { GreyedOutContainer } from 'views/Accelerator/components/styles'

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<any> = ({ currentTokenId, onSuccess, roundsToClaim }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    lotteryData: { id: currentLotteryId, tokenData, isNFT, nftPrizes },
  } = useLottery()
  const prizeAddress = useMemo(
    () => (nftPrizes?.length >= currentTokenId ? nftPrizes[currentTokenId]?.tokenAddress : nftPrizes[0]?.tokenAddress),
    [nftPrizes, currentTokenId],
  )
  const gasPrice = useGasPrice()
  const { toastSuccess } = useToast()
  const lotteryContract = useLotteryContract()
  const lotteryHelperContract = useLotteryHelperContract()
  const [identityTokenId, setIdentityTokenId] = useState('0')
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const currTokenData = useMemo(
    () => (tokenData?.length ? tokenData[parseInt(currentTokenId)] : {}),
    [tokenData, currentTokenId],
  )
  console.log('currTokenData============>', isNFT, prizeAddress, currTokenData, currentTokenId, tokenData)
  const [pendingBatchClaims, setPendingBatchClaims] = useState(roundsToClaim?.length ? roundsToClaim[0] : 0)

  const handleProgressToNextClaim = () => {
    if (roundsToClaim.length > activeClaimIndex + 1) {
      // If there are still rounds to claim, move onto the next claim
      setActiveClaimIndex(activeClaimIndex + 1)
      dispatch(fetchUserLotteries({ account, currentLotteryId }))
    } else {
      onSuccess()
    }
  }

  const handleClaim = async () => {
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const method = parseInt(isNFT) ? 'withdrawNFTPrize' : 'withdrawPendingReward'
      const contract = parseInt(isNFT) ? lotteryHelperContract : lotteryContract
      const args = parseInt(isNFT)
        ? [prizeAddress, currentLotteryId]
        : [currTokenData?.token?.address, currentLotteryId, identityTokenId]
      return callWithEstimateGas(contract, method, args, {
        gasPrice,
      })
    })
    if (receipt?.status) {
      toastSuccess(
        t('Prizes Collected!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %tk% prizes for lottery %lotteryId% have been sent to your wallet', {
            tk: currTokenData?.token?.symbol,
            currentLotteryId,
          })}
        </ToastDescriptionWithTx>,
      )
      handleProgressToNextClaim()
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
            value={
              parseInt(isNFT)
                ? getDecimalAmount(pendingBatchClaims, currTokenData?.token?.decimals)
                : pendingBatchClaims
            }
            fontSize="44px"
            bold
            decimals={parseInt(isNFT) ? 0 : 3}
            color="secondary"
            prefix={parseInt(isNFT) ? 'NFT # ' : ''}
            unit={parseInt(isNFT) ? '' : ` ${currTokenData?.token?.symbol?.toUpperCase() ?? ''}`}
          />
          <PresentWonIcon ml={['0', null, '12px']} width="64px" />
        </Flex>
      </Flex>
      <Flex>
        <GreyedOutContainer>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
            {t('Identity Token ID')}
          </Text>
          <Input
            type="text"
            scale="sm"
            value={identityTokenId}
            placeholder={t('input your identity token id')}
            onChange={(e) => setIdentityTokenId(e.target.value)}
          />
        </GreyedOutContainer>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="20px"
          width="100%"
          onClick={() => handleClaim()}
        >
          {pendingTx ? t('Claiming') : t('Claim')}{' '}
          {parseInt(isNFT)
            ? getDecimalAmount(pendingBatchClaims, currTokenData?.token?.decimals)?.toString()
            : Number(pendingBatchClaims) > 0
            ? `(${pendingBatchClaims})`
            : ''}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimInnerContainer
