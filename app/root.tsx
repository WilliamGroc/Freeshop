import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwind from './styles/tailwind.css';
import shared from './styles/shared.css';
import authenticator from "./services/auth.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: tailwind },
  { rel: 'stylesheet', href: shared },
];

export const meta: MetaFunction = () => {
  return [
    { title: "FreeSell" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const isAuthenticated = await authenticator.isAuthenticated(request);
  return json({ isAuthenticated: !!isAuthenticated })
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="page">
          <nav>
            <div className="title">
              <h2><a href="/">FreeSell</a></h2>
            </div>
            {data.isAuthenticated ?
              <>
                <a href="/account">Account</a>
                <Form method="post" className="flex items-center" action="/api/auth/signout">
                  <button type="submit">Logout</button>
                </Form>
              </> :
              <>
                <a href="/auth/login">Login</a>
                <a href="/auth/register">Register</a>
              </>
            }
          </nav>
          <div>
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
