const mongoose = require('mongoose');
const { createPredictionModel } = require('./predictionModel');
const { logger } = require('../utils/logger');

const defaultConnectionString = `mongodb://127.0.0.1:27017/kantine2022`;

let connectionString = process.env.MONGODB_CONNECTION_STRING??defaultConnectionString;
async function main() {
  logger.info(`ExpressApp try to connect to "${connectionString}"`);
  await mongoose.connect(connectionString);
  logger.info(`ExpressApp connected to "${connectionString}"`);
  await createPredictionModel();
  logger.info("finished training prediction model");
  process.exit();
}
// call main and handle errors
main().catch(err => {
  logger.error(`Creating prediction model failed. Errordetails here:`);
  logger.error(err);
});