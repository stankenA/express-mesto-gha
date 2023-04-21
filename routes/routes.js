const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const {
  login,
  createUser,
} = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((req, res) => {
  res.status(404).send({ message: '404 страница не найдена' });
});

module.exports = router;
