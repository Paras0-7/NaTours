const express = require('express');
const authController = require('./../controllers/authController');
const router = express.Router();

const userController = require('./../controllers/userController');

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
