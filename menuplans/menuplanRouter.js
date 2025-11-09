const express = require('express');
const { BadRequest, NotFound } = require('../errors/app-errors');
let { MenuPlan } = require('./menuplan');
let { Signup } = require('../signups/signup');
const { validateMenuPlan, validatePatchMenuPlan, validateStatistics } = require('./menuplanSchema');
const { validateIdEquality } = require('../middleware/validation');
const { handleAsyncError } = require('../errors/error-handler');
const { loggers } = require('winston');
const {predict, createPredictionModel} = require('./predictionModel');
const { dateToStandardString } = require('../utils/dateFunctions');
const { createCheckForRolesMiddleware } = require('../middleware/checkForRoles');

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

let router = express.Router();


router.get('/', handleAsyncError(async (req, res, _next) => {
    let menuPlans;
    if (req.query) {
        menuPlans = await MenuPlan.find(req.query);
    } else
        menuPlans = await MenuPlan.find();
    res.status(200).json(menuPlans);
}));

router.get('/dishes', handleAsyncError(async (_req, res, _next) => {
    let menuPlans = await MenuPlan.find();
    //convert mongo doc to js object
    menuPlans = menuPlans.map(menuPlan => menuPlan.toObject());
    let filteredDishes = [];

    menuPlans.forEach((mp) => { // iterate menu plans
        for (let day in mp.days) { // iterate days
            if (typeof (mp.days[day]) == "object") filteredDishes.push(...mp.days[day]); // push and dishes from day
            else loggers.error(day);
        }
    });

    filteredDishes = removeDuplicatesLatest(filteredDishes, "name"); // filter duplicates with prop "name"

    res.status(200).json(filteredDishes);
}));

router.get('/dishnames', handleAsyncError(async (_req, res, _next) => {
    let menuPlans = await MenuPlan.find();
    //convert mongo doc to js object
    menuPlans = menuPlans.map(menuPlan => menuPlan.toObject());
    let dishes = [];

    menuPlans.forEach((mp) => { // iterate menu plans
        for (let day in mp.days) { // iterate days
            if (typeof (mp.days[day]) == "object") {
                let date = new Date(mp.startDate);
                date.setDate(date.getDate() + DAYS.indexOf(day));
                for (let meal of mp.days[day]) {
                    dishes.push({
                        date: dateToStandardString(date),
                        name: meal.name,
                    });
                }
            }
        }
    });
    res.status(200).json(dishes);
}));

function removeDuplicatesLatest(arr, prop) {
    const seen = new Map();

    arr.forEach((item) => { // lopp array of objects
        const value = item[prop];
        seen.set(value, item); // item gets overwritten if already exists
    });

    return Array.from(seen.values());
}

router.get('/statistics', createCheckForRolesMiddleware(["chef", "cook", "admin"]), handleAsyncError(async (req, res,) => {
    let from = new Date(req.query.from);
    let to = new Date(req.query.to);
    if (isNaN(from)) throw new BadRequest("from must be a valid date");
    if (isNaN(to)) throw new BadRequest("to must be a valid date");
    let tags;
    try {
        tags = req.query.tags && JSON.parse(req.query.tags);
        if (tags && !Array.isArray(tags)) throw new BadRequest("tags must be a json array");
    } catch (e) {
        throw new BadRequest("tags must be a json array");
    }
    let startDate = new Date(from);
    startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1);
    startDate = dateToStandardString(startDate);
    let endDate = new Date(to);
    endDate.setDate(endDate.getDate() - (endDate.getDay() || 7) + 8);
    endDate = dateToStandardString(endDate);
    let menuPlans = await MenuPlan.find({ "startDate": { "$gte": startDate, "$lte": endDate } });
    let signupQuery = { "day": { "$gte": req.query.from, "$lte": req.query.to } };
    if (req.query.name) signupQuery["dish.name"] = req.query.name;
    let signupCounts = await Signup.aggregate([{$match:signupQuery}, {$group : {_id:{ day: "$day", dish: "$dish.name" }, count:{$sum:1}}}]);

    let statistics = [];
    menuPlans.forEach(async (mp) => { // iterate menu plans
        for (let day in mp.days) { // iterate days
            if (typeof (mp.days[day]) == "object") {
                let date = new Date(mp.startDate);
                date.setDate(date.getDate() + DAYS.indexOf(day));
                if (date >= from && date <= to) {
                    for (let meal of mp.days[day]) {
                        //apply query filters
                        if ((!req.query.name || meal.name == req.query.name) && (!tags || tags.every(tag => meal.tags.includes(tag)))) {
                            //copy data from meal
                            let entry = {
                                ...meal.statistics,
                                date: dateToStandardString(date),
                                name: meal.name,
                                registered: signupCounts.find(count => count._id.day == [dateToStandardString(date)] && count._id.dish == meal.name)?.count ?? 0  // [dateToStandardString(date)]?.[meal.name]
                            };
                            //create prediction for served meals
                            if(!entry.served && date>=new Date()) {
                                let preparedEntry={...entry};
                                ["Vorspeise","Hauptspeise","Nachspeise"].forEach(course =>{
                                    preparedEntry['choices'+course]=meal.tags.includes(course)?mp.days[day].filter(choice => choice.tags.includes(course)).length:7;
                                });
                                //entry.pred_served=entry.registered*1.5;
                                entry.pred_served=Math.round(predict(preparedEntry));
                            }
                            statistics.push(entry);
                        }
                    }
                }
            }
        }
    });
    res.status(200).json(statistics);
}));

