import { config, makeDocumentResponseHeaders } from "@/.server/shopify";
import { data, type LoaderFunctionArgs, useLoaderData } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const exitIframe = url.searchParams.get("exitIframe");
  const destination = exitIframe ? new URL(exitIframe, config.appUrl) : null;

  return data(
    {
      destination: destination?.toString(),
    },
    {
      headers: makeDocumentResponseHeaders(url.searchParams.get("shop")),
    },
  );
};

const ExitIframe = () => {
  const { destination } = useLoaderData<typeof loader>();

  if (destination) {
    window.open(destination);
  }

  return null;
};

export default ExitIframe;
