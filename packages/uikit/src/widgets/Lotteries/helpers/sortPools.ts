import orderBy from "lodash/orderBy";

export function sortPools<T>(sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "pricePerTicket":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.pricePerTicket), "desc");
    case "endTime":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.endTime), "desc");
    case "startTime":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.startTime), "desc");
    case "userCount":
      return orderBy(poolsToSort, (pool: any) => pool?.users?.length, "desc");
    case "treasuryFee":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.treasuryFee), "desc");
    case "referrerFee":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.referrerFee), "desc");
    default:
      return poolsToSort;
  }
}
