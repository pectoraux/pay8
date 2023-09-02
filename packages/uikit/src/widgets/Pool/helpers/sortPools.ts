import orderBy from "lodash/orderBy";

export function sortPools<T>(sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "timestamp":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.timestamp), "desc");
    case "name":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.name), "desc");
    case "symbol":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.symbol), "desc");
    case "totalLiquidity":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.totalLiquidity), "desc");
    case "toDistribute":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.toDistribute), "desc");
    default:
      return poolsToSort;
  }
}
