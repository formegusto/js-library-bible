# Model Usage

> **Sequelize 에서 데이터 탐색 (Data Retrieval) 및 Finders 라고 부르는 것들은 데이터에 READ Search 쿼리를 보내는 행위를 말한다. 이는 plain objects를 반환하지 않고 model instance를 반환한다.**

## 1. find

> **데이터베이스에서 특정 하나의 요소를 검색**

```jsx
// # findByPk()
// PrimaryKey 를 통해 조회
const findByPkResult = await Project.findByPk(1, {
  raw: true,
});
console.log(findByPkResult);

// # findOne
// 속성 조건을 기반으로 조회
const findOneResult = await Project.findOne({
  where: {
    title: "a Project",
  },
  raw: true,
});
console.log(findOneResult);

// # findOne _ 2
// 특정 칼럼만 결과물로 나타나도록 조회
const findOneTwoResult = await Project.findOne({
  where: {
    title: "a Project",
  },
  attributes: ["id", "name"],
  raw: true,
});
console.log(findOneTwoResult);
```

## 2. findOrCreate

> **데이터베이스에서 특정 하나의 요소를 조회했는데, 존재하지 않는다면 CREATE**

```jsx
// 존재하지 않는 요소인 경우
const [user, created] = await User.findOrCreate({
  where: {
    username: "sdepold",
  },
  // where 문으로 조회한 데이터 뿐만 아니라,
  // 다른 칼럼에도 데이터를 넣기 위한 작업
  defaults: {
    job: "Techincal Lead JavaScript",
  },
});

console.log("is created :", created); // true
console.log(
  user.get({
    plain: true,
  })
);
/*
{
  id: 1,
  job: 'Techincal Lead JavaScript',
  username: 'sdepold',
  updatedAt: 2021-11-23T14:51:10.315Z,
  createdAt: 2021-11-23T14:51:10.315Z
}
*/
```

```jsx
// 존재하는 요소인 경우
const [formegusto, isCreated] = await User.findOrCreate({
  where: {
    username: "formegusto",
  },
  defaults: {
    job: "bye, weareformegusto :)",
  },
});
console.log("is created :", isCreated); // false
console.log(
  formegusto.get({
    plain: true,
  })
);
/*
{
  id: 2,
  username: 'formegusto',
  job: 'hello, iamformegusto :)',
  createdAt: 2021-11-23T14:51:10.000Z,
  updatedAt: 2021-11-23T14:51:10.000Z
}
*/
```

## 3. findAndCountAll

> **데이터베이스에서 여러 요소를 조회한다. 그리고 데이터와 전체 개수를 반환한다.**

```jsx
const result = await Project.findAndCountAll({
  where: {
    title: {
      [Sequelize.Op.like]: "a%",
    },
  },
  // 몇 번째 페이지? 에 대한 개념
  offset: 1,

  // 한 페이지당 얼마나? 에 대한 개념
  limit: 10,
  raw: true,
});

// 전체 데이터 개수
console.log(result.count);
// 현재 offset에 대한 limit 만큼의 데이터
console.log(result.rows);
```

## 4. findAll

> **데이터베이스에서 여러 요소를 조회한다.**

- Reference Sequelize.Op

```jsx
// # Not Conditions
const resultNotConditions = await Project.findAll({
  raw: true,
});
console.log(resultNotConditions);

// # Single Conditions
const resultSingleConditions = await Project.findAll({
  where: {
    title: "a Project",
  },
  raw: true,
});
console.log(resultSingleConditions);

// # Multiple Conditions
const resultMultipleConditions = await Project.findAll({
  where: {
    id: [1, 12, 23],
  },
  raw: true,
});
console.log(resultMultipleConditions);

// # Sequelize.Op
const resultOp = await Project.findAll({
  where: {
    id: {
      [Sequelize.Op.gt]: 20,
    },
  },
  raw: true,
});
console.log(resultOp);
```

### Sequelize.Op References

