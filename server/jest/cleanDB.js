/* eslint-disable @typescript-eslint/explicit-function-return-type */
const mongoose = require('mongoose');

module.exports = async () => {
  // Setup Env Var
  process.env.MONGODB_URI = 'mongodb://localhost:27017/monity-test';
  process.env.DEBUG_WORKER = true;
  process.env.NODE_ENV = 'test';

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  await mongoose.connection.db.dropDatabase();
};
