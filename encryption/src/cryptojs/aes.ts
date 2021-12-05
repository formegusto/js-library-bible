import CryptoJS from "crypto-js";

export default function aesTestProcess() {
  const encrypted = CryptoJS.AES.encrypt("Message", "Secret Key");
  const decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Key");

  console.log(encrypted.toString());
  console.log(decrypted.toString());
  /*
  U2FsdGVkX1+e5VMtQaeLkcH5C8nKSsnfTlJAtIi5zT4=
  4d657373616765
  */

  const falseDecrypted = CryptoJS.AES.decrypt(encrypted, "I'm hacker");
  console.log(falseDecrypted.toString());
  // 결과 없음
}
