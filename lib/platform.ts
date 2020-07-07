export const isWeChatBrowser = () => {
  return (
    typeof window !== "undefined" &&
    /micromessenger/.test(navigator.userAgent.toLowerCase())
  );
};

export const isMobile = () => {
  return (
    typeof window !== "undefined" &&
    (/android/.test(navigator.userAgent.toLowerCase()) ||
      /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()))
  );
};
