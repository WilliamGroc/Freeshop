import { Authenticator, AuthorizationError } from "remix-auth";
import { User, sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";

const authenticator = new Authenticator<User | Error | null>(sessionStorage, {
  sessionKey: 'sessionKey',
  sessionErrorKey: 'sessionErrorKey'
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email');
    const password = form.get('password');

    let user = null;

    // do some validation, errors are in the sessionErrorKey
    if (!email || email?.length === 0) throw new AuthorizationError('Bad Credentials: Email is required')
    if (typeof email !== 'string')
      throw new AuthorizationError('Bad Credentials: Email must be a string')

    if (!password || password?.length === 0) throw new AuthorizationError('Bad Credentials: Password is required')
    if (typeof password !== 'string')
      throw new AuthorizationError('Bad Credentials: Password must be a string')

    // login the user, this could be whatever process you want
    if (email === 'aaron@mail.com' && password === 'password') {
      user = {
        name: email,
        token: `${password}-${new Date().getTime()}`,
      };

      // the type of this user must match the type you pass to the Authenticator
      // the strategy will automatically inherit the type if you instantiate
      // directly inside the `use` method
      return await Promise.resolve({ ...user });

    } else {
      // if problem with user throw error AuthorizationError
      throw new AuthorizationError("Bad Credentials")
    }
  })
);

export default authenticator;