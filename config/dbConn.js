//Create a connection configuration to MongooseDB
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      //useUnifiedTopology: true, // No longer work it is deprecated
      //useNewUrlParser: true, // No longer work it is deprecated
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
