const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_400,
  ERROR_404,
  ERROR_401,
  ERROR_500,
  ERROR_409,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_500).send({ message: 'Произошла ошибка при получении данных пользователей' }));
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(() => res.status(ERROR_500).send({ message: 'Произошла ошибка при получении данных текущего пользователя' }));
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

      if (err.code === 11000) {
        res.status(ERROR_409).send({ message: 'Пользователь с таким e-mail уже существует' });
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

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret', { expiresIn: '7d' });

      res.send({ jwt: token });
    })
    .catch((err) => {
      res.status(ERROR_401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
