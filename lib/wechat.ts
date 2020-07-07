export const isWeChatBrowser = () => {
  return (
    typeof window !== "undefined" &&
    /micromessenger/.test(navigator.userAgent.toLowerCase())
  );
};
