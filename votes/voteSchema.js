const joi = require('joi').extend(require('@joi/date'));
joi.objectId = require('joi-objectid')(joi);
const { createPatchSchema } = require('../utils/createPatchSchema');

const voteSchema = joi.object({
    _id: joi.objectId(),

    poll: joi.objectId().required(),

    user: joi.objectId().required(),

    choices: joi.object({
        vorspeise: joi.string(),
        hauptspeise: joi.string(),
        nachspeise: joi.string()
    }).required(),

    __v: joi.number()
});

const patchSchema = createPatchSchema(voteSchema);

const validateVote = msg => voteSchema.validate(msg, { abortEarly: false });

const validatePatchVote = msg => patchSchema.validate(msg, { abortEarly: false });

module.exports = { validateVote, validatePatchVote };