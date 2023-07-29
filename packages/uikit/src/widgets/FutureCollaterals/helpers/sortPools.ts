import orderBy from "lodash/orderBy";

export function sortPools<T>(account: string, sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "fund":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.fund), "desc");
    case "tokenId":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.id), "desc");
    case "channel":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.channel), "desc");
    case "createdAt":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.createdAt), "desc");
    default:
      return poolsToSort;
  }
}
