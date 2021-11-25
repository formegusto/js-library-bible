# Instances

## Building non-persistent instance

### Model.build()

```jsx
const project = Project.build({
  title: "test project",
  description: "we are best",
});
console.log(project.dataValues);
// { id: null, title: 'test project', description: 'we are best' }

const task = Task.build({
  title: "specity the project idea",
  description: "bia",
  deadline: new Date(),
});
console.log(task.dataValues);
/*
{
  id: null,
  title: 'specity the project idea',
  description: 'bia',
  deadline: 2021-11-25T04:42:15.844Z
}
*/
```

- Model Instance의 build 메서드는 아직 데이터베이스에 저장되지 않은 객체를 반환해준다.
- 여기서는 일반적인 객체 프로퍼티에 접근하듯이 `task.title` 과 같이 프로퍼티에 접근이 가능.

### Model.save()

```jsx
const resultProjectSave = await project.save();
const resultTaskSave = await task.save();

console.log(resultProjectSave.dataValues);
/*
{
  id: 1,
  title: 'test project',
  description: 'we are best',
  updatedAt: 2021-11-25T04:45:53.293Z,
  createdAt: 2021-11-25T04:45:53.293Z
}
*/
console.log(resultTaskSave.dataValues);
/*
{
  id: 1,
  title: 'specity the project idea',
  description: 'bia',
  deadline: 2021-11-25T04:45:53.291Z,
  updatedAt: 2021-11-25T04:45:53.303Z,
  createdAt: 2021-11-25T04:45:53.303Z
}
*/
```

- Model Instance의 save 메서드를 통해 해당 Model의 내용을 DB에 저장할 수 있다.

## Creating persistent instances

### Model.create()

- build() 메서드를 통해 만들어진 instance는 반드시 save() 메서드를 호출해야 데이터베이스에 저장이된다. create() 메서드는 객체를 바로 저장할 수 있는 기능을 제공한다.

```jsx
const userSaveResult = await User.create(userInfo, { fields: ["username"] });
console.log(
  userSaveResult.get({
    plain: true,
  })
);
/*
{
  id: 1,
  username: 'formegusto',
  updatedAt: 2021-11-25T04:55:30.066Z,
  createdAt: 2021-11-25T04:55:30.066Z
}
*/

const adminSaveResult = await User.create(adminInfo);
console.log(
  adminSaveResult.get({
    plain: true,
  })
);
/*
{
  id: 2,
  username: 'formegusto',
  isAdmin: true,
  updatedAt: 2021-11-25T04:55:30.082Z,
  createdAt: 2021-11-25T04:55:30.082Z
}
*/
```

- 옵션 중, fields는 저장 객체안에서 어떤 프로퍼티들을 저장할 것인지에 대한 정의다. 기본값은 전체 저장. ( 모든 저장, 수정같은 데이터를 지우지 않는 가공 명령어들이 가지고 있는 옵션이다. )

## Updating

### Model.update()

```jsx
const task = Task.build({
  title: "a Task",
  description: "This is Task",
  deadline: new Date(),
});

const taskSaveResult = await task.save();
console.log(
  taskSaveResult.get({
    plain: true,
  })
);

const taskUpdateResult = await task.update({
  title: "change a task",
});
console.log(
  taskUpdateResult.get({
    plain: true,
  })
);
```

- 마찬가지로, 옵션 란에 fields 프로퍼티를 넣어서 특정 칼럼만 변경시키고, 저장시킬 수 있다.

## Destroying

### Model.destory()

```jsx
const task = await Task.create({
  title: "a task",
});
console.log(
  task.get({
    plain: true,
  })
);
/*
  {
      id: 1,
      title: 'a task',
      updatedAt: 2021-11-25T05:18:10.368Z,
      createdAt: 2021-11-25T05:18:10.368Z
  }
*/

const deleteTask = await task.destroy();
console.log(deleteTask.get({ plain: true }));
/*
  UPDATE `Task` SET `deletedAt`=?,`updatedAt`=? WHERE `id` = ?
  {
      id: 1,
      title: 'a task',
      updatedAt: 2021-11-25T05:18:10.380Z,
      createdAt: 2021-11-25T05:18:10.368Z,
      deletedAt: 2021-11-25T05:18:10.380Z
  } 
*/
```

- Model에서 삭제 메서드인 destory()를 호출하면 해당 데이터가 삭제된다. 하지만 모델에 `paranoid:true` 설정이 되어 있는 경우, 삭제되지 않고 deletedAt에 삭제된 시간이 기록된다.

```jsx
const deleteTask = await task.destroy({ force: true });
console.log(deleteTask.get({ plain: true }));
/*
DELETE FROM `Task` WHERE `id` = 1
{
	id: 1,
	title: 'a task',
	updatedAt: 2021-11-25T05:20:17.903Z,
	createdAt: 2021-11-25T05:20:17.903Z
}
*/
```

