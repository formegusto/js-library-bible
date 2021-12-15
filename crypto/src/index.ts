import {
  createPrivateKey,
  generateKeyPair,
  privateDecrypt,
  privateEncrypt,
  publicDecrypt,
  publicEncrypt,
} from "crypto";
import NodeRSA from "node-rsa";
import dotenv from "dotenv";
import { resolve } from "path/posix";

const _getKeyPair = async (): Promise<{
  publicKey: string;
  privateKey: string;
}> => {
  return new Promise((resolve, reject) => {
    generateKeyPair(
      "rsa",
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: "개인키 패스워드 같은 거임",
        },
      },
      (err, publicKey, privateKey) => {
        if (err) return reject(err);
        resolve({ publicKey, privateKey });
      }
    );
  });
};
// crypto example
(async function asymmetricTest() {
  const { publicKey, privateKey } = await _getKeyPair();
  const str: string = "암호화 하는 데이터";
  console.log("public", publicKey);
  console.log("private", privateKey);

  const enc = publicEncrypt(publicKey, Buffer.from(str));
  console.log("public enc", enc);

  const encStr = enc.toString("base64");
  console.log("public encStr", encStr);

  const key = createPrivateKey({
    key: privateKey,
    format: "pem",
    passphrase: "개인키 패스워드 같은 거임",
  });

  const dec = privateDecrypt(key, Buffer.from(encStr, "base64"));
  console.log("private dec", dec);
  const decStr = dec.toString("utf8");
  console.log("private decStr", decStr);

  // private key로 암호화
  const strp: string = "private key로 암호화 하는 데이터";
  const keyp = createPrivateKey({
    key: privateKey,
    format: "pem",
    passphrase: "개인키 패스워드 같은 거임",
  });
  const enc2 = privateEncrypt(keyp, Buffer.from(strp));
  console.log("private enc", enc2);
  const enc2Str = enc2.toString("base64");
  console.log("private encStr", enc2Str);

  const dec2 = publicDecrypt(publicKey, Buffer.from(enc2Str, "base64"));
  console.log("public dec", dec2);
  const dec2Str = dec2.toString("utf8");
  console.log("public dec", dec2Str);
})();

// node-rsa example
(async function nodeRSAExample() {
  const key = new NodeRSA({ b: 512 }).generateKeyPair();
  const publicKey = key.exportKey("pkcs1-public-pem");
  const privateKey = key.exportKey("pkcs8-private-pem");

  dotenv.config();
  console.log(process.env.PUBLICKEY?.replace("\\n", "\n"));

  console.log(publicKey);
  console.log(privateKey);

  const text: string = "암호화를 해볼게요";
  const enc = publicEncrypt(
    {
      key: publicKey,
      passphrase: "password",
    },
    Buffer.from(text)
  ).toString("base64");
  console.log(enc);
});
