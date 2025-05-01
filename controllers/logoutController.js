//Import the user model from the User.js file
const User = require("../model/User");

const handleLogout = async (req, res) => {
  // Note for front end. On client, aldo delete teh accessToken

  const cookies = req.cookies;
  //Using optional chaining operator(?.) Checking to see if we have cookies and then, if we do have a cookie we are also checking to see if there is a jwt property
  if (!cookies?.jwt) return res.sendStatus(204); //204 means it was successful but there is no content to send back
  const refreshToken = cookies.jwt;

  //Check to see if the refreshToken is in the database
  const foundUser = await User.findOne({ refreshToken }).exec(); // Note every mongoose method needs .exec() on the data model but this one does because we are using async and await but check documentation for your needs
  if (!foundUser) {
    //Clear cookie that was sent
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //When testing cookies with thunder client secure: true needs to be commented out
    return res.sendStatus(204); //204 means it was successful but there is no content to send back
  }

  //If we reached this point that means we did find the same refreshToken in the database
  //Delete refreshTOken in db
  foundUser.refreshToken = "";
  //This will save our changes back to the MongoDb document stored in the user collection
  const result = await foundUser.save();
  console.log(result);

  //Delete cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //When testing cookies with thunder client secure: true needs to be commented out
  //Send status
  res.sendStatus(204); // 204 means  it was successful but there is no content to send back
};

module.exports = { handleLogout };
