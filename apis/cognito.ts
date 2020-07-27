import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CookieStorage,
} from "amazon-cognito-identity-js";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { UniversalStorage } from "lib/cookie";

type Context = GetServerSidePropsContext<ParsedUrlQuery>;

const domain =
  process.env.NODE_ENV === "production" ? "thu.community" : "localhost";
const secure = process.env.NODE_ENV === "production" ? true : false;

const clientUserPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
  Storage: new UniversalStorage({
    domain,
    secure,
  }),
});
export const getUserPool = (ctx?: Context) => {
  if (!ctx) {
    return clientUserPool;
  }
  return new CognitoUserPool({
    UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
    ClientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
    Storage: new UniversalStorage(
      {
        domain,
        secure,
      },
      ctx
    ),
  });
};

export const signUp = ({
  email,
  username,
  password,
  recaptcha,
}: {
  email: string;
  username: string;
  password: string;
  recaptcha: string;
}) => {
  return new Promise<CognitoUser>((resolve, reject) =>
    getUserPool().signUp(
      username,
      password,
      [
        new CognitoUserAttribute({
          Name: "email",
          Value: email,
        }),
      ],
      [
        new CognitoUserAttribute({
          Name: "recaptcha",
          Value: recaptcha,
        }),
      ],
      function (err, result) {
        if (err) {
          return reject(err);
        }
        const cognitoUser = result!.user;
        return resolve(cognitoUser);
      }
    )
  );
};

export const confirmRegistration = (username: string, code: string) => {
  return new Promise<string>((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: getUserPool(),
      Storage: new CookieStorage({
        domain,
        secure,
      }),
    });
    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

export const resendConfirmationCode = (username: string) => {
  return new Promise<any>((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: getUserPool(),
      Storage: new CookieStorage({
        domain,
        secure,
      }),
    });
    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

export const login = (username: string, password: string) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: getUserPool(),
      Storage: new CookieStorage({
        domain,
        secure,
      }),
    });
    cognitoUser.authenticateUser(
      new AuthenticationDetails({ Username: username, Password: password }),
      {
        onSuccess: function (session) {
          return resolve(session);
        },
        onFailure: function (err) {
          return reject(err);
        },
      }
    );
  });
};

export const signOut = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = await getUserSession();

      user.signOut();
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
};

export const forgotPassword = (username: string) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: getUserPool(),
      Storage: new CookieStorage({
        domain,
        secure,
      }),
    });
    cognitoUser.forgotPassword({
      onSuccess: function (data) {
        return resolve(data);
      },
      onFailure: function (err) {
        return reject(err);
      },
    });
  });
};

export const confirmPassword = (
  username: string,
  code: string,
  newPassword: string
) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: getUserPool(),
      Storage: new CookieStorage({
        domain,
        secure,
      }),
    });
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: function () {
        return resolve();
      },
      onFailure: function (err) {
        return reject(err);
      },
    });
  });
};

export const getUserSession = (ctx?: Context) => {
  return new Promise<{
    user: CognitoUser;
    session: CognitoUserSession;
  }>((resolve, reject) => {
    const cognitoUser = getUserPool(ctx).getCurrentUser();

    if (!cognitoUser) {
      return reject(null);
    }

    cognitoUser.getSession(function (err: Error, session: CognitoUserSession) {
      if (err) {
        return reject(err);
      }

      return resolve({ user: cognitoUser, session });
    });
  });
};

export const getUserAttributes = (user: CognitoUser) => {
  return new Promise<CognitoUserAttribute[]>((resolve, reject) => {
    user.getSession(function (err: Error, session: CognitoUserSession) {
      if (err) {
        return reject(err);
      }

      user.getUserAttributes((err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  });
};

export const changePassword = (oldPassword: string, newPassword: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = await getUserSession();

      user.changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    } catch (e) {
      return reject(e);
    }
  });
};
