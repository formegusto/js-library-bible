const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");

// option 1. as part of a single property definition
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

// option 2_1. as part of model options
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

// option 2_2. with sequelize
const EmployeeThree = sequelize.define(
  "EmployeeThree",
  {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
  },
  {
    getterMethods: {
      fullName() {
        return this.firstname + " " + this.lastname;
      },
    },
    setterMethods: {
      fullName(value) {
        const names = value.split(" ");
        this.setDataValue("firstname", names.slice(0, -1).join(" "));
        this.setDataValue("lastname", names.slice(-1).join(" "));
      },
    },
  }
);

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("table synchronizing success :)");

    console.log("##### EmplyeeOne Test #####");
    EmployeeOne.create({ name: "John Doe", title: "senior engineer" })
      .then((employee) => {
        console.log(employee.get("name")); // John Doe (SENIOR ENGINEER)
        console.log(employee.get("title")); // SENIOR ENGINEER
      })
      .catch((err) => {
        console.error(err);
      });

    console.log("##### EmplyeeTwo Test #####");
    EmployeeTwo.create({ firstname: "forme", lastname: "gusto" })
      .then((employee) => {
        console.log(employee.fullName);
      })
      .catch((err) => {
        console.error(err);
      });

    console.log("##### EmplyeeThree Test #####");
    EmployeeThree.create({ firstname: "i am", lastname: "formegusto" })
      .then((employee) => {
        console.log(employee.fullName);
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });
