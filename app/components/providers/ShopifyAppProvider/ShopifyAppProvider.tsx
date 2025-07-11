import Link from "./Link";
import {
  AppProvider as PolarisAppProvider,
  type AppProviderProps as PolarisAppProviderProps,
} from "@shopify/polaris";
import englishI18n from "@shopify/polaris/locales/en.json";
import { SHOPIFY_APP_BRIDGE_URL } from "@/config/shopify";

export interface AppProviderProps
  extends Omit<PolarisAppProviderProps, "linkComponent" | "i18n"> {
  apiKey: string;
  i18n?: PolarisAppProviderProps["i18n"];
}

const ShopifyAppProvider = ({
  children,
  apiKey,
  i18n,
  ...props
}: AppProviderProps) => {
  return (
    <>
      <script src={SHOPIFY_APP_BRIDGE_URL} data-api-key={apiKey} />

      <PolarisAppProvider
        {...props}
        i18n={i18n || englishI18n}
        linkComponent={Link}
      >
        {children}
      </PolarisAppProvider>
    </>
  );
};

export default ShopifyAppProvider;
