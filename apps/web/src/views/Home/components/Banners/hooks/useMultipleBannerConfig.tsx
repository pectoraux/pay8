import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'

import { GameBanner } from '../GameBanner'
import { BettingBanner } from '../BettingBanner'
import { NftBanner } from '../NftBanner'
import { CanCanBanner } from '../CanCanBanner'
import { RampBanner } from '../RampBanner'
import { LotteryBanner } from '../LotteryBanner'
import { ValuepoolBanner } from '../ValuepoolBanner'
import { BountiesBanner } from '../BountiesBanner'
import { StakeBanner } from '../StakeBanner'
import { ARPBanner } from '../ARPBanner'
import { AuditorBanner } from '../AuditorBanner'
import { SponsorBanner } from '../SponsorBanner'
import { PaycardBanner } from '../PaycardBanner'
import { FCBanner } from '../FCBanner'
import { PoolBanner } from '../PoolBanner'
import { WillBanner } from '../WillBanner'
import { WorldBanner } from '../WorldBanner'
import { LeviathanBanner } from '../LeviathanBanner'
import { FreeTokensBanner } from '../FreeTokensBanner'
import { SSIBanner } from '../SSIBanner'
import { ProfileBanner } from '../ProfileBanner'

interface IBannerConfig {
  shouldRender: boolean
  banner: ReactElement
}

/**
 * make your custom hook to control should render specific banner or not
 * add new campaign banner easily
 *
 * @example
 * ```ts
 *  {
 *    shouldRender: isRenderIFOBanner,
 *    banner: <IFOBanner />,
 *  },
 * ```
 */

export const useMultipleBannerConfig = () => {
  return useMemo(() => {
    const SHUFFLE_BANNERS: IBannerConfig[] = [
      { shouldRender: true, banner: <RampBanner /> },
      { shouldRender: true, banner: <CanCanBanner /> },
      { shouldRender: true, banner: <NftBanner /> },
      { shouldRender: true, banner: <GameBanner /> },
      { shouldRender: true, banner: <BettingBanner /> },
      { shouldRender: true, banner: <LotteryBanner /> },
      { shouldRender: true, banner: <ValuepoolBanner /> },
      { shouldRender: true, banner: <BountiesBanner /> },
      { shouldRender: true, banner: <StakeBanner /> },
      { shouldRender: true, banner: <ARPBanner /> },
      { shouldRender: true, banner: <AuditorBanner /> },
      { shouldRender: true, banner: <SponsorBanner /> },
      { shouldRender: true, banner: <PaycardBanner /> },
      { shouldRender: true, banner: <FCBanner /> },
      { shouldRender: true, banner: <PoolBanner /> },
      { shouldRender: true, banner: <WillBanner /> },
      { shouldRender: true, banner: <WorldBanner /> },
      { shouldRender: true, banner: <SSIBanner /> },
      { shouldRender: true, banner: <ProfileBanner /> },
    ]

    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      { shouldRender: true, banner: <FreeTokensBanner /> },
      { shouldRender: true, banner: <LeviathanBanner /> },
    ]
    return [...NO_SHUFFLE_BANNERS, ...shuffle(SHUFFLE_BANNERS)]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [])
}
