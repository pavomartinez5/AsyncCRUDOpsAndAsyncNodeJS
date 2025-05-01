//Create middleware for verifyRoles
const verifyRoles = (...allowedRoles) => {
  //middleware function
  return (req, res, next) => {
    //Using optional chaining(?.) We are saying even if it does have a request it also needs to have roles
    if (!req?.roles) return res.sendStatus(401); //401 stands for unauthorized
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401); //401 stands for unauthorized
    next();
  };
};

module.exports = verifyRoles;
