# crypto.js

# 1. References

[CryptoJS](https://cryptojs.gitbook.io/docs/)

# 2. Encryption Support by crypto.js

> **crypto.js는 크게 hashing hmac pbkdf2 cipher 암호화 기법들을 제공한다.**

1. **hashing**

   해시 (hash)란 단방향 암호화 기법을 말한다. hash algorithm에 의하여, 고정된 길이의 암호화된 문자열로 바꿔버리는 것을 의미한다.

   매핑 전 원래 데이터 값(key)을, 매핑 과정(hashing)을 거쳐서 해시 값(hash value)을 뽑아내는데, 해시 알고리즘은 모두에게 공개되어 있기 때문에 MD5, SHA-1, HAS-180은 사용이 위험하다고 한다. SHA-256, SHA-512를 사용하기를 권고하고 있다.

   해시 알고리즘의 특징은 특정 입력에 대해 항상 같은 해시 값을 리턴하기 때문에 이를 이용해서 인증을 한다는 것이다. 어떤 입력인지는 알 수 없어도(단방향 암호화의 특성), 해시함수를 이용해서 해시된 값이 일치하면 입력이 같다는 것이 인증된다.

   입력은 만들어낼 수 있는 값의 길이제한이 없어 무한정으로 만들 수 있지만, 해시값은 항상 고정된 길이의 값으로 나타나기 때문에 한계가 있다. 그래서 다른 입력이어도 같은 해시값이 나오는 경우가 있을 수 있다. (중복이 적게 나타날 수록 좋은 해시함수)

2. **hmac (keyed-hash message authentication code)**

   HMAC은 송신자와 수신자만이 공유하고 있는 key값과 Message를 혼합하여 Hash값을 만들어 비교하는 방법의 암호화 기법이다.

   MAC(message authentication code)는 특성상 역산이 불가능하다고 한다. 그래서 수신된 메시지와 공유하고 있는 Key값을 조합하여 만들어진 값을 수신된 Hash와 비교한다.

   일반적으로 PKI(공개키 기반 구조)보다 구현부담이 적어서 HMAC을 사용한다고 한다.

   HMAC은 인증을 위한 Secret Key와 임의의 길이를 가진 Message를 해시 알고리즘을 사용해서 생성한다.

   클라이언트 측에서 Key와 Message를 이용해 해시 알고리즘을 통해 MAC을 생성한 후, MAC과 Message를 서버에게 전송한다. 서버는 클라이언트로부터 전달받은 Message와 갖고 있던 Key를 이용해, 해시 알고리즘으로 MAC을 생성한다. 서로를 비교해서 같으면 인증에 성공한 것 이다.

3. **pbkdf2 (Password-Based Key Derivation Function)**

   pbkdf2 는 5개의 파라미터를 가진다. 난수, password, salt값, iteraction 반복 수, 원하는 Hash Value의 길이 ( Digest ), 해당 암호화 기법은 해커들의 무차별 공격에 대응하기 위해서 나타난 대표적인 알고리즘이다.

   이 알고리즘의 핵심 키워드는 salt이다. 해시알고리즘을 돌리기 전에 원문에 임의의 문자열을 덧붙여서, 더욱 암호화된 데이터에 접근하기 힘들게 만들었다.

4. **cipher**

# 3. Hashing

```tsx
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
```

- 원본 값(key)에 해싱 알고리즘을 적용(hashing)하여, 고정적인 hash value를 출력.

```tsx
// progressive hash
const progressive = CryptoJS.algo.SHA256.create();
progressive.update("Message");
progressive.update("Message");
progressive.update("Message");

const finalHash = progressive.finalize();
console.log(finalHash.toString());
// 7551e7be4790d189b3a045f77d2f1ae06cd4e53feacfd4294b70020e82dbba8b
```

- 여러번 해시함수를 적용시킬 수도 있다.

# 4. HMAC

> **HMAC은 수신자와 송신자만 알고 있는 Key값과 Message의 매칭**

```tsx
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
```

- 인자만 하나 늘었을 뿐, 일반적인 해싱과 사용법은 같다.

# 5. PBKDF2

> **pbkdf2는 해시알고리즘에 더 다양한 매개변수를 추가시킨 알고리즘이다. ( salt )**

```tsx
const salt = CryptoJS.lib.WordArray.random(128 / 8);
console.log("salt is ", salt.toString());

const key128bits = CryptoJS.PBKDF2("Password", salt, {
  keySize: 128 / 32,
  iterations: 1000,
});
console.log(key128bits.toString());
```

# 6. Ciphers

> **위의 내용은 crypto js의 기본적인 알고리즘들과 암호화의 기본 프로세스들을 소개해준 것 같다. 아래부터가 실질적으로, 어떻게 사용이 되는지에 대한 내용이다.**

## 1. AES ( Advanced Encryption Standard )

> **공식 문서에 따르면, AES는 FIPS(Federal Information PRocessing Standard) 이다. 5년간의 15개의 모델중에 선정된 표준 암호화 알고리즘이다.**

```tsx
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
```

- crypto-js는 AES-128, AES-192, AES-256을 지원하는데, 전달한 키의 크기에 따라 자동으로 알아서 선택한다.

## 2. DES (Data Encryption Standard)

> **AES 이전에 존재하던 FIPS 이다. 현재는 작은 키 크기값으로 인하여 안전하지 않다고 설명되어 있다.**

```tsx
const encrypted = CryptoJS.DES.encrypt("Message", "Secret Key");
const decrypted = CryptoJS.DES.decrypt(encrypted, "Secret Key");
console.log(encrypted.toString(), decrypted.toString());

const falseDecrypted = CryptoJS.DES.decrypt(encrypted, "I'm hacker");
console.log(encrypted.toString(), falseDecrypted.toString());
```

> **Triple DES라는 것도 존재한다. 키 크기를 늘리기 위해, 각 블록에 DES를 세 번 적용한 기법인데, 일반적인 DES보다는 안전하다고 신뢰하고 있다.**

```tsx
const tripleEncrypted = CryptoJS.TripleDES.encrypt("Message", "Secret Key");
const tripleDecrypted = CryptoJS.TripleDES.decrypt(
  tripleEncrypted,
  "Secret Key"
);
console.log(tripleEncrypted.toString(), tripleDecrypted.toString());
```

## 3. Rabbit

> **Rabbit은 고성능 스트림 암호화 기법이다. eSTREAM Portpolio에 선정된 알고리즘 기법이라고 한다,, (?)**

```tsx
const encrypted = CryptoJS.Rabbit.encrypt("message", "Secret Key");
const decrypted = CryptoJS.Rabbit.decrypt(encrypted, "Secret Key");

console.log(encrypted.toString(), decrypted.toString());
```

## 4. RC4

> **RC4는 SSL/TLS과 같은 네트워킹 프로토콜에서 자주 사용되는 스트링 암호기법이다. 주요 키워드는 상태(state)의 개념을 사용한다는 것이다.**

```tsx
const encrypted = CryptoJS.RC4Drop.encrypt("message", "Secret Key", {
  drop: 3072 / 4,
});
const decrypted = CryptoJS.RC4Drop.decrypt(encrypted, "Secret Key", {
  drop: 3072 / 4,
});

console.log(encrypted.toString(), decrypted.toString());
```

- RC4의 key stream의 처음 몇 바이트는 절대적으로 무작위가 아니라는 단점이 존재해서 RC4 drop 이라는 알고리즘이 주로 사용된다.
