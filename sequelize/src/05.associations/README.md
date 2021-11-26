# Associations

> **Sequelize 는 4가지 타입의 association들을 지원해준다.**

1. BelongsTo
2. HasOne
3. HasMany
4. BelongsToMany

## Basic Concepts

### Source & Target

> **Sequelize Association은 source와 target의 관계를 가지고 시작한다.**

```jsx
class User extends Model {}
// ...

class Project extends Model {}
// ...

User.hasOne(Project);
```

- User Model은 source의 역할을 한다. ( 실행자의 역할 )
- Project Model은 target의 역할을 한다. ( 매개변수의 역할 )

### Foreign Keys

> model들 사이의 associations를 만들게 되면, foreign key를 통해 그들의 관계가 엮어진다.

```jsx
class Task extends Model {}
Task.init({ title: Sequelize.STRING }, { sequelize, modelName: "task" });
class User extends Model {}
User.init({ username: Sequelize.STRING }, { sequelize, modelName: "user" });

User.hasMany(Task); // Will add userId to Task model
Task.belongsTo(User); // Will also add userId to Task model
```

- User Model로 부터 Task에게 "나는 너를 여러개 가질 수 있어" 하고 선언했다.
- Task Model로 부터 User에게 "나는 너에게 속할 수 있어" 하고 선언 했다.
  → 1(User):M(Task) 의 관계가 형성됐고, 이는 DB Modeling에서 M의 관계쪽에 있는 모델이 1의 Primary Key를 Foreign Key로 가지게 된다.
- 기본적으로 Foreign Key는 NULL ON UPDATE CASCADE, ON DELETE CASCADE 옵션을 가지게 된다.
  - 이들은 association의 옵션 중 onUpdate, onDelete로 수정이 가능하며, 이 밖에 RESTRICT, CASCADE, NOACTION, SET DEFAULT, SET NULL 설정이 가능하다.
  - 1:1, 1:m 관계에서는 SET NULL(deletion)과, CASCADE(for update)이 기본설정으로 붙으며, n:m 관계에서는 양쪽에 CASCADE 설정이 들어간다.

### underscored option

> **model 생성 시, `underscored: true` 옵션이 붙어있으면, association 관계에서 Foreign Key 생성이 underscored case 방식으로 칼럼명이 부여된다.**

### 순환 종속성 (Cyclick dependencies) 및 제약 조건 비활성화 (Disabling Constraints)

> 때때로, 테이블을 두 번 참조해야 하는 경우가 있다. 예로 들어, 어떤 문서가 자신만의 버전들을 테이블에 기록하고, 현재 버전을 표시해야 하는 경우.

```jsx
class Document extends Model {}
Document.init(
  {
    author: Sequelize.STRING,
  },
  { sequelize, modelName: "document" }
);
class Version extends Model {}
Version.init(
  {
    timestamp: Sequelize.DATE,
  },
  { sequelize, modelName: "version" }
);

// 자신만의 버전들을 테이블에 기록
Document.hasMany(Version);
// 현재 버전을 표시해야 하는 경우
Document.belongsTo(Version, {
  as: "Current",
  foreignKey: "currentVersionId",
});
```

- 이는 순환종속성에 의해 에러를 발생한다. documents → versions ⇒ documents 와 같이 참조가 되고 있기 때문이다.
- 이것을 성공 시키려면 제약 조건을 비활성화 시켜줘야 한다.

```jsx
Document.hasMany(Version);
Document.belongsTo(Version, {
  as: "Current",
  foreignKey: "currentVersionId",
  constraints: false,
});
```

- 이렇게 되면, Version Model 쪽에 documentId 가 생기고, Document Model 쪽에 currentVersionId가 생길 것 이다.

### 수동 외래 키 적용

