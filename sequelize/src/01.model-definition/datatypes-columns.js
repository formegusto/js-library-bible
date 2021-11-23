const { Sequelize } = require("sequelize");
const getMySQLInfo = require("../utils/getMySQLInfo");

const { username, password, host, port, database } = getMySQLInfo();
const dialect = "mysql";

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
});

const barAttributes = {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

class Bar extends Sequelize.Model {}
Bar.init(barAttributes, {
  sequelize,
  modelName: "bar",
});

const fooAttributes = {
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

  // # allowNull
  // NOT NULL 설정으로, 값이 들어가지 않으면 예외를 일으키도록 설정.
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  // # unique
  // select * from information_schema.table_constraints
  // 해당 칼럼을 유니크 칼럼으로 지정한다.
  // 이는 해당 칼럼에 같은 값을 가진 로우를 넣으려고 하면, 예외를 일으키도록 설정.
  uniqueOne: { type: Sequelize.STRING, unique: "compositeIndex" },
  uniqueTwo: { type: Sequelize.INTEGER, unique: "compositeIndex" },
  // unique 키로는 String 혹은 Boolean 값으로 설정할 수 있다.
  someUnique: { type: Sequelize.STRING, unique: true },

  // # primaryKey
  // 기본키로 설정하는 옵션.
  // 해당 설정을 넣으면, 기본적으로 생성되던 id column이 사라진다.
  identifier: { type: Sequelize.STRING, primaryKey: true },

  // # autoIncrement
  // 자동증감 칼럼 설정
  // INTEGER, 반드시 primary key 혹은 unique key로 설저되어 있어야 한다.
  incrementMe: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    unique: true,
  },

  // # field
  // 칼럼명을 직접지정한다. 프로퍼티이름과 칼럼명이 다르게 되는 셈.
  fieldWithUnderscores: {
    type: Sequelize.STRING,
    field: "field_with_underscores",
  },

  // # references
  // 외래키를 설정한다.
  bar_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Bar,
      key: "id",
    },
  },

  // # comments
  // 주석 MySQL, PostgreSQL, MSSQL Only
  commentMe: {
    type: Sequelize.INTEGER,
    comment: "This is a column name that has a comment",
  },
};

class Foo extends Sequelize.Model {}
Foo.init(fooAttributes, {
  sequelize,
  modelName: "foo",
});

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("tables synchronizing success :)");
  })
  .catch((err) => {
    console.error(err);
  });
