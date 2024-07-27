const Express = require('express');

const userController = require('../controllers/userController');


const router = Express.Router();

router.post('/signup',userController.addPostUser);

router.post('/login',userController.postLoginUser);

module.exports = router;