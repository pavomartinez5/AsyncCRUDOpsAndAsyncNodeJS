//Import employee model
const Employee = require("../model/Employee");

//getAllEmployees function for GET
const getAllEmployees = async (req, res) => {
  //Define employees and by calling find it will return all the employees
  const employees = await Employee.find();
  //Check to see if there is not employees
  console.log(employees);
  //Check to see if there are no employees or if the database is empty
  if (!employees || employees.length === 0)
    return res.status(204).json({ message: "No employees found." }); // 204 does not display in the body when using thunder client
  //If we made it this far we will assume there is employees and respond with employees
  res.json(employees);
};

//Checking to see if the firstname or last name is received after requesting it
const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last name are required." });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

//updateEmployee function for PUT
const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  //If employee dose not exists return 204 and message
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }
  //if id is given check firstname and first name is a parameter set the first name
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  //if id is given check lastname and first name is a parameter set the lastname
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();
  res.json(result);
};

//deleteEmployee function for DELETE
const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID required." });
  }
  //This code allows us to grab the employee if we receive id as a parameter
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  //If employee dose not exists return 204 and message
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }

  const result = await employee.deleteOne({ _id: req.body.id }); //This method does note need .exec() it all depends on the method. You will need to check the documentation.
  console.log(result);
  console.log(employee);
  //Send updated employees
  //The res.json(result) was commented out so I can see the employee that was deleted however this could be used instead of employee
  //res.json(result);
  res.json(employee);
};

//getEmployee function for a single employee using GET
const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Employee ID required." });
  }

  //Find out who employee is by checking id
  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}` });
  }
  //return employee
  res.json(employee);
};

//Export all controller functions
module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
