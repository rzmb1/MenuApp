const joi = require('joi').extend(require('@joi/date'));
joi.objectId = require('joi-objectid')(joi)
const {createPatchSchema} = require('../utils/createPatchSchema');

const imageSchema = joi.object({
  _id: joi.objectId(),
  image: joi.required(),

  __v: joi.number()
});

const patchSchema = createPatchSchema(imageSchema);

const validateImage = image => imageSchema.validate(image, {abortEarly: false});

const validatePatchImage = image => patchSchema.validate(image, {abortEarly: false});

module.exports = {validateImage, validatePatchImage};