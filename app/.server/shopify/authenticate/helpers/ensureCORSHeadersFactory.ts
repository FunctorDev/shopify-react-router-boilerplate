import type { BasicParams } from "@/.server/shopify/types";
import { REAUTH_URL_HEADER } from "@/config/shopify";

export const ensureCORSHeadersFactory = (
  { config }: BasicParams,
  request: Request,
  corsHeaders: string[] = [],
) => {
  return function ensureCORSHeaders(response: Response) {
    const origin = request.headers.get("Origin");

    if (origin && origin !== config.appUrl) {
      const corsHeadersSet = new Set([
        "Authorization",
        "Content-Type",
        ...corsHeaders,
      ]);

      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set(
        "Access-Control-Allow-Headers",
        [...corsHeadersSet].join(", "),
      );
      response.headers.set("Access-Control-Expose-Headers", REAUTH_URL_HEADER);
    }
  };
};