```jsx
class Trainer extends Model {}
Trainer.init(
  {
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
  },
  { sequelize, modelName: "trainer" }
);

class Series extends Model {}
Series.init(
  {
    title: Sequelize.STRING,
    subTitle: Sequelize.STRING,
    description: Sequelize.TEXT,
    // TrainerID 를 가짐으로서, belongsTo 처럼 적용이 된 것이고,
    // 후에 Trainer.hasMay(Series)를 실행시키면
    // 1:M 관계가 정의된다.
    trainerId: {
      type: Sequelize.INTEGER,
      references: {
        model: Trainer,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "series" }
);

class Video extends Model {}
Video.init(
  {
    title: Sequelize.STRING,
    sequence: Sequelize.INTEGER,
    description: Sequelize.TEXT,
    // SeriesID를 가짐으로서, belongsTo 처럼 적용이 된다.
    // 후에 Series.hasOne(Video)를 실행시키면
    // 1:1 관계가 정의된다.
    seriesId: {
      type: Sequelize.INTEGER,
      references: {
        model: Series,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "video" }
);

Series.hasOne(Video);
Trainer.hasMany(Series);
```

## One-To-One Associations

> **One-To-One 관계는 두 개의 모델 연결에 한개의 외래키가 있는 것을 말한다.**

### BelongsTo

> **Source Model 이 TargetModel의 외래키를 가지게 된다.**

```jsx
class Player extends Model {}
Player.init({}, { sequelize, modelName: "player" });
class Team extends Model {}
Team.init({}, { sequelize, modelName: "team" });

**Player.belongsTo(Team);**
/*
	CREATE TABLE IF NOT EXISTS `players`
	(`id` INTEGER NOT NULL auto_increment ,
	`createdAt` DATETIME NOT NULL, `
	updatedAt` DATETIME NOT NULL,
	`teamId` INTEGER, PRIMARY KEY (`id`),
	**FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`)**
	ON DELETE
	SET NULL
	ON UPDATE CASCADE)
	ENGINE=InnoDB;
*/
```

> **Foreign Keys : 외래키는 기본적으로 belongsTo 관계에서 target model의 이름과 기본키 이름을 따른다. 이 때, string case 의 여부는 source model의 설정에 따른다.**

```jsx
class User extends Model {}
User.init({}, { sequelize, modelName: "user", underscored: true });
class Company extends Model {}
Company.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  { sequelize, modelName: "company" }
);
User.belongsTo(Company);
/*
	CREATE TABLE IF NOT EXISTS `users` 
	(`id` INTEGER NOT NULL auto_increment , 
	`created_at` DATETIME NOT NULL, 
	`updated_at` DATETIME NOT NULL, `
	company_uuid` CHAR(36) BINARY, PRIMARY KEY (`id`), 
	**FOREIGN KEY (`company_uuid`) 
	REFERENCES `companies` (`uuid`)** 
	ON DELETE 
	SET NULL 
	ON UPDATE CASCADE) ENGINE=InnoDB;
*/
```

- `[model name]_[primary key name]` 형식으로 외래키가 만들어졌다.
- 자신의 설정인 `undersocred: true`로 undersocored case 로 외래키가 만들어졌다.

> **Source Model 쪽에서 as 옵션으로 target model name 을 변경할 수 있다.**

```jsx
class Person extends Model {}
Person.init({}, { sequelize, modelName: "person" });
class Household extends Model {}
Household.init({}, { sequelize, modelName: "household" });
Person.belongsTo(Household, { as: "house" });
/*
FOREIGN KEY (`houseId`) REFERENCES `households` (`id`)
*/
```

> **option.foreign key : 외래키 명을 자신이 원하는 대로 지정할 수 있다.**

```jsx
Person.belongsTo(Household, { foreignKey: "householdNumber" });
/*
FOREIGN KEY (`householdNumber`) REFERENCES `households`
*/
```

> **option.target key : 외래키의 존재 이유는 부모테이블의 식별이다. 따라서 부모키는 기본키이거나 유니크키여야 한다. 기본키 외에도 유니크키와 같은 칼럼을 target으로 잡기위한 옵션이다.**

```jsx
Household.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: "nameIndex",
    },
  },
  { sequelize, modelName: "household" }
);
Person.belongsTo(Household, { foreignKey: "apartName", targetKey: "name" });
/*
FOREIGN KEY (`apartName`) REFERENCES `households` (`name`)
*/
```

### HasOne

> **HasOne associations는 One-to-One 관계에서 target model에 존재하는 관계이다.**

```jsx
class User extends Model {}
User.init({}, { sequelize, modelName: "user" });
class Project extends Model {}
Project.init({}, { sequelize, modelName: "project" });

