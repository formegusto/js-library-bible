import Project from "../models/project";
import User from "../models/user";
import { AddressCol, ProjectCol, UserCol } from "../types/col";

const USER_DATAS: UserCol[] = [
  {
    name: "no th",
    preferredName: "formegusto",
  },
  {
    name: "anyone",
    preferredName: "any",
  },
  {
    name: "someone",
    preferredName: "some",
  },
];

const PROJECT_ONE: ProjectCol = {
  name: "a project",
};

const PROJECT_TWO: ProjectCol = {
  name: "b project",
};

const ADDRESS_ONE: AddressCol = {
  address: "서울",
};

export async function createDataWithUserProject() {
  await User.bulkCreate(USER_DATAS);

  const usersInDBTypeRaw = await User.findAll({ raw: true });
  console.log("-----confirm user datas-----");
  console.log(usersInDBTypeRaw);
  console.log("----------------------------\n");

  // save Project One
  const usersInDB = await User.findAll();
  const projectOne = await Project.build(PROJECT_ONE).save();
  await usersInDB[0].addProject([projectOne]);

  // get Project One
  await usersInDB[0].reload({
    include: [User.associations.projects],
  });
  console.log(usersInDB[0].get({ plain: true }));

  // new save Project Two
  const projectTwo = await Project.build(PROJECT_TWO).save();
  await usersInDB[0].setProjects([projectOne, projectTwo]);
  const selectUserOne = await User.findByPk(1, {
    include: [User.associations.projects],
    rejectOnEmpty: true,
  });
  if (selectUserOne.projects) {
    console.log(
      selectUserOne.projects.length > 1 &&
        selectUserOne.projects[1].get({ plain: true })
    );
  }
}

export async function createDataWithUserAddress() {
  const user = await User.findByPk(1);

  const userInAddress = await user?.createAddress(ADDRESS_ONE);
  console.log(userInAddress?.get({ plain: true }));

  await user?.reload({
    include: [User.associations.address],
  });
  console.log(user?.address?.get({ plain: true }));
}
