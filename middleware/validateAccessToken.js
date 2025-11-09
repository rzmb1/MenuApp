const jsonwebtoken = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const { Unauthorized } = require("../errors/app-errors");

function createValidateAccessTokenMiddleware(validateToken, tenantId, appId) { 
  if (validateToken && typeof tenantId != "string")
    throw "Invalid tenantId";

  if (validateToken && typeof appId != "string")
    throw "Invalid appId";

  const client = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
  });

  function lookupSigningKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
      if (err) {
        callback(err);
        return;
      }

      var signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }

  return (req, resp, next) => {
    const authorizationHdr = req.headers["authorization"];

    if (authorizationHdr && authorizationHdr.startsWith("Bearer ")) {
      const accessToken = authorizationHdr.substring(7);

      // in production
      if (validateToken) {
        jsonwebtoken.verify(
          accessToken,
          lookupSigningKey,
          {},
          (err, decodedToken) => {
            if (!err && decodedToken.aud == appId) {
              req.foundRoles = decodedToken.roles??[];
              next();
            } else {
              try {
                throw new Unauthorized("Invalid Token");
              } catch (err) {
                next(err);
              }
            }
          }
        );
      }
      // for local development and testing
      else {
        let decodedToken = jsonwebtoken.decode(accessToken, {});
        //if (decodedToken !== null && decodedToken.aud == `api://${appId}`) {
        if (
          decodedToken !== null &&
          decodedToken.tid == tenantId
        ) {
          req.foundRoles = decodedToken.roles??[];
          next();
        } else {
          throw new Unauthorized("Invalid Token");
        }
      }
    } else {
      throw new Unauthorized("Missing Token");
    }
  };
}

module.exports = { createValidateAccessTokenMiddleware };