// Project.hasOne(User);
// FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`)

// options
// Project.hasOne(User, { foreignKey: "initiatorId" });
// Project.hasOne(User, { as: "Initiator" });
```

> **self reference model**

```jsx
class Person extends Model {}
Person.init({}, { sequelize, modelName: "person" });
Person.hasOne(Person, { as: "Father", foreignKey: "dadId" });
// FOREIGN KEY (`dadId`) REFERENCES `people` (`id`)
```

> **multiple foreign key**

```jsx
class Team extends Model {}
Team.init({}, { sequelize, modelName: "team" });
class Game extends Model {}
Game.init({}, { sequelize, modelName: "game" });

Team.hasOne(Game, { as: "HomeTeam", foreignKey: "homeTeamId" });
Team.hasOne(Game, { as: "AwayTeam", foreignKey: "awayTeamId" });
Game.belongsTo(Team);
/*
FOREIGN KEY (`homeTeamId`) REFERENCES `teams` (`id`) 
FOREIGN KEY (`awayTeamId`) REFERENCES `teams` (`id`)
*/
```

> **option.source key : target key와 같은 의미로, 자식이 사용하느냐 부모가 사용하느냐의 차이정도만 있다.**

```jsx
class Company extends Model {}
Company.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { sequelize, modelName: "company" }
);
Company.hasOne(User, { foreignKey: "companyName", sourceKey: "name" });
/*
FOREIGN KEY (`companyName`) REFERENCES `companies` (`name`)
*/
```

## HasOne과 BelongsTo의 차이점

> HasOne과 BelongsTo는 각 각 서로 다른 모델에 외래키를 삽입한다. HasOne은 대상 모델에 삽입, BelongsTo는 소스 모델에 외래키를 삽입한다.

```jsx
class Player extends Model {}
class Coach extends Model {}
class Team extends Model {}
```

- `belongsTo` Player는 Team에 속한다. 즉, 연관정보가 Source Model에 있을 때 사용.
- `hasOne` Team은 Coach를 가진다. 즉, 연관정보가 Target Model에 있을 때 사용.
  → ???

## One-To-Many Associations (hasMany)

> **One-To-Many Associations는 하나의 source와 여러개의 target들로 구성이 된다. target들은 하나의 source를 가지고 접근할 수 있게 된다.**

```jsx
Project.hasMany(User, { as: "Workers" });
// FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`)
```

```jsx
Country.hasMany(User, { foreignKey: "countryCode", sourceKey: "isoCode" });
City.belongsTo(Country, { foreignKey: "countryCode", targetKey: "isoCode" });
// FOREIGN KEY (`countryCode`) REFERENCES `countries` (`isoCode`)
```

- 쿼리 상으로는 One-To-One과 달라진게 없어보이지만, 이는 프로그래밍 상에서의 차이를 보여줄 것 이다. 나중에 Country Model 에서 .getCities와 같이 복수형으로 접근이 가능해질 것 이다.

## Belongs-To-Many Associations

> **Belongs-To-Many Associations 는 하나의 source가 여러개의 target로 구성이 되는 동시에, 하나의 target과 여러개의 source로 구성될 수 있는, N:M 관계를 정의할 때 사용한다.**

```jsx
User.belongsToMany(Project, { through: "UserProject" });
Project.belongsToMany(User, { through: "UserProject" });
/*
CREATE TABLE IF NOT EXISTS `UserProject` 
(`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
`userId` INTEGER , `projectId` INTEGER , 
PRIMARY KEY (`userId`, `projectId`), 
FOREIGN KEY (`userId`) REFERENCES `users` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE, 
FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;
*/
```

- N:M 관계로 연결하게 되면 두 모델의 기본키들을 기본키로 가지는 또 다른 테이블이 생성되게 된다. 때문에, 이들의 belongsToMany 정의에는 이를 식별할 수 있는 through가 필요하다.
- 이렇게 되면 Project Model은 getUsers, setUsers, addUser, addUser 메서드를 사용할 수 있게되고, User Model은 getProjects, setPRojects, addProject, addProjects 메서드를 사용할수 있게 된다.

```jsx
User.belongsToMany(Project, {
  as: "Tasks",
  through: "UserProject",
  foreignKey: "taskId",
});
Project.belongsToMany(User, {
  as: "Workers",
  through: "UserProject",
  foreignKey: "workerId",
});
```

- 또 그들의 역할을 명확히 해주고 싶다면, 이와 같이 as, foreign key option을 넣어주면 된다.

> **option.other key**

```jsx
User.belongsToMany(Project, {
  as: "Tasks",
  through: "UserProject",
  foreignKey: "taskId",
  otherKey: "workerId",
});
```

- option 중 other key를 사용하면 하나의 모델에서 이 작업들을 진행시킬 수 있다. otherKey는 target model의 외래키명이 된다.

> **self reference model**

```jsx
Person.belongsToMany(Person, {
  as: "Children",
  through: "PersonChildren",
  otherKey: "childId",
  foreignKey: "parentId",
});
```

> **Source and target keys**

```jsx
User.belongsToMany(Group, {
  through: "usergroups",
  sourceKey: "userSecondId",
});
Group.belongsToMany(User, {
  through: "usergroups",
  sourceKey: "groupSecondId",
});
```

- 자신의 테이블에 N:M 관계에 칼럼으로 쓰고 싶다면, unique 설정되어 있는 key를 적어주면 된다. 기능은 다른 associations와 동일하게 동작한다.

> **Additional Attributes in join table**

```jsx
class UserProjects extends Model {}
UserProjects.init(
  {
    status: DataTypes.STRING,
  },
  { sequelize, modelName: "userProjects" }
);

