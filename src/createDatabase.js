const mongoose = require("mongoose");
const subscriberModel = require("./models/subscribers");
const data = require("./data");

// Connection to DATABASE
const DATABASE_URL =
  "mongodb+srv://gangordaykondan:gangordaykondan@cluster0.s34wiae.mongodb.net/";
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Database created..."));

const refreshAll = async () => {
  await subscriberModel.deleteMany({});
  // console.log(connection)
  await subscriberModel.insertMany(data);
  await mongoose.disconnect();
};
refreshAll();
