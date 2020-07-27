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
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { getUserSession } from "./cognito";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/v1/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const { session } = await getUserSession();
  const token = session?.getIdToken().getJwtToken();
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

function createApolloClient(session?: CognitoUserSession) {
  let link: ApolloLink | null;

  if (typeof window === "undefined") {
    const token = session?.getIdToken().getJwtToken();
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
  session?: CognitoUserSession
) {
  const _apolloClient = apolloClient ?? createApolloClient(session);

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
