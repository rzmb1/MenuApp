const express = require('express');
const { BadRequest, NotFound } = require('../errors/app-errors');
let { Signup } = require('./signup');
const { validateSignup, validatePatchSignup } = require('./signupSchema');
const { validateIdEquality } = require('../middleware/validation');
let { User } = require('../users/users');
let { MenuPlan } = require('../menuplans/menuplan');
const { handleAsyncError } = require('../errors/error-handler');
const { dateToStandardString } = require('../utils/dateFunctions');
const { createCheckForRolesMiddleware } = require('../middleware/checkForRoles');

let router = express.Router();

router.get('/', handleAsyncError(async (req, res, _next) => {
    let signups;
    if (req.query) {
        signups = await Signup.find(req.query);
    } else
        signups = await Signup.find();
    res.status(200).json(signups);
}));

router.post('/ratings-data', handleAsyncError(async (req, res) => {
    const dishNames = req.body.dishNames;

    if (!Array.isArray(dishNames) || dishNames.length === 0) {
        throw new BadRequest("dishNames must be a non-empty array");
    }

    const ratingsPromises = dishNames.map(async dishName => {
        const averageRatings = await Signup.aggregate([
            { $match: { "dish.name": dishName, "rating": { $gt: 0 } } },
            { $group: { _id: null, averageRating: { $avg: "$rating" } } }
        ]);

        const numberOfRatings = await Signup.aggregate([
            { $match: { "dish.name": dishName, "rating": { $gt: 0 } } },
            { $group: { _id: null, totalRatings: { $sum: 1 } } }
        ]);

        return {
            dishName: dishName,
            averageRating: averageRatings[0] ? averageRatings[0].averageRating : 0,
            totalRatings: numberOfRatings[0] ? numberOfRatings[0].totalRatings : 0
        };
    });

    const ratings = await Promise.all(ratingsPromises);

    res.status(200).json(ratings);
}));

router.get('/:id', handleAsyncError(async (req, res, _next) => {
    let signup = await Signup.findById(req.params.id);
    if (!signup)
        throw new NotFound(`signup id "${req.params.id}" not found`);
    res.status(200).json(signup);
}));

router.post('/', handleAsyncError(async (req, res, _next) => {
    if (req.body._id) throw new BadRequest("_id must not be specified");
    let { value, error } = validateSignup(req.body, 'create');
    if (error) throw new BadRequest(error.message);
    let menuPlans = await MenuPlan.find();
    if (!matchingSignup(value, menuPlans, false)) throw new BadRequest(`no dish width name:${value.dish.name} exists on ${getDayName(value.day)}`);
    let user = await User.findById(value._idUser);
    if (!user) throw new BadRequest(`no user width id:${req.body._idUser} exists`);
    let newSignup = new Signup(value);
    await newSignup.save();
    res.location(req.baseUrl + '/' + newSignup._id);
    res.status(201).json(newSignup);
}));

function matchingSignup(signup, menuPlans, ignorePast) {
    //const today = new Date();
    const day = getDayName(signup.day);

    // Check if singup date is in the future
    if (new Date(signup.day).getTime() > Date.now() - 3600 * 8 * 1000 || ignorePast) {
        if (signup.dish.name == "Abgemeldet") return true;
        const signupDate = new Date(signup.day);
        const startDate = dateToStandardString(new Date(signupDate.setDate(signupDate.getDate() - (signupDate.getDay() || 7) + 1)));
        const menuPlan = menuPlans.find(mp => mp.startDate === startDate);

        if (!menuPlan) throw new BadRequest(`no menu plan for given date: ${signup.day} exists`);

        // Check only published menu plans in the future
        if (menuPlan.state === "published") {

            // Check if day is in the menu plan
            if (menuPlan.days[day]) {
                const dishes = menuPlan.days[day];
                return dishes.some(dish => dish.name === signup.dish.name);
            }
        }
    }
    else {
        throw new BadRequest("can't signup in the past");
    }
}

