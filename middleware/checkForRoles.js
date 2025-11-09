const { Forbidden } = require("../errors/app-errors");

function createCheckForRolesMiddleware(authorizedRoles) {

  return (req, resp, next) => {
    if (!req.foundRoles.some(role => authorizedRoles.includes(role))) 
        throw new Forbidden("Authorized Roles: " + authorizedRoles + "; Your Roles: " + req.foundRoles);

    next();
  };
}

module.exports = {createCheckForRolesMiddleware};
