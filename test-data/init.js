const mongoose = require('mongoose');
const seedrandom = require('seedrandom');
seedrandom('Pizza', { global: true }); //seed Math.random() for getting the same testing data every time
//test-datasets
const users = require('./initial_users');
const signups = require('./initial_signups');
const images = require('./initial_images');
const notifications = require('./initial_notifications');
const menuPlans = require('./initial_menuplans_statistics');
const { getPolls } = require('./test_poll');
const { getVotes } = require('./initial_votes');

//mongo schemas
const {User} = require('../users/users');
const {Signup} = require('../signups/signup');
const {Image} = require('../images/image');
const {Notification} = require('../notifications/notifications');
const {MenuPlan} = require('../menuplans/menuplan');
const { Poll } = require('../polls/poll');
const { Vote } = require('../votes/vote');
const { logger } = require('../utils/logger');
const { createPredictionModel } = require('../menuplans/predictionModel');

const defaultConnectionString = `mongodb://127.0.0.1:27017/kantine2022`;

let connectionString = process.env.MONGODB_CONNECTION_STRING??defaultConnectionString;
async function main() {
  logger.info(`ExpressApp try to connect to "${connectionString}"`);
  await mongoose.connect(connectionString);
  logger.info(`ExpressApp connected to "${connectionString}"`);
  await User.insertMany(users);
  logger.info("users saved");
  await Image.insertMany(images);
  logger.info("images saved");
  await Notification.insertMany(notifications);
  logger.info("notifications saved");
  await MenuPlan.insertMany(menuPlans);
  logger.info("menuplans saved");
  await Signup.insertMany(signups);
  logger.info("signups saved");

  let polls = getPolls(menuPlans);
  polls = await Poll.insertMany(polls);
  logger.info("polls saved");

  let votes = getVotes(polls);
  await Vote.insertMany(votes);
  logger.info('votes saved');
  await createPredictionModel();
  await mongoose.disconnect();
}
// call main and handle errors
main().catch(err => {
  console.log(`ExpressApp init failed. Errordetails here:`);
  console.error(err);
});

module.exports = { menuPlans }