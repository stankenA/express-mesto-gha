const bcrypt = require('bcrypt');
const User = require('../models/user');

const {
  ERROR_400,
  ERROR_404,
  ERROR_500,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_500).send({ message: 'Произошла ошибка при получении данных пользователей' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_404).send({ message: 'Пользователь с таким id не найден' });
        return;
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Введён некорректный id' });
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при получении пользователя по id', err: `${err}` });
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Некорректно переданы данные нового пользователя' });
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при создании нового пользователя' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(ERROR_404).send({ message: 'Пользователь с таким id не найден' });
        return;
      }

      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Некорректно переданы данные пользователя' });
        return;
      }

      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Введён некорректный id' });
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при обновлении данных пользователя' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updatedAvatar) => {
      if (!updatedAvatar) {
        res.status(ERROR_404).send({ message: 'Пользователь с таким id не найден' });
        return;
      }

      res.send(updatedAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Некорректно переданы данные обновленного аватара' });
        return;
      }

      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Введён некорректный id' });
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при обновлении аватара пользователя' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
