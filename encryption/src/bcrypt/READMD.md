# bcrypt

# 1. References

[bcryptjs](https://www.npmjs.com/package/bcryptjs)

# 2. bcrypt?

> **해시함수들은 원래 암호화를 위해 설계된 것이 아니라, 짧은 시간에 데이터를 검색하기 위한 데이터 매핑용으로 위한 자료구조로 설계 되었다. 때문에 rainbow table attack과 같은 해킹방법에 취약했다.**

- bcrypt는 salting과 key stretching을 사용한다.
  1. salting : 실제 정보 이외에 추가적으로 무작위 데이터를 더해서 해시 값을 계산하는 방법이다. salt로 인해 해시값이 달라지기 때문에, rainbow attack과 같이 미리 해시값을 계산해 하는 공격을 무효화시킬 수 있다. salt값 자체는 해시값을 바꾸는데에 목적을 둔다.
  2. key stretching : 단방향 해시 값을 계산한 후 그 해시 값을 다시 해시하고, 이를 반복한다. 기존 단방향 해시 알고리즘의 빠른 실행 속도가 취약점이 됐던 것을 보완하기 위한 방법으로 도입 되었다.
- bcrypt의 출력값은 4부분으로 나누어진다.
  1. algorithm : 알고리즘 식별자, '$2a$'로 시작하며, 이는 bcrypt를 뜻한다.
  2. Cost factor : key stretching 횟수로, 2^n으로 나타낸다. ( 10 = 2^10 = 1024 )
  3. salt : 128bit의 salt값으로 22자 base64로 인코딩 되어있다.
  4. hash : salting과 key streching 후의 hash value
- why bcrypt?
  1. bcrypt는 현재 가장 강력한 해시 메커니즘 중 하나로 소개되고 있다.
  2. 보안성이나, 경제성에서 제일 가성비가 좋아서 사용되고 있다.
  3. bcrypt와 비교되는 암호화 방식들의 단점
     1. SHA : GPU를 이용한 공격에 취약해진다. Rainbow Table Attack에 약하다는 의미이다.
     2. scrypt : 보안성은 좋지만, 암호화 알고리즘을 선택할 때는 보안성뿐만이 아닌, 서비스가 감당할 수 있는 자원에서 최적의 효과를 낼 수 있는 암호화 알고리즘을 선택한다.

# 3. usage

> **bcrypt sync programming 방식과 async programming 방식을 지원하는데, async 방식을 추천하고 있다.**

```tsx
const saltRounds = 10;
const myPlaintextPassword = "12345678";
const someOtherPlaintextPassword = "87654321";

const salt = await bcrypt.genSalt(saltRounds);
console.log(salt);
// $2b$10$lPezHj9IV4TOpWYnKTLNE.

const hash = await bcrypt.hash(myPlaintextPassword, salt);
console.log(hash);
// $2b$10$lPezHj9IV4TOpWYnKTLNE.ym6BvpILcg/GGXEvNFG9e8Tio0ZTTui

const isAuth = await bcrypt.compare(myPlaintextPassword, hash);
console.log(isAuth);
// true

const isAuthTwo = await bcrypt.compare(someOtherPlaintextPassword, hash);
console.log(isAuthTwo);
// false
```

- 일반적으로 DB에 입력된 사용자 가입 정보의 hash값을 그대로 넣고, 나중에 사용자가 로그인할 때 입력한 password값과 hash값을 비교하여 auth check를 하는 방식으로 쓰인다.
