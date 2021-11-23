const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");

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
    freezeTableName: true,
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
  }
}

sequelize.sync({ force: true }).then(async () => {
  await PubExam();
});
