import { useRef, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Card, ScanLink, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import PreviewImage from 'views/Nft/market/components/CollectibleCard/PreviewImage'
import { RoundedImage } from 'views/Nft/market/Collection/IndividualNFTPage/shared/styles'
import { useFilters2 as useFilters } from 'state/valuepools/hooks'
import { getBlockExploreLink } from 'utils'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { format } from 'date-fns'

const CardWrapper = styled(Box)`
  display: inline-block;
  min-width: 190px;
  margin-left: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
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
const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const DataCard: React.FC<any> = ({ pool, loan, t }) => {
  const { chainId } = useActiveChainId()
  return (
    <CardWrapper style={{ whiteSpace: 'break-spaces', backgroundColor: 'ButtonShadow' }}>
      <Flex flexDirection="column" justifyContent="center" alignSelf="center">
        <ScanLink href={getBlockExploreLink(loan?.borrower, 'address', chainId)} bold={false} small>
          {t('Borrower')}
        </ScanLink>
        {/* <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
          {loan?.active ? t('Yes') : t('No')}
        </Text>
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Active')}
        </Text> */}
        <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
          {loan?.loanType}
        </Text>
        <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Loan Type')}
        </Text>
        <Box mr="8px" height="32px">
          <Balance
            lineHeight="1"
            color="textSubtle"
            fontSize="12px"
            decimals={pool?.vaDecimals ?? 18}
            value={getBalanceNumber(loan?.amount, pool?.vaDecimals)}
          />
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Amount Borrowed')}
          </Text>
        </Box>
        <Text small bold color="textSubtle">
          {t(`Loan started: ${format(Number(loan?.createAt ?? 0) * 1000, 'MMM dd, yyyy HH:mm')}`)}
        </Text>
        <Text small bold color="textSubtle">
          {t(`Loan Updated: ${format(Number(loan?.updatedAt ?? 0) * 1000, 'MMM dd, yyyy HH:mm')}`)}
        </Text>
      </Flex>
    </CardWrapper>
  )
}

const Cart: React.FC<any> = ({ pool, loans }) => {
  const { t } = useTranslation()

  const increaseRef = useRef<HTMLDivElement>(null)
  const moveLeftRef = useRef<boolean>(true)
  console.log('DataCard==============+>', loans)

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
      <Text ml="16px" mt="8px" color="primary">
        {t('Valuepool Loans')}
      </Text>
      <ScrollableRow ref={increaseRef}>
        {loans
          ?.filter((loan) => loan.active)
          .map((loan) => (
            <DataCard pool={pool} loan={loan} t={t} />
          ))}
      </ScrollableRow>
    </Card>
  )
}

export default Cart
