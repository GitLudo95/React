const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controller/blogs');
const usersRouter = require('./controller/users');
const loginRouter = require('./controller/login');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const url = config.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        logger.info('connected to MongoDB');
    })
    .catch((error) => {
        logger.error('error connecting to MongDB:', error.message);
    })

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app