const {BadRequest} = require('../errors/app-errors');

function validateIdEquality(req, _res, next) {
    if(req.body._id && req.body._id != req.params.id) throw new BadRequest(`Not allowed to change id from "${req.params.id}" to "${req.body._id}"`)
    next();
}

module.exports = {validateIdEquality};