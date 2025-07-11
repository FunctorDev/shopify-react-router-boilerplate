import { authenticate } from "@/.server/shopify/shopify";
import { Link, type LoaderFunctionArgs, useLoaderData } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`#graphql
    query layout {
      shop {
        name
        description
      }
    }
  `);

  const json = await response.json();

  return json.data;
};

const App = () => {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <h1>Apppppppp!</h1>

      <pre>{JSON.stringify(loaderData, null, 2)}</pre>

      <Link to="/app/test">Test</Link>

      <Link to="/app/debug">Debug</Link>
    </div>
  );
};

export default App;
