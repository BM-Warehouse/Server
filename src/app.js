// untuk alias path, jadi kita bisa pakai @constants/,
// @middleware, dst untuk path waktu pakai require
require('module-alias/register');

const express = require('express');
const errorHandler = require('@middlewares/errorHandler');
const notFound = require('@middlewares/notFound');
const { ClientError } = require('@exceptions/error.excecptions');
const { runExpiredCheckScheduler } = require('@libs/expiredChecker');

const routes = require('@routes/index');

const app = express();

app.use(express.json());

// ping server
app.get('/', async (req, res, next) => {
  try {
    res.send('ok');
  } catch (err) {
    next(new ClientError());
  }
});

app.use(routes);
app.use(notFound);
app.use(errorHandler);
runExpiredCheckScheduler();

module.exports = app;
