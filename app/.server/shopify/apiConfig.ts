import { db } from "@/.server/db";
import type { AppConfig } from "@/.server/shopify/types";
import { ApiVersion } from "@shopify/shopify-api";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";

export const makeApiConfig = (): AppConfig => {
  const appUrl = new URL(process.env.SHOPIFY_APP_URL as string);

  return {
    apiKey: process.env.SHOPIFY_API_KEY as string,
    apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
    apiVersion: ApiVersion.April25,
    appUrl: appUrl.origin,
    scopes: process.env.SCOPES?.split(",") as any,
    hostName: appUrl.host,
    hostScheme: appUrl.protocol.replace(":", "") as "http" | "https",
    isEmbeddedApp: process.env.IS_EMBEDDED_APP === "true",
    useOnlineTokens: false,
    sessionStorage: new PrismaSessionStorage(db),

    auth: {
      loginPath: "/auth/login",
      sessionTokenBouncePath: "/auth/session-token-bounce",
    },
  };
};
