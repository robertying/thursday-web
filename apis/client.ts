import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  HttpLink,
} from "@apollo/client";
import { useMemo } from "react";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { ParsedUrlQuery } from "querystring";

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createApolloClient(ctx?: GetServerSidePropsContext<ParsedUrlQuery>) {
  const cookies = parseCookies(ctx);
  const idTokenKey = `CognitoIdentityServiceProvider.${
    process.env.NEXT_PUBLIC_CLIENT_ID
  }.${
    cookies[
      `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_CLIENT_ID}.LastAuthUser`
    ]
  }.idToken`;
  const token = cookies[idTokenKey];

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_API_URL}/v1/graphql`,
      headers: token
        ? {
            Authorization: "Bearer " + token,
          }
        : undefined,
    }),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
  ctx?: GetServerSidePropsContext<ParsedUrlQuery>
) {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === "undefined") return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject | null) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
