import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAuthenticatedUser } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
 return json(await getAuthenticatedUser(request));
};

export default function Account() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix {data?.email}</h1>
    </div>
  );
}
