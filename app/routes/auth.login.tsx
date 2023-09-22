import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import authenticator from "~/services/auth.server"
import { sessionStorage } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/'
  });

  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  const error = session.get('sessionErrorKey');

  return json<any>({ error });
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const res = await authenticator.authenticate('form', request, {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    throwOnError: true,
    context
  });
  return res;
}

export default function Login() {
  const loaderData = useLoaderData<typeof loader>();

  return <div>
    <h1>
      Login page
    </h1>
    <Form method="post" className="flex flex-col w-2/4">
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button>Sign in</button>
    </Form>
    <div>
      {loaderData?.error && <span>Error: {loaderData?.error?.message}</span>}
    </div>
  </div>
}