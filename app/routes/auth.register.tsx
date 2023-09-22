import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import authenticator, { hash, signToken } from "~/services/auth.server";
import { prisma } from "~/services/db.server";
import { SessionUser, commitSession, getSession } from "~/services/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email')?.valueOf();
  const password = formData.get('password')?.valueOf();
  const passwordConfirm = formData.get('password_confirm')?.valueOf();

  if (!email)
    throw new Error('No email setted');
  if (!password)
    throw new Error('No password setted');

  if (password !== passwordConfirm)
    throw new Error('Password are different');

  const user = await prisma.user.create({
    data: {
      email: email as string,
      password: await hash(password as string)
    }
  });

  const session = await getSession(request.headers.get('cookie'));

  const sessionUser: SessionUser = {
    token: signToken(user)
  }
  session.set(authenticator.sessionKey, sessionUser);

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}


export default function Register() {
  return <div>
    Create User
    <Form method="post" className="flex flex-col w-2/4">
      <input type="email" placeholder="Email" name="email" required />
      <input type="password" placeholder="Password" name="password" required />
      <input type="password" placeholder="Password confirm" name="password_confirm" required />
      <button>Register</button>
    </Form>
  </div>
}