import { Model, BuildOptions } from "sequelize";

interface DefineModel extends Model {
  readonly id: number;
}

export type DefineModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DefineModel;
};
