const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes/routes');
const сentralizedErrors = require('./middlewares/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json()); // для сборки JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/', routes);

app.use(errors());
app.use(сentralizedErrors);

app.listen(PORT);
