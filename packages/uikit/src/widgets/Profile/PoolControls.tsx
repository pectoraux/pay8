import { useCallback, useEffect, useMemo, useRef, useState, ReactElement } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import partition from "lodash/partition";
import { useTranslation } from "@pancakeswap/localization";
import { useIntersectionObserver } from "@pancakeswap/hooks";
import latinise from "@pancakeswap/utils/latinise";
import { useRouter } from "next/router";
import { useWatchlistTokens } from "../../../../../apps/web/src/state/user/hooks";

import PoolTabButtons from "./PoolTabButtons";
import { ViewMode } from "../../components/ToggleView/ToggleView";
import { Flex, Text, SearchInput, Select, OptionProps } from "../../components";

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

const NUMBER_OF_POOLS_VISIBLE = 12;

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
}

export function PoolControls<T>({
  pools,
  children,
  stakedOnly,
  setStakedOnly,
  viewMode,
  setViewMode,
  mineOnly,
  setMineOnly,
  followingOnly,
  followersOnly,
  setFollowersOnly,
  setFollowingOnly,
  account,
  threshHold,
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
  const chosenPoolsLength = useRef(0);
  const [watchlistTokens] = useWatchlistTokens();

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools]);
  const openPoolsWithStartBlockFilter = useMemo(
    () => openPools.filter((pool) => (threshHold > 0 && pool.startBlock ? Number(pool.startBlock) < threshHold : true)),
    [threshHold, openPools]
  );
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        return pool.owner?.toLowerCase() === account?.toLowerCase();
      }),
    [finishedPools]
  );
  const stakedOnlyOpenPools = useCallback(() => {
    return openPoolsWithStartBlockFilter.filter((pool: any) => {
      const res = pool?.accounts?.filter((acc: any) => acc?.ownerAddress?.toLowerCase() === account?.toLowerCase());
      console.log("resres==================>", res);
      return !!res?.length;
    });
  }, [openPoolsWithStartBlockFilter]);
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0;
  console.log("1resres================>", stakedOnly, stakedOnlyOpenPools());
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
  const showFinishedPools = router.pathname.includes("history");

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
      .filter((p: any) => (favoritesOnly ? watchlistTokens.includes(p?.earningToken?.address) : true));

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase());
      return sortedPools.filter((pool: any) => latinise(pool?.name?.toLowerCase() || "").includes(lowercaseQuery));
    }
    return sortedPools;
  }, [account, sortOption, chosenPools, favoritesOnly, numberOfPoolsVisible, searchQuery, watchlistTokens]);

  chosenPoolsLength.current = chosenPools.length;

  const childrenReturn: ChildrenReturn<T> = useMemo(
    () => ({ chosenPools, stakedOnly, viewMode, normalizedUrlSearch, showFinishedPools }),
    [chosenPools, normalizedUrlSearch, showFinishedPools, stakedOnly, viewMode]
  );

  return (
    <>
      <PoolControlsView>
        <PoolTabButtons
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          hasStakeInFinishedPools={hasStakeInFinishedPools}
          mineOnly={mineOnly}
          setMineOnly={setMineOnly}
          followingOnly={followingOnly}
          followersOnly={followersOnly}
          setFollowersOnly={setFollowersOnly}
          setFollowingOnly={setFollowingOnly}
          account={account}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <FilterContainer>
          <LabelWrapper>
            <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
              {t("Sort by")}
            </Text>
            <ControlStretch>
              <Select
                options={[
                  {
                    label: t("Profile ID"),
                    value: "id",
                  },
                  {
                    label: t("Follower Count"),
                    value: "hot",
                  },
                  {
                    label: t("Followee Count"),
                    value: "apr",
                  },
                ]}
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
              placeholder={t("Search Profiles")}
            />
          </LabelWrapper>
        </FilterContainer>
      </PoolControlsView>
      {children(childrenReturn)}
      <div ref={observerRef} />
    </>
  );
}
