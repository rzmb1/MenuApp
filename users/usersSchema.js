const joi = require('joi');
joi.objectId = require('joi-objectid')(joi)
const {createPatchSchema} = require('../utils/createPatchSchema');

const schema = joi.object({
    _id: joi.objectId(),

    oid: joi.string(),

    firstname: joi.string(),

    lastname: joi.string(),

    email: joi.string()
    .email({ minDomainSegments: 2})
    .required(),

    __v: joi.number(),

    //customer: can signup for menu
    //admin: can administer users
    //chef: can create, update, delete,publish and review menu-plans
    //cook: can add cooked and handed out meals
    roles: joi.array().items(joi.any().valid('customer','admin','chef','cook')).default([])
});

const patchSchema = createPatchSchema(schema);

const validateUser = msg => schema.validate(msg, {abortEarly: false});

const validatePatchUser = msg => patchSchema.validate(msg, {abortEarly: false});

module.exports = {validateUser, validatePatchUser};