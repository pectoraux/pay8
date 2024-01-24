import { Text, Flex, Box, Balance } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { useGetAllResources, useGetGame } from 'state/games/hooks'

import truncateHash from '@pancakeswap/utils/truncateHash'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { format } from 'date-fns'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const objectNames = pool?.objectNames?.map((objectName) => objectName?.name)
  const gameData = useGetGame(pool?.gameAPI, currAccount?.id ?? '0') as any
  const { data: resources } = useGetAllResources(currAccount?.id)
  console.log('gamepool1====>', gameData, currAccount)

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Game Uses')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {pool?.token?.symbol?.toUpperCase() ?? ''}
      </Text>
    </>
  )

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={18}
              value={getBalanceNumber(pool?.totalPaid, pool?.token?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Total Paid')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={18}
              value={getBalanceNumber(pool?.pricePerMinutes, pool?.token?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Price Per Minutes')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={18}
              value={getBalanceNumber(pool?.totalEarned, pool?.token?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Total Earnings')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={1}
              value={parseInt(pool?.teamShare) / 100}
              unit="%"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Team Share')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={1}
              value={parseInt(pool?.creatorShare) / 100}
              unit="%"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Creator Share')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={1}
              value={parseInt(pool?.referrerFee) / 100}
              unit="%"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Referrer Fee')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.id) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={currAccount?.id}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Attached veNFT Token Id')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.score) ? (
              <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currAccount?.score} />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Score')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.scorePercentile) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={currAccount?.scorePercentile}
                unit=" %"
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Score Percentile')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.pricePercentile) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={currAccount?.pricePercentile}
                unit=" %"
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Price Percentile')}
            </Text>
          </Box>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Receiver')}
          </Text>
          <CopyAddress title={truncateHash(currAccount?.receiver ?? '')} account={currAccount?.receiver} />
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.price) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(currAccount?.price, pool?.token?.decimals ?? 18)}
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Price')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.won) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={18}
                value={getBalanceNumber(currAccount?.won, pool?.token?.decimals ?? 18)}
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Winnings')}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {Number(currAccount?.userDeadLine)
              ? format(new Date(parseInt(currAccount?.userDeadLine || 0) * 1000), 'yyyy-MM-dd HH:mm')
              : '-'}
          </Text>
          <Text color="primary" mb="3px" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Closes At')}
          </Text>
          <Text lineHeight="1" mb="3px" fontSize="12px" color="textSubtle" as="span">
            {Number(currAccount?.deadline)
              ? format(new Date(parseInt(currAccount?.deadline || 0) * 1000), 'yyyy-MM-dd HH:mm')
              : '-'}
          </Text>
          <Text color="primary" mb="3px" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Time Played')}
          </Text>
          <Text lineHeight="1" mb="3px" fontSize="12px" color="textSubtle" as="span">
            {objectNames?.length ? objectNames?.toString() : 'N/A'}
          </Text>
          <Text color="primary" mb="3px" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Game Object Names')}
          </Text>
          {resources?.length ? (
            <>
              <Text lineHeight="1" mb="3px" fontSize="12px" color="textSubtle" as="span">
                {resources?.toString()}
              </Text>
              <Text color="primary" mb="3px" fontSize="12px" bold as="span" textTransform="uppercase">
                {t('Resources From Burnt')}
              </Text>
            </>
          ) : null}
          {currAccount ? (
            <>
              <Text lineHeight="1" mb="3px" fontSize="12px" color="textSubtle" as="span">
                {currAccount?.objectNames?.length ? currAccount?.objectNames?.toString() : 'N/A'}
              </Text>
              <Text color="primary" mb="3px" fontSize="12px" bold as="span" textTransform="uppercase">
                {t('Token Object Names')}
              </Text>
            </>
          ) : null}
          {currAccount && currAccount?.lender !== ADDRESS_ZERO ? (
            <>
              <CopyAddress title={truncateHash(currAccount?.lender)} account={currAccount?.lender} />
              <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
                {t('Lender')}
              </Text>
            </>
          ) : null}
          {gameData && !gameData?.error ? (
            <>
              <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                {format(
                  new Date(parseInt(Object.values(gameData?.data?.deadline)?.toString() || '0') * 1000),
                  'yyyy-MM-dd HH:mm',
                )}
              </Text>
              <Text color="primary" mb="3px" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Deadline')}
              </Text>
              <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                {Object.values(gameData?.data?.score ?? gameData?.data?.value)?.toString()}
              </Text>
              <Text color="primary" mb="3px" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Score')}
              </Text>
            </>
          ) : null}
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
