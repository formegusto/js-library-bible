function getMongoConneciton() {
  const dotenv = require("dotenv");

  dotenv.config();
  const mongoose = require("mongoose");
  const { MONGO_URI, MONGO_PORT, MONGO_APP } = process.env;
  const connectionURL = `mongodb://${MONGO_URI}:${MONGO_PORT}/${MONGO_APP}`;

  mongoose.connect(connectionURL);

  return mongoose;
}

module.exports = getMongoConneciton;
