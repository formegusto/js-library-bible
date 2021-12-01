# faker.js

# 1. Reference

[Documentation Index](http://marak.github.io/faker.js/)

# 2. faker.js

- faker.js 는 대량의 가짜 데이터를 만들어주는 라이브러리이다.

# 3. Usage

```jsx
const faker = require("faker");

var randomFirstName = faker.name.firstName();
var randomLastName = faker.name.lastName();

console.log(randomFirstName, randomLastName);
/* Maurice Turner */
```

- 사용법은 간단하다. faker 객체를 import 한 후, 원하는 데이터를 랜덤하게 가지고 오면 된다.

> **faker.js 는 사용법만큼 문서도 깔끔하게 정리가 되어 있다. 지원하는 API Methods 목록을 확인하면 어떤 부류의 데이터를 랜덤하게 가지고 올 수 있는지 정리가 되어 있다.**

# 4. Localization

```jsx
var faker = require("faker/locale/ko");

var randomFirstName = faker.name.firstName();
var randomLastName = faker.name.lastName();

console.log(randomFirstName, randomLastName);
/* 성후 서 */
```

- faker js는 여러 나라의 언어에 대응한다. 이 또한 문서에 아주 친절하게 잘 나와 있다.

# 5. Typescript

```tsx
import faker from "faker/locale/ko";

const firstName = faker.name.firstName();
const lastName = faker.name.lastName();

console.log(firstName, lastName);
/* 준웅 노 */
```

- faker js는 TypeScript로도 친절하게 잘 동작하는 성격을 가지고 있다. (만족만족)
