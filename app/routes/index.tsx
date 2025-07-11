import { Welcome } from "@/modules/welcome/welcome";
import { Link, type LoaderFunctionArgs, redirect } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    return redirect(`/app?${url.searchParams.toString()}`);
  }
};

export default function Home() {
  return (
    <>
      <Link to="/app">/app</Link>

      <Welcome />
    </>
  );
}
