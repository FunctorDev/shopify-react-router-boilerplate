export function makeDocumentResponseHeaders(shop: string | null | undefined) {
  const headers = new Headers();

  if (shop) {
    headers.set(
      "Link",
      '<https://cdn.shopify.com/shopifycloud/app-bridge.js>; rel="preload"; as="script";',
    );

    headers.set(
      "Content-Security-Policy",
      `frame-ancestors https://${shop} https://admin.shopify.com https://*.spin.dev https://admin.myshopify.io https://admin.shop.dev;`,
    );
  }

  return headers;
}
