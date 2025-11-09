const joi = require('joi').extend(require('@joi/date'));
joi.objectId = require('joi-objectid')(joi)
const {createPatchSchema} = require('../utils/createPatchSchema');

const schema = joi.object({
    _id: joi.objectId(),

    _idUser: joi.objectId()
        .required(),

    day: joi.date().format('YYYY-MM-DD').raw().required(),

    dish: joi.object({
        _id: joi.objectId(),
        name: joi.string().required(),
        tags: joi.array().items(joi.string()).required(),
        image: joi.objectId()
    }).required(),

    rating: joi.number().min(0).max(5),

    comment: joi.string(),

    __v: joi.number()
});

const patchSchema = createPatchSchema(schema);

const validateSignup = msg => schema.validate(msg, {abortEarly: false});

const validatePatchSignup = msg => patchSchema.validate(msg, {abortEarly: false});

module.exports = {validateSignup, validatePatchSignup};