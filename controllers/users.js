const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении данных пользователей' }))
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении данных конкретного пользователя по id' }))
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(newUser => res.send({ data: newUser }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при создании нового пользователя' }))
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then(updatedUser => res.send({ data: updatedUser }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при обновлении пользователя' }))
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(updatedAvatar => res.send({ data: updatedAvatar }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при обновлении аватара' }))
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
}