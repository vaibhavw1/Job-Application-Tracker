const Express = require('express');

const applicationController = require('../controllers/applicationController');
const userAuth = require('../middleware/userAuth');
const profileAuth = require('../middleware/profileAuth');
const multerUpload = require('../middleware/multer');


const router = Express.Router();



router.post('/apply',userAuth,multerUpload.single('file'),profileAuth,applicationController.addApplication);

router.post('/get-applications',userAuth,profileAuth,applicationController.getApplications);

router.delete('/delete',userAuth,applicationController.deleteApplication);

router.post('/update-status',userAuth,applicationController.updateApplicationStatus);



module.exports = router;