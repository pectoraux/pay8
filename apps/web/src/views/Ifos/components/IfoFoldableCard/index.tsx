import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ExpandableButton,
  ExpandableLabel,
  useMatchBreakpoints,
  useToast,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Ifo, PoolIds } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { useIsWindowVisible } from '@pancakeswap/hooks'
import useSWRImmutable from 'swr/immutable'
import { FAST_INTERVAL } from 'config/constants'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import styled from 'styled-components'
import { requiresApproval } from 'utils/requiresApproval'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useIfoApprove from '../../hooks/useIfoApprove'
import { CardsWrapper } from '../IfoCardStyles'
import IfoAchievement from './Achievement'
import IfoPoolCard from './IfoPoolCard'
import { IfoRibbon } from './IfoRibbon'
import { EnableStatus } from './types'

interface IfoFoldableCardProps {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const StyledCard = styled(Card)<{ $isCurrent?: boolean }>`
  width: 100%;
  margin: auto;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;

  ${({ $isCurrent }) =>
    $isCurrent &&
    `
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  > div {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  `}

  > div {
    background: ${({ theme, $isCurrent }) => ($isCurrent ? theme.colors.gradientBubblegum : theme.colors.dropdown)};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;

    > div {
      border-top-left-radius: 32px;
      border-top-right-radius: 32px;
    }
  }
`

const Header = styled(CardHeader)<{ ifoId; $isCurrent?: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: ${({ $isCurrent }) => ($isCurrent ? '64px' : '112px')};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  background-image: ${({ ifoId }) => `url('/images/cancan/${ifoId}.jpg')`};
  ${({ theme }) => theme.mediaQueries.md} {
    height: 112px;
  }
`

export const StyledCardBody = styled(CardBody)`
  padding: 24px 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
`

const StyledCardFooter = styled(CardFooter)`
  padding: 0;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  text-align: center;
`

const StyledNoHatBunny = styled.div<{ $isLive: boolean; $isCurrent?: boolean }>`
  position: absolute;
  left: -24px;
  z-index: 1;
  top: 33px;
  display: none;

  > img {
    width: 78px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    display: block;
    left: auto;
    top: ${({ $isLive }) => ($isLive ? '63px' : '48px')};
    right: ${({ $isCurrent }) => ($isCurrent ? '17px' : '90px')};

    > img {
      width: 123px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 90px;
  }
`

const NoHatBunny = ({ isLive, isCurrent }: { isLive?: boolean; isCurrent?: boolean }) => {
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const isSmallerThanTablet = isXs || isSm || isMd
  if (isSmallerThanTablet && isLive) return null
  return (
    <StyledNoHatBunny $isLive={isLive} $isCurrent={isCurrent}>
      <img
        src={`/images/ifos/assets/bunnypop-${!isSmallerThanTablet ? 'right' : 'left'}.png`}
        width={123}
        height={162}
        alt="bunny"
      />
    </StyledNoHatBunny>
  )
}

// Active Ifo
export const IfoCurrentCard = ({ ifo, data, refetch }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Box position="relative" width="100%" maxWidth={['400px', '400px', '400px', '400px', '400px', '100%']}>
      <StyledCard $isCurrent>
        {!isMobile && (
          <>
            <Header $isCurrent ifoId={1} />
            <IfoRibbon data={data} status={data?.bid?.length && parseInt(data?.bid[0]) ? 'live' : 'coming_soon'} />
          </>
        )}
        <IfoCard ifo={ifo} data={data} refetch={refetch} />
        <StyledCardFooter>
          <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? t('Hide') : t('Details')}
          </ExpandableLabel>
          {isExpanded && <IfoAchievement ifo={ifo} data={data} />}
        </StyledCardFooter>
      </StyledCard>
    </Box>
  )
}

const FoldableContent = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`

// Past Ifo
const IfoFoldableCard = ({ ifo, index, status, refetch, data }) => {
  const { asPath } = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const wrapperEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hash = asPath.split('#')[1]
    if (hash === ifo.id) {
      setIsExpanded(true)
      wrapperEl?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [asPath, ifo])

  return (
    <Box id={ifo.id} ref={wrapperEl} position="relative">
      <Box as={StyledCard} borderRadius="32px">
        <Box position="relative">
          <Header ifoId={index + 50}>
            <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
          </Header>
          {isExpanded && (
            <>
              <IfoRibbon status="finished" data={data} />
            </>
          )}
        </Box>
        <FoldableContent isVisible={isExpanded}>
          <IfoCard ifo={ifo} status={status} data={data} refetch={refetch} walletIfoData={data} />
          <IfoAchievement ifo={ifo} publicIfoData={data} />
        </FoldableContent>
      </Box>
    </Box>
  )
}

const IfoCard: React.FC<any> = ({ ifo, status, data, refetch }) => {
  const [enableStatus, setEnableStatus] = useState(EnableStatus.DISABLED)
  const { t } = useTranslation()
  const onApprove = useIfoApprove()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      setEnableStatus(EnableStatus.IS_ENABLING)
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(
        t('Successfully Enabled!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now participate in the bidding process.')}
        </ToastDescriptionWithTx>,
      )
      setEnableStatus(EnableStatus.ENABLED)
    } else {
      setEnableStatus(EnableStatus.DISABLED)
    }
  }
  return (
    <>
      <StyledCardBody>
        <CardsWrapper shouldReverse={false} singleCard>
          <IfoPoolCard
            poolId={PoolIds.poolBasic}
            ifo={ifo}
            data={data}
            refetch={refetch}
            status={status}
            onApprove={handleApprove}
            enableStatus={enableStatus}
          />
        </CardsWrapper>
      </StyledCardBody>
    </>
  )
}

export default IfoFoldableCard
