import { makeDocumentResponseHeaders } from "@/.server/shopify";
import { SHOPIFY_APP_BRIDGE_URL } from "@/config/shopify";
import { data, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = ({ request }) => {
  const shop = new URL(request.url).searchParams.get("shop");

  const html = `
  <head>
      <meta name="shopify-api-key" content="${process.env.SHOPIFY_API_KEY}" />
      <script src="${SHOPIFY_APP_BRIDGE_URL}" data-api-key="${process.env.SHOPIFY_API_KEY}"></script>
  </head>
  `;

  const headers = new Headers([
    ...Array.from(
      new Headers({
        "content-type": "html",
      }).entries(),
    ),

    ...Array.from(makeDocumentResponseHeaders(shop).entries()),
  ]);

  return data(html, {
    headers,
  });
};
