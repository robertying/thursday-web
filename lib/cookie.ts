import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import dayjs from "dayjs";

export class UniversalStorage {
  ctx?: GetServerSidePropsContext<ParsedUrlQuery>;
  domain: string;
  path = "/";
  expires = 365;
  secure = true;

  constructor(
    data: {
      domain: string;
      path?: string;
      expires?: number;
      secure?: boolean;
    },
    ctx?: GetServerSidePropsContext<ParsedUrlQuery>
  ) {
    this.ctx = ctx;
    this.domain = data.domain;
    this.path = data.path ?? "/";
    this.expires = data.expires ?? 365;
    this.secure = data.secure ?? true;
  }

  setItem(key: string, value: string) {
    setCookie(this.ctx, key, value, {
      domain: this.domain,
      expires: dayjs().add(this.expires, "day").toDate(),
      path: this.path,
      secure: this.secure,
    });
    return this.getItem(key);
  }

  getItem(key: string) {
    const cookies = parseCookies(this.ctx);
    return cookies[key];
  }

  removeItem(key: string) {
    destroyCookie(this.ctx, key, {
      domain: this.domain,
      path: this.path,
    });
  }

  clear() {
    const cookies = parseCookies(this.ctx);

    for (const key of Object.keys(cookies)) {
      this.removeItem(key);
    }

    return {};
  }
}
