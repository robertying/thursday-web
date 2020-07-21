import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/link-context";
import { useMemo } from "react";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { getTokenFromCookie } from "lib/cookie";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/v1/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = getTokenFromCookie();
  return {
    headers: {
      ...headers,
      ...(token
        ? {
            Authorization: "Bearer " + token,
          }
        : undefined),
    },
  };
});

function createApolloClient(ctx?: GetServerSidePropsContext<ParsedUrlQuery>) {
  let link: ApolloLink | null;

  if (typeof window === "undefined") {
    const token = getTokenFromCookie(ctx);
    link = new HttpLink({
      uri: `${process.env.API_URL}/v1/graphql`,
      headers: token
        ? {
            Authorization: "Bearer " + token,
          }
        : undefined,
    });
  } else {
    link = authLink.concat(httpLink);
  }

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link,
    cache: new InMemoryCache({
      typePolicies: {
        user: {
          keyFields: ["username"],
        },
      },
    }),
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
  const client = useMemo(() => initializeApollo(initialState), [initialState]);
  return client;
}
