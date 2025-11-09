const joi = require('joi').extend(require('@joi/date'));
joi.objectId = require('joi-objectid')(joi);
const { createPatchSchema } = require('../utils/createPatchSchema');
const { mealSchema } =require('../menuplans/menuplanSchema');

const pollSchema = joi.object({
    _id: joi.objectId(),

    menuplan: joi.objectId(),

    dishes: joi.array().items(mealSchema).required(),

    // votes: joi.array().items(joi.string()).required(),

    open: joi.boolean().required(),

    endDate: joi.date().format('YYYY-MM-DD').raw().required(),

    __v: joi.number()
});

const patchSchema = createPatchSchema(pollSchema);

const validatePoll = msg => pollSchema.validate(msg, { abortEarly: false });

const validatePatchPoll = msg => patchSchema.validate(msg, { abortEarly: false });

module.exports = { validatePoll, validatePatchPoll };