router.patch('/statistics/updatePredictionModel', createCheckForRolesMiddleware(["admin"]), handleAsyncError(async (_req, res, _next) => {
    try {
        await createPredictionModel();
        res.status(200).json({message:'prediction model updated'});   
    } catch(err) {
        if(err.type=='failed prediction model precondition'){
            throw new BadRequest(err.message);
        } else {
            throw err;
        }
    }
}));


router.get('/:id', handleAsyncError(async (req, res, _next) => {
    const day = req.query.day;
    let menuPlan = await MenuPlan.findById(req.params.id);
    if (!menuPlan) throw new NotFound(`menuplan id "${req.params.id}" not found`);
    if (day) {
        const menuItems = menuPlan.days[day];

        if (!menuItems) throw new NotFound(`No menu items found for day ${day}`);

        res.status(200).json(menuItems);
    }
    else {
        res.status(200).json(menuPlan);
    }
}));

router.post('/', createCheckForRolesMiddleware(["chef", "admin"]), handleAsyncError(async (req, res, next) => {
    if (req.body._id) throw new BadRequest("_id must not be specified");
    const validation = validateMenuPlan(req.body);
    if (validation.error) throw new BadRequest(validation.error.message);
    let newMenuPlan = new MenuPlan(req.body);
    await newMenuPlan.save();
    res.location(req.baseUrl + '/' + newMenuPlan._id);
    res.status(201).json(newMenuPlan);
}));

router.delete('/:id', createCheckForRolesMiddleware(["chef", "admin"]), handleAsyncError(async (req, res, next) => {
    await MenuPlan.findByIdAndDelete(req.params.id);
    res.status(204).send();
}));

router.patch('/statistics', createCheckForRolesMiddleware(["chef", "cook", "admin"]), handleAsyncError(async (req, res, _next) => {
    const validation = validateStatistics(req.body);
    if (validation.error) {
        throw new BadRequest(validation.value);
    }
    let date = new Date(req.body.date);
    let day = DAYS[date.getDay() - 1];
    if (!day) throw new BadRequest("Invalid day of week");
    let startDate = new Date(date);
    startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1);
    startDate = dateToStandardString(startDate);
    let menuPlan = await MenuPlan.findOne({ startDate: startDate });
    if (!menuPlan) throw new NotFound(`menuPlan with startDate "${startDate}" not found`);
    let meal = menuPlan.days[day]?.find(meal => meal.name == req.body.name);
    if (!meal) throw new NotFound(`meal with name ${req.body.name} on ${req.body.date} no found`);
    // Update all parts
    for (let key in validation.value) {
        if (key != "date" && key != "name" && key != "registered") {
            if (validation.value[key] === null)
                // delete does not work, set field to undefined and it will be deleted
                meal.statistics[key] = undefined
            else
                meal.statistics[key] = validation.value[key];
        }
    }
    await menuPlan.save();
    res.status(200).json(meal.statistics);
}));

router.patch('/:id', createCheckForRolesMiddleware(["chef", "admin"]), validateIdEquality, handleAsyncError(async (req, res, _next) => {
    const validation = validatePatchMenuPlan(req.body);
    if (validation.error) {
        throw new BadRequest(validation.error.message);
    }
    let menuPlan = await MenuPlan.findById(req.params.id);
    if (!menuPlan) throw new NotFound(`menuPlan id "${req.params.id}" not found`);
    // Update all parts
    for (let key in validation.value) {
        // delete does not work, set field to undefined and it will be deleted
        if (validation.value[key] === null)
            menuPlan[key] = undefined
        else
            menuPlan[key] = validation.value[key];
    }
    await menuPlan.save();
    res.status(200).json(menuPlan);
}));

module.exports = router;