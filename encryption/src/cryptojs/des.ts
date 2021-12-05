import CryptoJS from "crypto-js";

export default function desTestProcess() {
  const encrypted = CryptoJS.DES.encrypt("Message", "Secret Key");
  const decrypted = CryptoJS.DES.decrypt(encrypted, "Secret Key");
  console.log(encrypted.toString(), decrypted.toString());

  const falseDecrypted = CryptoJS.DES.decrypt(encrypted, "I'm hacker");
  console.log(encrypted.toString(), falseDecrypted.toString());

  const tripleEncrypted = CryptoJS.TripleDES.encrypt("Message", "Secret Key");
  const tripleDecrypted = CryptoJS.TripleDES.decrypt(
    tripleEncrypted,
    "Secret Key"
  );
  console.log(tripleEncrypted.toString(), tripleDecrypted.toString());
}
