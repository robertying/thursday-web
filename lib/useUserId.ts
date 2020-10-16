import { useState, useEffect } from "react";
import { getUserId } from "apis/cognito";
import useUserSession from "./useUserSession";

const useUserId = () => {
  const { user } = useUserSession();

  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (user) {
        const userId = await getUserId(user);
        setUserId(userId);
      }
    })();
  }, [user]);

  return userId;
};

export default useUserId;
