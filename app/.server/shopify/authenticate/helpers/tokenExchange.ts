import type { BasicParams, SessionContext } from "@/.server/shopify/types";
import { RequestedTokenType } from "@shopify/shopify-api";

export const tokenExchange = async (
  params: BasicParams,
  request: Request,
  { shop, sessionToken, session }: SessionContext,
) => {
  const STILL_ACTIVE_IN_5_MINUTES = 5 * 60 * 1000;

  if (
    !session ||
    !session.isActive(params.config.scopes, STILL_ACTIVE_IN_5_MINUTES)
  ) {
    const { session: offlineAccessToken } = await params.api.auth.tokenExchange(
      {
        shop,
        sessionToken,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      },
    );

    await params.config.sessionStorage.storeSession(offlineAccessToken);

    const { session: onlineAccessToken } = await params.api.auth.tokenExchange({
      shop,
      sessionToken,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });

    await params.config.sessionStorage.storeSession(onlineAccessToken);

    return onlineAccessToken;
  }

  return session;
};
