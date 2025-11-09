const joi = require('joi').extend(require('@joi/date'));
const {createPatchSchema} = require('../utils/createPatchSchema');
joi.objectId = require('joi-objectid')(joi)

const statisticsSchema = joi.object({
  name: joi.string().required(),
  date: joi.date().format('YYYY-MM-DD').raw().required(),
  registered: joi.number().integer(),
  ordered: joi.number().integer(),
  served: joi.number().integer(),
  wasted: joi.number().integer()
});

const mealSchema = joi.object({
    _id: joi.objectId(),
    name: joi.string().required(),
    tags: joi.array().items(joi.string()).required(),
    image: joi.objectId(),
    statistics : joi.object({
      ordered: joi.number().integer(),
      served: joi.number().integer(),
      wasted: joi.number().integer()
    })
});
  
const daySchema = joi.array().items(mealSchema);

const schema = joi.object({
    _id: joi.objectId(),

    createdBy: joi.objectId()
    .required(),

    approvedBy: joi.objectId(),
    /*
    draft: unfertiger Entwurf
    in-review: fertiger Entwurf, der auf Freigabe wartet
    approved: für die Veröffendlichung freigegebener Menüplan
    published: auf /menu-plan veröffentlichter Menüplan
    cancelled: verworfener Entwurf eines Menüplans
    */
    state: joi.any().valid('draft','in-review','approved','published','cancelled'),

    days: joi.object({
        Montag: daySchema,
        Dienstag: daySchema,
        Mittwoch: daySchema,
        Donnerstag: daySchema,
        Freitag: daySchema
      }).required(),
    
    startDate: joi.date().format('YYYY-MM-DD').raw(),
    
    endDate: joi.date().format('YYYY-MM-DD').raw(), 

    __v: joi.number()
});

const patchSchema = createPatchSchema(schema);

const validateMenuPlan = msg => schema.validate(msg, {abortEarly: false});

const validatePatchMenuPlan = msg => patchSchema.validate(msg, {abortEarly: false});

const validateStatistics = msg => statisticsSchema.validate(msg,{abortEarly: false});

module.exports = {validateMenuPlan, validatePatchMenuPlan,validateStatistics, mealSchema};