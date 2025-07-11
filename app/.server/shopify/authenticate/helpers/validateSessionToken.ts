import type { BasicParams } from "@/.server/shopify/types";

export const validateSessionToken = async (
  params: BasicParams,
  request: Request,
  token: string,
) => {
  return await params.api.session.decodeSessionToken(token);
};
