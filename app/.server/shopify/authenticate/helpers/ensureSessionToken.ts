import { getShopFromRequest } from "@/.server/shopify/authenticate/helpers/getShopFromRequest";
import {
  getSessionTokenFromUrlParam,
  getSessionTokenHeader,
} from "@/.server/shopify/helpers/getSessionToken";
import { composeMiddlewares } from "@/.server/shopify/middlewares";
import type { MiddlewareFunction } from "@/.server/shopify/types";
import { redirect } from "react-router";

const validateShopAndHostParams: MiddlewareFunction = async (
  params,
  request,
  response,
  next,
) => {
  if (params.config.isEmbeddedApp) {
    const shop = params.api.utils.sanitizeShop(getShopFromRequest(request)!);

    if (!shop) {
      throw redirect(params.config.auth.loginPath);
    }

    const host = params.api.utils.sanitizeHost(
      new URL(request.url).searchParams.get("host")!,
    );

    if (!host) {
      throw redirect(params.config.auth.loginPath);
    }
  }

  return next();
};

const ensureAppIsEmbeddedIfRequired: MiddlewareFunction = async (
  params,
  request,
  response,
  next,
) => {
  const url = new URL(request.url);
  const isRequestInEmbedded = url.searchParams.get("embedded") === "1";

  if (params.config.isEmbeddedApp && !isRequestInEmbedded) {
    const redirectTo = await params.api.auth.getEmbeddedAppUrl({
      rawRequest: request,
    });

    throw redirect(redirectTo);
  }

  return next();
};

const ensureSessionTokenSearchParamIfRequired: MiddlewareFunction = async (
  params,
  request,
  response,
  next,
) => {
  const url = new URL(request.url);
  const isRequestInEmbedded = url.searchParams.get("embedded") === "1";
  const sessionToken = getSessionTokenFromUrlParam(request);

  if (params.config.isEmbeddedApp && isRequestInEmbedded && !sessionToken) {
    const url = new URL(request.url);
    url.searchParams.delete("id_token");
    url.searchParams.set(
      "shopify-reload",
      `${params.config.appUrl}${url.pathname}?${url.searchParams.toString()}`,
    );

    throw redirect(
      `${params.config.auth.sessionTokenBouncePath}?${url.searchParams.toString()}`,
    );
  }

  return next();
};

export const ensureSessionToken: MiddlewareFunction = async (
  params,
  request,
  response,
  next,
) => {
  if (!getSessionTokenHeader(request)) {
    return composeMiddlewares(
      validateShopAndHostParams,
      ensureAppIsEmbeddedIfRequired,
      ensureSessionTokenSearchParamIfRequired,
      () => next(),
    )(params, request, response);
  }

  return next();
};
