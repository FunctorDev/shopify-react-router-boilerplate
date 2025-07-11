import { createQueryClient } from "./query-client";
import { createTRPCContext } from "@/.server/trpc/init";
import { appRouter } from "@/.server/trpc/root";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

const createContext = (opts: { request: Request }) => {
  const headers = new Headers(opts.request.headers);
  headers.set("x-trpc-source", "server-loader");

  const innerContext = createTRPCContext({
    headers,
  });

  return {
    ...innerContext,
    request: opts.request,
  };
};

export const getQueryClient = cache(createQueryClient);

export const makeApi = cache(
  async (args: LoaderFunctionArgs | ActionFunctionArgs) => {
    return createTRPCOptionsProxy({
      ctx: createContext(args),
      router: appRouter,
      queryClient: getQueryClient,
    });
  },
);
