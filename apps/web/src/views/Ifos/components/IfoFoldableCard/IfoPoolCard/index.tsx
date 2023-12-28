import { ContextApi, useTranslation } from '@pancakeswap/localization'
import { Box, Card, CardBody, CardHeader, Flex, HelpIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { Ifo, PoolIds } from 'config/constants/types'
import styled from 'styled-components'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { CardConfigReturn, EnableStatus } from '../types'
import IfoCardDetails from './IfoCardDetails'
import IfoCardTokens from './IfoCardTokens'

const StyledCard = styled(Card)`
  width: 100%;
  margin: 0 auto;
  padding: 0 0 3px 0;
  height: fit-content;
`

interface IfoCardProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  onApprove: () => Promise<any>
  enableStatus: EnableStatus
}

export const cardConfig = (
  t: ContextApi['t'],
  poolId: PoolIds,
  meta: {
    version: number
    needQualifiedPoints?: boolean
    needQualifiedNFT?: boolean
  },
): CardConfigReturn => {
  switch (poolId) {
    case PoolIds.poolBasic:
      if (meta?.version >= 3.1) {
        const MSG_MAP = {
          needQualifiedNFT: t('Set PancakeSquad NFT as Pancake Profile avatar.'),
          needQualifiedPoints: t('Reach a certain Pancake Profile Points threshold.'),
        }

        const msgs = Object.keys(meta)
          .filter((criteria) => meta[criteria])
          .map((criteria) => MSG_MAP[criteria])
          .filter(Boolean)

        return {
          title: t('Private Sale'),
          variant: 'blue',
          tooltip: msgs?.length ? (
            <>
              <Text>
                {msgs.length > 1 // one or multiple
                  ? t('Meet any one of the requirements to join:')
                  : t('Meet the following requirement to join:')}
              </Text>
              {msgs.map((msg) => (
                <Text ml="16px" key={msg} as="li">
                  {msg}
                </Text>
              ))}
            </>
          ) : null,
        }
      }

      return {
        title: t('Basic Sale'),
        variant: 'blue',
        tooltip: t(
          'Every person can only commit a limited amount, but may expect a higher return per token committed.',
        ),
      }
    case PoolIds.poolUnlimited:
      return {
        title: meta?.version >= 3.1 ? t('Public Sale') : t('Unlimited Sale'),
        variant: 'violet',
        tooltip: t('No limits on the amount you can commit. Additional fee applies when claiming.'),
      }

    default:
      return { title: '', variant: 'blue', tooltip: '' }
  }
}

const SmallCard: React.FC<any> = ({ poolId, ifo, data, refetch, onApprove, enableStatus, status = 'live' }) => {
  const { t } = useTranslation()

  const needQualifiedNFT = false
  const needQualifiedPoints = false

  const config = cardConfig(t, poolId, {
    version: ifo,
    needQualifiedNFT,
    needQualifiedPoints,
  })

  // const { targetRef, tooltip, tooltipVisible } = useTooltip(config.tooltip, { placement: 'bottom' })

  const isLoading = false

  return (
    <>
      {/* {tooltipVisible && tooltip} */}
      <StyledCard>
        <CardHeader p="16px 24px" variant={config.variant}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text bold fontSize="20px" lineHeight={1}>
              {`Auction For Profile ID #${data?.boughtProfileId}`}
            </Text>
            {/* <div ref={targetRef}>
              <HelpIcon />
            </div> */}
          </Flex>
        </CardHeader>
        <CardBody p="12px">
          <>
            <IfoCardTokens
              data={data}
              refetch={refetch}
              status={status}
              isLoading={isLoading}
              onApprove={onApprove}
              enableStatus={enableStatus}
            />
            <Box pt="24px">
              <IfoCardDetails data={data} status={status} />
            </Box>
          </>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default SmallCard
