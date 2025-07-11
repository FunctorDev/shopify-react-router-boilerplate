import type { MiddlewareFunction } from "@/.server/shopify/types";
import { isbot } from "isbot";
import { data } from "react-router";

const SHOPIFY_POS_USER_AGENT = /Shopify POS\//;
const SHOPIFY_MOBILE_USER_AGENT = /Shopify Mobile\//;

const SHOPIFY_USER_AGENTS = [SHOPIFY_POS_USER_AGENT, SHOPIFY_MOBILE_USER_AGENT];

export const respondToBotRequest: MiddlewareFunction = async (
  params,
  request,
  response,
  next,
) => {
  const userAgent = request.headers.get("User-Agent") ?? "";

  // We call isbot below to prevent good (self-identifying) bots from triggering auth requests, but there are some
  // Shopify-specific cases we want to allow that are identified as bots by isbot.
  if (SHOPIFY_USER_AGENTS.some((agent) => agent.test(userAgent))) {
    return next();
  }

  if (isbot(userAgent)) {
    throw new Response(undefined, {
      status: 410,
      statusText: "Gone",
    });
  }

  return next();
};
