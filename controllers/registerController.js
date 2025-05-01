//Import the user Schema model from the User.js file
const User = require("../model/User");

//Using package called bcrypt this package will help us hash and salt the passwords that come in so we can securely and safely store them in our database
const bcrypt = require("bcrypt");

//Define handler for the new user information that we will receive at this register route
const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400) //400 stand for bad request
      .json({ message: "Username and password are required." });

  //Check for duplicate usernames in the Mongodb database
  //This will return any user that matches the user that was passed in and place in into the variable duplicate
  const duplicate = await User.findOne({ username: user }).exec(); // Note every mongoose method needs .exec() on the data model but this one does because we are using async and await but check documentation for your needs
  // duplicate is found send 409
  if (duplicate) return res.sendStatus(409); //409 stands for conflict
  try {
    //encrypt the password using bcrypt
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //Create and store the new user all at once
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    //log result to view the record that was created in the console
    console.log(result);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    // 500 stand for server error
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
