import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LinearProgress } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { isWeChatBrowser } from "lib/platform";

const useStyles = makeStyles((theme) =>
  createStyles({
    loading: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1199,
    },
  })
);

const Loading = () => {
  const classes = useStyles();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleStart = (url: string) => {
    if (isWeChatBrowser()) {
      window.location.href = url;
    } else {
      setLoading(true);
    }
  };

  const handleComplete = (url: string) => {
    setLoading(false);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return loading ? <LinearProgress className={classes.loading} /> : null;
};

export default Loading;
