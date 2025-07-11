import { graphqlClientFactory } from "@/.server/shopify/clients/admin/graphqlClientFactory";
import type { AdminApiContext } from "@/.server/shopify/clients/admin/types";
import type { BasicParams } from "@/.server/shopify/types";
import type { Session } from "@shopify/shopify-api";

export const adminClientFactory = (
  params: BasicParams,
  session: Session,
): AdminApiContext => {
  return {
    graphql: graphqlClientFactory(params, session),
  };
};
