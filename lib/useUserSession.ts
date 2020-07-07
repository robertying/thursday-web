import { useState } from "react";
import { CognitoUserSession, CognitoUser } from "amazon-cognito-identity-js";
import { useRouter } from "next/router";
import { getUserSession } from "apis/cognito";
import useInterval from "./useInterval";

const useUserSession = (poll?: boolean) => {
  const [user, setUser] = useState<CognitoUser | null>();
  const [session, setSession] = useState<CognitoUserSession | null>();
  const router = useRouter();

  const callback = async () => {
    try {
      const { user, session } = await getUserSession();
      setUser(user);
      setSession(session);
    } catch (e) {
      setUser(null);
      setSession(null);
      if (window.location.pathname !== "/login") {
        router.push({
          pathname: "/login",
          query: {
            redirect_url: window.location.pathname,
          },
        });
      }
    }
  };

  useInterval(callback, poll ? 45 * 60 * 1000 : null);

  return { user, session };
};

export default useUserSession;
