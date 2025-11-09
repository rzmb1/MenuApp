const { morganMiddleware } = require("../utils/logger");
function logRequest(req, res, next) {
    morganMiddleware(req,res,next);
}
module.exports = logRequest;