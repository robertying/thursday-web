import TinyOSS from "tiny-oss";

let expirationTime: Date | null = null;
let oss: any | null = null;

export const getOSS = async () => {
  if (
    oss === null ||
    expirationTime === null ||
    expirationTime.getTime() <= new Date().getTime()
  ) {
    const response = await fetch("/api/sts");
    const auth = await response.json();
    expirationTime = new Date(auth.Expiration);

    oss = new TinyOSS({
      region: "oss-cn-beijing",
      accessKeyId: auth.AccessKeyId,
      accessKeySecret: auth.AccessKeySecret,
      stsToken: auth.SecurityToken,
      bucket: "thursday-images",
      cname: false,
      endpoint: process.env.NEXT_PUBLIC_OSS_ENDPOINT,
      secure: true,
    });
    return oss;
  } else {
    return oss;
  }
};
