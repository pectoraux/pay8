import orderBy from "lodash/orderBy";

export function sortPools<T>(account: string, sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "id":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.id), "desc");
    case "likes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.likes), "desc");
    case "dislikes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.dislikes), "desc");
    case "updatedAt":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.updatedAt), "desc");
    default:
      return poolsToSort;
  }
}
