import { query, RequireKey } from "@/util/graphql/zeus/client";

export const adminInfo = async () => {
  const res = await query({
    adminInfo: {
      name: true,
      role: true,
      displayName: true,
      phone: true,
      tenantName: true,
    },
  });

  return res as RequireKey<typeof res>;
};
