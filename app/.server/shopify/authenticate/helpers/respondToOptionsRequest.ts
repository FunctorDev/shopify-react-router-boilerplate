import { ensureCORSHeadersFactory } from "@/.server/shopify/authenticate/helpers/ensureCORSHeadersFactory";
import type { MiddlewareFunction } from "@/.server/shopify/types";
import { data } from "react-router";

export const respondToOptionsRequest: (
  corsHeaders?: string[],
) => MiddlewareFunction =
  (corsHeaders) => async (params, request, response, next) => {
    if (request.method === "OPTIONS") {
      const ensureCORSHeaders = ensureCORSHeadersFactory(
        params,
        request,
        corsHeaders,
      );

      ensureCORSHeaders(response);
      response.headers.set("Access-Control-Max-Age", "7200");

      throw new Response(undefined, {
        status: 204,
        headers: response.headers,
      });
    }

    return next();
  };
