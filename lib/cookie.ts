import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { parseCookies } from "nookies";

export const getTokenFromCookie = (
  ctx?: GetServerSidePropsContext<ParsedUrlQuery>
) => {
  ctx?.req.headers.cookie;
  const cookies = parseCookies(ctx);
  const idTokenKey = `CognitoIdentityServiceProvider.${
    process.env.NEXT_PUBLIC_CLIENT_ID
  }.${
    cookies[
      `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_CLIENT_ID}.LastAuthUser`
    ]
  }.idToken`;
  const token = cookies[idTokenKey];
  return token;
};
