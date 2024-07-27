const Express = require('express');


const userAuth = require('../middleware/userAuth');
const reminderController = require('../controllers/reminderController');



const router = Express.Router();



router.post('/remind',userAuth,reminderController.remindAfterPost);





module.exports = router;