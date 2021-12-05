import CryptoJS from "crypto-js";

export default function pbkdf2TestProcess() {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  console.log("salt is ", salt.toString());

  const key128bits = CryptoJS.PBKDF2("Password", salt, {
    keySize: 128 / 32,
    iterations: 1000,
  });
  console.log(key128bits.toString());
}
