const Card = require('../models/card');

const ERROR_404 = 404;
const ERROR_400 = 400;
const ERROR_500 = 500;

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards.map((card) => {
      return {
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
        createdAt: card.createdAt
      }
    })))
    .catch(() => res.status(ERROR_500).send({ message: 'Произошла ошибка при получении данных о карточках' }))
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(newCard => res.send({
      createdAt: newCard.createdAt,
      likes: newCard.likes,
      link: newCard.link,
      name: newCard.name,
      owner: newCard.owner,
      _id: newCard._id
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Некорректно переданы данные новой карточки' });
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при создании новой карточки' })
    })
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Ошибка удаления. Некорректно введён id' })
        return;
      }

      if (err.name === 'TypeError') {
        res.status(ERROR_404).send({ message: 'Ошибка удаления. Карточка с таким id не найдена' })
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при удалении карточки' })
    })
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Ошибка постановки лайка. Некорректно введён id' })
        return;
      }

      if (err.name === 'TypeError') {
        res.status(ERROR_404).send({ message: 'Ошибка постановки лайка. Карточка с таким id не найдена' })
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при постановке лайка карточки', err: `${err}` })
    })
};

const unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => res.send({
      createdAt: card.createdAt,
      likes: card.likes,
      link: card.link,
      name: card.name,
      owner: card.owner,
      _id: card._id
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Ошибка снятия лайка. Некорректно введён id' })
        return;
      }

      if (err.name === 'TypeError') {
        res.status(ERROR_404).send({ message: 'Ошибка снятия лайка. Карточка с таким id не найдена' })
        return;
      }

      res.status(ERROR_500).send({ message: 'Произошла ошибка при снятии лайка карточки' })
    })
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard
}