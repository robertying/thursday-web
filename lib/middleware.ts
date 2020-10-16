import { URLSearchParams } from "url";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import CORS, { CorsOptions } from "cors";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { getUserSession } from "apis/cognito";

const client = jwksClient({
  jwksUri: process.env.JWKS_URL!,
  rateLimit: true,
});

export default function initMiddleware(middleware: ReturnType<typeof CORS>) {
  return (req: any, res: any) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const whitelist = [
  "https://thu.community",
  "https://thu.wtf",
  "http://localhost:3000",
];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
export const cors = initMiddleware(CORS(corsOptions));

export const recaptcha = async (req: any, res: any, next: any) => {
  if (!req.body?.recaptcha) {
    return res
      .status(422)
      .send("422 Unprocessable Entity: Missing reCAPTCHA response");
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_KEY!);
    params.append("response", req.body.recaptcha);

    const response = await fetch(
      "https://www.recaptcha.net/recaptcha/api/siteverify",
      { method: "POST", body: params }
    );
    const result = await response.json();

    if (result.success) {
      next();
    } else {
      res.status(400).end("Invalid reCAPTCHA");
    }
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};

export const auth = async (req: any, res: any, next: any) => {
  let session: CognitoUserSession | null = null;

  try {
    const results = await getUserSession({ req } as any);
    session = results.session;
  } catch (err) {
    console.error(err);
    res.status(401).end();
  }

  try {
    const token = session?.getIdToken().getJwtToken();
    if (!token) {
      return res.status(401).send("401 Unauthorized: Missing token");
    }

    const decoded = jwt.decode(token, { complete: true }) as any;
    if (!decoded) {
      return res.status(401).send("401 Unauthorized: Invalid token");
    }

    const kid = decoded?.header?.kid as string | undefined;
    if (!kid) {
      return res.status(401).send("401 Unauthorized: Invalid token");
    }

    client.getSigningKey(kid, (err, key) => {
      if (err) {
        console.error(err);
        return res.status(500).end();
      }
      const signingKey = key.getPublicKey();

      jwt.verify(token, signingKey, (err, d) => {
        if (err || !d) {
          console.error(err);
          return res
            .status(401)
            .send("401 Unauthorized: Token expired or invalid");
        }

        req.auth = decoded.payload;
        return next();
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
