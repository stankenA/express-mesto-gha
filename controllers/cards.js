const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const Card = require('../models/card');
const {
  ERROR_400,
  ERROR_404,
  ERROR_500,
  ERROR_401,
} = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректно переданы данные новой карточки'));
      }

      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Ошибка удаления. Карточка с таким id не найдена');
      }

      if (card.owner.toString() !== userId) {
        throw new UnauthorizedError('Нельзя удалять чужие карточки');
      }

      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => {
          res.send(deletedCard);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Ошибка удаления. Некорректно введён id'));
          }

          next(err);
        });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Ошибка постановки лайка. Карточка с таким id не найдена');
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка постановки лайка. Некорректно введён id'));
      }

      next(err);
    });
};

const unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Ошибка снятия лайка. Карточка с таким id не найдена');
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка снятия лайка. Некорректно введён id'));
      }

      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
