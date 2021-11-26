import {
  createDataWithUserAddress,
  createDataWithUserProject,
} from "./examples/create-data";
import sequelize from "./models";

async function _() {
  try {
    await sequelize.sync({ force: true });
    console.log("[database] connected :)");

    await createDataWithUserProject();

    await createDataWithUserAddress();
  } catch (err) {
    console.log((err as any).message);
  }
}
_();
