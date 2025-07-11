import type { AuthenticateAdmin } from "@/.server/shopify/authenticate/admin/types";
import {
  type ConfigInterface,
  type JwtPayload,
  Session,
  type Shopify,
} from "@shopify/shopify-api";
import type { SessionStorage } from "@shopify/shopify-app-session-storage";

export interface AppConfig
  extends Omit<ConfigInterface, "future" | "isCustomStoreApp" | "logger"> {
  appUrl: string;
  useOnlineTokens: boolean;
  sessionStorage: SessionStorage;
  auth: {
    loginPath: string;
    sessionTokenBouncePath: string;
  };
}

export interface BasicParams {
  api: Shopify;
  config: AppConfig;
  logger?: Shopify["logger"];
}

export type MiddlewareFunction = (
  params: BasicParams,
  request: Request,
  response: Response,
  next: () => Promise<any>,
) => Promise<any>;

export interface SessionTokenContext {
  shop: string;
  sessionId?: string;
  offlineSessionId?: string;
  onlineSessionId?: string;
  sessionToken: string;
  payload?: JwtPayload;
}

export interface SessionContext {
  shop: string;
  session?: Session;
  sessionToken: string;
}
