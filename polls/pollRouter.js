const express = require('express');
const { BadRequest, NotFound } = require('../errors/app-errors');
const { Poll } = require('./poll'); 
const { Vote } = require('../votes/vote');
const { validatePatchPoll } = require('./pollSchema');
const { validatePoll } = require('./pollSchema'); 
const { handleAsyncError } = require('../errors/error-handler');
const { createCheckForRolesMiddleware } = require('../middleware/checkForRoles');
const seedrandom = require('seedrandom');

let router = express.Router();

router.get('/', handleAsyncError(async (req, res, _next) => {
    let polls;
    if (req.query) {
        polls = await Poll.find(req.query);
    } else {
        polls = await Poll.find();
    }
    res.status(200).json(polls);
}));

router.post('/', createCheckForRolesMiddleware(["chef", "admin"]), handleAsyncError(async (req, res, _next) => {
    if (req.body._id) throw new BadRequest("_id must not be specified");
    
    const validation = validatePoll(req.body);
    if (validation.error) throw new BadRequest(validation.error.message);

    let newPoll = new Poll(req.body);
    await newPoll.save();

    res.location(req.baseUrl + '/' + newPoll._id);
    res.status(201).json(newPoll);
}));

router.get('/:id', handleAsyncError(async (req, res, _next) => {
    let poll = await Poll.findById(req.params.id);
    if (!poll)
        throw new NotFound(`poll with id "${req.params.id}" not found`);
    res.status(200).json(poll);
}));

router.patch('/:id',  createCheckForRolesMiddleware(["chef", "admin"]), handleAsyncError(async (req, res, _next) => {
    const { value, error } = validatePatchPoll(req.body);
    if (error) throw new BadRequest(error.message);

    let poll = await Poll.findById(req.params.id);
    if (!poll) throw new NotFound(`Poll id "${req.params.id}" not found`);

    /*const endDate = new Date(poll.endDate);
    if (endDate < new Date()) {
        throw new BadRequest("Poll has already ended and cannot be updated");
    }*/

    for (let key in value) {
        if (value[key] === null)
            poll[key] = undefined
        else
            poll[key] = value[key];
    }

    await poll.save();
    res.status(200).json(poll);
}));

router.get('/voteoptions/:userId', handleAsyncError(async (req, res, _next) => {
    const userId = req.params.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const poll = await Poll.findOne({ 
        open: true, 
        endDate: { 
            $gte: today.toISOString()
        }
    }).sort({ endDate: 1 });

    if (!poll) {
        throw new NotFound("No active or upcoming polls found");
    }

    const existingVote = await Vote.findOne({ user: userId, poll: poll._id });
    if (existingVote) {
        throw new NotFound("User has already voted in this poll");
    }

    const sr = seedrandom(userId + poll._id.toString());

    const options = {
        vorspeisen: getRandomDishes(poll.dishes, 'Vorspeise', 4, sr),
        hauptspeisen: getRandomDishes(poll.dishes, 'Hauptspeise', 4, sr),
        nachspeisen: getRandomDishes(poll.dishes, 'Nachspeise', 4, sr)
    };

    res.status(200).json({
        userId: userId,
        pollId: poll._id,
        options: options
    });
}));

function getRandomDishes(dishes, category, count, rng) {
    const filteredDishes = dishes.filter(dish => dish.tags.includes(category));

    let randomDishes = [];
    for (let i = 0; i < count; i++) {
        if (filteredDishes.length === 0) {
            break;
        }
        const randomIndex = Math.floor(rng() * filteredDishes.length);
        randomDishes.push(filteredDishes[randomIndex]);
        filteredDishes.splice(randomIndex, 1);
    }

    return randomDishes;
}

router.delete('/:id', createCheckForRolesMiddleware(["admin", "chef"]), handleAsyncError(async (req, res, _next) => {
    await Poll.findByIdAndDelete(req.params.id);
    res.status(204).send();
}));

module.exports = router;