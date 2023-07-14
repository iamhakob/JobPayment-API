require('express-async-errors');

const express = require('express');
const bodyParser = require('body-parser');

const { getProfile } = require('./middleware');
const ApiError = require('./apiError');
const { sequelize } = require('./model');
const router = require('./routes');

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use(getProfile);
app.use(router);

app.use((error, req, res, next) => {
  if (error instanceof ApiError) {
    res.status(error.code);
    res.json({
      error: error.message,
    });
    return;
  }
  // Bad request general error
  res.status(500);
  res.json({ error: 'Something went wrong' });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'not found endpoint',
  });
});

module.exports = app;
