const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const registerRoutes = require('./routes');
const { initDatabaseConnection } = require('./db');

// import .env
dotenv.config();

// configure app
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

registerRoutes(app);

// additional initializations
initDatabaseConnection();

module.exports = app;