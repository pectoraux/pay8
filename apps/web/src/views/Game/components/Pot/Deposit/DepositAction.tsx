import styled from 'styled-components'
import { useState, useMemo, useEffect } from 'react'
import { Flex, Box, Button, Text, InputProps, NumericalInput } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useERC20 } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import { getFullDisplayBalance, getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getGameFactoryAddress } from 'utils/addressHelpers'
import { useGetRequiresApproval } from 'state/valuepools/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useActiveChainId } from 'hooks/useActiveChainId'
import EnableButton from './EnableButton'
import DepositButton from './DepositButton'

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  padding-bottom: 30px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`

const Container = styled.div<InputProps>`
  border-radius: 16px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme, isWarning }) => (isWarning ? theme.shadows.warning : theme.shadows.inset)};
`

interface DepositActionProps {
  totalValueLockedValue: number
}

const DepositAction: React.FC<any> = ({ tokenId, gameData }) => {
  const { t } = useTranslation()
  const [depositAmount, setDepositAmount] = useState<any>('')
  const [numMinutes, setNumMinutes] = useState<any>(BIG_ZERO)
  const [identityTokenId, setIdentityTokenId] = useState<any>('')

  const symb = ` ${gameData?.token?.symbol?.toUpperCase() ?? '$'}`

  // const maxTotalDepositToNumber = getBalanceNumber(publicData.maxTotalDeposit)
  // const remainingCakeCanStake = new BigNumber(maxTotalDepositToNumber).minus(totalValueLockedValue).toString()

  const { account } = useWeb3React()
  const { chainId } = useActiveChainId()
  const { balance: userCake } = useTokenBalance(gameData?.token?.address)
  const userCakeDisplayBalance = getFullDisplayBalance(userCake, gameData?.token?.decimals, 3)
  const tokenContract = useERC20(gameData?.token?.address || '')
  const pricePerMinutes = getBalanceAmount(gameData?.pricePerMinutes, gameData?.token?.decimals)

  const onClickMax = () => {
    const userCakeBalance = getBalanceAmount(userCake, gameData?.token?.decimals ?? 18)
    setDepositAmount(userCakeBalance?.toString())
    setNumMinutes(userCakeBalance.dividedBy(pricePerMinutes))
  }

  const showMaxButton = useMemo(
    () => new BigNumber(depositAmount).multipliedBy(gameData?.token?.decimals).eq(userCake),
    [depositAmount, userCake, gameData],
  )

  const { isRequired: needsApproval, refetch } = useGetRequiresApproval(tokenContract, account, getGameFactoryAddress())
  console.log('needsApproval================>', needsApproval, tokenContract)

  useEffect(() => {
    refetch()
  }, [account, chainId, refetch])

  if (needsApproval) {
    return <EnableButton refetch={refetch} tokenContract={tokenContract} />
  }

  // if (publicData.getStatus !== PotteryDepositStatus.BEFORE_LOCK) {
  //   return (
  //     <Button disabled mt="10px" width="100%">
  //       {t('Deposit closed until next Pottery')}
  //     </Button>
  //   )
  // }
  return (
    <Box>
      <Box mb="4px">
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
          {t('Buy %val% minutes in', {
            val: numMinutes && numMinutes?.isNaN() ? '' : numMinutes?.dividedBy(pricePerMinutes),
          })}
        </Text>
        <Text fontSize="12px" ml="4px" color="textSubtle" bold as="span">
          {symb}
        </Text>
      </Box>
      <InputPanel>
        <Container>
          <Text fontSize="14px" color="textSubtle" mb="12px" textAlign="right">
            {t('Balance: %balance%', { balance: userCakeDisplayBalance })}
          </Text>
          <Flex mb="6.5px">
            <NumericalInput
              style={{ textAlign: 'left' }}
              className="pottery-amount-input"
              value={depositAmount}
              onUserInput={(val) => {
                setDepositAmount(val)
                setNumMinutes(new BigNumber(val))
                console.log('pricePerMinutes===================>', val)
              }}
            />
            <Flex ml="8px">
              {!showMaxButton && (
                <Button onClick={onClickMax} scale="xs" variant="secondary" style={{ alignSelf: 'center' }}>
                  {t('Max').toUpperCase()}
                </Button>
              )}
              <Text ml="5px">{symb}</Text>
            </Flex>
          </Flex>
        </Container>
      </InputPanel>
      <InputPanel>
        <Container>
          <Text fontSize="14px" color="textSubtle" mb="12px" textAlign="right">
            {t('Identity Token ID')}
          </Text>
          <Flex mt="6.5px">
            <NumericalInput
              style={{ textAlign: 'left' }}
              placeholder="0"
              value={identityTokenId}
              onUserInput={(val) => setIdentityTokenId(val)}
            />
          </Flex>
        </Container>
      </InputPanel>
      {/* <Flex>
        <Flex ml="auto">
          <Text fontSize="12px" color="textSubtle">
            {t('Deposited CAKE will be locked for 10 weeks')}
          </Text>
          <Flex ref={targetRef}>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>{' '}
        </Flex>
      </Flex> */}
      {/* {userNotEnoughCake ? (
        <Button disabled mt="10px" width="100%">
          {notEnoughErrorMessage}
        </Button>
      ) : ( */}
      <Flex flexDirection="column">
        <EnableButton refetch={refetch} tokenContract={tokenContract} />
        <DepositButton
          tokenId={tokenId}
          numMinutes={numMinutes?.dividedBy(pricePerMinutes)}
          identityTokenId={identityTokenId}
          collectionAddress={gameData?.owner}
          setDepositAmount={setDepositAmount}
          setNumMinutes={setNumMinutes}
          setIdentityTokenId={setIdentityTokenId}
        />
      </Flex>
    </Box>
  )
}

export default DepositAction
