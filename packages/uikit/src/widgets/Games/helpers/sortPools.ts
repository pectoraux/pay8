import orderBy from "lodash/orderBy";

export function sortPools<T>(sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "likes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.likes), "desc");
    case "dislikes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.dislikes), "desc");
    case "mintFee":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.mintFee), "desc");
    case "burnFee":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.burnFee), "desc");
    case "users":
      return orderBy(poolsToSort, (pool: any) => pool?.accounts?.length, "desc");
    default:
      return poolsToSort;
  }
}
