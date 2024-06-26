import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { Flex, Box, Text, Balance, Input } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import { LockTimer } from 'views/Game/components/Timer'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import YourDeposit from '../YourDeposit'
import WalletNotConnected from './WalletNotConnected'
import PrizeToBeClaimed from './PrizeToBeClaimed'
import CardFooter from './CardFooter'
import WinRate from '../WinRate'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
`

const Claim: React.FC<any> = ({ data, tokenId, setTokenId }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  // const { data, publicData, userData } = usePotteryData()
  const symb = ` ${data?.token?.symbol?.toUpperCase() ?? '$'}`
  const [identityTokenId, setIdentityTokenId] = useState('')

  const tokenData = useMemo(() => {
    return data?.accounts?.find((protocol) => protocol.id === tokenId)
  }, [data, tokenId])
  console.log('Claim==================>', data)
  return (
    <>
      <Box>
        <Container>
          <GreyCard mb="18px">
            <Flex justifyContent="space-between">
              <YourDeposit data={data} tokenId={tokenId} setTokenId={setTokenId} />
              <WinRate />
            </Flex>
          </GreyCard>
          <Flex justifyContent="space-between">
            <Text color="textSubtle">{t('Total Spent')}</Text>
            <Balance
              bold
              decimals={2}
              value={getBalanceNumber(tokenData?.price ?? 0, data?.token?.decimals ?? 18)}
              unit={symb}
            />
          </Flex>
          <Flex justifyContent="space-between">
            <Text color="textSubtle">{t('Score')}</Text>
            <Balance bold decimals={2} value={tokenData?.score} />
          </Flex>
          {Number(tokenData?.userDeadLine) ? (
            <LockTimer lockTime={tokenData?.userDeadLine} text={t('Play Expires')} />
          ) : null}
          {Number(tokenData?.deadline) ? <LockTimer lockTime={tokenData?.deadline} text={t('Played Until')} /> : null}
        </Container>
      </Box>
      <Box>
        {account ? (
          <Container>
            <GreyCard>
              <SubgraphHealthIndicator inline subgraphName="pancakeswap/pottery" />
              <Flex justifyContent="space-between" mb="20px">
                <Text fontSize="12px" color="secondary" bold as="span" ml="4px" textTransform="uppercase">
                  {t('Identity Token ID')}
                </Text>
                <Input
                  type="text"
                  scale="sm"
                  value={identityTokenId}
                  placeholder={t('input your identity token id')}
                  onChange={(e) => setIdentityTokenId(e.target.value)}
                />
              </Flex>
              {/* {userData.withdrawAbleData.map((data) => (
              <AvailableWithdraw key={data.id} withdrawData={data} />
            ))} */}
              <PrizeToBeClaimed tokenId={tokenId} tokenData={tokenData} gameData={data} />
            </GreyCard>
          </Container>
        ) : (
          <WalletNotConnected />
        )}
        <CardFooter account={account} data={data} />
      </Box>
    </>
  )
}

export default Claim
