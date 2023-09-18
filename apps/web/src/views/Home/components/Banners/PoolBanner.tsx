import { Button, Flex, NextLinkFromReactRouter, Text, useMatchBreakpoints, OpenNewIcon, Box } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/legacy/image'
import styled, { css } from 'styled-components'

import * as S from './Styled'
import { flyingAnim } from './animations'
import { lotteryImage } from './images'

const RightWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  overflow: visible;

  > span:nth-child(2) {
    // TradingRewardButter2
    position: absolute !important;
    right: -5%;
    top: 2%;
    animation: ${flyingAnim} 2.5s ease-in-out infinite;
    z-index: 2;

    ${({ theme }) => theme.mediaQueries.md} {
      right: -3%;
      top: -20%;
    }
  }
`

const Title = styled.div`
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 16px;
  width: 196px;

  &::after {
    letter-spacing: 0.01em;
    font-feature-settings: 'liga' off;
    background: linear-gradient(0deg, #832e00, #832e00), linear-gradient(18.74deg, #ffdf37 7.81%, #ffeb37 81.03%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 4px #832e00;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 32px;
    margin-bottom: 4px;
    width: 100%;
  }
`

const Header = styled.div`
  position: relative;
  font-family: 'Kanit';
  font-style: normal;
  line-height: 68%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 16px;
  width: 196px;

  &::after {
    letter-spacing: 0.01em;
    font-feature-settings: 'liga' off;
    background: linear-gradient(0deg, #832e00, #832e00), linear-gradient(18.74deg, #ffdf37 7.81%, #ffeb37 81.03%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 4px #832e00;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 32px;
    margin-bottom: 4px;
    width: 100%;
  }
`

const sharedStyle = css`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: 16px;
    padding: 12px 24px;
  }
`

const StyledButtonLeft = styled(Button)`
  ${sharedStyle}
  > div {
    color: ${({ theme }) => theme.colors.white};
  }
`

const BGWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: -2px;
  left: 0;
  overflow: hidden;
  border-radius: 32px;
  span {
    // liquidStakingBunnyBg1
    position: absolute !important;
    top: 0px;
    right: 0px;
    max-width: none !important;
    min-width: 300px !important;
    width: 100% !important;
    height: 196px !important;
    ${({ theme }) => theme.mediaQueries.sm} {
      top: -2px;
      right: 0;
      width: 1126px !important;
      height: 194px !important;
    }
  }
`
const LogoBox = styled(Box)`
  margin-bottom: 0px;
  margin-top: -3px;
  transform: scale(0.9);
  transform-origin: top left;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
    transform: scale(1);
    margin-bottom: 10px;
  }
`
export const PoolBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  const title = t('Stake LPs & Earn rewards with pools')

  return (
    <S.Wrapper
      style={{
        background: 'linear-gradient(180deg, #9132D2 0%, #803DE1 100%)',
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <LogoBox>
            <Header data-text="payswap">PAYSWAP</Header>
          </LogoBox>
          <Title data-text={title}>{title}</Title>
          {isDesktop && (
            <Text color="#FFE437" fontSize={24} fontWeight={700} mb="8px">
              {t('Pools let you to earn rewards for providing liquidity in the AMM')}
            </Text>
          )}
          <Flex>
            <NextLinkFromReactRouter target="_blank" to="/liquidity">
              <StyledButtonLeft scale={['xs', 'sm', 'md']}>
                <Text bold fontSize={['12px', '16px']} mr="4px">
                  {t('Provide liquidity')}
                </Text>
                <OpenNewIcon color="white" />
              </StyledButtonLeft>
            </NextLinkFromReactRouter>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          <BGWrapper>
            <Image src={'/images/cancan/340.jpg'} alt="Background" width={338} height={176} unoptimized />
          </BGWrapper>
          {isMobile ? (
            <Image src={'/images/decorations/logo.png'} alt="GalxeTraverseBunny" width={173} height={138} />
          ) : (
            <Image src={'/images/decorations/logo.png'} alt="GalxeTraverseBunny" width={335} height={268} />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}