function getDayName(date) {
    let day;

    switch (new Date(date).getDay()) {
        case 1:
            day = "Montag";
            break;
        case 2:
            day = "Dienstag";
            break;
        case 3:
            day = "Mittwoch";
            break;
        case 4:
            day = "Donnerstag";
            break;
        case 5:
            day = "Freitag";
            break;
        default:
            throw new BadRequest(`invalid date:${date}`)
    }

    return day;
}

router.delete('/:id', createCheckForRolesMiddleware(["admin"]), handleAsyncError(async (req, res, _next) => {
    await Signup.findByIdAndDelete(req.params.id);
    res.status(204).send();
}));

router.patch('/:id', validateIdEquality, handleAsyncError(async (req, res, _next) => {
    const { value, error } = validatePatchSignup(req.body);
    if (error) throw new BadRequest(error.message);
    let signup = await Signup.findById(req.params.id);
    if (!signup) throw new NotFound(`signup id "${req.params.id}" not found`);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // set time to midnight
    const signupDate = new Date(signup.day);
    signupDate.setHours(0, 0, 0, 0);

    if (today < signupDate && (Object.keys(value).includes("rating") || Object.keys(value).includes("comment"))) {
        throw new BadRequest("Can't rate in the future");
    } 
    
    for (let key in value) {
        // delete does not work, set field to undefined and it will be deleted
        if (value[key] === null)
            signup[key] = undefined
        else
            signup[key] = value[key];
    }

    let menuPlans = await MenuPlan.find();
    if (!matchingSignup(signup, menuPlans, !Object.keys(value).find(key => key !=='rating' && key !== 'comment'))) throw new BadRequest(`no dish width name:${value.dish.name} exists on ${getDayName(value.day)}`);
    let user = await User.findById(signup._idUser);
    if (!user) throw new BadRequest(`no user width id:${signup._idUser} exists`);
    // Update all parts
    await signup.save();
    res.status(200).json(signup);
}));

router.get('/average-rating/:dishName', handleAsyncError(async (req, res) => {
    const dishName = req.params.dishName;

    const averageRatings = await Signup.aggregate([
        { $match: { "dish.name": dishName, "rating": { $gt: 0 } } },
        { $group: { _id: "$dish.name", averageRating: { $avg: "$rating" } } }
    ]);

    if (averageRatings.length === 0) {
        // return res.status(404).send('Keine Bewertungen für dieses Gericht gefunden.');

        res.status(200).json({
            dishName: dishName,
            averageRating: 0
        });
    } else {
        res.status(200).json({
            dishName: dishName,
            averageRating: averageRatings[0].averageRating
        });
    }
}));

router.get('/number-of-ratings/:dishName', handleAsyncError(async (req, res) => {
    const dishName = req.params.dishName;

    const numberOfRatings = await Signup.aggregate([
        { $match: { "dish.name": dishName, "rating": { $gt: 0 } } },
        { $group: { _id: "$dish.name", totalRatings: { $sum: 1 } } }
    ]);

    if (numberOfRatings.length === 0) {
        res.status(200).json({
            dishName: dishName,
            totalRatings: 0
        });
    } else {
        res.status(200).json({
            dishName: dishName,
            totalRatings: numberOfRatings[0].totalRatings
        });
    }
}));

router.get('/comments/:dishName', handleAsyncError(async (req, res) => {

    const comments = await Signup.aggregate([
        { '$match': { 'dish.name': req.params.dishName,'rating': { $ne: null },'comment': { $ne: null } } },
        { $lookup: {
            from: 'users', // collection name in db
            localField: '_idUser',
            foreignField: '_id',
            as: 'user'
        }},
        { "$project": {
            'rating':'$rating',
            'comment':'$comment',
            'updatedAt':'$updatedAt',
            'user':{ $first: '$user' }

        }},
        { "$project": {
            'rating':'$rating',
            'comment':'$comment',
            'updatedAt':'$updatedAt',
            'user.firstname':'$user.firstname',
            'user.lastname':'$user.lastname'

        }}
    ]);

    res.status(200).json(comments);
}));

module.exports = router;