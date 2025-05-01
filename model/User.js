//File created for our Schema that will interact with MongoDB specifically the User Schema
//Import mongoose module
const mongoose = require("mongoose");

//Create Schema
const Schema = mongoose.Schema;
//Define Schema
const userSchema = new Schema({
  //Map out data for Schema
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001, //If not specified any new user created will have a default value of 2001 in this example this is our basic user value
    },
    Editor: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

//Exporting the data model that we are Creating
module.exports = mongoose.model("User", userSchema);
