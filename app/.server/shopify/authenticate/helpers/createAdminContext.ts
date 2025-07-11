import { adminClientFactory } from "@/.server/shopify/clients/admin/adminClientFactory";
import type { BasicParams, SessionTokenContext } from "@/.server/shopify/types";
import type { Session } from "@shopify/shopify-api";

export const createAdminContext = (
  params: BasicParams,
  request: Request,
  sessionTokenContext: SessionTokenContext,
  session: Session,
) => {
  return adminClientFactory(params, session);
};
