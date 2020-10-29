import AWS from "aws-sdk";
import { buildClient, KmsKeyringNode } from "@aws-crypto/client-node";
import { auth } from "lib/middleware";
import client from "lib/client";
import {
  ADD_LEARNX_PUSH_DEVICE,
  DELETE_LEARNX_PUSH,
  GET_LEARNX_PUSH_TOKENS,
} from "apis/learnx_push";
import {
  AddLearnXPushDevice,
  AddLearnXPushDeviceVariables,
  DeleteLearnXPush,
  DeleteLearnXPushVariables,
  GetLearnXPushTokens,
  GetLearnXPushTokensVariables,
} from "apis/types";

AWS.config.update({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.KMS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.KMS_ACCESS_KEY_SECRET!,
  },
});

const { encrypt } = buildClient();

const keyring = new KmsKeyringNode({ generatorKeyId: process.env.KMS_KEY_ARN });

const context = {
  identifier: process.env.KMS_ENCRPTION_IDENTIFIER!,
};

const handler = (req: any, res: any) => {
  return new Promise(async (resolve) => {
    try {
      await new Promise((resolve) => auth(req, res, resolve));

      const { username, password, deviceId, tokenType, pushToken } = req.body;

      if (req.method === "PUT") {
        if (!deviceId) {
          res.status(422).send("Form data is missing required fields");
          return resolve();
        }
      } else if (req.method === "POST") {
        if (!username || !password || !deviceId || !tokenType || !pushToken) {
          res.status(422).send("Form data is missing required fields");
          return resolve();
        }
      } else if (req.method === "DELETE") {
        await client.request<DeleteLearnXPush, DeleteLearnXPushVariables>(
          DELETE_LEARNX_PUSH,
          {
            user_id: req.auth.sub,
          }
        );
        res.status(200).end();
        return resolve();
      } else {
        res.status(422).send("Unsupported method");
        return resolve();
      }

      const response = await client.request<
        GetLearnXPushTokens,
        GetLearnXPushTokensVariables
      >(GET_LEARNX_PUSH_TOKENS, { user_id: req.auth.sub });

      const username64 = response.learnx_push_by_pk?.username;
      const password64 = response.learnx_push_by_pk?.password;
      const tokens = JSON.parse(response.learnx_push_by_pk?.tokens ?? "{}");

      if (req.method === "PUT") {
        delete tokens[deviceId];
        await client.request<AddLearnXPushDevice, AddLearnXPushDeviceVariables>(
          ADD_LEARNX_PUSH_DEVICE,
          {
            user_id: req.auth.sub,
            username: username64!,
            password: password64!,
            tokens: JSON.stringify(tokens),
          }
        );
      } else {
        const { result: usernameResult } = await encrypt(keyring, username, {
          encryptionContext: context,
        });
        const { result: passwordResult } = await encrypt(keyring, password, {
          encryptionContext: context,
        });

        await client.request<AddLearnXPushDevice, AddLearnXPushDeviceVariables>(
          ADD_LEARNX_PUSH_DEVICE,
          {
            user_id: req.auth.sub,
            username: usernameResult.toString("base64"),
            password: passwordResult.toString("base64"),
            tokens: JSON.stringify({
              ...tokens,
              [deviceId]: {
                type: tokenType,
                token: pushToken,
              },
            }),
          }
        );
      }

      res.status(200).end();
      return resolve();
    } catch (e) {
      console.log(e);
      res.status(500).end();
      return resolve(e);
    }
  });
};

export default handler;
