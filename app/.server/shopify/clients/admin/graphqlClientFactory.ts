import type { GraphQLClient } from "@/.server/shopify/clients/types";
import type { BasicParams } from "@/.server/shopify/types";
import type { AdminOperations } from "@shopify/admin-api-client";
import type { Session } from "@shopify/shopify-api";

export const graphqlClientFactory = (
  params: BasicParams,
  session: Session,
): GraphQLClient<AdminOperations> => {
  return async function query(operation, options) {
    const client = new params.api.clients.Graphql({
      session,
      apiVersion: options?.apiVersion,
    });

    const apiResponse = await client.request(operation, {
      variables: options?.variables,
      retries: options?.tries ? options.tries - 1 : 0,
      headers: options?.headers,
      signal: options?.signal,
    });

    return new Response(JSON.stringify(apiResponse));
  };
};
