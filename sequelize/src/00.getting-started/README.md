# Getting Started

## 1. Installing

```
$ npm install --save sequelize@^5.9.x

필요에 따라, 아래와 같이 Database Driver도 설치도 진행해준다.
# One of the following:
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
```

## 2. Setting up a connection

- 데이터베이스에 연결하기 위해 **Sequlieze Instance** 를 생성해준다.
- 이는 매개변수로 Sequelize 생성자에 별도로 전달하거나, 단일 연결 URI를 전달하여 수행할 수 있다.

```jsx
// Option 1: 파라미터로 부분적으로 넘겨주기
const sequelize_1 = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
});

// Option 2: 연결 URI 넘겨주기
const sequelize_2 = new Sequelize(
  `mysql://${username}:${password}@${host}:${port}/${database}`
);

// Note: setting up SQLite
const sqlite_sequlize = new Sequelize({
  dialect: "sqlite",
  storage: "storage/sqlite_database.sqlite",
});
```

> **Note: Connection Pool ( Production )**

- 서버는 동시에 사용할 수 있는 사용자의 수라는 개념이 존재한다.
- Connection Pool이란 동시접속자가 가질 수 있는 Connection을 하나로 모아놓고 관리한다는 개념이다.
  - 누군가가 접속하면 자신이 관리하는 Pool에서 남아 있는 Connection을 제공한다.
  - 남아있는 Connection이 없는 경우라면, 해당 클라이언트는 대기 상태로 전환시킨다.

```jsx
// Note: connection pool
const pool_sequlize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
```

- Sequelize는 초기화 시 연결 풀을 설정하는데, options 매개변수를 통해 구성할 수 있다.
- 여러 프로세스에서 데이터베이스에 연결하는 경우, 프로세스당 하나의 인스턴스를 생성해야 하지만, 각 인스턴스의 최대 연결 풀 크기는 총 최대 크기를 준수해야 한다.
  - 최대 연결 풀 크기가 90이고, 3개의 프로세스가 있는 경우, 각 프로세스의 Sequelize 인스턴스는 최대 연결 풀 크기가 30이어야 한다.

## 3. Testing the connection

> **.authenticate()**

```jsx
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
```

> **.close()**

**Closing the connection**

## 4. Modeling a table

> **하나의 모델은 `Sequelize.Model`을 상속받는다. 공식 문서에 의하면 두 가지 방식으로 생성할 수 있다.**

```jsx
// option 1 : Sequlize.Model.init(attributes, options)
const Model = Sequelize.Model;
class User_1 extends Model {}
User_1.init(attributes, {
  sequelize,
  modelName: "user_1",
});

// option 2 : sequelize.define
const User_2 = sequelize.define("user_2", attributes, {
  // options
});
```

1. Sequlize.Model.init(attributes, options)
   1. Sequlize.Model을 상속받아, init을 통해 모델의 특징을 정의한다.
   2. 해당 방식은 options 파라미터에 생성한 sequelize instance를 넣어주어서 DB와 동기화 시킨다.
2. sequelize.define
   1. 생성한 sequelize instance를 이용한다.
3. common features
   1. Sequlize는 기본적으로 id(기본키), createdAt, updatedAt 이 정의된다.

> **Changing the default model options**

- 우선순위는 Model Option → Sequelize Option 순서이다.

```jsx
const sequelize = new Sequelize(connectionURI, {
  define: {
    // 기본적으로 timestamps, createdAt, updatedAt 필드가 생성되지 않도록 설정한 것이다.
    timestamps: false,
  },
});

class Foo extends Model {}
Foo.init(
  {
    /* ... */
  },
  { sequelize }
);

// 우선순위는 모델의 옵션이기 때문에, 아래와 같은 경우에는 timestamps가 생성된다.
class Bar extends Model {}
Bar.init(
  {
    /* ... */
  },
  { sequelize, timestamps: true }
);
```

> **Synchronizing the model with the database**

```jsx
User_1.sync({ force: true })
  .then(() => {
    return User_1.create({
      firstName: "forme",
      lastName: "gusto",
    });
  })
  .then((result) => {
    console.log(result);
  });
```

- 모델이 연결한 데이터베이스에 테이블로서 생성이 된다.
- force 속성은 기존에 존재하는 테이블을 삭제하고 새로운 테이블로 덮어씌울 것인지에 대한 설정이다.

> **Synchronizing all models at once**

- **모델들을 연결한 sequelize instance 에서도 sync() 메서드를 호출할 수 있다. 이를 호출하면 전체 모델이 연결된 데이터베이스와 동기화된다.**
- 이는 후에 Migrations 라는 개념과 연결되는데, Migrations 파트에서 자세히 살펴보도록 하겠다.

## 5. Querying

```jsx
// Read
const users = await User.findAll();

// Create
const createUser_1 = await User.create({
  firstName: "forme",
  lastName: "gusto",
  age: 3,
  sex: false,
});

// Read
const formegusto = await User.findOne({
  where: {
    firstName: "forme",
    lastName: "gusto",
  },
  raw: true,
});

// Update
const updateUser = await User.update(
  {
    lastName: "th",
  },
  {
    where: {
      firstName: "no",
      lastName: null,
    },
  }
);

// Delete
const deleteUser = await User.destroy({
  where: {
    firstName: "no",
  },
});
```
