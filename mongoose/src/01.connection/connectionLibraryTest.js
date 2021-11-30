const { Schema } = require("mongoose");
const getMongoConnection = require("../utils/getMongoConnection");

const mongoose = getMongoConnection();
const MyModel = mongoose.model("study_mongoose", new Schema({ name: String }));

MyModel.find((err, result) => {
  console.log(result);
});
