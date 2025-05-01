//Import jsonwebtoken package
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  //Using optional chaining method(?.) We are saying event if it does have authHeader still check to see if it does not start with bearer
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); //401 stand for unauthorized
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //403 stand for forbidden, this will mean we have an invalid token
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
