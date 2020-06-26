import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CookieStorage,
} from "amazon-cognito-identity-js";

export const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
  Storage: new CookieStorage({
    domain: "localhost",
    secure: false,
  }),
});

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
    userPool.signUp(
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
      Pool: userPool,
      Storage: new CookieStorage({
        domain: "localhost",
        secure: false,
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
      Pool: userPool,
      Storage: new CookieStorage({
        domain: "localhost",
        secure: false,
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
      Pool: userPool,
      Storage: new CookieStorage({
        domain: "localhost",
        secure: false,
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

export const getUserSession = () => {
  return new Promise<{
    user: CognitoUser;
    session: CognitoUserSession;
  }>((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      return reject(null);
    }

    cognitoUser.getSession(function (err: Error, session: CognitoUserSession) {
      if (err) {
        return reject(err);
      }
      if (!session.isValid()) {
        return reject(null);
      }

      return resolve({ user: cognitoUser, session });
    });
  });
};

export const getUserAttributes = (user: CognitoUser) => {
  return new Promise<CognitoUserAttribute[]>((resolve, reject) => {
    user.getUserAttributes((err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};