User.belongsToMany(Project, { through: UserProjects });
Project.belongsToMany(User, { through: UserProjects });
```

- N:M 관계에서 생기는 Join Table에 넣고 싶은 특성이 있다면, 모델로 따로 구성한 후, 관계설정 시, through 옵션에 넣어준다.
- 해당 테이블은 일반 테이블 처럼 이용할 수 있다. 기본키도 넣어줄 수 있는데, 해당 테이블 같은 경우에는 관계설정에서 생성되기 때문에, 직접 아래와 같이 지정해주어야 한다.

```jsx
class UserProjects extends Model {}
UserProjects.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: DataTypes.STRING,
  },
  { sequelize, modelName: "userProjects" }
);
```

> **Use Example**

```jsx
const user = User.build({});
const project = Project.build({});

const saveUserResult = await user.save();
const saveProjectResult = await project.save();
const saveUserProjectsResult = await user.addProject(project, {
  through: { status: "success" },
});
```

## Naming Strategy

- Sequelize 는 모델이름을 사용하여, associations 관계에서 모델의 이름으로 이들을 탐색한다.
- user가 지정된 모델들은 get/set/add User를 연결된 모델 인스턴스 기능에 추가한다.
- 우리는 `as` 옵션을 봤고, 이를 통해 모델이름을 바꿀 수 있다는 것을 알았다. 이는 association 관계에서도 적용이 되며, 단수, 복수로 진행할 수 있다.

```jsx
**User.hasMany(Project, { as: { singular: "task", plural: "tasks" } });**
Project.belongsTo(User);

async function exam() {
  const user = User.build({});
  const project = Project.build({});

  const saveUserResult = await user.save();
  const saveProjectResult = await project.save();
  **const saveProjectResultByUser = await user.addTask(project);**
  console.log(saveProjectResultByUser);
}
```

```jsx
Invoice.belongsTo(Subscription, { as: "TheSubscription" });
Subscription.hasMany(Invoice);
```

- 다음과 같은 경우 Invoice 테이블에는 TheSubscriptionId와 subscriptionId 두개가 생성이 된다. sequelize는 두 개가 같은 관계라고 인식할 만큼 똑똑하지 못해서인데, 이럴경우에는 foreignKey 옵션을 사용하여 해결한다.

```jsx
Invoice.belongsTo(Subscription, {
  as: "TheSubscription",
  foreignKey: "subscriptionId",
});
Subscription.hasMany(Invoice, { foreignKey: "subscriptionId" });
```

## Associating objects

> **Basic Usage**

```jsx
await project.setTasks([task1, task2]);
const saveProjectTasks = await project.getTasks({
  raw: true,
});

