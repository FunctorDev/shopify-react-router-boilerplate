import { createAdminContext } from "../helpers/createAdminContext";
import { ensureSessionToken } from "../helpers/ensureSessionToken";
import { respondToBotRequest } from "../helpers/respondToBotRequest";
import { respondToOptionsRequest } from "../helpers/respondToOptionsRequest";
import { tokenExchange } from "../helpers/tokenExchange";
import { validateSessionToken } from "../helpers/validateSessionToken";
import type { AuthenticateAdmin } from "@/.server/shopify/authenticate/admin/types";
import { getSessionToken } from "@/.server/shopify/helpers/getSessionToken";
import { composeMiddlewares } from "@/.server/shopify/middlewares";
import type { BasicParams, SessionTokenContext } from "@/.server/shopify/types";
import type { Session } from "@shopify/shopify-api";

const getSessionTokenContext = async (
  params: BasicParams,
  request: Request,
): Promise<SessionTokenContext> => {
  const sessionToken = getSessionToken(request)!;

  if (params.config.isEmbeddedApp) {
    const payload = await validateSessionToken(params, request, sessionToken);
    const dest = new URL(payload.dest);
    const shop = dest.hostname;
    const onlineSessionId = params.api.session.getJwtSessionId(
      shop,
      payload.sub,
    );
    const offlineSessionId = params.api.session.getOfflineId(shop);

    return {
      shop,
      sessionId: params.config.useOnlineTokens
        ? onlineSessionId
        : offlineSessionId,
      onlineSessionId,
      offlineSessionId,
      sessionToken,
      payload,
    };
  }

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop")!;

  const [offlineSessionId, onlineSessionId] = await Promise.all([
    params.api.session.getOfflineId(shop),

    params.api.session.getCurrentId({
      isOnline: true,
      rawRequest: request,
    }),
  ]);

  return {
    shop,
    sessionId: params.config.useOnlineTokens
      ? onlineSessionId
      : offlineSessionId,
    offlineSessionId,
    onlineSessionId,
    sessionToken,
  };
};

const createContext = (
  params: BasicParams,
  request: Request,
  sessionTokenContext: SessionTokenContext,
  session: Session,
) => {
  return {
    admin: createAdminContext(params, request, sessionTokenContext, session),
  };
};

export const authStrategyFactory = (params: BasicParams): AuthenticateAdmin => {
  return async (request: Request) => {
    try {
      return await composeMiddlewares(
        respondToBotRequest,
        respondToOptionsRequest(),
        ensureSessionToken,
        async (params, request) => {
          const sessionTokenContext = await getSessionTokenContext(
            params,
            request,
          );

          const existingSession = sessionTokenContext.sessionId
            ? await params.config.sessionStorage.loadSession(
                sessionTokenContext.sessionId,
              )
            : undefined;

          const session = await tokenExchange(params, request, {
            session: existingSession,
            sessionToken: sessionTokenContext.sessionToken,
            shop: sessionTokenContext.shop,
          });

          return createContext(params, request, sessionTokenContext, session);
        },
      )(params, request);
    } catch (errorOrResponse: unknown) {
      if (errorOrResponse instanceof Response) {
        throw errorOrResponse;
      }

      throw new Response(undefined, {
        status: 401,
      });
    }
  };
};
