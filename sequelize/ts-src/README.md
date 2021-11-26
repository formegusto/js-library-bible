# TypeScript

> **Sequelize v5 부터, Sequelize 는 TypeScript 정의를 가지기 시작했다. 이는 TypeScript v3.1 부터 호환이 된다.**

- Sequelize는 런타임 속성 할당에 크게 의존해서, 모델을 작동하게 하려면 많은 양의 Type선언이 필요하기 때문에 아직까지는 TypeScript와는 잘 어울리지 않는다고 한다.

## Installation

```
yarn add -D @types/node @types/validator @types/bluebird
```

## Model Type Definition

> **TypeScript 특성상, Model의 타입을 정의해주어야 한다. 이 과정이 매우 코드가 길어져서, TypeScript와 Sequelize는 잘 맞지 않는다는 말이 나온 것 같다.**

```tsx
class User extends Model {
  // 1.property
  public readonly id!: number;
  public name!: string;
  public preferredName!: string | null;

  // 2.timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 3.association func
  public getProjects!: HasManyGetAssociationsMixin<Project>;
  public setProjects!: HasManySetAssociationsMixin<Project, number>;
  public addProject!: HasManyAddAssociationsMixin<Project, number>;
  public hasProject!: HasManyHasAssociationMixin<Project, number>;
  public countProjects!: HasManyCountAssociationsMixin;
  public createProject!: HasManyCreateAssociationMixin<Project>;

  public getAddress!: HasOneGetAssociationMixin<Address>;
  public setAddress!: HasOneSetAssociationMixin<Address, number>;
  public createAddress!: HasOneCreateAssociationMixin<Address>;

  // 4.association property
  public readonly projects?: Project[];
  public readonly address?: Address;

  // 5.association
  public static associations: {
    projects: Association<User, Project>;
    address: Association<User, Address>;
  };
}
```

1. Property & timestamps
   1. 자동으로 생기는 칼럼들 (id, createdAt, updatedAt) 은 설정안해줘도 된다. 어짜피 findAll 등 실행 시키고 plain object화 시키면 쿼리결과 그대로~ 가지고 온다. 때문에 우리가 Model 객체를 받았을 때, 쉽게 제어 하기 위해서 설정한다고 생각하면 된다.
   2. typescript는 strict mode 에서 프로퍼티가 비어있는 것을 용납하지 않는다. 초기화를 해줘야 하는데, 위에서도 Model 객체들을 신나게 다루어봤듯이, 절대 내가 객체화해서 쓸일이 없다. optional (!) 를 써준다. 다른 것들도 마찬가지.
   3. 정말 내가 건들일 없는 id, createdAt, updatedAt은 readonly로 막아버리자
2. association func
   1. (공식문서) TypeScript는 컴파일 타임에서 Model Association을 결정할 수 없기 때문에, 가상으로 선언을 해놔줘야 한다. 이 때, 이 함수들은 Model.init 이 호출되기 전까지 존재하지 않는다.
   2. 이름의 향기로 쉽게 찾을 수 있다.
3. association & association property
   1. association type을 선언해두고, association property로 선언한다.
   2. 이들은 개발자가 include 하지 않았을 때는 없을 수도 있는 정보들이기 때문에, optional (?) 로 설정한다.
   3. Association<Source, Target> 의 구성으로 자신을 Source, Target을 관계설정할 모델 클래스를 넣는다.

## (Idea) Init Model Supporter

> **TypeScript는 미지의 세계,,, super.init 이 호출되지 않아서, 아예 새로운 static 메서드를 만들었다. 안에서의 사용법은 똑같다.**

```tsx
public static initConfig(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preferredName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { sequelize, modelName: "user" }
  );
}

public static associationsConfig() {
  User.hasMany(Project, {
    sourceKey: "id",
    foreignKey: "ownerId",
    as: "projects",
  });
  User.hasOne(Address, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "address",
  });
}
```

## Basic Usage

- 소스코드 참고

## Usage of sequelize.define

```tsx
// defineModel.ts
interface DefineModel extends Model {
  readonly id: number;
}

export type DefineModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DefineModel;
};

// index.ts
export const DefineModel = <DefineModelStatic>sequelize.define("DefineModel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

// example
await DefineModel.create();

const defineModel = await DefineModel.findByPk(1, {
  rejectOnEmpty: true,
});
console.log(defineModel.get({ plain: true }));
```
