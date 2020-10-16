import AWS from "aws-sdk";
import { buildClient, KmsKeyringNode } from "@aws-crypto/client-node";
import { auth } from "lib/middleware";
import client from "lib/client";
import {
  ADD_LEARNX_PUSH_DEVICE,
  GET_LEARNX_PUSH_TOKENS,
} from "apis/learnx_push";
import {
  AddLearnXPushDevice,
  AddLearnXPushDeviceVariables,
  GetLearnXPushTokens,
  GetLearnXPushTokensVariables,
} from "apis/types";

const { encrypt, decrypt } = buildClient();

const keyring = new KmsKeyringNode({ generatorKeyId: process.env.KMS_KEY_ARN });

const context = {
  identifier: process.env.KMS_ENCRPTION_IDENTIFIER!,
};

export default (req: any, res: any) => {
  return new Promise(async (resolve) => {
    try {
      await new Promise((resolve) => auth(req, res, resolve));

      const { username, password, deviceId, pushToken } = req.body;

      if (!username || !password || !deviceId || !pushToken) {
        res.status(422).send("Form data is missing required fields");
        return resolve();
      }

      const response = await client.request<
        GetLearnXPushTokens,
        GetLearnXPushTokensVariables
      >(GET_LEARNX_PUSH_TOKENS, { user_id: req.auth.sub });

      const tokens = JSON.parse(response.learnx_push_by_pk?.tokens ?? "{}");

      AWS.config.update({
        region: "ap-northeast-1",
        credentials: {
          accessKeyId: process.env.KMS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.KMS_ACCESS_KEY_SECRET!,
        },
      });

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
            [deviceId]: pushToken,
          }),
        }
      );

      const {
        plaintext,
        messageHeader: { encryptionContext },
      } = await decrypt(
        keyring,
        Buffer.from(usernameResult.toString("base64"), "base64")
      );
      Object.entries(context).forEach(([key, value]) => {
        if (encryptionContext[key] !== value)
          throw new Error("Encryption Context does not match expected values");
      });
      console.log(plaintext.toString());

      res.status(200).end();
      return resolve();
    } catch (e) {
      console.log(e);
      res.status(500).end();
      return resolve(e);
    }
  });
};
