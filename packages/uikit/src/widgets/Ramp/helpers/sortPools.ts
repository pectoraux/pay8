import orderBy from "lodash/orderBy";

export function sortPools<T>(sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "mintable":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.mintable), "desc");
    case "minted":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.minted), "desc");
    case "burnt":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.burnt), "desc");
    case "maxPartners":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.maxPartners), "desc");
    case "salePrice":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.salePrice), "desc");
    case "status":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.status), "desc");
    default:
      return poolsToSort;
  }
}
