import CryptoJS from "crypto-js";

export default function rabbitTestProcess() {
  const encrypted = CryptoJS.Rabbit.encrypt("message", "Secret Key");
  const decrypted = CryptoJS.Rabbit.decrypt(encrypted, "Secret Key");

  console.log(encrypted.toString(), decrypted.toString());
}
