import type { GraphQLClient } from "@/.server/shopify/clients/types";
import type { AdminOperations } from "@shopify/admin-api-client";

export interface AdminApiContext {
  graphql: GraphQLClient<AdminOperations>;
}
