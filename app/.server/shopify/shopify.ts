import { makeApiConfig } from "./apiConfig";
import { authStrategyFactory } from "./authenticate/admin/authenticate";
import { shopifyApi } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";

export const config = makeApiConfig();

const api = shopifyApi(config);

export const shopify = {
  authenticate: {
    admin: authStrategyFactory({
      api,
      config,
    }),
  },
};

export const authenticate = shopify.authenticate;
