import "styles/global.css";
import "katex/dist/katex.min.css";
import { AppProps } from "next/app";
import Head from "next/head";
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

if (typeof window !== "undefined") {
  (window as any).recaptchaOptions = {
    useRecaptchaNet: true,
  };
}

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  useUserSession(true);

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="apple-mobile-web-app-title" content="星期四" />
        <meta name="application-name" content="星期四" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg"
          color={theme.palette.primary.main}
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
      </Head>
      <DefaultSeo
        title="Thursday"
        titleTemplate="星期四｜%s"
        description="星期四社区"
        noindex
        nofollow
        dangerouslySetAllPagesToNoIndex
        dangerouslySetAllPagesToNoFollow
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
