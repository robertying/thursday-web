import { NextApiRequest, NextApiResponse } from "next";
import AWS, { CognitoIdentityServiceProvider } from "aws-sdk";

AWS.config.update({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.COGNITO_ACCESS_KEY_ID!,
    secretAccessKey: process.env.COGNITO_ACCESS_KEY_SECRET!,
  },
});

const provider = new CognitoIdentityServiceProvider();

export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise((resolve) =>
    provider.adminUpdateUserAttributes(
      {
        UserAttributes: [
          {
            Name: "custom:tsinghua_verified_at",
            Value: new Date().toISOString(),
          },
        ],
        UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
        Username: "robertying",
      },
      function (err, data) {
        if (err) {
          console.error(err);
          res.status(500).end();
        } else {
          console.log(data);
          res.status(200).end();
        }
        return resolve();
      }
    )
  );
};