- destroy 메서드에 매개변수로 `{ force: true }` 를 보내준다. 그러면 deletedAt이 아닌, 완전히 데이터가 지워지고, 지워진 데이터가 반환된다.

### Model.restore() : Restoring soft-deleted instances

- 이렇듯 paranoid가 설정된 Model Instance 에서 destroy를 실행하면, soft-deleted 가 된다.
- 이 때, restore() 메서드를 사용하면 deletedAt이 다시 null값으로 채워진다.

```jsx
const deleteTask = await task.destroy();
console.log(deleteTask.get({ plain: true }));
/*
  {
      id: 1,
      title: 'a task',
      updatedAt: 2021-11-25T05:18:10.380Z,
      createdAt: 2021-11-25T05:18:10.368Z,
      deletedAt: 2021-11-25T05:18:10.380Z
  } 
*/

const restoreTask = await task.restore();
console.log(restoreTask.get({ plain: true }));
/*
  {
      id: 1,
      title: 'a task',
      updatedAt: 2021-11-25T05:29:05.545Z,
      createdAt: 2021-11-25T05:29:05.527Z,
      deletedAt: null
  }
*/
```

## Working in bulk

> **bulk란 여러행을 작업할 때 쓰이는 용어이다. Sequelize 에서는 여러 행을 추가 시키기 위해 bulkCreate를 사용한다.**

```jsx
User.bulkCreate(users)
  .then((result) => {
    return User.findAll({
      raw: true,
    });
  })
  .then((users) => {
    console.log(users);
  });
```

> **Update 활용**

```jsx
Task.bulkCreate(tasks)
  .then(() => {
    return Task.update(
      {
        status: "inactive",
      },
      {
        where: {
          subject: "programming",
        },
      }
    );
  })
  .then(([affectedCount, affectedRows]) => {
    console.log("변화 : ", affectedCount);

    return Task.findAll({
      where: {
        subject: "programming",
      },
      raw: true,
    });
  })
  .then((result) => {
    console.log(result);
  });
```

> **destroy 활용**

```jsx
Task.bulkCreate(tasks)
  .then(() => {
    return Task.destroy({
      where: {
        subject: "programming",
      },
      truncate: true,
      // 외래키를 모두 무시하고 데이터를 지운다.
    });
  })
  .then((affectedRows) => {
    return Task.findAll({
      raw: true,
    });
  })
  .then((result) => {
    console.log(result);
  });
```

> **fields 옵션 존재합니당.**

```jsx
User.bulkCreate([{ username: "foo" }, { username: "bar", admin: true }], {
  fields: ["username"],
}).then(() => {
  // nope bar, you can't be admin!
});
```

> **option validate: true**

- bulkCreate는 레코드를 빠르게 삽입하는 방법으로 만들어졌는데, 여러행을 넣다가 validate에 위반하는 행을 마주치면 에러를 뽑아내면서 데이터삽입을 멈추게 된다.

```jsx
try {
  const result = await ValidateTask.bulkCreate(validateTasks, {});

  console.log(result);
} catch (err) {
  console.log(err);
  err.forEach((e) => console.log(e.message));
  /*
      notNull Violation: name cannot be null
      Validation error: code is [code >= 3] and [code <= 10]
  */
}
```

- 중간에 멈추지 않게 하려면 { validate: true } 옵션을 준다. 그러면, 에러 내용이 담겨진 배열이 catch 문으로 반환이 된다.

## Values of an Instance

- Sequelize 에서의 Instance는 `get()` 메서드 안에 `{ plain: true }` 옵션을 주면, 깔끔한 객체 형태로 반환이 된다.
- 이는 JSON.stringify(instance) 를 사용하면 위의 객체 형태가 string 타입으로 만들어진다.

## Reloading instances

### Model.reload()

```jsx
Person.findOne({ where: { name: "john" } }).then((person) => {
  person.name = "jane";
  console.log(person.name); // 'jane'

  person.reload().then(() => {
    console.log(person.name); // 'john'
  });
});
```

## Counting

### Model.increment()

```jsx
// Postgres 만 변경된거를 반환해준다. 다른 dialect는 reload 사용
await saveUser.increment(["age"], { by: 2 });
const incUser = await saveUser.reload();
console.log(incUser.get({ plain: true })["age"]); // 28

// another-usage
/*
User.findByPk(1).then(user => {
  return user.increment({
    'my-integer-field':    2,
    'my-very-other-field': 3
  })
}).then(/* ... */)
*/
```

### Model.decrement()

```jsx
await saveUser.decrement(["age"], { by: 4 });
const decUser = await saveUser.reload();
console.log(decUser.get({ plain: true })["age"]); // 24

// another-usage
/*
User.findByPk(1).then(user => {
  return user.decrement({
    'my-integer-field':    2,
    'my-very-other-field': 3
  })
}).then(/* ... */)
*/
```
