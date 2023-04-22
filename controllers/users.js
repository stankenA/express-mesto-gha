const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введён некорректный id'));
      }

      next(err);
    });
};

const createUser = (req, res, next) => {
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
        next(new BadRequestError('Некорректно переданы данные нового пользователя'));
      }

      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким e-mail уже существует'));
      }

      next(err);
    });
};

const updateUser = (req, res, next) => {
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
        throw new NotFoundError('Пользователь с таким id не найден');
      }

      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректно переданы данные пользователя'));
      }

      if (err.name === 'CastError') {
        next(new BadRequestError('Введён некорректный id'));
      }

      next(err);
    });
};

const updateAvatar = (req, res, next) => {
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
        throw new NotFoundError('Пользователь с таким id не найден');
      }

      res.send(updatedAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректно переданы данные обновленного аватара'));
      }

      if (err.name === 'CastError') {
        next(new BadRequestError('Введён некорректный id'));
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret', { expiresIn: '7d' });

      res.send({ jwt: token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
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
