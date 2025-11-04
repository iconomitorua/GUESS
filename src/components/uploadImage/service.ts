import { query, mutation } from "@/util/graphql";

export const aliossToken = async (params?: any) => {
  return query(
    {
      aliossToken: [
        { limitSize: 2 },
        {
          expire: true,
          policy: true,
          signature: true,
          accessId: true,
          host: true,
          dir: true,
          downloadHost: true,
        },
      ],
    },
    { variables: params }
  );
};
