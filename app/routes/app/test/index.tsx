import { Link, type LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  throw new Response("about-error", {
    status: 400,
  });
};

export default function Test() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/app">App</Link>
    </div>
  );
}
