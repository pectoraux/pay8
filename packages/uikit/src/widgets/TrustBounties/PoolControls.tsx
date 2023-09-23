import { useCallback, useEffect, useMemo, useRef, useState, ReactElement } from "react";
import styled from "styled-components";
import partition from "lodash/partition";
import { useTranslation } from "@pancakeswap/localization";
import { useIntersectionObserver } from "@pancakeswap/hooks";
import latinise from "@pancakeswap/utils/latinise";
import { useRouter } from "next/router";

import PoolTabButtons from "./PoolTabButtons";
import { ViewMode } from "../../components/ToggleView/ToggleView";
import { Flex, Text, SearchInput, Select, OptionProps } from "../../components";
import { useWatchlistTokens } from "../../../../../apps/web/src/state/user/hooks";

import { DeserializedPool } from "./types";
import { sortPools } from "./helpers";

const PoolControlsView = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`;

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`;

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`;

const NUMBER_OF_POOLS_VISIBLE = 122;

interface ChildrenReturn<T> {
  chosenPools: DeserializedPool<T>[];
  viewMode: ViewMode;
  stakedOnly: boolean;
  showFinishedPools: boolean;
  normalizedUrlSearch: string;
}

interface PoolControlsPropsType<T> {
  pools: DeserializedPool<T>[];
  children: (childrenReturn: ChildrenReturn<T>) => ReactElement;
  stakedOnly: boolean;
  setStakedOnly: (s: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (s: ViewMode) => void;
  account: string;
  threshHold: number;
  hideViewMode?: boolean;
}

export function PoolControls<T>({
  pools,
  children,
  stakedOnly,
  setStakedOnly,
  viewMode,
  setViewMode,
  account,
  threshHold,
  hideViewMode = false,
}: any) {
  const router = useRouter();
  const { t } = useTranslation();

  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE);
  const { observerRef, isIntersecting } = useIntersectionObserver();
  const normalizedUrlSearch = useMemo(
    () => (typeof router?.query?.search === "string" ? router.query.search : ""),
    [router.query]
  );
  const [_searchQuery, setSearchQuery] = useState("");
  const searchQuery = normalizedUrlSearch && !_searchQuery ? normalizedUrlSearch : _searchQuery;
  const [sortOption, setSortOption] = useState("hot");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [watchlistTokens] = useWatchlistTokens();
  const chosenPoolsLength = useRef(0);

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools]);
  const openPoolsWithStartBlockFilter = useMemo(
    () =>
      openPools.filter((pool) =>
        threshHold > 0 && pool.startTimestamp ? Number(pool.startTimestamp) < threshHold : true
      ),
    [threshHold, openPools]
  );
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        return router.asPath.includes("valuepools")
          ? pool.devaddr_?.toLowerCase() === account?.toLowerCase()
          : pool.owner?.toLowerCase() === account?.toLowerCase();
      }),
    [finishedPools]
  );
  const stakedOnlyOpenPools = useCallback(() => {
    return openPoolsWithStartBlockFilter.filter((pool) => {
      return router.asPath.includes("valuepools")
        ? pool.devaddr_?.toLowerCase() === account?.toLowerCase()
        : pool.owner?.toLowerCase() === account?.toLowerCase();
    });
  }, [openPoolsWithStartBlockFilter]);

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
        if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
          return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE;
        }
        return poolsCurrentlyVisible;
      });
    }
  }, [isIntersecting]);
  const showFinishedPools = router.asPath.includes("manual");

  const handleChangeSearchQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value),
    []
  );

  const handleSortOptionChange = useCallback((option: OptionProps) => setSortOption(option.value), []);

  let chosenPools: any;
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools;
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools() : openPoolsWithStartBlockFilter;
  }

  chosenPools = useMemo(() => {
    const sortedPools = sortPools<T>(sortOption, chosenPools)
      .slice(0, numberOfPoolsVisible)
      .filter((p: any) =>
        favoritesOnly ? watchlistTokens.includes(router.asPath.includes("valuepools") ? p?.id : p.timestamp) : true
      );

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase());
      return sortedPools.filter(
        (p: any) =>
          latinise(
            `${p?.devaddr_?.toLowerCase()} ${p?.description?.toLowerCase()} ${p?.owner?.toLowerCase() ?? ""} ${
              p?.symbol?.toLowerCase() ?? ""
            } ${p?.countries?.toLowerCase() ?? ""} ${p?.cities?.toLowerCase() ?? ""} ${
              p?.products?.toLowerCase() ?? ""
            }` || ""
          ).includes(lowercaseQuery) || latinise(p?.id || "").includes(lowercaseQuery)
      );
    }
    return sortedPools;
  }, [account, sortOption, chosenPools, favoritesOnly, numberOfPoolsVisible, searchQuery, watchlistTokens]);

  chosenPoolsLength.current = chosenPools.length;

  const childrenReturn: ChildrenReturn<T> = useMemo(
    () => ({ chosenPools, stakedOnly, viewMode, normalizedUrlSearch, showFinishedPools }),
    [chosenPools, normalizedUrlSearch, showFinishedPools, stakedOnly, viewMode]
  );
  let vaOptions = [
    {
      label: t("Created At"),
      value: "timestamp",
    },
    {
      label: t("Min Ticket Price"),
      value: "minTicketPrice",
    },
    {
      label: t("Min To Switch"),
      value: "minToSwitch",
    },
    {
      label: t("Max Supply"),
      value: "maxSupply",
    },
    {
      label: t("BNPL"),
      value: "bnpl",
    },
    {
      label: t("1 Person 1 Vote"),
      value: "onePersonOneVote",
    },
    {
      label: t("Riskpool"),
      value: "riskpool",
    },
    {
      label: t("Supply"),
      value: "supply",
    },
    {
      label: t("Total paid by sponsors"),
      value: "totalpaidBySponsors",
    },
    {
      label: t("Total Liquidity"),
      value: "totalLiquidity",
    },
    {
      label: t("Ve Balance"),
      value: "veBalance",
    },
  ];
  const tbOptions = [
    {
      label: t("Created At"),
      value: "timestamp",
    },
    {
      label: t("By ID"),
      value: "id",
    },
    {
      label: t("By NFT Collateral"),
      value: "isNFT",
    },
    {
      label: t("By Native Collateral"),
      value: "isNativeCoin",
    },
    {
      label: t("Min To Claim"),
      value: "minToClaim",
    },
    {
      label: t("By Parent Bount IDs"),
      value: "parentBountyId",
    },
    {
      label: t("Total Liquidity"),
      value: "totalLiquidity",
    },
  ];
  const smOptions = [
    {
      label: t("Created At"),
      value: "timestamp",
    },
  ];
  return (
    <>
      <PoolControlsView>
        <PoolTabButtons
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          viewMode={viewMode}
          setViewMode={setViewMode}
          hideViewMode={hideViewMode}
        />
        <FilterContainer style={{ marginLeft: "1px", paddingBottom: "16px" }}>
          <LabelWrapper>
            <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
              {t("Sort by")}
            </Text>
            <ControlStretch>
              <Select
                options={
                  router.asPath.includes("valuepool")
                    ? vaOptions
                    : router.asPath.includes("trustbounties")
                    ? tbOptions
                    : smOptions
                }
                onOptionChange={handleSortOptionChange}
              />
            </ControlStretch>
          </LabelWrapper>
          <LabelWrapper style={{ marginLeft: 16 }}>
            <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
              {t("Search")}
            </Text>
            <SearchInput
              initialValue={searchQuery}
              onChange={handleChangeSearchQuery}
              placeholder={t("Search by addresses")}
            />
          </LabelWrapper>
        </FilterContainer>
      </PoolControlsView>
      {children(childrenReturn)}
      <div ref={observerRef} />
    </>
  );
}
