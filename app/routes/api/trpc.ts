import { createTRPCContext } from "@/.server/trpc/init";
import { appRouter } from "@/.server/trpc/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

const createContext = (args: LoaderFunctionArgs | ActionFunctionArgs) => {
  const innerContext = createTRPCContext({
    headers: args.request.headers,
  });

  return {
    ...innerContext,
    request: args.request,
  };
};

export const loader = async (args: LoaderFunctionArgs) => {
  return handleRequest(args);
};

export const action = async (args: ActionFunctionArgs) => {
  return handleRequest(args);
};

function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: args.request,
    router: appRouter,
    createContext: () => createContext(args),
  });
}
