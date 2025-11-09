const votes = [];

function getRandomChoice(dishes, course) {
  let dishnames = dishes.filter(d => d.tags.includes(course)).map(d => d.name);
  let choice = dishnames[Math.floor(Math.random()*dishnames.length)];
  return choice;
}

function getVotes(polls) {
  let poll = polls[0];
  for (let i = 100; i < 500; i++) {  
    votes.push({
        poll: poll._id,
        user: "51711777bcf86cd799439" + i,
        choices: ['vorspeise', 'hauptspeise', 'nachspeise'].reduce(
          (choices, course) => {
            choices[course] = getRandomChoice(poll.dishes, course.charAt(0).toUpperCase() + course.slice(1));
            return choices;
          }
        , {})
    });
  }

  return votes;
}

  
module.exports = { getVotes };