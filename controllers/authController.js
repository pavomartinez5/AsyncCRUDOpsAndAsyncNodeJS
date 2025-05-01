//Import the user model from the User.js file
const User = require("../model/User");
//Import bcrypt package
const bcrypt = require("bcrypt");
//Import jsonwebtoken package
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  //Check to see if the username exists
  const foundUser = await User.findOne({ username: user }).exec(); // Note every mongoose method needs .exec() on the data model but this one does because we are using async and await but check documentation for your needs
  if (!foundUser) return res.sendStatus(401); //401 Means unauthorized
  //Evaluate password
  //use decrypt to do that
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //Grab roles
    const roles = Object.values(foundUser.roles);
    //Create JWTs
    //Create access token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    //Saving refreshToken with current user
    //Save refresh token in the database, which will also allow use to create a logout route in the future that will allow us to invalidate the refresh token when a user log out
    foundUser.refreshToken = refreshToken;
    //This will save our changes back to the MongoDb document stored in the user collection
    const result = await foundUser.save();
    console.log(result);

    //Send the refresh token as a cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //When testing cookies with thunder client secure: true needs to be commented out, in production you will want it back in
      maxAge: 24 * 60 * 60 * 1000,
    });
    //best practices is storing/send the accessToken in memory
    res.json({ accessToken });
  } else {
    res.sendStatus(401); //401 stands for unauthorized
  }
};

module.exports = { handleLogin };