const conditionResult = await project.getTasks({
  attributes: ["title"],
  where: {
    id: {
      [Op.eq]: 2,
    },
  },
  raw: true,
});
```

> **hasMany Usage**

- hasMany 는 1:M 관계에서 1에 속한다. 즉 상대 모델을 여러개 소유할 수 있다. 그래서 의미론적으로 아래와 같은 메서드들을 지원한다.
  - setTasks, getTasks (복수개 설정)
  - addTask, removeTask (추가 설정)

```jsx
await project.setTasks([task1, task2]);
const saveProjectTasks = await project.getTasks({
  raw: true,
});
console.log("saveResult 1 :", saveProjectTasks);
/*
saveResult 1 : [
{
  id: 1,
  title: 'lunch thinking.',
  createdAt: 2021-11-25T15:32:47.000Z,
  updatedAt: 2021-11-25T15:32:47.000Z,
  projectId: 1
},
{
  id: 2,
  title: 'dinner thinking',
  createdAt: 2021-11-25T15:32:47.000Z,
  updatedAt: 2021-11-25T15:32:47.000Z,
  projectId: 1
}
]
*/

await project.setTasks([task1]);
const saveProjectTasks2 = await project.getTasks({
  raw: true,
});
console.log("saveResult 2 :", saveProjectTasks2);
/*
saveResult 2 : [
{
  id: 1,
  title: 'lunch thinking.',
  createdAt: 2021-11-25T15:32:47.000Z,
  updatedAt: 2021-11-25T15:32:47.000Z,
  projectId: 1
}
]
*/
```

```jsx
await project.removeTask(task1);
await project.addTask(task2);
```

> **BelongsTo / hasOne Usage**

- BelongsTo는 1:1 혹은 1:M 관계에서 1과 M의 역할을 한다. 그래서 본인이 속한 1에 관해서는 본인이 제거할 수 있다. 그래서 주로 아래와 같은 메서드들이 추가된다.
  - set / get

```jsx
await task2.setProject(null);
const saveProjectTasks5 = await project.getTasks({
  raw: true,
});
console.log("saveResult 5 :", saveProjectTasks5); // []
```

> BelonsToMany Usage

- BelongsToMany 는 N:M 관계 설정의 역할을 한다.
  - set / get
  - add / remove
  → 양쪽 상관없이 사용이 가능하다.

```jsx
class UserProjects extends Model {
  static init(sequelize) {
    super.init(
      {
        status: DataTypes.STRING,
      },
      { sequelize, modelName: "UserProjects" }
    );
  }

  static associate(db) {}
}

User.belongsToMany(db.Project, {
  through: db.UserProject,
  as: { singular: "Task", plural: "Tasks" },
  foreignKey: "workerId",
});

Project.belongsToMany(db.User, {
  through: db.UserProject,
  as: { singular: "Task", plural: "Tasks" },
  foreignKey: "taskId",
});
```

```jsx
const user = await User.create();
const project_1 = await Project.create();

project_1.UserProjects = {
  status: "active",
};
await user.addTask(project_1);
//   await user.addTask(project_1, {through: {status: 'success'}})

const userHasProject_1 = await user.getTasks({
  raw: true,
});
console.log(userHasProject_1);
/*
[
  {
    id: 1,
    status: 'project init',
    createdAt: 2021-11-25T16:22:58.000Z,
    updatedAt: 2021-11-25T16:22:58.000Z,
    'UserProjects.status': 'active',
    'UserProjects.createdAt': 2021-11-25T16:22:58.000Z,
    'UserProjects.updatedAt': 2021-11-25T16:22:58.000Z,
    'UserProjects.taskId': 1,
    'UserProjects.workerId': 1
  }
]
*/
console.log(userHasProject_1[0]["UserProjects.status"]);

