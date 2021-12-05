import CryptoJS from "crypto-js";

export default function rc4TestProcess() {
  const encrypted = CryptoJS.RC4Drop.encrypt("message", "Secret Key", {
    drop: 3072 / 4,
  });
  const decrypted = CryptoJS.RC4Drop.decrypt(encrypted, "Secret Key", {
    drop: 3072 / 4,
  });

  console.log(encrypted.toString(), decrypted.toString());
}
