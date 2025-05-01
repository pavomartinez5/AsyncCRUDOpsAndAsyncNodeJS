//File created for our Schema that will interact with MongoDB specifically the Employee Schema
//Import mongoose module
const mongoose = require("mongoose");

//Create Schema
const Schema = mongoose.Schema;

//Define Schema
const employeeSchema = new Schema({
  //Map out data for Schema
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

//Exporting the data model that we are Creating
//By default mongoDB will set Employee to lowercase and make it plural looking for the collections employees
module.exports = mongoose.model("Employee", employeeSchema);