```jsx
[Op.and]: {a: 5},           // AND (a = 5)
[Op.or]: [{a: 5}, {a: 6}],  // (a = 5 OR a = 6)
[Op.gt]: 6,                // id > 6
[Op.gte]: 6,               // id >= 6
[Op.lt]: 10,               // id < 10
[Op.lte]: 10,              // id <= 10
[Op.ne]: 20,               // id != 20
[Op.between]: [6, 10],     // BETWEEN 6 AND 10
[Op.notBetween]: [11, 15], // NOT BETWEEN 11 AND 15
[Op.in]: [1, 2],           // IN [1, 2]
[Op.notIn]: [1, 2],        // NOT IN [1, 2]
[Op.like]: '%hat',         // LIKE '%hat'
[Op.notLike]: '%hat',       // NOT LIKE '%hat'
[Op.iLike]: '%hat',         // ILIKE '%hat' (case insensitive)  (PG only)
[Op.notILike]: '%hat',      // NOT ILIKE '%hat'  (PG only)
[Op.overlap]: [1, 2],       // && [1, 2] (PG array overlap operator)
[Op.contains]: [1, 2],      // @> [1, 2] (PG array contains operator)
[Op.contained]: [1, 2],     // <@ [1, 2] (PG array contained by operator)
[Op.any]: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)
[Op.not]: false           // status NOT FALSE
```

### Complex filtering / OR / NOT queries

> **Sequelize 는 복잡한 쿼리, 예로들자면 AND, OR, NOT 조합을 여러개로 한 중첩쿼리도 프로그래밍적으로 가능하게 해준다.**

```jsx
const resultComplexQueryOne = await Project.findOne({
  where: {
    title: "a Project",
    [Sequelize.Op.or]: [{ id: [1, 2, 3] }, { id: { [Sequelize.Op.gt]: 10 } }],
  },
  raw: true,
});
console.log(resultComplexQueryOne);
/*
SELECT `id`, `title`, `name`, `createdAt`, `updatedAt` 
FROM `Project` AS `Project` 
WHERE (`Project`.`id` IN (1, 2, 3) 
OR `Project`.`id` > 10) 
AND `Project`.`title` = 'a Project' 
LIMIT 1;
*/

// not example
const resultNotQuery = await Project.findAll({
  where: {
    title: "a Project",
    [Sequelize.Op.not]: [{ id: [1, 2, 3] }],
  },
  raw: true,
});
console.log(resultNotQuery);
/*
SELECT `id`, `title`, `name`, `createdAt`, `updatedAt` 
FROM `Project` AS `Project` 
WHERE NOT (`Project`.`id` IN (1, 2, 3)) 
AND `Project`.`title` = 'a Project';
*/
```

## 5. limit, offset, order and group

```jsx
// # limit offset
const resultLimitOffset_11 = await Project.findAll({
  limit: 10,
  offset: 1,
  raw: true,
});
console.log(resultLimitOffset_11);

const resultLimitOffset_21 = await Project.findAll({
  limit: 10,
  // 얼마나 스킵할 것인에 대함.
  offset: 11,
  raw: true,
});
console.log(resultLimitOffset_21);

// # order
const resultOrder = await Project.findAll({
  order: [["id", "DESC"]],
  raw: true,
});
console.log(resultOrder);

// # group
const resultGroup = await Project.findAll({
  group: "title",
  raw: true,
});
console.log(resultGroup);
```

## 6. aggregate function

### 1. count - 데이터베이스의 요소들의 수를 반환

```jsx
const resultCountOne = await Project.count();
console.log("All Count:", resultCountOne);
const resultCountTwo = await Project.count({
  where: { id: { [Sequelize.Op.gt]: 10 } },
});
console.log("id > 10 Count:", resultCountTwo);
```

### 2. max - 특정 테이블에서 가장 높은 값을 반환

```jsx
const resultMaxOne = await Project.max("id");
console.log("Max Value:", resultMaxOne);
const resultMaxTwo = await Project.max("id", {
  where: { id: { [Sequelize.Op.lt]: 20 } },
});
console.log("id < 20 Max Value:", resultMaxTwo);
```

