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
    case "updatedAt":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.updatedAt), "desc");
    case "maxPartners":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.maxPartners), "desc");
    case "totalRevenue":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.totalRevenue), "desc");
    case "totalUnderCollateralized":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.totalUnderCollateralized), "desc");
    default:
      return poolsToSort;
  }
}
