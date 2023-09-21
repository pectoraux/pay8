import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'
import EthBanner from '../EthBanner'
import CompetitionBanner from '../CompetitionBanner'
import IFOBanner from '../IFOBanner'
import V3LaunchBanner from '../V3LaunchBanner'
import PerpetualBanner from '../PerpetualBanner'
import LiquidStakingBanner from '../LiquidStakingBanner'
import { GameBanner } from '../GameBanner'
import { BettingBanner } from '../BettingBanner'
import FarmV3MigrationBanner from '../FarmV3MigrationBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'
import useIsRenderIfoBanner from './useIsRenderIFOBanner'
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
  const isRenderIFOBanner = useIsRenderIfoBanner()
  const isRenderCompetitionBanner = useIsRenderCompetitionBanner()

  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      { shouldRender: true, banner: <FreeTokensBanner /> },
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
      { shouldRender: true, banner: <LeviathanBanner /> },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
      // {
      //   shouldRender: isRenderCompetitionBanner,
      //   banner: <CompetitionBanner />,
      // },
      // {
      //   shouldRender: true,
      //   banner: <PerpetualBanner />,
      // },
    ]
    return [...NO_SHUFFLE_BANNERS, ...shuffle(SHUFFLE_BANNERS)]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [isRenderIFOBanner, isRenderCompetitionBanner])
}