### 3. min - 특정 테이블에서 가장 낮은 값을 반환

```jsx
const resultMinOne = await Project.min("id");
console.log("Min Value:", resultMinOne);
const resultMinTwo = await Project.min("id", {
  where: { id: { [Sequelize.Op.gt]: 30 } },
});
console.log("id > 30 Min Value:", resultMinTwo);
```

### 4. sum - 특정 열의 전체 합

```jsx
// # sum
const resultSumOne = await Project.sum("id");
console.log("Total Sum:", resultSumOne);
const resultSumTwo = await Project.sum("id", {
  where: { id: { [Sequelize.Op.gt]: 10 } },
});
console.log("id > 10 Sum:", resultSumTwo);
```

## 7. Eager Loading ( 즉시 로딩 )

> ORM 개념에서, Eager Loading(즉시로딩)과 Lazy Loading(지연로딩)이라는 개념이 존재한다. **Eager Loading**은 **엔티티를 조회할 때, 연관된 엔티티를 즉시 조인해서 값을 넣어주는 것**을 말한다. **Lazy Loading**은 이것의 반대로, **엔티티를 조회할 때, 연관된 엔티티를 조인하지 않는다.**

```jsx
class User extends Sequelize.Model {}
User.init({ name: Sequelize.STRING }, { sequelize, modelName: "user" });
class Task extends Sequelize.Model {}
Task.init({ name: Sequelize.STRING }, { sequelize, modelName: "task" });
class Tool extends Sequelize.Model {}
Tool.init({ name: Sequelize.STRING }, { sequelize, modelName: "tool" });

Task.belongsTo(User);
User.hasMany(Task);
User.hasMany(Tool, { as: "Instruments" });
```

- belongsTo와 hasMany는 1:N 관계를 정의할 때, 사용된다.
  - belongsTo : 사용 인스턴스가 매개변수 인스턴스를 가리키는 키가 생긴다.
  - hasMany : 사용 인스턴스가 매개변수 인스턴스로부터 가리키는 키가 매개변수 인스턴스에 생긴다.
  - 둘의 차이점은 코드 레벨에서 사용상의 차이를 보여주게 된다.
    - belongsTo는 사용인스턴스가 매개변수 인스턴스를 가지고 올 수 있게 해주고,
    - hasMany는 사용인스턴스가 매개변수 인스턴스들을 가지고 올 수 있게 해준다.
    - 즉, 사용 주체로 부터, 1(belongsTo):N(hasMany) 관계가 형성되는 것 이다.
- 자세한 것은 association 파트에서 알아보도록 한다.

```jsx
async function basic_exam() {
  const result = await Task.findAll({ include: [User] });
  const toJson = JSON.parse(JSON.stringify(result));
  console.log(toJson);
  /*
    [
        {
            id: 1,
            name: 'A task',
            createdAt: '2021-11-24T04:52:28.000Z',
            updatedAt: '2021-11-24T04:52:28.000Z',
            userId: 1,
            user: {
                id: 1,
                name: 'John Doe',
                createdAt: '2021-11-24T04:52:28.000Z',
                updatedAt: '2021-11-24T04:52:28.000Z'
            }
        }
    ]
  */
}
```

- include 옵션을 이용하여, 로딩한다. 이 때, task는 user와 1:N 관계에서 N에 속하기 때문에, user의 결과값이 단수로 반환이 된다.

```jsx
async function basic_exam_2() {
  const result = await User.findOne({ where: { id: 1 }, include: [Task] });
  const toJson = JSON.parse(JSON.stringify(result));
  console.log(toJson);
  /*
    {
        id: 1,
        name: 'John Doe',
        createdAt: '2021-11-24T05:05:26.000Z',
        updatedAt: '2021-11-24T05:05:26.000Z',
        tasks: [
            {
                id: 1,
                name: 'A task',
                createdAt: '2021-11-24T05:05:26.000Z',
                updatedAt: '2021-11-24T05:05:26.000Z',
                userId: 1
            },
            {
                id: 2,
                name: 'B task',
                createdAt: '2021-11-24T05:05:26.000Z',
                updatedAt: '2021-11-24T05:05:26.000Z',
                userId: 1
            }
        ]
    }
  */
}
```

