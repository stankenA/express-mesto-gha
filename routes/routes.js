const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const { ERROR_404 } = require('../utils/constants');
const {
  login,
  createUser,
} = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((req, res) => {
  res.status(ERROR_404).send({ message: '404 страница не найдена' });
});

module.exports = router;
