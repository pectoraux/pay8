import { useRef, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Card, Button, CopyButton, Balance, useToast, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTrustBountiesContract } from 'hooks/useContract'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'

const CardWrapper = styled(Flex)`
  display: inline-block;
  align-iterms: center;
  justify-content: center;
  min-width: 190px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`
const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`
const TopMoverCard = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 16px;
`

export const ScrollableRow = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px 0;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`

const DataCard = ({ bountyId, isNativeCoin, claim, decimals }) => {
  const { t } = useTranslation()
  const { days, hours, minutes } = getTimePeriods(Number(claim.endTime ?? '0'))
  const { fetchWithCatchTxError } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess, toastError } = useToast()
  const [pendingFb, setPendingFb] = useState(false)
  const [pendingFb2, setPendingFb2] = useState(false)
  const trustBountiesContract = useTrustBountiesContract()

  console.log('claim===============>', claim, !!claim.winner)
  const handleConcede = useCallback(
    async (fromConcede) => {
      if (fromConcede) {
        setPendingFb(true)
      } else {
        setPendingFb2(true)
      }
      // eslint-disable-next-line consistent-return
      const receipt = await fetchWithCatchTxError(async () => {
        const method = fromConcede ? 'concede' : isNativeCoin ? 'applyClaimResultsETH' : 'applyClaimResults'
        const args = fromConcede
          ? [bountyId]
          : isNativeCoin
          ? [bountyId, claim.id, '', '', '']
          : [bountyId, claim.id, 0, '', '', '']
        console.log('concede===============>', method, args)
        return callWithGasPrice(trustBountiesContract, method, args).catch((err) => {
          console.log('err0=================>', err)
          if (fromConcede) {
            setPendingFb(false)
          } else {
            setPendingFb2(false)
          }
          toastError(
            t('Issue conceding'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
          )
        })
      })
      if (receipt?.status) {
        if (fromConcede) {
          setPendingFb(false)
        } else {
          setPendingFb2(false)
        }
        toastSuccess(
          t('Claim successfully conceded'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('This claimed has now been settled with the attacker.')}
          </ToastDescriptionWithTx>,
        )
        // dispatch(fetchBountiesAsync())
      }
    },
    [
      t,
      claim,
      bountyId,
      isNativeCoin,
      toastError,
      toastSuccess,
      callWithGasPrice,
      fetchWithCatchTxError,
      trustBountiesContract,
    ],
  )

  return (
    <CardWrapper>
      <TopMoverCard>
        <Wrapper>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Hunter Address')}
          </Text>
          <CopyButton width="24px" text={claim?.hunter} tooltipMessage={t('Copied')} />
        </Wrapper>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={claim.id} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Claim ID')}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={decimals} value={claim.amount} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Claimed')}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {days} {t('days')} {hours} {t('hours')} {minutes} {t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('End Time')}
          </Text>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {t('%status%', { status: claim.atPeace ? 'At Peace' : 'At War' })}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Status')}
          </Text>
        </Flex>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Button
            mb="8px"
            scale="sm"
            variant="secondary"
            disabled={claim.atPeace}
            onClick={() => handleConcede(true)}
            endIcon={pendingFb ? <AutoRenewIcon spin color="currentColor" /> : null}
          >
            {t('Concede')}
          </Button>
          <Button
            scale="sm"
            variant="secondary"
            // disabled={claim.atPeace}
            onClick={() => handleConcede(false)}
            endIcon={pendingFb2 ? <AutoRenewIcon spin color="currentColor" /> : null}
          >
            {t('Apply Results')}
          </Button>
        </Flex>
      </TopMoverCard>
    </CardWrapper>
  )
}

const Cart: React.FC<any> = ({ pool }) => {
  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (increaseRef.current) {
        if (increaseRef.current.scrollLeft === increaseRef.current.scrollWidth - increaseRef.current.clientWidth) {
          moveLeftRef.current = false
        } else if (increaseRef.current.scrollLeft === 0) {
          moveLeftRef.current = true
        }
        increaseRef.current.scrollTo(
          moveLeftRef.current ? increaseRef.current.scrollLeft + 1 : increaseRef.current.scrollLeft - 1,
          0,
        )
      }
    }, 30)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  return (
    <Card my="6px" style={{ width: '100%' }}>
      <ScrollableRow ref={increaseRef}>
        {pool?.friendlyClaims?.map((claim) => (
          <DataCard
            key={`application-token-${claim?.id}`}
            bountyId={pool.sousId}
            claim={claim}
            isNativeCoin={pool?.isNativeCoin}
            decimals={pool.token.decimals}
          />
        ))}
      </ScrollableRow>
    </Card>
  )
}

export default Cart
