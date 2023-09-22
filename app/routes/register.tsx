import { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { prisma } from "~/services/db.server";

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
      password: password as string
    }
  });

  return user;
}


export default function Register() {
  return <div>
    Create User
    <Form method="post">
      <input type="email" placeholder="Email" name="email" required />
      <input type="password" placeholder="Password" name="password" required />
      <input type="password" placeholder="Password confirm" name="password_confirm" required />
      <button>Register</button>
    </Form>
  </div>
}