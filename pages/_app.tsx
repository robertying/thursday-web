import "styles/global.css";
import "katex/dist/katex.min.css";
import { useEffect } from "react";
import { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { ApolloProvider } from "@apollo/client";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import theme from "styles/theme";
import { useApollo } from "apis/client";
import Loading from "components/Loading";
import useUserSession from "lib/useUserSession";

dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  useUserSession(true);

  useEffect(() => {
    (window as any).recaptchaOptions = {
      useRecaptchaNet: true,
    };
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <DefaultSeo
        title="Thursday"
        titleTemplate="星期四｜%s"
        description="星期四社区"
        noindex
        nofollow
        dangerouslySetAllPagesToNoIndex
        dangerouslySetAllPagesToNoFollow
        additionalMetaTags={[
          {
            property: "viewport",
            content: "minimum-scale=1, initial-scale=1, width=device-width",
          },
        ]}
        openGraph={{
          url: "https://thu.community/",
          type: "website",
        }}
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Loading />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
