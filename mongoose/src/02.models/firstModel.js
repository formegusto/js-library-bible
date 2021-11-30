const getMongoConneciton = require("../utils/getMongoConnection");

const mongoose = getMongoConneciton();
const schema = new mongoose.Schema({ name: "string", size: "string" });
const model = mongoose.model("Tank", schema);
