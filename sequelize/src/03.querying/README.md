# Querying

## Attributes

> **Option Attributes**

```jsx
// # Basic
const _1 = await TestModel.findAll({
  attributes: ["foo", "bar"],
  raw: true,
});
console.log(_1);
/*
SELECT `foo`, `bar` 
FROM `TestModel` AS `TestModel`;
-> { foo: 'is Foo!', bar: 'is Bar!' }
*/

// # AS
const _2 = await TestModel.findAll({
  attributes: ["foo", ["bar", "baz"]],
  raw: true,
});
console.log(_2);
/*
SELECT `foo`, `bar` AS `baz` 
FROM `TestModel` AS `TestModel`;
-> { foo: 'is Foo!', baz: 'is Bar!' }
*/

// # Aggregate Function
const _3 = await TestModel.findAll({
  attributes: [[Sequelize.fn("COUNT", Sequelize.col("hats")), "hats count"]],
  raw: true,
});
console.log(_3);
/*
SELECT COUNT(`hats`) AS `hats count` 
FROM `TestModel` AS `TestModel`;
-> { 'hats count': 2 }
*/

// # exclude field ( 칼럼 제외 명령어 )
const _4 = await TestModel.findAll({
  attributes: { exclude: ["bar"] },
  raw: true,
});
console.log(_4);
/*
SELECT `id`, `foo`, `hats` FROM `TestModel` AS `TestModel`;
-> { id: 1, foo: 'is Foo!', hats: 1 }
*/
```

## Where

> **Option Where**

- sequelize 에서 findAll/find, bulk updates/destroys 를 진행할 때, where 객체를 사용하여 조건을 걸 수가 있다.
- where 객체는 일반적으로 "속성:값"의 형식으로 이루어진다.
- 또한 복잡한 중첩 쿼리를 지원한다. ( reference.Operators )

> **Basic**

```jsx
const _1 = await Post.findAll({
  where: {
    authorId: 1,
  },
});
/*
SELECT `id`, `title`, `contents`, `status`, 
`createdAt`, `updatedAt`, `authorId` 
FROM `Post` AS `Post` 
WHERE `Post`.`authorId` = 1;
*/

const _2 = await Post.findAll({
  where: {
    authorId: 1,
    status: "active",
  },
});
/*
SELECT `id`, `title`, `contents`, `status`, 
`createdAt`, `updatedAt`, `authorId` FROM `Post` AS `Post` 
WHERE `Post`.`authorId` = 1 
AND `Post`.`status` = 'active';
*/

const _3 = await Post.findAll({
  where: {
    [Op.or]: [{ authorId: 1 }, { authorId: 2 }],
  },
});
const _3_2 = await Post.findAll({
  where: {
    authorId: {
      [Op.or]: [1, 2],
    },
  },
});
/*
SELECT `id`, `title`, `contents`, `status`, 
`createdAt`, `updatedAt`, `authorId` 
FROM `Post` AS `Post` 
WHERE (`Post`.`authorId` = 1 
OR `Post`.`authorId` = 2);
*/

const _4 = await Post.destroy({
  where: {
    id: {
      [Op.gt]: 10,
    },
  },
});
/*
SELECT `id`, `title`, `contents`, `status`, 
`createdAt`, `updatedAt`, `authorId` 
FROM `Post` AS `Post` 
WHERE (`Post`.`authorId` = 1 
OR `Post`.`authorId` = 2);
*/

const _5 = await Post.update(
  {
    title: "반갑습니다!",
  },
  {
    where: {
      id: {
        [Op.gt]: 1,
      },
    },
  }
);
/*
UPDATE `Post` SET `title`=?,`updatedAt`=? WHERE `id` > 1
*/

const _6 = await Post.findAll({
  where: sequelize.where(
    sequelize.fn("char_length", sequelize.col("status")),
    6
  ),
});
/*
SELECT `id`, `title`, `contents`, `status`, 
`createdAt`, `updatedAt`, `authorId` 
FROM `Post` AS `Post` 
WHERE char_length(`status`) = 6;
 */
```

> **Ordering**

> **Operators**

- Sequelize 는 Database에서 사용할 수 있는 다양한 수식들을 지원해준다. ( keywords: Operators, Range Operators, Operators Aliases )

[Sequelize](https://sequelize.org/v5/manual/querying.html)

- Operators Security
  - Sequelize는 연산자를 이용한 Operator 별칭 지정도 지원을 해준다.
  - 하지만, 별칭없이 Sequelize의 Symbol 연산자를 사용하는 것이 보안이 향상된다.
