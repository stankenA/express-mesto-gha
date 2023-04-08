const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении данных пользователей' }))
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
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
    .then(newUser => res.send({ data: newUser }))
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
    .then(updatedUser => res.send({ data: updatedUser }))
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
    .then(updatedAvatar => res.send({ data: updatedAvatar }))
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