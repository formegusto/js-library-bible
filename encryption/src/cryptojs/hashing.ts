import CryptoJS from "crypto-js";

export default function hashingTestProcess() {
  // md 5
  const md5 = CryptoJS.MD5("Message");
  console.log(md5);
  console.log(md5.toString());
  // 4c2a8fe7eaf24721cc7a9f0175115bd4

  // sha-1
  const sha1 = CryptoJS.SHA1("Message");
  console.log(sha1);
  console.log(sha1.toString());
  // 68f4145fee7dde76afceb910165924ad14cf0d00

  // sha-256
  const sha256 = CryptoJS.SHA256("Message");
  console.log(sha256);
  console.log(sha256.toString());
  // 2f77668a9dfbf8d5848b9eeb4a7145ca94c6ed9236e4a773f6dcafa5132b2f91

  // sha-512
  const sha512 = CryptoJS.SHA512("Message");
  console.log(sha512);
  console.log(sha512.toString());
  // 4fb472dfc43def7a46ad442c58ac532f89e0c8a96f23b672f5fd637652eab158d4d589444ef7530a34e6626b40830b4e1ec5364611ae31c599bffa958e8b4c4e

  // progressive hash
  const progressive = CryptoJS.algo.SHA256.create();
  progressive.update("Message");
  progressive.update("Message");
  progressive.update("Message");

  const finalHash = progressive.finalize();
  console.log(finalHash.toString());
  // 7551e7be4790d189b3a045f77d2f1ae06cd4e53feacfd4294b70020e82dbba8b
}