- Task와의 연결 상에서 User Model은 1의 관계를 가지기 때문에 N개의 Task를 가지고 있을 수 있다. 때문에, 복수 인스턴스를 반환한다.

```jsx
const result = await User.findOne({
  where: { id: 1 },
  // include: [{ model: Tool, as: "Instruments" }],
  // include: ["Instruments"],
  include: [{ association: "Instruments" }],
});
const toJson = JSON.parse(JSON.stringify(result));
console.log(toJson);
```

- 연결에 별칭이 있는 경우, 모델을 포함할 때 마다 이 별칭을 지정해줘야 한다. 방법은 위와같이 여러가지 방법이 있다.

### Eager Loading With Conditions

> **Sequelize에 이러한 즉시로딩은 조건식과 함께하여 사용될 수 있다.**

```jsx
const result = await User.findAll({
  include: [
    {
      model: Task,
      where: {
        name: { [Sequelize.Op.like]: "A%" },
      },
    },
  ],
});
const toJson = JSON.parse(JSON.stringify(result));
console.log(toJson);
/*
  [
      {
          id: 1,
          name: 'John Doe',
          createdAt: '2021-11-24T05:24:28.000Z',
          updatedAt: '2021-11-24T05:24:28.000Z',
          tasks: [ [Object] ]
      },
      {
          id: 2,
          name: 'John Smith',
          createdAt: '2021-11-24T05:24:28.000Z',
          updatedAt: '2021-11-24T05:24:28.000Z',
          tasks: [ [Object] ]
      }
  ]
*/
```

- 해당 예제는 Task Model에 A로 시작하는 Task를 가지고 있는 유저만 반환하며, 이 때 tasks안에는 A로 시작하는 Task Model Instance 들만 들어있다.
- 이렇게 Eager Loading Model을 사용하여 필터링하면 include.where 다음 include.required가 true로 암시적으로 설정된다고 한다. 즉, 일치하는 Child가 있는 Parent Model을 반환하는 내부 조인이 완료된다. ( left join이나, right join이 아니다. 즉, 포함해야만 나온다는 뜻 ! )

```sql
SELECT `user`.`id`, `user`.`name`, `user`.`createdAt`,
`user`.`updatedAt`, `tasks`.`id` AS `tasks.id`,
`tasks`.`name` AS `tasks.name`,
`tasks`.`createdAt` AS `tasks.createdAt`,
`tasks`.`updatedAt` AS `tasks.updatedAt`,
`tasks`.`userId` AS `tasks.userId`
FROM `users` AS `user`
INNER JOIN `tasks` AS `tasks`
ON `user`.`id` = `tasks`.`userId` AND `tasks`.`name` LIKE 'A%';
```

> **Top level where with eagerly loaded models**

```jsx
const result = await User.findAll({
  where: {
    "$Instruments.name$": {
      [Sequelize.Op.like]: "%oot%",
    },
  },
  include: {
    model: Tool,
    as: "Instruments",
  },
});
const toJson = JSON.parse(JSON.stringify(result));
console.log(toJson);
```

최상위 부모의 조건문에서도 하위 자식의 칼럼 조건을 걸 수 있다.

### Include Extenstion

> **Including Everything**

```jsx
const result = await User.findOne({
  where: {
    id: 1,
  },
  include: [
    {
      all: true,
    },
  ],
});
```

> **Including soft deleted records**

