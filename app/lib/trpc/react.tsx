import { createQueryClient } from "./query-client";
import type { AppRouter } from "@/.server/trpc/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import SuperJSON from "superjson";

let clientQueryClientSingleton: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }

  // Browser: use singleton pattern to keep the same query client
  clientQueryClientSingleton ??= createQueryClient();

  return clientQueryClientSingleton;
}

const getBaseUrl = () => {
  console.log("getBaseUrl: ", import.meta.env);

  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.SHOPIFY_APP_URL) return process.env.SHOPIFY_APP_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const getApiUrl = () => {
  const baseUrl = getBaseUrl();

  if (typeof window === "undefined") {
    const shop = process.env.VITE_PUBLIC_SHOP!;

    return `${baseUrl}/api/trpc?shop=${shop}`;
  }

  const shop = import.meta.env.VITE_PUBLIC_SHOP;

  return `${baseUrl}/api/trpc?shop=${shop}`;
};

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

const TRPCReactProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),

        httpBatchLink({
          transformer: SuperJSON,
          url: getApiUrl(),
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "react");
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
};

export default TRPCReactProvider;
