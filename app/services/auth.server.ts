import { Authenticator, AuthorizationError } from "remix-auth";
import { SessionUser, getSession, sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from "./db.server";
import { User } from "@prisma/client";

const jwtSecret = 'tHeS3cRèt';

const authenticator = new Authenticator<SessionUser | Error | null>(sessionStorage, {
  sessionKey: 'sessionKey',
  sessionErrorKey: 'sessionErrorKey'
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email');
    const password = form.get('password');

    // do some validation, errors are in the sessionErrorKey
    if (!email || email?.length === 0) throw new AuthorizationError('Bad Credentials: Email is required')
    if (typeof email !== 'string')
      throw new AuthorizationError('Bad Credentials: Email must be a string')

    if (!password || password?.length === 0) throw new AuthorizationError('Bad Credentials: Password is required')
    if (typeof password !== 'string')
      throw new AuthorizationError('Bad Credentials: Password must be a string')

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      }
    })

    // login the user, this could be whatever process you want
    if (user && await bcrypt.compare(password, user.password)) {

      const sessionUser: SessionUser = {
        token: signToken(user)
      }

      return await Promise.resolve({ ...sessionUser });

    } else {
      // if problem with user throw error AuthorizationError
      throw new AuthorizationError("Bad Credentials")
    }
  })
);

export async function hash(str: string): Promise<string> {
  return bcrypt.hash(str, 10);
}

export async function getToken(request: Request): Promise<string> {
  const session = await getSession(request.headers.get('cookie'));
  return session.get(authenticator.sessionKey).token;
}

export function signToken(user: User): string {
  const payload = {
    id: user.id,
  }

  return jwt.sign(payload, jwtSecret, { expiresIn: '1h', algorithm: 'HS256' })
}

export async function verifyToken(request: Request): Promise<void> {
  const token = await getToken(request);
  jwt.verify(token, jwtSecret);
}

export async function getAuthenticatedUser(request: Request): Promise<Partial<User> | null> {

  const decodedToken = jwt.decode(await getToken(request)) as any;

  const user = await prisma.user.findFirst({
    select: {
      id: true,
      email: true
    },
    where: {
      id: decodedToken.id
    }
  });


  return user;
}

export default authenticator;