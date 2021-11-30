const dotenv = require("dotenv");

dotenv.config();
const mongoose = require("mongoose");
const { MONGO_URI, MONGO_PORT, MONGO_APP } = process.env;
const connectionURL = `mongodb://${MONGO_URI}:${MONGO_PORT}/${MONGO_APP}`;

// mongoose.set("bufferCommands", false);

const MyModel = mongoose.model(
  "my-model",
  new mongoose.Schema(
    { name: String },
    {
      bufferCommands: false,
      autoCreate: false,
    }
  )
);
MyModel.find(() => {
  console.log("MyModel Find Execute.");
});

setTimeout(() => {
  console.log("Mongoose Connected.");
  mongoose.connect(connectionURL);
}, 6000);
