import bcrypt from "bcrypt";

async function usage() {
  const saltRounds = 10;
  const myPlaintextPassword = "12345678";
  const someOtherPlaintextPassword = "87654321";

  const salt = await bcrypt.genSalt(saltRounds);
  console.log(salt);
  // $2b$10$lPezHj9IV4TOpWYnKTLNE.

  const hash = await bcrypt.hash(myPlaintextPassword, salt);
  console.log(hash);
  // $2b$10$lPezHj9IV4TOpWYnKTLNE.ym6BvpILcg/GGXEvNFG9e8Tio0ZTTui

  const isAuth = await bcrypt.compare(myPlaintextPassword, hash);
  console.log(isAuth);
  // true

  const isAuthTwo = await bcrypt.compare(someOtherPlaintextPassword, hash);
  console.log(isAuthTwo);
  // false
}

usage();
