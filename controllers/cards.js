const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении данных о карточках' }))
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(newCard => res.send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректно переданы данные новой карточки' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка при создании новой карточки' })
    })
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Ошибка удаления. Карточка с таким id не найдена' })
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка при удалении карточки' })
    })
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Ошибка лайка. Карточка с таким id не найдена' })
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка при лайке карточки' })
    })
};

const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Ошибка лайка. Карточка с таким id не найдена' })
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка при лайке карточки' })
    })
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard
}