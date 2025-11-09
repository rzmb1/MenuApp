const joi = require('joi');
const {createPatchSchema} = require('../utils/createPatchSchema');
joi.objectId = require('joi-objectid')(joi)

const schema = joi.object({
    _id: joi.objectId(),

    _idUser: joi.objectId()
        .required(),

    title: joi.string()
        .required(),

    text: joi.string()
        .required(),

    read: joi.boolean(),

    timeCreated: joi.date().default(Date.now()),

    priority: joi.string(),

    link: joi.string(),

    __v: joi.number()
});

const patchSchema = createPatchSchema(schema);

const validateNotification = msg => schema.validate(msg, {abortEarly: false});

const validatePatchNotification = msg => patchSchema.validate(msg, {abortEarly: false});

module.exports = {validateNotification, validatePatchNotification};