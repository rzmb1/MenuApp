const mongoose = require('mongoose');
const { HTTPError, BadRequest, InternalServerError } = require('./app-errors');
const { logger } = require('../utils/logger');
function errorHandler(originalError, req, res, _next) {
    let errorToSend;
    if (originalError instanceof HTTPError)
        errorToSend = originalError;
    else if (originalError instanceof mongoose.Error.CastError)
        errorToSend = new BadRequest(`no valid uuid-format for id "${req.
            params.id}"`);
    else if(originalError.statusCode == 400){
        errorToSend = new BadRequest(originalError.type);
    }
    else {
        // a better logger will be introduced soon
        // !!! very important to log all unexpected errors !!!
        logger.error('unexpected error occured. original error logged here: '
            , originalError);
        errorToSend = new InternalServerError('Oops ...');
    }
    res.status(errorToSend.code).json(errorToSend);
}
function handleAsyncError(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}
module.exports = { errorHandler, handleAsyncError };