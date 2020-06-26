import { useEffect, useState } from "react";
import { CognitoUserSession, CognitoUser } from "amazon-cognito-identity-js";
import { getUserSession } from "apis/cognito";

const useUserSession = () => {
  const [user, setUser] = useState<CognitoUser | null>();
  const [session, setSession] = useState<CognitoUserSession | null>();

  useEffect(() => {
    (async () => {
      try {
        const { user, session } = await getUserSession();
        setUser(user);
        setSession(session);
      } catch {
        setUser(null);
        setSession(null);
      }
    })();
  }, []);

  return { user, session };
};

export default useUserSession;
