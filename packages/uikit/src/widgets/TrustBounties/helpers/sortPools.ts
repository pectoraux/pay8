import orderBy from "lodash/orderBy";

export function sortPools<T>(sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "minTicketPrice":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.minTicketPrice), "desc");
    case "minToSwitch":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.minToSwitch), "desc");
    case "maxSupply":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.maxSupply), "desc");
    case "bnpl":
      return orderBy(poolsToSort, (pool: any) => Number(!!pool?.bnpl), "desc");
    case "onePersonOneVote":
      return orderBy(poolsToSort, (pool: any) => Number(!!pool?.onePersonOneVote), "desc");
    case "riskpool":
      return orderBy(poolsToSort, (pool: any) => Number(!!pool?.riskpool), "desc");
    case "supply":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.supply), "desc");
    case "totalpaidBySponsors":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.totalpaidBySponsors), "desc");
    case "totalLiquidity":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.totalLiquidity), "desc");
    case "veBalance":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.veBalance), "desc");
    case "id":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.id), "desc");
    case "isNFT":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.isNFT), "desc");
    case "isNativeCoin":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.isNativeCoin), "desc");
    case "minToClaim":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.minToClaim), "desc");
    case "parentBountyId":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.parentBountyId), "desc");
    case "totalLiquidity":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.totalLiquidity), "desc");
    default:
      return orderBy(poolsToSort, (pool: any) => Number(pool?.timestamp), "desc");
  }
}