```jsx
const resultNotInParanoid = await User.findOne({
  where: {
    id: 2,
  },
  include: [
    {
      model: Task,
      paranoid: true,
    },
  ],
});
/*
  {
      id: 2,
      name: 'John Smith',
      createdAt: '2021-11-24T05:46:39.000Z',
      updatedAt: '2021-11-24T05:46:39.000Z',
      tasks: [
          {
              id: 3,
              name: 'A task',
              createdAt: '2021-11-24T05:46:39.000Z',
              updatedAt: '2021-11-24T05:46:39.000Z',
              deletedAt: null,
              userId: 2
          }
      ]
  }
*/

const resultInParanoid = await User.findOne({
  where: {
    id: 2,
  },
  include: [
    {
      model: Task,
      paranoid: false,
    },
  ],
});
console.log(JSON.parse(JSON.stringify(resultInParanoid)));
/*
  {
      id: 2,
      name: 'John Smith',
      createdAt: '2021-11-24T05:46:39.000Z',
      updatedAt: '2021-11-24T05:46:39.000Z',
      tasks: [
          {
              id: 3,
              name: 'A task',
              createdAt: '2021-11-24T05:46:39.000Z',
              updatedAt: '2021-11-24T05:46:39.000Z',
              deletedAt: null,
              userId: 2
          },
          {
              id: 4,
              name: 'C task',
              createdAt: '2021-11-24T05:46:39.000Z',
              updatedAt: '2021-11-24T05:46:39.000Z',
              deletedAt: '2021-11-24T05:46:41.000Z',
              userId: 2
          }
      ]
  }
*/
```

- paranoid 처리된 데이터를 포함할 것인지에 대한 설정이다.
- soft deleted 란 완전히 행을 지우지 않고, delete query에 영향을 받은 시간을 일컫는다.

### Ordering Eager Loaded Associations

```jsx
// # option 1
const _1 = await User.findOne({
  where: {
    id: 1,
  },
  include: [Task],
  order: [[Task, "name", "DESC"]],
});
console.log(nestedToJson(_1));

// # option 2
const _2 = await User.findOne({
  where: {
    id: 1,
  },
  include: [{ model: Tool, as: "Instruments" }],
  order: [[{ model: Tool, as: "Instruments" }, "name"]],
});
console.log(nestedToJson(_2));

// # option 3
const _3 = await User.findOne({
  where: {
    id: 1,
  },
  include: [{ model: Task, include: [Teacher] }],
  order: [[Task, Teacher, "name"]],
});
console.log(nestedToJson(_3));
```

### Nested eager loading

```jsx
const _1 = await User.findOne({
  where: {
    id: 1,
  },
  include: [
    {
      model: Task,
      include: [
        {
          model: Teacher,
          // include: [/* etc */]
        },
      ],
    },
  ],
});
```

- 계속해서 확장 가능한 구조로 만들어주고 그 안에서 사용법과 where과 required의 동작방식은 모두 같다.

```jsx
const _2 = await User.findAll({ include: [{ all: true, nested: true }] });
```

- 모든 중첩쿼리를 진행한다.

### User right join for association

- 기본적으로 left join을 기반으로 진행이 된다. 이것은 모두 오직 부모테이블을 기준으로 행이 만들어진다는 것을 말하는데 아래는 right join의 예시들을 보여준다.

```jsx
const _1 = await User.findOne({
  where: {
    id: 1,
  },
  include: [{ model: Task, right: true }],
});
console.log(nestedToJson(_1));

// required를 설정해버리면, left join과 마찬가지로
// 무조건 INNER JOIN이 된다.
const _2 = await User.findOne({
  where: {
    id: 1,
  },
  include: [{ model: Task, right: true, required: true }],
});
console.log(nestedToJson(_2));

// WHERE를 설정해버리면, 암시적으로 required가 true가 된다.
// 때문에 INNER JOIN이 된다.
const _3 = await User.findOne({
  where: {
    id: 1,
  },
  include: [
    {
      model: Task,
      where: {
        name: { [Sequelize.Op.like]: "A%" },
      },
      right: true,
    },
  ],
});
console.log(nestedToJson(_3));

const _4 = await User.findOne({
  where: {
    id: 1,
  },
  include: [
    {
      model: Task,
      where: {
        name: { [Sequelize.Op.like]: "A%" },
      },
      right: true,
      required: false,
    },
  ],
});
```
