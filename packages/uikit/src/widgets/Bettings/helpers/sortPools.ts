import orderBy from "lodash/orderBy";

export function sortPools<T>(sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "createdAt":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.createdAt), "desc");
    case "updatedAt":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.updatedAt), "desc");
    default:
      return poolsToSort;
  }
}
