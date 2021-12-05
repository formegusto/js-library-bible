import CryptoJS from "crypto-js";

export default function hmacTestProcess() {
  // md5
  const hmacMD5 = CryptoJS.HmacMD5("Message", "Secret Key");
  console.log(hmacMD5);
  console.log(hmacMD5.toString());
  // 9ff417237b087cfeea23f3538e7a407f

  // sha1
  const hmacSHA1 = CryptoJS.HmacSHA1("Message", "Secret Key");
  console.log(hmacSHA1);
  console.log(hmacSHA1.toString());
  // 5450a50adc6fc5e8551d81c8f40c677f4fa8b736
}
