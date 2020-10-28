import { NextApiRequest, NextApiResponse } from "next";
import { CognitoIdentityServiceProvider, SES } from "aws-sdk";
import jwt from "jsonwebtoken";
import { recaptcha } from "lib/middleware";
import { validateEmail } from "lib/validate";

const ses = new SES({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.COGNITO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.COGNITO_ACCESS_KEY_SECRET!,
  },
});
const cognito = new CognitoIdentityServiceProvider({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.COGNITO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.COGNITO_ACCESS_KEY_SECRET!,
  },
});

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async (resolve) => {
    const { action, username, tsinghuaEmail } = req.body;

    if (action === "request") {
      if (!username || !tsinghuaEmail) {
        res
          .status(422)
          .send(
            "422 Unprocessable Entity: action, username and tsinghuaEmail required"
          );
        return resolve();
      }

      if (!validateEmail(tsinghuaEmail, true)) {
        res.status(422).send("422 Unprocessable Entity: invalid tsinghuaEmail");
        return resolve();
      }

      await new Promise((resolve) => recaptcha(req, res, resolve));

      try {
        const token = jwt.sign(
          {
            tsinghuaEmail,
            username,
            action: "verifyTsinghuaEmail",
          },
          process.env.JWT_SECRET!,
          {
            expiresIn: "15m",
          }
        );
        await new Promise((resolve, reject) =>
          ses.sendTemplatedEmail(
            {
              Source: process.env.SES_FROM!,
              Template: process.env.SES_TEMPLATE!,
              Destination: {
                ToAddresses: [tsinghuaEmail],
              },
              TemplateData: `{ "verificationLink":"${
                process.env.SES_VERIFICATION_LINK + token
              }" }`,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              } else {
                return resolve(data);
              }
            }
          )
        );
        res.status(200).end();
        return resolve();
      } catch (error) {
        console.error(error);
        res.status(500).end();
        return resolve();
      }
    } else if (action === "fulfill") {
      const { token } = req.body;

      jwt.verify(
        token as string,
        process.env.JWT_SECRET!,
        async (err, decoded) => {
          if (err || !decoded) {
            res.status(401).send("401 Unauthorized: Token expired or invalid");
            return resolve();
          }

          const payload = decoded as {
            tsinghuaEmail: string;
            username: string;
            action: string;
          };
          if (payload.action !== "verifyTsinghuaEmail") {
            res.status(401).send("401 Unauthorized: Token expired or invalid");
            return resolve();
          }

          try {
            cognito.adminUpdateUserAttributes(
              {
                UserAttributes: [
                  {
                    Name: "custom:tsinghua_verified_at",
                    Value: new Date().toISOString(),
                  },
                ],
                UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
                Username: payload.username,
              },
              function (err, data) {
                if (err) {
                  console.error(err);
                  res.status(500).end();
                  return resolve();
                } else {
                  res.status(200).end();
                  resolve();
                }
              }
            );
          } catch (err) {
            console.error(err);
            res.status(500).end();
            return resolve();
          }
        }
      );
    } else {
      res.status(422).send("422 Unprocessable Entity: Wrong action");
      return resolve();
    }
  });
};

export default handler;
