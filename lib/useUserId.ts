import { useState, useEffect } from "react";
import useUserSession from "./useUserSession";
import { getUserAttributes } from "apis/cognito";

const useUserId = () => {
  const { user } = useUserSession();

  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (user) {
        const result = await getUserAttributes(user);
        setUserId(result.find((v) => v.getName() === "sub")?.getValue());
      }
    })();
  }, [user]);

  return userId;
};

export default useUserId;
