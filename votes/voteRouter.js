const express = require('express');
const { BadRequest, NotFound } = require('../errors/app-errors');
const { Vote } = require('./vote');
const { Poll } = require('../polls/poll');
const { validateVote } = require('./voteSchema');
const { handleAsyncError } = require('../errors/error-handler');
const { createCheckForRolesMiddleware } = require('../middleware/checkForRoles');

let router = express.Router();

router.post('/', handleAsyncError(async (req, res, _next) => {
  const validation = validateVote(req.body);
  if (validation.error) throw new BadRequest(validation.error.message);

  const poll = await Poll.findById(req.body.poll);
  if (!poll || !poll.open) {
      throw new BadRequest("Poll is not open or doesn't exist");
  }

  const pollDishes = poll.dishes.map(dish => dish.name);

  // check if dishes from vote are in voteoptions from poll
  const choices = req.body.choices;
  if (!choices || 
      choices.vorspeise&&!pollDishes.includes(choices.vorspeise) || 
      choices.hauptspeise&&!pollDishes.includes(choices.hauptspeise) || 
      choices.nachspeise&&!pollDishes.includes(choices.nachspeise)) {
      throw new BadRequest("One or more dishes in the vote are not in the vote options");
  }

  let newVote = new Vote(req.body);
  await newVote.save();

  res.location(req.baseUrl + '/vote/' + newVote._id);
  res.status(201).json(newVote);
}));

router.get('/:pollId', handleAsyncError(async (req, res, _next) => {
    const pollId = req.params.pollId;
    const poll = await Poll.findById(pollId);
    if (!poll) throw new NotFound(`Poll with ID ${pollId} not found`);

    const votes = await Vote.find({ poll: pollId });
    //if (!votes.length) return res.status(200).json({ message: "No votes for this poll" });

    let result = {
      vorspeisen: [],
      hauptspeisen: [],
      nachspeisen: []
    };

    // Aggregate votes
    votes.forEach(vote => {
      ['vorspeise', 'hauptspeise', 'nachspeise'].forEach(category => {
        let dishName = vote.choices[category];
        if(dishName) {
          let dishCategory = `${category}n`;
          let dish = result[dishCategory].find(d => d.dish === dishName);

          if (dish) {
            dish.votes++;
          } else {
            result[dishCategory].push({ dish: dishName, votes: 1 });
          }
        }
      });
    });

    ['vorspeisen', 'hauptspeisen', 'nachspeisen'].forEach(category => {
      result[category].sort((a, b) => b.votes - a.votes);
    })

    res.status(200).json(result);
}));

router.delete('/:id', createCheckForRolesMiddleware(["admin", "chef"]), handleAsyncError(async (req, res, _next) => {
    await Vote.findByIdAndDelete(req.params.id);
    res.status(204).send();
}));

module.exports = router;
