import { useCallback, useEffect } from "react";

const useBeforeReload = (enabled: boolean) => {
  const listener = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  }, []);

  useEffect(() => {
    if (enabled) {
      window.addEventListener("beforeunload", listener);
    } else {
      window.removeEventListener("beforeunload", listener);
    }
    return () => window.removeEventListener("beforeunload", listener);
  }, [enabled]);
};

export default useBeforeReload;