project_1.UserProjects = {
  status: "incative",
};
await user.setTasks(project_1);
const userHasProject_2 = await user.getTasks({
  attributes: [],
  joinTableAttributes: ["status"],
  // raw: true,
});
console.log(userHasProject_2[0].UserProjects.get({ plain: true }));
/*
{ status: 'incative' }
*/
```

- `as` 옵션의 또다른 기능은 N:M 관계에서의 조이테이블 칼럼 설정이 가능하다는 것 이다.
- `raw:true` 옵션을 사용하게 되면, plain object로 반환되며, 이 과정에서 sequelize 내부적으로 조인테이블 칼럼을 다른 object로 형성해서 프로퍼티에 넣는 것이 아니라, 분해해서 join_table.column_name 구조의 프로퍼티 네임으로 구조화 시킨다.

## Check associations

> **N:M 관계의 Association 에서는 해당 모델 포함여부를 확인할 수 있다.**

```jsx
const project = await Project.create();
const user = await User.create();

const isProjectHasUser_1 = await project.hasWorker(user);
console.log(
  `project id [${project.id}] has ${isProjectHasUser_1 ? "" : '"not"'} user [${
    user.id
  }]`
); // project id [1] has "not" user [1]

await project.addWorker(user);
const isProjectHasUser_2 = await project.hasWorker(user);
console.log(
  `project id [${project.id}] has ${isProjectHasUser_2 ? "" : '"not "'}user [${
    user.id
  }]`
); // project id [1] has user [1]

const user2 = await User.create();
const users = [user, user2];
const isProjectHasUsers_1 = await project.hasWorkers(users);
console.log(
  `project id [${project.id}] has ${
    isProjectHasUsers_1 ? "" : '"not"'
  } users [${users
    .slice(1)
    .reduce((acc, cur) => acc + "," + cur.id, users[0].id.toString())}]`
); // project id [1] has "not" users [1,2]

await project.setWorkers(users);
const isProjectHasUsers_2 = await project.hasWorkers(users);
console.log(
  `project id [${project.id}] has ${
    isProjectHasUsers_2 ? "" : '"not "'
  }users [${users
    .slice(1)
    .reduce((acc, cur) => acc + "," + cur.id, users[0].id.toString())}]`
); // project id [1] has users [1,2]
```

## Advanced Concepts

### Scopes ( 1:n )

> **Association Scopes. 예제 모델로 게시글 (Post), 이미지 (Image), 댓글 (Comment) 가 준비되어 있다. 현재상황은 게시글과 이미지에 모두 댓글을 달 수 있는 상황이다.**

```jsx
class Post extends Model {}
Post.init(
  {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
  },
  { sequelize, modelName: "post" }
);
class Image extends Model {}
Image.init(
  {
    title: DataTypes.STRING,
    link: DataTypes.STRING,
  },
  { sequelize, modelName: "image" }
);
class Comment extends Model {
  getItem(options) {
    return this[
      "get" +
        this.get("commentable")[0].toUpperCase() +
        this.get("commentable").substr(1)
    ](options);
  }
}
Comment.init(
  {
    title: DataTypes.STRING,
    commentable: DataTypes.STRING,
    commentableId: DataTypes.INTEGER,
  },
  { sequelize, modelName: "comment" }
);
```

```jsx
Post.hasMany(Comment, {
  foreignKey: "commentableId",
  constraints: false,
  scope: {
    commentable: "post",
  },
});
Comment.belongsTo(Post, {
  foreignKey: "commentableId",
  constraints: false,
  as: "post",
});
Image.hasMany(Comment, {
  foreignKey: "commentableId",
  constraints: false,
  scope: {
    commentable: "image",
  },
});
Comment.belongsTo(Image, {
  foreignKey: "commentableId",
  constraints: false,
  as: "image",
});
```

- 이 때, Post Model과 Image Model 두 개의 모델이 Comment Model과의 1:N 관계를 맺어야 하는 상황이다. 외래키를 postId, imageId 라고 설정해도 되겠지만, 가독성이 매우 떨어지는 테이블 구조가 잡히게 된다.
- 때문에 Sequelize 문서에서 소개하는 방식은 commentable 이라는 칼럼을 Comment Model 에 추가 시켰다. 이를 통해 해당 행의 scope를 표현할 것 이다.
- 그래서 오른쪽과 같이 association scopes 옵션에 commentable column의 값을 지정해준다.
- 이 때, 두 개가 같은 외래키를 바라보고 있기 때문에, constraint 가 겹쳐서 에러를 발생시킬 것이다. 이 관계에 속한 모든 associtations 에 `contraints: false` 옵션을 넣어준다.

```jsx
const image = await Image.create();

