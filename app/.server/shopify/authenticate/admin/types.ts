import type { AdminApiContext } from "@/.server/shopify/clients/admin/types";

interface AdminContextInternal {
  admin: AdminApiContext;
}

export type AuthenticateAdmin = (
  request: Request,
) => Promise<AdminContextInternal>;
