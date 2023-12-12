import { ChainId, Currency } from '@pancakeswap/sdk'
import { BinanceIcon, TokenLogo } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import styled from 'styled-components'
import { getImageUrlFromToken } from 'components/TokenImage'

import { ASSET_CDN } from 'config/constants/endpoints'
import { useHttpLocations } from '@pancakeswap/hooks'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

interface LogoProps {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}

export function FiatLogo({ currency, size = '24px', style }: LogoProps) {
  return <StyledLogo size={size} srcs={[`${getImageUrlFromToken(currency)}.svg`]} width={size} style={style} />
}

export default function CurrencyLogo({ currency, size = '24px', style }: LogoProps) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return []

    if (currency?.isToken) {
      const tokenLogoURL = getImageUrlFromToken(currency)

      if (currency instanceof WrappedTokenInfo) {
        if (!tokenLogoURL) return [...uriLocations]
        return [...uriLocations, tokenLogoURL]
      }
      if (!tokenLogoURL) return []
      return [tokenLogoURL]
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative) {
    if (currency.chainId === ChainId.BSC) {
      return <BinanceIcon width={size} style={style} />
    }
    return <StyledLogo size={size} srcs={[`${getImageUrlFromToken(currency)}.svg`]} width={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
