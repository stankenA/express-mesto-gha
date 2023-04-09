const Card = require('../models/card');
const {
  ERROR_400,
  ERROR_404,
  ERROR_500,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_500).send({ message: 'Произошла ошибка при получении данных о карточках' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Некорректно переданы данные новой карточки' });
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при создании новой карточки' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_404).send({ message: 'Ошибка удаления. Карточка с таким id не найдена' });
        return;
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Ошибка удаления. Некорректно введён id' });
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при удалении карточки' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_404).send({ message: 'Ошибка постановки лайка. Карточка с таким id не найдена' });
        return;
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Ошибка постановки лайка. Некорректно введён id' });
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при постановке лайка карточки', err: `${err}` });
    });
};

const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_404).send({ message: 'Ошибка снятия лайка. Карточка с таким id не найдена' });
        return;
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Ошибка снятия лайка. Некорректно введён id' });
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при снятии лайка карточки' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
