import { SWRCache } from "./swr.ts";

const ONE_HOUR_SECONDS = 60 * 60;

export const domainSWRCache = new SWRCache<string | null>(
  "domain-swr",
  ONE_HOUR_SECONDS,
);

export const purge = async (...domains: string[]): Promise<void> => {
  await Promise.all(domains.map((domain) => domainSWRCache.delete(domain)));
};
