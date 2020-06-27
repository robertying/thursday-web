import { useState, useEffect } from "react";
import useUserSession from "./useUserSession";
import { getUserAttributes } from "apis/cognito";

const useUserId = () => {
  const { user } = useUserSession();

  const [authorId, setAuthorId] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (user) {
        const result = await getUserAttributes(user);
        setAuthorId(result.find((v) => v.getName() === "sub")?.getValue());
      }
    })();
  }, [user]);

  return authorId;
};

export default useUserId;