await image.getComments();
/*
SELECT `id`, `title`, `commentable`, `commentableId`, 
`createdAt`, `updatedAt` 
FROM `comments` AS `comment` 
**WHERE `comment`.`commentable` = 'image'** 
AND `comment`.`commentableId` = 1;
*/
const comment = await image.createComment();
await image.addComment(comment);
```

```jsx
class Comment extends Model {
  getItem(options) {
    return this[
      "get" +
        this.get("commentable")[0].toUpperCase() +
        this.get("commentable").substr(1)
    ](options);
  }
}
```

- 추가적으로, 이렇게 외래키를 같이 쓰고, scope columns로 표현된 테이블은 위와 같은 메서드를 모델에 추가해주면 좋다.

```jsx
await comment.getImage();
/*
SELECT * 
FROM `images` AS `image` 
WHERE `image`.`id` = 1;
*/
await comment.getPost();
/*
SELECT *
FROM `posts` AS `post` 
WHERE `post`.`id` = 1;
*/
```

```jsx
console.log(
  "get" +
    comment.get("commentable")[0].toUpperCase() +
    comment.get("commentable").substr(1)
); // getImage

await comment.getItem();
/*
SELECT *
FROM `images` AS `image` 
WHERE `image`.`id` = 1;
*/
```

- 위의 예제는 이미지 (image model)에 댓글 (comment model)을 달아놓은 상황이다.
  - 이때 ,comment model은 두 개의 모델과 관계를 가지고 있기 때문에, getImage, getPost 가 모두 가능한 상황이다.
  - 하지만, getImage 를 하든, getPost를 하든 이들과의 관계는 자신의 commentableId로 연결되어 있기 때문에 양쪽 다 모두 조회가 가능한 상황이라는 것이다.
  - 즉, 위 상황은 이미지에 댓글을 단 상황인데, 포스트에 댓글을 조회하는 엉뚱한 조회도 가능해지는 것 이다.
  - 때문에, 위와 같이 getItem 메서드를 만들어놓으면, 오른쪽과 같이 해당 comment에 맞는 게시글 (Post) 혹은 이미지 (Image) 의 조회가 가능해진다.

### Scopes (n:m)

> **현재상황은 게시물과 태그의 관계이다. 태그는 여러개의 게시물을 가질 수 있으며, 게시물 또한 여러개의 태그를 가질 수 있다.**

```jsx
class ItemTag extends Model {}
ItemTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tagId: {
      type: DataTypes.INTEGER,
      unique: "item_tag_taggable",
    },
    taggable: {
      type: DataTypes.STRING,
      unique: "item_tag_taggable",
    },
    taggableId: {
      type: DataTypes.INTEGER,
      unique: "item_tag_taggable",
      references: null,
    },
  },
  { sequelize, modelName: "item_tag" }
);
class Tag extends Model {}
Tag.init(
  { name: DataTypes.STRING, status: DataTypes.STRING },
  {
    sequelize,
    modelName: "tag",
  }
);

