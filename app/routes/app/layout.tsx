import { authenticate } from "@/.server/shopify/shopify";
import ShopifyAppProvider from "@/components/providers/ShopifyAppProvider";
import TRPCReactProvider from "@/lib/trpc/react";
import { NavMenu } from "@shopify/app-bridge-react";
import {
  type HeadersFunction,
  Link,
  type LoaderFunctionArgs,
  Outlet,
  useLoaderData,
  useRouteError,
} from "react-router";

export const ErrorBoundary = () => {
  const error = useRouteError() as any;

  if (
    error.constructor.name === "ErrorResponse" ||
    error.constructor.name === "ErrorResponseImpl"
  ) {
    return <div dangerouslySetInnerHTML={{ __html: error.data }} />;
  }

  throw error;
};

export const headers: HeadersFunction = (headersArgs) => {
  const { parentHeaders, loaderHeaders, actionHeaders, errorHeaders } =
    headersArgs;

  if (errorHeaders && Array.from(errorHeaders.entries()).length > 0) {
    return errorHeaders;
  }

  return new Headers([
    ...(parentHeaders ? Array.from(parentHeaders.entries()) : []),
    ...(loaderHeaders ? Array.from(loaderHeaders.entries()) : []),
    ...(actionHeaders ? Array.from(actionHeaders.entries()) : []),
  ]);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

const AppLayout = () => {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <ShopifyAppProvider apiKey={apiKey}>
      <TRPCReactProvider>
        <NavMenu>
          <Link to="/app" rel="home">
            Home
          </Link>

          <Link to="/app/additional">Additional page</Link>
        </NavMenu>

        <Outlet />
      </TRPCReactProvider>
    </ShopifyAppProvider>
  );
};

export default AppLayout;
