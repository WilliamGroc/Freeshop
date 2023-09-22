import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";
import authenticator, { verifyToken } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  try {
    await verifyToken(request);
    return json({});
  } catch (e) {
    return redirect('/auth/login');
  }
};

export default function Protected() {
  return <Outlet />
}