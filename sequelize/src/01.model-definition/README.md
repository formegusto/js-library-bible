# Model Definition

[Sequelize](https://sequelize.org/v5/manual/data-types.html)

## 1. DataTypes, Column Config Example

> **Sequelize는 다양한 DataType과 각 열에 설정할 수 있는 옵션들이 있다.**

> **defaultValue : 설정하지 않았을 때, 기본적으로 들어가게 할 값**

```jsx
// # defaultValue,
// 따로 설정하지 않았을 때, 들어가는 값.
flag: {
  type: Sequelize.BOOLEAN,
  allowNull: false,
  defaultValue: true,
},
// 현재 시간을 기본값으로 넣는 예제.
myDate: {
  type: Sequelize.DATE,
  defaultValue: Sequelize.NOW,
},
```

> **allowNull : NULL 값의 허용여부**

```jsx
// # allowNull
// NOT NULL 설정으로, 값이 들어가지 않으면 예외를 일으키도록 설정.
title: {
  type: Sequelize.STRING,
  allowNull: false,
},
```

> **unique : Unique 키 설정**

```jsx
// # unique
// select * from information_schema.table_constraints
// 해당 칼럼을 유니크 칼럼으로 지정한다.
// 이는 해당 칼럼에 같은 값을 가진 로우를 넣으려고 하면, 예외를 일으키도록 설정.
uniqueOne: { type: Sequelize.STRING, unique: "compositeIndex" },
uniqueTwo: { type: Sequelize.INTEGER, unique: "compositeIndex" },
// unique 키로는 String 혹은 Boolean 값으로 설정할 수 있다.
// 이때, CONSTRAINT_NAME은 해당 칼럼이름으로 설정된다.
someUnique: { type: Sequelize.STRING, unique: true },
```

> **primaryKey : 기본키 설정**

```jsx
// # primaryKey
// 기본키로 설정하는 옵션.
// 해당 설정을 넣으면, 기본적으로 생성되던 id column이 사라진다.
identifier: { type: Sequelize.STRING, primaryKey: true },
```

> **autoIncrement : 자동증감 설정**

```jsx
// # autoIncrement
// 자동증감 칼럼 설정
// INTEGER, 반드시 primary key 혹은 unique key로 설저되어 있어야 한다.
incrementMe: {
  type: Sequelize.INTEGER,
  autoIncrement: true,
  unique: true,
},
```

> **field : 칼럼명 지정**

```jsx
// # field
// 칼럼명을 직접지정한다. 프로퍼티이름과 칼럼명이 다르게 되는 셈.
fieldWithUnderscores: {
  type: Sequelize.STRING,
  field: "field_with_underscores",
},
```

> **references : 외래키 지정**

```jsx
// # references
// 외래키를 설정한다.
bar_id: {
  type: Sequelize.INTEGER,
  references: {
    model: Bar,
    key: "id",
  },
},
```

> **comments : 주석 설정**

```jsx
// # comments
// 주석 MySQL, PostgreSQL, MSSQL Only
commentMe: {
  type: Sequelize.INTEGER,
  comment: "This is a column name that has a comment",
},
```

## 2. Getters & Setters

> **option 1. 프로퍼티에 getter setter 를 추가해주는 방법**

```jsx
class EmployeeOne extends Sequelize.Model {}
EmployeeOne.init(
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        const title = this.getDataValue("title");
        return this.getDataValue("name") + " (" + title + ")";
      },
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      set(val) {
        this.setDataValue("title", val.toUpperCase());
      },
    },
  },
  { sequelize, modelName: "EmployeeOne", tableName: "EmployeeOne" }
);
```

```jsx
EmployeeOne.create({ name: "John Doe", title: "senior engineer" })
  .then((employee) => {
    console.log(employee.get("name")); // John Doe (SENIOR ENGINEER)
    console.log(employee.get("title")); // SENIOR ENGINEER
  })
  .catch((err) => {
    console.error(err);
  });
```

> **option 2. 모델의 옵션으로 넣어주는 방법**

```jsx
class EmployeeTwo extends Sequelize.Model {
  get fullName() {
    return this.firstname + " " + this.lastname;
  }
  set fullName(value) {
    const names = value.split(" ");
    this.setDataValue("firstname", names.slice(0, -1).join(" "));
    this.setDataValue("lastname", names.slice(-1).join(" "));
  }
}
EmployeeTwo.init(
  {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
  },
  {
    sequelize,
    modelName: "EmployeeTwo",
    tableName: "EmployeeTwo",
  }
);
```

```jsx
EmployeeTwo.create({ firstname: "forme", lastname: "gusto" })
  .then((employee) => {
    console.log(employee.fullName); // forme gusto
  })
  .catch((err) => {
    console.error(err);
  });
```

## 3. Validations

- Sequelize는 create, update, 그리고 save시, validate 프로퍼티를 설정했으면 그것에 맞게 유효성 검사를 실시해준다.
- Sequelize의 이러한 유효성 검사는 validator.js 에 의해 구현되었다.

```jsx
class ValidateMe extends Model {}
ValidateMe.init({
  bar: {
    type: Sequelize.STRING,
    validate: {
      is: ["^[a-z]+$",'i'],     // will only allow letters
      is: /^[a-z]+$/i,          // same as the previous example using real RegExp
      not: ["[a-z]",'i'],       // will not allow letters
      isEmail: true,            // checks for email format (foo@bar.com)
      isUrl: true,              // checks for url format (http://foo.com)
      isIP: true,               // checks for IPv4 (129.89.23.1) or IPv6 format
      isIPv4: true,             // checks for IPv4 (129.89.23.1)
      isIPv6: true,             // checks for IPv6 format
      isAlpha: true,            // will only allow letters
      isAlphanumeric: true,     // will only allow alphanumeric characters, so "_abc" will fail
      isNumeric: true,          // will only allow numbers
      isInt: true,              // checks for valid integers
      isFloat: true,            // checks for valid floating point numbers
      isDecimal: true,          // checks for any numbers
      isLowercase: true,        // checks for lowercase
      isUppercase: true,        // checks for uppercase
      notNull: true,            // won't allow null
      isNull: true,             // only allows null
      notEmpty: true,           // don't allow empty strings
      equals: 'specific value', // only allow a specific value
      contains: 'foo',          // force specific substrings
      notIn: [['foo', 'bar']],  // check the value is not one of these
      isIn: [['foo', 'bar']],   // check the value is one of these
      notContains: 'bar',       // don't allow specific substrings
      len: [2,10],              // only allow values with length between 2 and 10
      isUUID: 4,                // only allow uuids
      isDate: true,             // only allow date strings
      isAfter: "2011-11-05",    // only allow date strings after a specific date
      isBefore: "2011-11-05",   // only allow date strings before a specific date
      max: 23,                  // only allow values <= 23
      min: 23,                  // only allow values >= 23
      isCreditCard: true,       // check for valid credit card numbers

      // Examples of custom validators:
      isEven(value) {
        if (parseInt(value) % 2 !== 0) {
          throw new Error('Only even values are allowed!');
        }
      }
      isGreaterThanOtherField(value) {
        if (parseInt(value) <= parseInt(this.otherField)) {
          throw new Error('Bar must be greater than otherField.');
        }
      }
    }
  }
}, { sequelize });
```

- validator.js
  validator.js 는 사용자 정의 오류 메시지를 사용할 수 있으며, 인수가 필요한 옵션의 경우에는 args 속성을 추가한다.
  ```jsx
  isInt: {
    msg: "Must be an integer number of pennies"
  }
  isIn: {
    args: [['en', 'zh']],
    msg: "Must be English or Chinese"
  }
  ```

### 1. validators 와 allowNull의 관계

> **null 값은 validating 하지 않는다.**

```jsx
class UserExamOne extends Sequelize.Model {}
UserExamOne.init(
  {
    username: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: [5, 10],
      },
    },
  },
  { sequelize }
);

async function ExamOne() {
  try {
    const result = await UserExamOne.create({
      username: null,
    });
    console.log(result); // Success!
  } catch (err) {
    console.error(err);
  }
}
```

> **customValidator() 로는 원하는대로 제어 가능.**

```jsx
class UserExamTwo extends Sequelize.Model {}
UserExamTwo.init(
  {
    age: Sequelize.INTEGER,
    name: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        customValidator(value) {
          if (value === null && this.age !== 10) {
            throw new Error("10살이 아니면, 이름을 비울 수 없어.");
          }
        },
      },
    },
  },
  {
    sequelize,
  }
);

async function ExamTwo() {
  try {
    const result = await UserExamTwo.create({
      age: 9,
      name: null,
    });
    console.log(result);
  } catch (err) {
    console.error(err); // 10살이 아니면, 이름을 비울 수 없어.
  }
}
```

> **친히 메세지는 그대로 이용할 수 있게 해줬다.**

```jsx
class UserExamThree extends Sequelize.Model {}
UserExamThree.init(
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "이름을 채워주세요.",
        },
      },
    },
  },
  { sequelize }
);
async function ExamThree() {
  console.log("##### Exam Three #####");
  try {
    const result = await UserExamThree.create({
      username: null,
    });
    console.log(result);
  } catch (err) {
    console.error(err.message); // 이름을 채워주세요.
  }
}
```

### 2. Model-wide validations

- Sequelize의 Validation은 더 넓은 개념으로 확장시킬 수 있다.

```jsx
class Pub extends Sequelize.Model {}
Pub.init(
  {
    name: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    latitude: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { min: -90, max: 90 },
    },
    longitude: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: { min: -180, max: 180 },
    },
  },
  {
    validate: {
      bothCoordsOrNone() {
        if ((this.latitude === null) !== (this.longitude === null)) {
          throw new Error(
            "좌표를 넣을거면 lat, long 둘 다 넣거나, 둘 다 null로 넣으셈."
          );
        }
      },
    },
    sequelize,
  }
);

async function PubExam() {
  try {
    const result = await Pub.create({
      name: "test",
      address: "my home",
      latitude: 90,
      longitude: null,
    });
  } catch (err) {
    console.error(err.message);
    // 좌표를 넣을거면 lat, long 둘 다 넣거나, 둘 다 null로 넣으셈.
  }
}
```

## 4. Configuration

```jsx
class Bar extends Model {}
Bar.init(
  {
    /* bla */
  },
  {
    // # modelName
    // 1. 모델은 이 이름으로 sequelize.models 에 저장된다.
    // 2. 기본값은 클래스 이름으로 붙는다. 즉, 설정하지 않으면 Bar로 붙는다.
    // 3. foreginKey나 associations 설정에 사용된다.
    modelName: "bar",

    // # timestamps
    // createdAt, upatedAt 사용여부
    timestamps: false,

    // # paranoid
    // true 설정 시, deletedAt이 생기며, 해당 행은 지워지지 않고,
    // destory 실행 당시의 서버 시간이 남는다.
    paranoid: true,

    // # underscored
    // 칼럼명을 camel-case 가 아닌, underscored-case로 사용하고 싶을 때 사용한다.
    underscored: true,

    // # freezeTableName
    // 테이블 이름 수정을 비활성화한다.
    // Sequelize는 기본적으로 전달된 모든 모델이름을 복수형으로 변환하는데,
    // 이것이 원치 않을 때 설정한다. ( 설정 시, tableName을 설정하지 않으면 복수형이 아닌, 모델명 )
    freezeTableName: true,

    // # tableName
    tableName: "my_very_custom_table_name",

    // Sequelize instance
    sequelize,
  }
);
```

## 5. import

> **Sequelize는 모델들을 파일로 분리하여 이용할 수 있다.**

```jsx
// models/project.js
const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Project extends Sequelize.Model {}
  Project.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    { sequelize }
  );
  return Project;
};
```

```jsx
// option 1. File Import
const Project = sequelize.import(__dirname + "/models/project");

// option 2. callback argument
const Book = sequelize.import("book", (sequelize, DataTypes) => {
  class Book extends Sequelize.Model {}
  Book.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    { sequelize }
  );
  return Book;
});
```
