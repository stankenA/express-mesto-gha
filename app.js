const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const { PORT = 3000 } = process.env;
const app = express();

app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(PORT);
});
