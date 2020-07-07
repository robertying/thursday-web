import { NextApiRequest, NextApiResponse } from "next";
import OSS from "ali-oss";
import { auth } from "lib/middleware";

const { STS } = OSS as any;

const policy = {
  Version: "1",
  Statement: [
    {
      Effect: "Allow",
      Action: ["oss:GetObject", "oss:PostObject", "oss:PutObject"],
      Resource: [
        "acs:oss:*:*:thursday-images",
        "acs:oss:*:*:thursday-images/*",
      ],
    },
  ],
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise(async (resolve) => {
    try {
      await new Promise((resolve) => auth(req, res, resolve));

      const client = new STS({
        accessKeyId: process.env.OSS_KEY_ID!,
        accessKeySecret: process.env.OSS_KEY_SECRET!,
      });

      client
        .assumeRole(process.env.OSS_ROLE_ARN, policy, 3600)
        .then((result: any) => {
          res.status(200).json({
            AccessKeyId: result.credentials.AccessKeyId,
            AccessKeySecret: result.credentials.AccessKeySecret,
            SecurityToken: result.credentials.SecurityToken,
            Expiration: result.credentials.Expiration,
          });
          return resolve();
        })
        .catch((err: Error) => {
          console.error(err);
          res.status(500).end();
          return resolve();
        });
    } catch (e) {
      res.status(500).end();
      return resolve();
    }
  });
};
