//Import the user model from the User.js file
const User = require("../model/User");

//Import jsonwebtoken package
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  //Using optional chaining operator(?.) Checking to see if we have cookies and then, if we do have a cookie we are also checking to see if there is a jwt property
  if (!cookies?.jwt) return res.sendStatus(401); //401 Means unauthorized
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  //Check to see if the username exists
  const foundUser = await User.findOne({ refreshToken }).exec(); // Note every mongoose method needs .exec() on the data model but this one does because we are using async and await but check documentation for your needs
  if (!foundUser) return res.sendStatus(403); //403 Stand for forbidden
  //Evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403); //403 Stand for forbidden
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      //In this example we will make expire in 30 seconds in an actual production you might want to go longer.
      { expiresIn: "2m" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
