import { useEffect } from "react";

const useBeforeReload = (enabled: boolean) => {
  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    if (enabled) {
      window.addEventListener("beforeunload", listener);
    } else {
      window.removeEventListener("beforeunload", listener);
    }

    return () => window.removeEventListener("beforeunload", listener);
  }, [enabled]);
};

export default useBeforeReload;
