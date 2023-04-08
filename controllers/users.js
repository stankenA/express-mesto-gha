const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users.map((user) => {
      return {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id
      }
    })))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении данных пользователей' }))
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка при получении пользователя по id' })
    })
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(newUser => res.send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      _id: newUser._id
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректно переданы данные нового пользователя' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка при создании нового пользователя' })
    })
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true
    }
  )
    .then(updatedUser => res.send({
      name: updatedUser.name,
      about: updatedUser.about,
      _id: updatedUser._id
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректно переданы данные пользователя' });
        return;
      }

      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка при обновлении данных пользователя' })
    })
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true
    }
  )
    .then(updatedAvatar => res.send({
      avatar: updatedAvatar.avatar,
      _id: updatedAvatar._id
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректно переданы данные обновленного аватара' });
        return;
      }

      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка при обновлении аватара пользователя' })
    })
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
}