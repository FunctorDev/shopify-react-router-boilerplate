import { useTRPC } from "@/lib/trpc/react";
import { makeApi, getQueryClient } from "@/lib/trpc/server";
import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query";
import React from "react";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";

const url = `https://terminals-wicked-group-circle.trycloudflare.com?shop=${encodeURIComponent("quickstart-94b3bcac.myshopify.com")}`;

export const loader = async (loaderArgs: LoaderFunctionArgs) => {
  const queryClient = getQueryClient();
  const api = await makeApi(loaderArgs);

  await queryClient.prefetchQuery(api.test.user.queryOptions());

  return {
    dehydratedState: dehydrate(queryClient),
  };
};

const DebugPage = () => {
  const { dehydratedState } = useLoaderData<typeof loader>();

  const api = useTRPC();

  const helloQuery = useQuery(api.test.user.queryOptions());

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="container mx-auto py-5">
        <h1 className="text-center text-xl font-mono mb-8">Debug Page</h1>

        <pre>{helloQuery.status}</pre>

        <pre>{JSON.stringify(helloQuery.data, null, 2)}</pre>
      </div>
    </HydrationBoundary>
  );
};

export default DebugPage;