class Post extends Model {}
Post.init(
  {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
  },
  { sequelize, modelName: "post" }
);
```

```jsx
Post.belongsToMany(Tag, {
  through: {
    model: ItemTag,
    unique: false,
    scope: {
      taggable: "post",
    },
  },
  as: "pendingTags",
  foreignKey: "taggableId",
  constraints: false,
});
Tag.belongsToMany(Post, {
  through: {
    model: ItemTag,
    unique: false,
  },
  foreignKey: "tagId",
  constraints: false,
});
```

- sequelize 문서는 태그가 여러 종류의 scope에 붙을 수 있다는 점을 가정하에 진행을 한다. taggable은 태그가 된 Model의 scope를 담는 scope column 이다.

```jsx
const post = (await Post.findAll())[0];
const tag = (await Tag.findAll())[0];
await post.addPendingTag(tag);

const pendingTags = await post.getPendingTags({
  raw: true,
});
console.log(pendingTags);
```

## Creating with associations

> **Sequelize는 instance가 DataBase에 데이터를 넣을 때, 중첩관계에 있는 데이터들까지 모두 한 번에 들어갈 수 있도록 지원한다.**

### BelongsTo / HasMany / HasOne association

```jsx
Product.User = Product.belongsTo(User);
User.Addresses = User.hasMany(Address);
// Also works for `hasone`
```

```jsx
await Product.create(
  {
    title: "Chair",
    user: {
      firstName: "Mick",
      lastName: "Broadstone",
      addresses: [
        {
          type: "home",
          line1: "100 Main St.",
          city: "Austin",
          state: "TX",
          zip: "78704",
        },
      ],
    },
  },
  {
    include: [
      {
        association: Product.User,
        include: [User.Addresses],
      },
    ],
  }
);

const product = await Product.findOne({
  where: {
    title: "Chair",
  },
  include: [
    {
      association: Product.User,
      include: [User.Addresses],
      // ==
      // model: User,
      // include: [
      //   {
      //     model: Address,
      //   },
      // ],
    },
  ],
});
console.log(product.get({ plain: true }));
/*
  {
      id: 1,
      title: 'Chair',
      createdAt: 2021-11-26T04:49:39.000Z,
      updatedAt: 2021-11-26T04:49:39.000Z,
      userId: 1,
      user: {
          id: 1,
          firstName: 'Mick',
          lastName: 'Broadstone',
          createdAt: 2021-11-26T04:49:39.000Z,
          updatedAt: 2021-11-26T04:49:39.000Z,
          addresses: [ [Object] ]
      }
  }
*/
```

### BelongsTo association with an alias

> **위에서 만들어서 저장해둔 association object를 후에 생성할 때나, 조회할 때, 이용할 수 있다는 것을 알았다. 이는 여러가지로 활용이 될 수 있다.**

```jsx
const Creator = Product.belongsTo(User, {
  as: "creator",
});
```

### HasMany / BelongsToMany association

> **아 이제서야 컨셉 이해! 우리는 associations object를 이용해서 개발자에게 편한 네이밍으로 객체를 가지고 올 수 있게 설정할 수 있다는 뜻이다. 여기서 as가 붙는 것이고!**

```jsx
Product.hasMany(Tag);
const Categories = Product.hasMany(Tag, { as: "categories" });
```

```jsx
await Product.create(
  {
    id: 1,
    title: "Chair",
    tags: [
      {
        name: "Alpha",
      },
      {
        name: "Beta",
      },
    ],
  },
  {
    include: [Tag],
  }
);

await Product.create(
  {
    id: 2,
    title: "formegusto",
    categories: [
      {
        name: "dance",
      },
      {
        name: "boy",
      },
    ],
  },
  {
    include: [
      {
        association: Categories,
        as: "categories",
      },
    ],
  }
);
```

```jsx
const productsWithCats = await Product.findAll({ include: [Categories] });
console.log(
  productsWithCats[0].categories[0].get({
    plain: true,
  })
);

const productWithTags = await Product.findAll({ include: [Tag] });
console.log(
  productWithTags[0].tags[0].get({
    plain: true,
  })
);
```

- 누구는 product의 분류를 tag로 네이밍하는 것이 편할 수 있을 것이고, 누구는 category로 네이밍 하는 것이 편할 수 있을 것이다. 이것을 나눠서 사용하는 것이다.
- 같은 결과이지만, 본인이 편한 네이밍으로 가지고 올 수 있다.
