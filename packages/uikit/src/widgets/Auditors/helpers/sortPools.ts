import orderBy from "lodash/orderBy";

export function sortPools<T>(sortOption: string, poolsToSort: any) {
  switch (sortOption) {
    case "likes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.likes), "desc");
    case "dislikes":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.dislikes), "desc");
    case "percentiles":
      return orderBy(poolsToSort, (pool: any) => Number(pool?.percentiles), "desc");
    case "color":
      return orderBy(
        poolsToSort,
        (pool: any) => (pool?.color === "Gold" ? 3 : pool?.color === "Silver" ? 2 : pool?.color === "Brown" ? 1 : 0),
        "desc"
      );
    default:
      return poolsToSort;
  }
}
